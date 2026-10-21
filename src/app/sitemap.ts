import type { MetadataRoute } from "next";
import { services } from "@/config/services";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/leistungen", "/kontakt", "/impressum", "/datenschutz", ...services.map((s) => `/leistungen/${s.slug}`)];
  return paths.map((p) => ({ url: new URL(p, site.url).toString(), changeFrequency: "monthly", priority: p === "/" ? 1 : 0.6 }));
}
