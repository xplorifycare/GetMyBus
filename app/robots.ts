import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/blog/"],
      disallow: ["/calculator", "/calculator/", "/api", "/api/"],
    },
    sitemap: "https://www.getmybus.in/sitemap.xml",
  };
}
