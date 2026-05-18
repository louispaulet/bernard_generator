import { describe, expect, it } from 'vitest'
import {
  createCarrots,
  createInitialBernards,
  getHomePositionForResident,
  getHouseCountForPopulation,
  getHousePosition,
  HOUSE_POSITION,
} from './spawn'
import { CEMETERY_AREA, pointInRect } from './areas'

describe('createCarrots', () => {
  it('spawns carrots inside the padded map bounds', () => {
    const carrots = createCarrots(
      2,
      { width: 500, height: 300, padding: 50 },
      () => 0.5,
    )

    expect(carrots).toEqual([
      { id: 1, position: { x: 250, y: 150 } },
      { id: 2, position: { x: 250, y: 150 } },
    ])
  })

  it('keeps carrots out of excluded areas', () => {
    const carrots = createCarrots(
      2,
      { width: 960, height: 640, padding: 48 },
      nextRandom([
        0.75, 0.7,
        0.5, 0.5,
        0.78, 0.72,
        0.1, 0.1,
      ]),
      [CEMETERY_AREA],
    )

    expect(carrots.every((carrot) => !pointInRect(carrot.position, CEMETERY_AREA))).toBe(true)
    expect(carrots[0].position).toEqual({ x: 480, y: 320 })
    expect(carrots[1].position).toEqual({ x: 134.4, y: 102.4 })
  })
})

describe('createInitialBernards', () => {
  it('spawns Bernards at the house', () => {
    const bernards = createInitialBernards(2)

    expect(bernards).toMatchObject([
      { id: 1, position: HOUSE_POSITION, alive: true },
      { id: 2, position: HOUSE_POSITION, alive: true },
    ])
  })
})

function nextRandom(values: number[]) {
  let index = 0

  return () => values[index++] ?? values.at(-1) ?? 0
}

describe('house placement', () => {
  it.each([
    [0, 0],
    [1, 1],
    [10, 1],
    [11, 2],
    [30, 3],
    [31, 4],
  ])('uses one house for every ten residents: %i residents need %i houses', (population, houses) => {
    expect(getHouseCountForPopulation(population)).toBe(houses)
  })

  it('adds the second and third houses upward from the first house', () => {
    expect(getHousePosition(0)).toEqual(HOUSE_POSITION)
    expect(getHousePosition(1)).toEqual({ x: HOUSE_POSITION.x, y: HOUSE_POSITION.y - 118 })
    expect(getHousePosition(2)).toEqual({ x: HOUSE_POSITION.x, y: HOUSE_POSITION.y - 236 })
  })

  it('assigns every ten residents to the next house', () => {
    expect(getHomePositionForResident(0)).toEqual(getHousePosition(0))
    expect(getHomePositionForResident(9)).toEqual(getHousePosition(0))
    expect(getHomePositionForResident(10)).toEqual(getHousePosition(1))
  })
})
