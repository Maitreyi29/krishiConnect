import React from "react"

// Card wrapper
export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div {...props}>{children}</div>
}

// Card content
export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

// Card header
export function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

// Card title
export function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <h2 {...props}>{children}</h2>
}