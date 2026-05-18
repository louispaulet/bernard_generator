import type { Vector2 } from './types'

export type RectArea = {
  x: number
  y: number
  width: number
  height: number
}

export const CEMETERY = {
  x: 679,
  y: 423,
  width: 150,
  height: 98,
  cols: 4,
  rows: 2,
  cellWidth: 28,
  cellHeight: 30,
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
