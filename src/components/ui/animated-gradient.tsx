"use client";
import { cn } from "@/lib/utils";

export const AnimatedGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <div 
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/30 via-purple-300/30 to-blue-300/30 blur-3xl animate-pulse" 
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-300/30 via-cyan-300/30 to-teal-300/30 blur-3xl animate-pulse" 
        style={{ animationDelay: '1s' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 blur-3xl animate-pulse" 
        style={{ animationDelay: '0.5s' }}
      />
    </div>
  );
};
