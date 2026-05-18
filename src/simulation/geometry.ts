import type { Vector2 } from './types'

export function distanceBetween(a: Vector2, b: Vector2): number {
  const dx = b.x - a.x
  const dy = b.y - a.y

  return Math.hypot(dx, dy)
}

export function movePointToward(
  start: Vector2,
  target: Vector2,
  maxDistance: number,
): Vector2 {
  const distance = distanceBetween(start, target)

  if (distance === 0 || maxDistance >= distance) {
    return { ...target }
  }

  const ratio = maxDistance / distance

  return {
    x: start.x + (target.x - start.x) * ratio,
    y: start.y + (target.y - start.y) * ratio,
  }
}

export function isMovingLeft(start: Vector2, target: Vector2): boolean {
  return target.x < start.x
}
