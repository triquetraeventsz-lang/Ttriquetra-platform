import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const variants = {
  primary: 'bg-gold text-ink hover:bg-gold-dark',
  dark: 'bg-ink text-cream hover:bg-charcoal',
  outline: 'border border-current bg-transparent hover:bg-ink hover:text-cream',
  'outline-light': 'border border-cream/40 text-cream bg-transparent hover:bg-cream hover:text-ink',
}

/**
 * Shared CTA button. Renders a <Link> when `to` is provided, otherwise a <button>.
 */
const Button = forwardRef(function Button(
  { to, href, variant = 'primary', withArrow = true, className = '', children, ...rest },
  ref,
) {
  const classes = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${variants[variant]} ${className}`

  const content = (
    <>
      <span>{children}</span>
      {withArrow && <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={`group ${classes}`} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={`group ${classes}`} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button ref={ref} className={`group ${classes}`} {...rest}>
      {content}
    </button>
  )
})

export default Button
