import { MapPin } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <Reveal delay={index * 0.06}>
      <div className="group block w-full overflow-hidden rounded-3xl border border-line bg-white text-left transition-shadow duration-300 hover:shadow-xl">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={project.images[0]}
            alt={`${project.project}, ${project.client}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-ink">{project.project}</h3>
          <p className="mt-1 text-sm font-medium text-gold-dark">{project.client}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-stone-dark">
            <MapPin className="h-4 w-4 shrink-0" />
            {project.venue}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
