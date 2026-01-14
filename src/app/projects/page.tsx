import Link from 'next/link';
import { getAllProjects } from '@/lib/mdx';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ProjectCard from '@/components/home/ProjectCard';
import ProjectsHeader from '@/components/project/ProjectsHeader';

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <ProjectsHeader />

      <AnimatedSection className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger="stagger">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="block">
            <ProjectCard
              title={project.frontmatter.title}
              description={project.frontmatter.description}
              tech={project.frontmatter.technologies}
              color={project.frontmatter.accentColor}
            />
          </Link>
        ))}
      </AnimatedSection>
    </div>
  );
}