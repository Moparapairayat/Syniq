import { Container } from '@/components/ui/Container'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)]">
      <Container className="flex flex-col gap-2 py-8 text-sm text-[var(--color-text-tertiary)] sm:flex-row sm:items-center sm:justify-between">
        <p>Syniq</p>
        <p>Phase 1 foundation, {currentYear}</p>
      </Container>
    </footer>
  )
}
