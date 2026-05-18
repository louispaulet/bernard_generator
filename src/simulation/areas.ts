import type { Vector2 } from './types'

export type RectArea = {
  x: number
  y: number
  width: number
  height: number
}

export const CEMETERY = {
  x: 604,
  y: 374,
  width: 300,
  height: 196,
  cols: 8,
  rows: 4,
  cellWidth: 34,
  cellHeight: 38,
} as const

export const CEMETERY_AREA: RectArea = {
  x: CEMETERY.x,
  y: CEMETERY.y,
  width: CEMETERY.width,
  height: CEMETERY.height,
}

export function pointInRect(point: Vector2, rect: RectArea): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

export function pointInAnyRect(point: Vector2, rects: RectArea[]): boolean {
  return rects.some((rect) => pointInRect(point, rect))
}
