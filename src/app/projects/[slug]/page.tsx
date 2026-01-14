import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ProjectDetail from '@/components/project/ProjectDetail';
import { getProjectBySlug, getAllProjects } from '@/lib/mdx';
import { mdxComponents } from '@/mdx-components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetail
      title={project.frontmatter.title}
      description={project.frontmatter.description}
      tech={project.frontmatter.technologies}
      color={project.frontmatter.accentColor}
      github={project.frontmatter.githubUrl || ''}
    >
      <MDXRemote source={project.content} components={mdxComponents} />
    </ProjectDetail>
  );
}

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}