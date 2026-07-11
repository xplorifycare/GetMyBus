import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/lib/blogData";
import BlogReaderClient from "@/components/BlogReaderClient";

interface Props {
  params: {
    slug: string;
  };
}

// Generate static routes at build time for all articles (SSG)
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

// SEO & AEO Meta Generation on the Server
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: "Article Not Found | GetMyBus Blog",
    };
  }

  return {
    title: `${article.seoTitle} | GetMyBus Blog`,
    description: article.snippet,
    keywords: `${article.keyword}, GetMyBus blog, Kerala transit technology, bus operator ad income, dynamic ETM ticketing`,
    alternates: {
      canonical: `https://www.getmybus.in/blog/${article.slug}`,
    },
    openGraph: {
      title: `${article.seoTitle} | GetMyBus Blog`,
      description: article.snippet,
      url: `https://www.getmybus.in/blog/${article.slug}`,
      siteName: "GetMyBus Blog",
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
      authors: [article.author],
      images: [
        {
          url: `https://www.getmybus.in/blog/${article.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.headline,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.seoTitle} | GetMyBus Blog`,
      description: article.snippet,
      images: [`https://www.getmybus.in/blog/${article.slug}/opengraph-image`],
    },
  };
}

export default function BlogReaderPage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  // Article structured JSON-LD schema (rendered server-side for maximum indexability)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.snippet,
    "image": `https://www.getmybus.in/blog/${article.slug}/opengraph-image`,
    "datePublished": new Date(article.date).toISOString().split("T")[0],
    "dateModified": new Date(article.date).toISOString().split("T")[0],
    "author": {
      "@type": "Organization",
      "name": "GetMyBus",
      "url": "https://www.getmybus.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GetMyBus",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.getmybus.in/logo_white.png"
      }
    },
    "mainEntityOfPage": `https://www.getmybus.in/blog/${article.slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogReaderClient article={article} />
    </>
  );
}
