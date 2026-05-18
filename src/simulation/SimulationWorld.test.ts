import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from './rules'
import { SimulationWorld } from './SimulationWorld'
import { INITIAL_BERNARDS } from './worldState'

const bounds = {
  width: 960,
  height: 640,
  padding: 48,
}

describe('SimulationWorld', () => {
  it('starts with initial Bernards, houses, carrots, and stats', () => {
    const world = new SimulationWorld(bounds, DEFAULT_SETTINGS)

    world.start(() => 0.5)

    expect(world.getSnapshot()).toMatchObject({
      activeHouseCount: 1,
      builtHouseCount: 1,
    })
    expect(world.getSnapshot().bernards).toHaveLength(INITIAL_BERNARDS)
    expect(world.getSnapshot().carrots).toHaveLength(DEFAULT_SETTINGS.totalCarrots)
    expect(world.getStats()).toMatchObject({
      day: 1,
      livingBernards: INITIAL_BERNARDS,
      deadBernards: 0,
    })
  })

  it('ticks simulated time using speed-adjusted elapsed time', () => {
    const world = new SimulationWorld(bounds, { ...DEFAULT_SETTINGS, speed: 2 })
    world.start(() => 0.5)

    world.tick(1_000, { ...DEFAULT_SETTINGS, speed: 2 })

    expect(world.getStats().timeRemainingMs).toBe(14_000)
  })

  it('finishes a day and records deaths when Bernards cannot eat enough', () => {
    const world = new SimulationWorld(bounds, {
      ...DEFAULT_SETTINGS,
      carrotsToSurvive: 99,
      dayDurationMs: 1,
    })
    world.start(() => 0.5)

    world.tick(1, { ...DEFAULT_SETTINGS, carrotsToSurvive: 99, dayDurationMs: 1 })

    expect(world.getStats()).toMatchObject({
      day: 2,
      livingBernards: 0,
      deadBernards: INITIAL_BERNARDS,
      carrotsRemaining: DEFAULT_SETTINGS.totalCarrots,
    })
    expect(world.getSnapshot().gravePositions).toHaveLength(INITIAL_BERNARDS)
  })

  it('keeps survivors and records population history', () => {
    const world = new SimulationWorld(bounds, {
      ...DEFAULT_SETTINGS,
      carrotsToSurvive: 0,
      carrotsToReproduce: 99,
      dayDurationMs: 1,
    })
    world.start(() => 0.5)

    world.tick(1, { ...DEFAULT_SETTINGS, carrotsToSurvive: 0, carrotsToReproduce: 99, dayDurationMs: 1 })

    expect(world.getStats().bernardsPerDay).toEqual([
      { day: 1, bernards: 5 },
      { day: 2, bernards: 5 },
    ])
  })
})
