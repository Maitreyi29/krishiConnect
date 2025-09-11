import React from "react"

export function Select({ value, onValueChange, children, className }: any) {
  return <div className={className}>{children}</div>
}

export function SelectTrigger({ children, className }: any) {
  return <button className={className}>{children}</button>
}

export function SelectValue() {
  return null
}

export function SelectContent({ children }: any) {
  return <div>{children}</div>
}

export function SelectItem({ value, children }: any) {
  return <div>{children}</div>
}