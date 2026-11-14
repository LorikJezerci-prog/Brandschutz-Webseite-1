import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/kontakt.php" }, sitemap: new URL("/sitemap.xml", site.url).toString() };
}
