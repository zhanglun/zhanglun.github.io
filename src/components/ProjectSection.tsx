import React from "react";
import ProjectCard from "./ProjectCard";
import "./ProjectSection.css";

interface Project {
  url: string;
  name: string;
  description: string;
  technologies: readonly string[];
  image?: string;
  video?: string;
  links?: { icon: any; type: string; href: string }[];
}

interface Props {
  prefix?: string;
  projects: Project[];
}

export default function ProjectSection({ prefix = "", projects = [] }: Props) {
  return (
    <section className="section project--section">
      <div className="header">
        <div className="label text-smallcaps">
          <span>/</span> PROJECTS
        </div>
      </div>
      <div className="list">
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
