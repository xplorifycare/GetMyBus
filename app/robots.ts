import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/blog/", "/privacy", "/terms", "/cookies"],
      disallow: ["/calculator", "/calculator/", "/api", "/api/"],
    },
    sitemap: "https://www.getmybus.in/sitemap.xml",
  };
}
