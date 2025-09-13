import React from "react"

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const base =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
  return <input className={`${base} ${className}`} {...props} />
}