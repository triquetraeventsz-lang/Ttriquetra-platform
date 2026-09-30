import { BadgeCheck, Clock, Eye, Gem, PenTool, Target, Users, Zap } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

const iconMap = {
  'Precision Management': Target,
  Punctuality: Clock,
  'Promise-Driven Delivery': BadgeCheck,
  Transparency: Eye,
  'Design with Identity': PenTool,
  'Quality Without Compromise': Gem,
  'Agility & Innovation': Zap,
  'Empowered Teamwork': Users,
}

export default function ValueList({ values }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {values.map((value, i) => {
        const Icon = iconMap[value.title] ?? Target
        return (
          <Reveal key={value.title} delay={i * 0.05} className="bg-white p-7">
            <Icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
            <h3 className="mt-4 text-lg font-semibold text-ink">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-dark">{value.description}</p>
          </Reveal>
        )
      })}
    </div>
  )
}
