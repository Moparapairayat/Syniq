import { NavLink } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { mainNavigationItems } from '@/routes/navigation'
import { cn } from '@/utils/classNames'
import { Logo } from './Logo'

const navLinkBaseClassName =
  'rounded-[var(--radius-full)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]'

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border-subtle)] bg-[color:rgb(16_18_21/0.86)] backdrop-blur-xl">
      <Container className="flex min-h-14 flex-row items-center justify-between py-3">
        <Logo />
        <nav aria-label="Primary navigation">
          <ul className="flex flex-row items-center gap-1 sm:gap-2">
            {mainNavigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      navLinkBaseClassName,
                      'px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm',
                      isActive &&
                        'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-inset)]',
                    )
                  }
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
