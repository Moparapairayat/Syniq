import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { getButtonClassName } from '@/components/ui/buttonStyles'
import { PageTitle } from '@/components/ui/PageTitle'
import { Section } from '@/components/ui/Section'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RoutePath } from '@/routes/routePaths'

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found')

  return (
    <Container className="py-12 sm:py-16">
      <PageTitle
        description="The page you requested does not exist."
        eyebrow="404"
        title="Page Not Found"
      />
      <Section spacing="compact">
        <Link
          className={getButtonClassName({ variant: 'secondary' })}
          to={RoutePath.home}
        >
          Return Home
        </Link>
      </Section>
    </Container>
  )
}
