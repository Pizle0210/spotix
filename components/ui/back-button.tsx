"use client";
import type { ReactNode } from "react";
import { Button } from "./button";

export default function BackButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Button className={className}>{children}</Button>;
}
