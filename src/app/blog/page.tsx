import { getAllPosts } from '@/lib/mdx';
import BlogFeed from '@/components/blog/BlogFeed';
import BlogHeader from '@/components/blog/BlogHeader';
import { BlogPost, PostFormat } from '@/components/blog/types';

export default function BlogPage() {
  const posts = getAllPosts();

  // Map ContentItem<BlogFrontmatter> to BlogPost
  const formattedPosts: BlogPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    publishedAt: post.frontmatter.publishedAt,
    updatedAt: post.frontmatter.updatedAt,
    tags: post.frontmatter.tags,
    featured: post.frontmatter.featured,
    draft: post.frontmatter.draft,
    format: post.frontmatter.format || 'narrative' as PostFormat,
    heroImage: (post.frontmatter as any).heroImage, // Allow extra fields
    readingTime: post.frontmatter.readingTime || 5, // Default or calculate
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <BlogHeader />
      <BlogFeed posts={formattedPosts} showFilters showFeatured />
    </div>
  );
}