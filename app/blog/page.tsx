import type { Metadata } from "next";
import { siteUrl, defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Art Stories & Guides",
  description: "Insights on buying original paintings, styling wall art, and collecting art with Rakhi Studio.",
  keywords: [...defaultKeywords, "art blog", "art tips", "home decor art", "collecting art"],
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Art Stories & Guides",
    description: "Learn how to choose, style, and invest in original paintings.",
    url: `${siteUrl}/blog`
  },
  twitter: {
    title: "Art Stories & Guides",
    description: "Learn how to choose, style, and invest in original paintings."
  }
};

const posts = [
  {
    title: "Why Original Paintings Add Lasting Value to Your Home",
    summary:
      "Discover how original art elevates your interiors, supports artists, and appreciates over time compared to mass prints."
  },
  {
    title: "How to Choose Paintings for Your Living Room, Bedroom, and Office",
    summary: "Room-by-room guidance on scale, palette, and mood so your wall art feels intentional and cohesive."
  },
  {
    title: "Abstract vs Modern Art: Key Differences and When to Choose Each",
    summary: "Understand styles, materials, and the stories behind abstract and modern art to pick the right fit."
  },
  {
    title: "Beginner’s Guide to Investing in Art Without Overthinking",
    summary: "Practical steps to start collecting original art confidently, from budgeting to provenance."
  }
];

const BlogPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Art stories</p>
        <h1 className="section-heading">Art Stories & Guides</h1>
        <p className="max-w-3xl text-white/70">
          Tips on selecting, styling, and collecting original paintings—written for homeowners, designers, and new
          collectors.
        </p>
      </div>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.title} className="card-glass rounded-3xl border border-white/10 bg-white/5 p-6 space-y-2">
            <h2 className="font-display text-2xl">{post.title}</h2>
            <p className="text-white/70">{post.summary}</p>
            <p className="text-sm text-white/60">Coming soon</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
