import type { NextConfig } from "next";

/**
 * Statischer Export für das Hosting bei all-inkl (Apache).
 * Sicherheits-Header und Weiterleitungen stehen in public/.htaccess,
 * das Kontaktformular verarbeitet public/kontakt.php.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
