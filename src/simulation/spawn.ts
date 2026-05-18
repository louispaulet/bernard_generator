import type { Bernard, Carrot, Vector2, WorldBounds } from './types'

export const HOUSE_POSITION: Vector2 = { x: 96, y: 320 }

export function createInitialBernards(count: number, housePosition = HOUSE_POSITION): Bernard[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    position: { ...housePosition },
    carrotsEatenToday: 0,
    alive: true,
  }))
}

export function createCarrots(
  count: number,
  bounds: WorldBounds,
  random = Math.random,
): Carrot[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    position: randomPosition(bounds, random),
  }))
}

export function getDailyCarrotCount(livingBernards: number): number {
  return Math.max(16, Math.ceil(livingBernards * 8))
}

export function randomPosition(bounds: WorldBounds, random = Math.random): Vector2 {
  const minX = bounds.padding
  const maxX = bounds.width - bounds.padding
  const minY = bounds.padding
  const maxY = bounds.height - bounds.padding

  return {
    x: minX + random() * (maxX - minX),
    y: minY + random() * (maxY - minY),
  }
}
