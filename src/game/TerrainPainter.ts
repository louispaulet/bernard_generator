import type Phaser from 'phaser'
import { CEMETERY } from '../simulation/areas'
import type { Vector2 } from '../simulation/types'

export const TREE_POSITIONS: Vector2[] = [
  { x: 92, y: 92 },
  { x: 176, y: 92 },
  { x: 284, y: 96 },
  { x: 704, y: 94 },
  { x: 808, y: 124 },
  { x: 888, y: 214 },
  { x: 146, y: 512 },
  { x: 258, y: 548 },
  { x: 450, y: 548 },
  { x: 548, y: 514 },
  { x: 936, y: 588 },
]

export function drawTerrain(scene: Phaser.Scene, width: number, height: number): void {
  const meadow = scene.add.graphics()
  meadow.fillStyle(0xcfe8c3, 1)
  meadow.fillRect(0, 0, width, height)
  meadow.fillStyle(0xb7d99d, 1)
  meadow.fillRoundedRect(24, 24, width - 48, height - 48, 22)
  meadow.fillStyle(0xf0d58f, 1)
  meadow.fillRoundedRect(84, 304, 780, 32, 16)
  meadow.fillStyle(0xc7c1b4, 1)
  meadow.fillRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 10)
  meadow.lineStyle(3, 0x817a6b, 1)
  meadow.strokeRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 10)
}

export function getGravePosition(index: number): Vector2 {
  const capacity = CEMETERY.cols * CEMETERY.rows
  const cellIndex = index % capacity
  const stackIndex = Math.floor(index / capacity)
  const column = cellIndex % CEMETERY.cols
  const row = Math.floor(cellIndex / CEMETERY.cols)
  const offsets = [
    { x: 0, y: 0 },
    { x: 7, y: -5 },
    { x: -7, y: 5 },
    { x: 4, y: 8 },
    { x: -4, y: -8 },
  ]
  const offset = offsets[stackIndex % offsets.length]

  return {
    x: CEMETERY.x + 24 + column * CEMETERY.cellWidth + offset.x,
    y: CEMETERY.y + 28 + row * CEMETERY.cellHeight + offset.y,
  }
}

export function getGraveDepth(index: number): number {
  const capacity = CEMETERY.cols * CEMETERY.rows
  return 1 + Math.floor(index / capacity)
}
