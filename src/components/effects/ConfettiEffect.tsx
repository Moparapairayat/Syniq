import { useEffect, useRef } from 'react'

interface ConfettiEffectProps {
  readonly isActive: boolean
  readonly duration?: number // Duration in ms
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  opacity: number
  life: number
}

const PALETTE = [
  '#fcd34d', // Gold
  '#fbbf24', // Amber
  '#f59e0b', // Dark Amber
  '#38bdf8', // Blue
  '#4ade80', // Green
  '#f87171', // Red
  '#ffffff', // Pure White
]

export function ConfettiEffect({ isActive, duration = 3000 }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 110

    // Spawn celebration burst particles from center-top
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14 - 3,
        size: Math.random() * 8 + 4,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        life: 1,
      })
    }

    let animationFrameId: number
    const startTime = Date.now()

    const render = () => {
      const elapsed = Date.now() - startTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let activeCount = 0

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.28 // Gravity
        p.vx *= 0.98 // Air resistance
        p.rotation += p.vRot
        p.life -= 0.012
        p.opacity = Math.max(0, p.life)

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          activeCount++
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.shadowBlur = 8
          ctx.shadowColor = p.color

          // Draw shiny rotated square/rectangle confetti piece
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
      }

      if (activeCount > 0 && elapsed < duration) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [isActive, duration])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[150] h-full w-full select-none"
    />
  )
}
