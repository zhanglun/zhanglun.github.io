import React from "react";
import clsx from 'clsx';
import ProjectCard from "./ProjectCard";
import styles from "./ProjectSection.module.css";

interface Project {
  name: string;
  url: string;
  description: string;
  technologies: string[];
  image?: string;
  video?: string;
  links?: { icon: any; type: string; href: string }[];
}

interface ProjectSectionProps {
  prefix?: string;
  projects: Project[];
}

export default function ProjectSection({
  prefix = "",
  projects = [],
}: ProjectSectionProps) {
  return (
    <section className={clsx('section', styles.section)}>
      <div className={styles.header}>
        <div className={`${styles.label} text-smallcaps`}>
          <span>/</span> PROJECTS
        </div>
      </div>
      <div className={styles.list}>
        {projects.slice(0, 4).map((project, index) => (
          <ProjectCard
            key={index}
            href={project.url}
            title={project.name}
            description={project.description}
            tags={project.technologies}
            image={project.image}
            video={project.video}
            links={project.links}
          />
        ))}
      </div>
    </section>
  );
}
