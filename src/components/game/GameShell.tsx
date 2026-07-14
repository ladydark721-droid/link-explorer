import type { ReactNode } from "react";

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Ambient fog */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-x-[-20%] top-1/4 h-40 bg-[radial-gradient(ellipse_at_center,var(--color-poison)/25,transparent_70%)] blur-3xl animate-fog" />
        <div className="absolute inset-x-[-20%] bottom-1/4 h-40 bg-[radial-gradient(ellipse_at_center,var(--color-arcane)/20,transparent_70%)] blur-3xl animate-fog" style={{ animationDelay: "-4s" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,oklch(0_0_0/0.5)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 py-6">
        {children}
      </div>
    </div>
  );
}
