"use client";

import { useContext } from "react";
import { LanguageContext } from "./provider";

export function useTranslation() {
  return useContext(LanguageContext);
}
