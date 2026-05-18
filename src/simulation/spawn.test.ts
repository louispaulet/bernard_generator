import { describe, expect, it } from 'vitest'
import { createCarrots, createInitialBernards, HOUSE_POSITION } from './spawn'

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
