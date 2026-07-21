import { Link } from 'react-router-dom'
import syniqMark from '@/assets/syniq-mark.svg'
import { RoutePath } from '@/routes/routePaths'

export function Logo() {
  return (
    <Link
      aria-label="Syniq home"
      className="group inline-flex items-center gap-3 rounded-[var(--radius-full)] transition outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
      to={RoutePath.home}
    >
      <img
        alt=""
        className="size-9 rounded-[var(--radius-md)] shadow-[var(--shadow-mark)]"
        height="36"
        src={syniqMark}
        width="36"
      />
      <span className="tracking-0 text-base font-semibold text-[var(--color-text-primary)]">
        Syniq
      </span>
    </Link>
  )
}
