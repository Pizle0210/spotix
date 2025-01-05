"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import SearchBar from "../search-bar";
export default function Header() {
  return (
    <header className="w-full border-b bg-[#ff0079]">
      <div className="flex flex-col items-center gap-4 p-4 lg:flex-row">
        <div className="flex w-full items-center justify-between rounded-3xl p-0 lg:w-auto">
          {/*logo and clerk */}
          <Link href={"/"} className="shrink-0 font-bold">
            <h1 className="p-1 tracking-wider px-4 text-2xl uppercase text-[#13bbb6]">
              spo
              <span className="font-extrabold tracking-wider uppercase text-[#ffffff]">
                tix
              </span>
            </h1>
          </Link>

          <div className="lg:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="rounded-lg border border-gray-300 bg-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-all hover:bg-gray-500">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* desktop */}
        <div className="ml-auto hidden lg:block">
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href={"/seller"}>
                <button className="cursor-pointer rounded-lg bg-primary/80 px-3 py-2 text-sm text-white shadow-xl font-bold transition-all hover:bg-primary hover:shadow-none">
                  Sell Tickets
                </button>
              </Link>
              <Link href={"/tickets"}>
                <button className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-lg transition-all hover:bg-gray-200 hover:shadow-none">
                  My Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-800 transition hover:bg-gray-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* mobile action button */}
        <div className="flex w-full justify-center gap-3 lg:hidden">
          <SignedIn>
            <Link href={"/seller"} className="flex-1">
              <button className="w-full rounded-lg bg-primary/80 px-3 py-2 text-sm text-white shadow-lg transition-all hover:bg-primary hover:shadow-none">
                Sell Tickets
              </button>
            </Link>
            <Link href={"/tickets"} className="flex-1">
              <button className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-lg transition-all hover:bg-gray-200 hover:shadow-none">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
