import type Phaser from 'phaser'
import type { Vector2 } from '../simulation/types'

export const CEMETERY = {
  x: 604,
  y: 374,
  width: 300,
  height: 196,
  cols: 8,
  cellWidth: 34,
  cellHeight: 38,
}

export function drawTerrain(scene: Phaser.Scene, width: number, height: number): void {
  const meadow = scene.add.graphics()
  meadow.fillStyle(0xcfe8c3, 1)
  meadow.fillRect(0, 0, width, height)
  meadow.fillStyle(0xb7d99d, 1)
  meadow.fillRoundedRect(24, 24, width - 48, height - 48, 22)
  meadow.fillStyle(0x8bbf79, 1)
  meadow.fillCircle(820, 140, 92)
  meadow.fillCircle(760, 520, 72)
  meadow.fillStyle(0xf0d58f, 1)
  meadow.fillRoundedRect(84, 304, 780, 32, 16)
  meadow.fillStyle(0xb9b5aa, 1)
  meadow.fillRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 14)
  meadow.lineStyle(3, 0x837f75, 1)
  meadow.strokeRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 14)
  meadow.lineStyle(1, 0xa6a195, 0.75)

  for (let row = 1; row < 4; row += 1) {
    const y = CEMETERY.y + 24 + row * CEMETERY.cellHeight
    meadow.lineBetween(CEMETERY.x + 18, y, CEMETERY.x + CEMETERY.width - 18, y)
  }
}

export function getGravePosition(index: number): Vector2 {
  const column = index % CEMETERY.cols
  const row = Math.floor(index / CEMETERY.cols)

  return {
    x: CEMETERY.x + 30 + column * CEMETERY.cellWidth,
    y: CEMETERY.y + 32 + row * CEMETERY.cellHeight,
  }
}
