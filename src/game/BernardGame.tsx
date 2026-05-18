import Phaser from 'phaser'
import { useEffect, useRef } from 'react'
import type { SimulationSettings, SimulationStats } from '../simulation/types'
import { WORLD_SIZE, WorldScene } from './scenes/WorldScene'

type BernardGameProps = {
  settings: SimulationSettings
  onStats: (stats: SimulationStats) => void
}

export function BernardGame({ settings, onStats }: BernardGameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const settingsRef = useRef(settings)
  const onStatsRef = useRef(onStats)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  useEffect(() => {
    onStatsRef.current = onStats
  }, [onStats])

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return
    }

    const scene = new WorldScene(
      () => settingsRef.current,
      (stats) => onStatsRef.current(stats),
    )

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: WORLD_SIZE.width,
      height: WORLD_SIZE.height,
      backgroundColor: '#cfe8c3',
      pixelArt: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene,
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[360px] w-full overflow-hidden rounded-md border border-emerald-900/15 bg-emerald-100 shadow-sm"
      aria-label="Bernard simulation canvas"
    />
  )
}
