"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Return() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center text-white">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Account Connected!</h2>
            <p className="text-green-100">
              Your Stripe account has been successfully connected
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <h3 className="mb-1 font-medium text-green-900">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• You can now create and sell tickets for events</li>
                  <li>
                    • Payments will be processed through your Stripe account
                  </li>
                  <li>• Funds will be transferred automatically</li>
                </ul>
              </div>

              <Link
                href="/seller"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600/80 px-4 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-green-600"
              >
                Go to Seller Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
