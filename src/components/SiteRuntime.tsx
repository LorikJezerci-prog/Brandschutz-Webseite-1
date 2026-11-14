"use client";

import { useEffect } from "react";
import { initSiteRuntime } from "@/lib/site-runtime";

/** Bindet die kleinen Verhaltensweisen der Seite ein. Rendert nichts. */
export function SiteRuntime() {
  useEffect(() => initSiteRuntime(document), []);
  return null;
}
