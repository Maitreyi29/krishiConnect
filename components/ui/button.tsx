import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: "outline" | "default" | "secondary" | "destructive"
  size?: "sm" | "md" | "lg"
}

export function Button({ children, variant = "default", size = "md", className = "", ...props }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ring-offset-background"

  let variantClasses = ""
  if (variant === "default") variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
  else if (variant === "outline") variantClasses = "border border-border bg-transparent text-foreground hover:bg-muted"
  else if (variant === "secondary") variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/90"
  else if (variant === "destructive") variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90"

  let sizeClasses = ""
  if (size === "sm") sizeClasses = "h-8 px-3 text-sm"
  else if (size === "md") sizeClasses = "h-10 px-4 text-base"
  else if (size === "lg") sizeClasses = "h-12 px-6 text-lg"

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}