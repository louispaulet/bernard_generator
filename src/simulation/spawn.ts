import type { Bernard, Carrot, Vector2, WorldBounds } from './types'

export const HOUSE_POSITION: Vector2 = { x: 96, y: 320 }
export const HOUSE_CAPACITY = 10

const HOUSE_COLUMN_SIZE = 3
const HOUSE_SPACING = {
  x: 118,
  y: 118,
}

export function createInitialBernards(count: number, housePosition = HOUSE_POSITION): Bernard[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    position: { ...housePosition },
    carrotsEatenToday: 0,
    alive: true,
  }))
}

export function getHouseCountForPopulation(population: number): number {
  return Math.ceil(Math.max(0, population) / HOUSE_CAPACITY)
}

export function getHousePosition(index: number): Vector2 {
  const column = Math.floor(index / HOUSE_COLUMN_SIZE)
  const row = index % HOUSE_COLUMN_SIZE

  return {
    x: HOUSE_POSITION.x + column * HOUSE_SPACING.x,
    y: HOUSE_POSITION.y - row * HOUSE_SPACING.y,
  }
}

export function getHomePositionForResident(residentIndex: number): Vector2 {
  return getHousePosition(Math.floor(residentIndex / HOUSE_CAPACITY))
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
