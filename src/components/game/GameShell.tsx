import type { ReactNode } from "react";
import parchmentBg from "@/assets/parchment.jpg";

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Dark stone backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.05_45)_0%,oklch(0.08_0.02_30)_75%)]" />
      {/* Chlorine mist */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-64 mist-poison blur-2xl animate-smoke opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 mist-poison blur-3xl animate-smoke opacity-40" style={{ animationDelay: "-4s" }} />

      {/* Parchment page */}
      <div
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-6"
        style={{
          backgroundImage: `url(${parchmentBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 0 60px oklch(0 0 0 / 70%), inset 0 0 80px oklch(0.3 0.08 35 / 50%)",
        }}
      >
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
