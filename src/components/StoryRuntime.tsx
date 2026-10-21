"use client";

import { useEffect } from "react";
import { initSiteRuntime } from "@/lib/site-runtime";

/** Bindet die Scroll-Engine ein. Rendert nichts. */
export function StoryRuntime() {
  useEffect(() => initSiteRuntime(document), []);
  return null;
}
