"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GoCopilot } from "react-icons/go";

export default function SimpleCardDemo() {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group"
      )}
    >
      <div
        className={cn(
          "h-[15rem] md:h-[20rem] rounded-xl z-40 bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
        )}
      >
        <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
          <div className="flex flex-row shrink-0 justify-center items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
              <GoCopilot className="h-6 w-6 dark:text-white" />
            </div>
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
              <span className="text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      <h3
        className={cn(
          "text-lg font-semibold text-gray-800 dark:text-white py-2"
        )}
      >
        Tecnologias que Impulsionam
      </h3>

      <p
        className={cn(
          "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm"
        )}
      >
        IA, blockchain, banco de dados em tempo real, automações e muito mais.
      </p>
    </div>
  );
}
