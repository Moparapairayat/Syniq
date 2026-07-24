import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

const PALETTE = ['#fcd34d', '#86efac', '#fef08a', '#ffffff', '#4ade80']

export function ForestParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const count = 35
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2, // Floating upwards gently
        opacity: Math.random() * 0.6 + 0.2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around borders
        if (p.y < -10) p.y = canvas.height + 10
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full select-none"
    />
  )
}
