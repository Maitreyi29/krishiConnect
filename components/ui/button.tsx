import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: "outline" | "default" // add other variants if needed
  size?: "sm" | "md" | "lg" // add other sizes if needed
}

export function Button({ children, variant = "default", size = "md", ...props }: ButtonProps) {
  let variantClasses = ""
  if (variant === "outline") variantClasses = "border-2 border-primary text-primary"
  // Add more variant styles here

  let sizeClasses = ""
  if (size === "sm") sizeClasses = "px-2 py-1 text-sm"
  else if (size === "md") sizeClasses = "px-4 py-2 text-base"
  else if (size === "lg") sizeClasses = "px-6 py-3 text-lg"

  return (
    <button className={`${variantClasses} ${sizeClasses} ${props.className || ""}`} {...props}>
      {children}
    </button>
  )
}