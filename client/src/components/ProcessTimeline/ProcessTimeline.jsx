import Reveal from '../Reveal/Reveal'

export default function ProcessTimeline({ steps }) {
  return (
    <ol className="relative flex flex-col gap-10 sm:gap-0">
      {steps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 0.06}
          className="relative flex gap-6 sm:gap-10 sm:pb-14 sm:last:pb-0"
        >
          <div className="flex flex-col items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-gold">
              {String(i + 1).padStart(2, '0')}
            </span>
            {i !== steps.length - 1 && (
              <span className="mt-2 hidden w-px flex-1 bg-line sm:block" aria-hidden="true" />
            )}
          </div>
          <div className="pb-2">
            <h3 className="text-xl font-semibold text-ink sm:text-2xl">{step.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-dark sm:text-base">
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
