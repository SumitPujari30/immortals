"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"
import { User } from "lucide-react"

function Avatar({
  className,
  size = "default",
  variant = "circle",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  variant?: "circle" | "pill"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/avatar relative flex shrink-0 select-none transition-all duration-300",
        // Circle Variant
        "data-[variant=circle]:rounded-full",
        "data-[variant=circle]:size-10 data-[variant=circle]:data-[size=lg]:size-12 data-[variant=circle]:data-[size=sm]:size-8",
        "data-[variant=circle]:data-[size=xl]:size-16 data-[variant=circle]:data-[size=2xl]:size-24 data-[variant=circle]:data-[size=3xl]:size-32 data-[variant=circle]:data-[size=4xl]:size-40",
        // Pill (Capsule) Variant - Massive Horizontal Presence
        "data-[variant=pill]:rounded-[100px] data-[variant=pill]:aspect-[2.2/1]",
        "data-[variant=pill]:h-8 data-[variant=pill]:data-[size=lg]:h-10 data-[variant=pill]:data-[size=xl]:h-14 data-[variant=pill]:data-[size=2xl]:h-20 data-[variant=pill]:data-[size=3xl]:h-24 data-[variant=pill]:data-[size=4xl]:h-28",
        // Visual Polish
        "ring-2 ring-emerald-500/10 ring-offset-2 ring-offset-background hover:ring-emerald-500/30",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 shadow-[inset_0_-6px_10px_rgba(0,0,0,0.25),inset_0_6px_10px_rgba(255,255,255,0.35)] relative overflow-hidden",
        "group-data-[variant=circle]/avatar:rounded-full group-data-[variant=pill]/avatar:rounded-[100px]",
        "animate-in fade-in duration-500",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent)] pointer-events-none" />
      <User className="h-3/5 aspect-square text-white/95 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] shrink-0" />
    </AvatarPrimitive.Fallback>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
