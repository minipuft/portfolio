import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { NarrativePost } from '@/components/blog';
import { getPostBySlug, getAllPosts, getAllProjects } from '@/lib/mdx';
import { findRelatedContent, BlogPost, PostFormat } from '@/components/blog/types';
import { mdxComponents } from '@/mdx-components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Map ContentItem to BlogPost
  const blogPost: BlogPost = {
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    publishedAt: post.frontmatter.publishedAt,
    updatedAt: post.frontmatter.updatedAt,
    tags: post.frontmatter.tags,
    featured: post.frontmatter.featured,
    draft: post.frontmatter.draft,
    format: post.frontmatter.format || 'narrative' as PostFormat,
    heroImage: (post.frontmatter as any).heroImage,
    readingTime: post.frontmatter.readingTime || 5, // Should calculate from content
  };

  // Get related content based on tags
  const allPosts = getAllPosts().map(p => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    tags: p.frontmatter.tags
  }));

  const allProjects = getAllProjects().map(p => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    tech: p.frontmatter.technologies
  }));

  const relatedContent = findRelatedContent(
    slug,
    post.frontmatter.tags,
    allPosts,
    allProjects,
    3
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <NarrativePost
        post={blogPost}
        content={<MDXRemote source={post.content} components={mdxComponents} />}
        relatedContent={relatedContent}
      />
    </div>
  );
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}