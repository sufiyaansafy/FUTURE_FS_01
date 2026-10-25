import { useState } from 'react'
import { categories, projects } from '../data/projects.js'
import { ExternalIcon } from './Icons.jsx'
import Section from './Section.jsx'

const statusClass = {
  Live: 'status-live',
  'Up next': 'status-next',
  Planned: 'status-planned',
  Completed: 'status-done',
  'In progress': 'status-progress',
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <Section
      id="projects"
      title="Projects"
      lead="Three builds for my Future Interns internship, plus work from my certifications and degree."
    >
      <div className="filters" role="group" aria-label="Filter projects">
        {categories.map((cat) => {
          const count =
            cat.id === 'all' ? projects.length : projects.filter((p) => p.category === cat.id).length
          return (
            <button
              key={cat.id}
              type="button"
              className="filter"
              aria-pressed={filter === cat.id}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label} <span className="filter-count">({count})</span>
            </button>
          )
        })}
      </div>

      <p className="visually-hidden" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
      </p>

      <ul className="project-list">
        {visible.map((project) => {
          const isTask = project.category === 'internship'
          return (
            <li key={project.id} className={isTask ? 'project project-task' : 'project'}>
              <div className="project-key" aria-hidden={isTask ? 'true' : undefined}>
                {isTask ? project.step.replace('Task ', '0') : project.step}
              </div>
              <div className="project-main">
                {isTask && <p className="visually-hidden">{project.step}</p>}
                <h3>{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <ul className="slash-list slash-list-small" aria-label="Built with">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="project-meta">
                <span className={`status ${statusClass[project.status] ?? ''}`}>{project.status}</span>
                <span className="project-when">{project.when}</span>
                {project.links.map((link) => (
                  <a key={link.href} className="project-link" href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ExternalIcon />
                  </a>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
