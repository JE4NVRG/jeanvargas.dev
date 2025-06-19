"use client";
import React from "react";

export default function BasicCard() {
  return (
    <div className="max-w-sm w-full mx-auto p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      <div className="h-64 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
        <div className="flex flex-row gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-3xl">⚡</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white py-2">
        Tecnologias que Impulsionam
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        IA, blockchain, banco de dados em tempo real, automações e muito mais.
      </p>
    </div>
  );
}
