import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ProjectFrontmatter {
  title: string;
  description: string;
  slug: string;
  featured: boolean;
  order: number;
  heroImage: string;
  accentColor: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'active' | 'archived' | 'wip';
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  readingTime?: number;
}

export interface ContentItem<T> {
  frontmatter: T;
  content: string;
  slug: string;
}

function getContentFiles(directory: string): string[] {
  const fullPath = path.join(contentDirectory, directory);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter((file) => /\.mdx?$/.test(file));
}

function parseContentFile<T>(
  directory: string,
  filename: string
): ContentItem<T> {
  const fullPath = path.join(contentDirectory, directory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const slug = filename.replace(/\.mdx?$/, '');

  return {
    frontmatter: data as T,
    content,
    slug,
  };
}

export function getAllProjects(): ContentItem<ProjectFrontmatter>[] {
  const files = getContentFiles('projects');
  const projects = files.map((file) =>
    parseContentFile<ProjectFrontmatter>('projects', file)
  );

  return projects.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getFeaturedProjects(): ContentItem<ProjectFrontmatter>[] {
  return getAllProjects().filter((p) => p.frontmatter.featured);
}

export function getProjectBySlug(
  slug: string
): ContentItem<ProjectFrontmatter> | null {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export function getAllPosts(): ContentItem<BlogFrontmatter>[] {
  const files = getContentFiles('blog');
  const posts = files
    .map((file) => parseContentFile<BlogFrontmatter>('blog', file))
    .filter((post) => !post.frontmatter.draft);

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export function getFeaturedPosts(): ContentItem<BlogFrontmatter>[] {
  return getAllPosts().filter((p) => p.frontmatter.featured);
}

export function getPostBySlug(
  slug: string
): ContentItem<BlogFrontmatter> | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostsByTag(tag: string): ContentItem<BlogFrontmatter>[] {
  return getAllPosts().filter((p) =>
    p.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
