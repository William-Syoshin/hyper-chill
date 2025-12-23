'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズを設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 脈拍の中心点
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // パーティクル（脈拍に合わせて動く）
    class PulsingParticle {
      angle: number
      distance: number
      baseDistance: number
      size: number
      opacity: number
      pulseOffset: number

      constructor() {
        this.angle = Math.random() * Math.PI * 2
        this.baseDistance = Math.random() * 400 + 100
        this.distance = this.baseDistance
        this.size = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.4 + 0.2
        this.pulseOffset = Math.random() * Math.PI * 2
      }

      update(pulseScale: number) {
        this.distance = this.baseDistance * pulseScale
      }

      draw(centerX: number, centerY: number) {
        if (!ctx) return
        const x = centerX + Math.cos(this.angle) * this.distance
        const y = centerY + Math.sin(this.angle) * this.distance
        
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(x, y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 脈拍リング
    class PulseRing {
      radius: number
      maxRadius: number
      opacity: number
      speed: number

      constructor() {
        this.radius = 0
        this.maxRadius = Math.max(canvas.width, canvas.height)
        this.opacity = 0.3
        this.speed = 2
      }

      update() {
        this.radius += this.speed
        this.opacity = 0.3 * (1 - this.radius / this.maxRadius)
        
        if (this.radius > this.maxRadius) {
          this.radius = 0
          this.opacity = 0.3
        }
      }

      draw(centerX: number, centerY: number) {
        if (!ctx) return
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // パーティクルとリングを生成
    const particles: PulsingParticle[] = []
    const rings: PulseRing[] = []

    for (let i = 0; i < 100; i++) {
      particles.push(new PulsingParticle())
    }

    for (let i = 0; i < 3; i++) {
      const ring = new PulseRing()
      ring.radius = i * 200
      rings.push(ring)
    }

    // 脈拍のタイミング
    let pulseTime = 0
    const pulseSpeed = 0.05 // 脈拍の速度

    // アニメーションループ
    let animationId: number
    const animate = () => {
      // 画面を少しずつ暗く
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // 脈拍のスケール計算（sin波で1.0〜1.15の間で変動）
      pulseTime += pulseSpeed
      const pulseScale = 1.0 + Math.sin(pulseTime) * 0.15

      // リングを描画・更新
      rings.forEach((ring) => {
        ring.update()
        ring.draw(centerX, centerY)
      })

      // 中心の光る円（脈拍に合わせて拡大縮小）
      const coreRadius = 40 * pulseScale
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fill()

      // パーティクルを描画・更新
      particles.forEach((particle) => {
        particle.update(pulseScale)
        particle.draw(centerX, centerY)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#000000' }}
    />
  )
}

