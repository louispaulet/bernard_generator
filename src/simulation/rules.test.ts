import { describe, expect, it } from 'vitest'
import type { Bernard, SimulationSettings } from './types'
import { DEFAULT_DAY_DURATION_MS, DEFAULT_SETTINGS, getRealDayDurationMs, resolveDay } from './rules'

const house = { x: 10, y: 20 }

function bernard(id: number, carrotsEatenToday: number): Bernard {
  return {
    id,
    position: { x: 100, y: 100 },
    carrotsEatenToday,
    alive: true,
  }
}

describe('resolveDay', () => {
  it('kills Bernards below the survival threshold', () => {
    const result = resolveDay([bernard(1, 2)], DEFAULT_SETTINGS, house, 2)

    expect(result.survivors).toHaveLength(0)
    expect(result.newborns).toHaveLength(0)
    expect(result.dead).toMatchObject([{ id: 1, alive: false }])
  })

  it('keeps Bernards alive without children when they survive but do not reproduce', () => {
    const result = resolveDay([bernard(1, 3)], DEFAULT_SETTINGS, house, 2)

    expect(result.survivors).toMatchObject([
      { id: 1, carrotsEatenToday: 0, alive: true, position: house },
    ])
    expect(result.newborns).toHaveLength(0)
    expect(result.dead).toHaveLength(0)
  })

  it('adds one child when a Bernard reaches the reproduction threshold', () => {
    const result = resolveDay([bernard(1, 6)], DEFAULT_SETTINGS, house, 9)

    expect(result.survivors).toHaveLength(1)
    expect(result.newborns).toMatchObject([{ id: 9, position: house, alive: true }])
    expect(result.dead).toHaveLength(0)
  })

  it('allows the survival and reproduction thresholds to be the same', () => {
    const result = resolveDay(
      [bernard(1, 5)],
      { ...DEFAULT_SETTINGS, carrotsToSurvive: 5, carrotsToReproduce: 5 },
      house,
      9,
    )

    expect(result.survivors).toHaveLength(1)
    expect(result.newborns).toMatchObject([{ id: 9, position: house, alive: true }])
    expect(result.dead).toHaveLength(0)
  })
})

describe('getRealDayDurationMs', () => {
  it.each([
    [1, 30_000],
    [2, 15_000],
    [3, 10_000],
  ] as const)('maps %ix speed to %ims real day duration', (speed, expected) => {
    const settings: SimulationSettings = {
      ...DEFAULT_SETTINGS,
      speed,
      dayDurationMs: DEFAULT_DAY_DURATION_MS,
    }

    expect(getRealDayDurationMs(settings)).toBe(expected)
  })
})

describe('DEFAULT_SETTINGS', () => {
  it('uses a fixed default carrot budget of 40 per day', () => {
    expect(DEFAULT_SETTINGS.totalCarrots).toBe(40)
  })
})
