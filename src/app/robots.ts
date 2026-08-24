import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
    ],

    sitemap: "https://www.thesavecompany.com/sitemap.xml",
    host: "https://www.thesavecompany.com",
  };
}