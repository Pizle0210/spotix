/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { regions } from "../lib/constants";
import { cn, useStorageUrl } from "../lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Event date must be in the future",
    ),
  category: z.string(),
  currency: z.string(),
  price: z.number().min(0, "Price must be 0 or greater"),
  totalTickets: z.number().min(1, "Must have at least 1 ticket"),
});

type FormData = z.infer<typeof formSchema>;

type InitialEventData = {
  _id: Id<"events">;
  name: string;
  description: string;
  location: string;
  category: string;
  currency: string;
  eventDate: number;
  price: number;
  totalTickets: number;
  imageStorageId?: Id<"_storage">;
};

type EventFormProps = {
  mode: "create" | "edit";
  initialData?: InitialEventData;
};

export default function EventForm({ mode, initialData }: EventFormProps) {
  const { user } = useUser();
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.updateEvent);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentImageUrl = useStorageUrl(initialData?.imageStorageId);

  const [currencySymbol, setCurrencySymbol] = useState(
    initialData?.currency || "", // Initialize with existing data if available
  );

  // Image upload
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEventImage = useMutation(api.storage.updateEventImage);
  const deleteImage = useMutation(api.storage.deleteImage);

  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      currency: initialData?.currency ?? "",
      category: initialData?.category ?? "",
      eventDate: initialData ? new Date(initialData.eventDate) : new Date(),
      price: initialData?.price ?? 0,
      totalTickets: initialData?.totalTickets ?? 1,
    },
  });

  //   onsubmit
  async function onSubmit(values: FormData) {
    if (!user?.id) return;

    startTransition(async () => {
      try {
        let imageStorageId = null;

        // Handle image changes
        if (selectedImage) {
          // Upload new image
          imageStorageId = await handleImageUpload(selectedImage);
        }

        // Handle image deletion/update in edit mode
        if (mode === "edit" && initialData?.imageStorageId) {
          if (removedCurrentImage || selectedImage) {
            // Delete old image from storage
            await deleteImage({
              storageId: initialData.imageStorageId,
            });
          }
        }

        if (mode === "create") {
          const eventId = await createEvent({
            ...values,
            userId: user.id,
            eventDate: values.eventDate.getTime(),
          });

          if (imageStorageId) {
            await updateEventImage({
              eventId,
              storageId: imageStorageId as Id<"_storage">,
            });
          }

          router.push(`/event/${eventId}`);
        } else {
          // Ensure initialData exists before proceeding with update
          if (!initialData) {
            throw new Error("Initial event data is required for updates");
          }

          // Update event details
          await updateEvent({
            eventId: initialData._id,
            ...values,
            eventDate: values.eventDate.getTime(),
          });

          // Update image - this will now handle both adding new image and removing existing image
          if (imageStorageId || removedCurrentImage) {
            await updateEventImage({
              eventId: initialData._id,
              // If we have a new image, use its ID, otherwise if we're removing the image, pass null
              storageId: imageStorageId
                ? (imageStorageId as Id<"_storage">)
                : null,
            });
          }

          toast("Your event has been successfully updated.");

          router.push(`/event/${initialData._id}`);
        }
      } catch (error: unknown) {
        console.error("Failed to handle event:", error);
        toast(
          "Uh oh! Something went wrong.There was a problem with your request.",
        );
      }
    });
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      return storageId;
    } catch (error: unknown) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Track currency changes and update symbol
  const watchedCurrency = form.watch("currency");
  useEffect(() => {
    const currency = form.watch("currency");
    if (typeof currency === "string") {
      setCurrencySymbol(watchedCurrency);
    } else {
      console.error("Unexpected currency type:", typeof currency);
    }
  }, [watchedCurrency, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border border-[#17BEBB] shadow-sm outline-none transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* category and currency */}
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null,
                        );
                      }}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concert">concert</SelectItem>
                        <SelectItem value="film">film</SelectItem>
                        <SelectItem value="festival">festival</SelectItem>
                        <SelectItem value="sport">sport</SelectItem>
                        <SelectItem value="fashion">fashion</SelectItem>
                        <SelectItem value="award">award</SelectItem>
                        <SelectItem value="comedy">comedy</SelectItem>
                        <SelectItem value="television">television</SelectItem>
                        <SelectItem value="theater">theater</SelectItem>
                        <SelectItem value="convention">convention</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(regions).map(([region, currencies]) => (
                          <SelectGroup key={region} className="mb-3">
                            <SelectLabel className="bg-[#17BEBB] font-extrabold text-white">
                              {region}
                            </SelectLabel>
                            {Object.entries(currencies).map(
                              ([currencyCode, country]) => (
                                <SelectItem
                                  key={currencyCode}
                                  value={currencyCode}
                                >
                                  {country} ({currencyCode})
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Ticket</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      {form.getValues("currency") || "$"}
                    </span>
                    <span className="absolute left-[48px] top-1/2 -translate-y-1/2 text-gray-400">
                      |
                    </span>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="rounded-md border border-gray-300 pl-[3.5rem] shadow-sm transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Tickets Available</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="rounded-md border border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-[#17BEBB] focus:ring focus:ring-[#17BEBB]"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              {imagePreview || (!removedCurrentImage && currentImageUrl) ? (
                <div className="relative aspect-square w-32 rounded-lg bg-gray-100">
                  <Image
                    src={imagePreview || currentImageUrl!}
                    alt="Preview"
                    priority
                    fill
                    className="rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setRemovedCurrentImage(true);
                      if (imageInput.current) {
                        imageInput.current.value = "";
                      }
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInput}
                  className="hover:file:bg-[#17BEBB]/7 file:bg-[#17BEBB]/7 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#17BEBB]"
                />
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-all duration-200",
            mode === "edit"
              ? "bg-gradient-to-br from-[#ff0079] to-teal-500 font-bold hover:bg-gradient-to-l hover:from-teal-500 hover:to-[#ff0079]"
              : "bg-gradient-to-r from-[#17BEBB] to-[#17BEBB]/80 hover:from-[#17BEBB]/80 hover:to-[#17BEBB]",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating Event..." : "Updating Event..."}
            </>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Update Event"
          )}
        </Button>
      </form>
    </Form>
  );
}

/**
 * EventForm Component
 *
 * This component provides a form interface for creating and editing events.
 * It supports two modes: "create" for new events and "edit" for updating existing events.
 *
 * Key Features:
 * - Utilizes React Hook Form for form state management and validation.
 * - Supports initial data population for the edit mode.
 * - Handles image uploads and stores image references.
 * - Tracks currency changes and updates the currency symbol dynamically.
 *
 * Props:
 * - mode: Determines the form mode ("create" or "edit").
 * - initialData: Optional initial data for pre-filling the form in edit mode.
 *
 * Note:
 * - The ESLint rule `@typescript-eslint/no-unused-vars` is temporarily disabled to suppress warnings during development.
 * - The `EventFormProps` is defined as a type for flexibility and potential future extensibility.
 */
