import React from "react"

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  const base = "rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-xl font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  )
}