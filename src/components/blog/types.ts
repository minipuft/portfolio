export type PostFormat = 'narrative' | 'quicktake';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  readingTime: number;
  format: PostFormat;
  heroImage?: string;
  content?: string;
}

export interface RelatedContent {
  type: 'post' | 'project';
  slug: string;
  title: string;
  description?: string;
}

// Sample data for development
export const samplePosts: BlogPost[] = [
  {
    slug: 'building-mcp-server',
    title: 'Building a Production MCP Server',
    description: 'A deep dive into creating a Model Context Protocol server with TypeScript, including prompt templates, chain execution, and quality gates.',
    publishedAt: '2025-01-10',
    tags: ['mcp', 'typescript', 'ai-tooling'],
    featured: true,
    draft: false,
    readingTime: 12,
    format: 'narrative',
    heroImage: '/blog/mcp-server/hero.jpg',
  },
  {
    slug: 'year-3000-design',
    title: 'Year 3000 Design Philosophy',
    description: 'Exploring consciousness-responsive interfaces that anticipate, breathe, and resonate with users.',
    publishedAt: '2025-01-08',
    tags: ['design', 'ux', 'animation'],
    featured: true,
    draft: false,
    readingTime: 8,
    format: 'narrative',
    heroImage: '/blog/year3000/hero.jpg',
  },
  {
    slug: 'gsap-react-patterns',
    title: 'GSAP + React: Essential Patterns',
    description: 'Key patterns for integrating GSAP animations with React, including useGSAP, cleanup, and performance.',
    publishedAt: '2025-01-05',
    tags: ['react', 'gsap', 'animation'],
    featured: false,
    draft: false,
    readingTime: 6,
    format: 'narrative',
  },
  {
    slug: 'quick-tokyo-night-colors',
    title: 'Tokyo Night Color System',
    description: 'Quick reference for the Tokyo Night color palette and how I use it consistently across projects.',
    publishedAt: '2025-01-04',
    tags: ['design', 'css'],
    featured: false,
    draft: false,
    readingTime: 2,
    format: 'quicktake',
  },
  {
    slug: 'quick-lenis-setup',
    title: 'Lenis Smooth Scroll Setup',
    description: 'One-minute guide to adding Lenis smooth scrolling to a Next.js app with reduced motion support.',
    publishedAt: '2025-01-03',
    tags: ['nextjs', 'animation'],
    featured: false,
    draft: false,
    readingTime: 1,
    format: 'quicktake',
  },
  {
    slug: 'quick-intersection-observer',
    title: 'Scroll-Triggered Animations',
    description: 'Using Intersection Observer for performant scroll-triggered effects without GSAP ScrollTrigger.',
    publishedAt: '2025-01-02',
    tags: ['javascript', 'performance'],
    featured: false,
    draft: false,
    readingTime: 3,
    format: 'quicktake',
  },
];

// Helper functions
export function getPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return getPublishedPosts(posts).filter((post) => post.featured);
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return getPublishedPosts(posts).filter((post) => post.tags.includes(tag));
}

export function getPostsByFormat(posts: BlogPost[], format: PostFormat): BlogPost[] {
  return getPublishedPosts(posts).filter((post) => post.format === format);
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  getPublishedPosts(posts).forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Helper to generate related content suggestions based on tags
export function findRelatedContent(
  currentSlug: string,
  currentTags: string[],
  allPosts: { slug: string; title: string; description?: string; tags: string[] }[],
  allProjects: { slug: string; title: string; description?: string; tech: string[] }[],
  maxItems = 3
): RelatedContent[] {
  const related: Array<RelatedContent & { score: number }> = [];

  // Find related posts
  allPosts.forEach((post) => {
    if (post.slug === currentSlug) return;

    const matchingTags = post.tags.filter((tag) => currentTags.includes(tag));
    if (matchingTags.length > 0) {
      related.push({
        type: 'post',
        slug: post.slug,
        title: post.title,
        description: post.description,
        score: matchingTags.length,
      });
    }
  });

  // Find related projects (match tags to tech stack)
  allProjects.forEach((project) => {
    const matchingTech = project.tech.filter((tech) =>
      currentTags.some((tag) => tech.toLowerCase().includes(tag.toLowerCase()))
    );
    if (matchingTech.length > 0) {
      related.push({
        type: 'project',
        slug: project.slug,
        title: project.title,
        description: project.description,
        score: matchingTech.length,
      });
    }
  });

  // Sort by score and limit
  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(({ score: _score, ...item }) => item);
}
