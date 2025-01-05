'use client'
import Form from "next/form";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

export default function SearchBar() {
  return (
    <div>
      <Form action={"/search"} className="relative">
        <Input
          type="text"
          name="q"
          placeholder="Search for events..."
          className="w-full px-4 py-5 pl-12 text-white shadow-sm outline-none focus-within:outline-none focus:border-none focus:shadow-lg focus:ring-1 focus:ring-[#17BEBB]"
        />
        <Search className="hover: absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
        <Button
          type="submit"
          className="scroll absolute right-2 top-1/2 -translate-y-1/2 bg-[#40b5ad] px-4 font-medium text-white outline-none ring-0 transition-all duration-200 hover:bg-[#49c8c0] hover:ring-0"
          size={"sm"}
        >
          Search
        </Button>
      </Form>
    </div>
  );
}
