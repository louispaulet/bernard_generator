import { describe, expect, it } from 'vitest'
import { BernardAgent, BERNARD_SPEED_PIXELS_PER_MS } from './BernardAgent'
import { CarrotField } from './CarrotField'
import type { Bernard } from './types'

function bernard(overrides: Partial<Bernard> = {}): Bernard {
  return {
    id: 1,
    position: { x: 0, y: 0 },
    carrotsEatenToday: 0,
    alive: true,
    ...overrides,
  }
}

describe('BernardAgent', () => {
  it('claims the nearest carrot and keeps that target', () => {
    const field = new CarrotField()
    field.spawn(2, { width: 100, height: 100, padding: 0 }, nextRandom([0.8, 0.8, 0.1, 0.1]))
    const agent = new BernardAgent(bernard(), { x: 0, y: 0 })

    const target = agent.chooseTarget(field)
    const repeated = agent.chooseTarget(field)

    expect(target).toMatchObject({ id: 2, claimedBy: 1 })
    expect(repeated).toMatchObject({ id: 2, claimedBy: 1 })
    expect(agent.targetCarrotId).toBe(2)
  })

  it('moves toward a target without overshooting and records facing direction', () => {
    const agent = new BernardAgent(bernard({ position: { x: 100, y: 0 } }), { x: 0, y: 0 })

    agent.moveToward({ x: 0, y: 0 }, 1_000)

    expect(agent.position.x).toBeCloseTo(100 - BERNARD_SPEED_PIXELS_PER_MS * 1_000)
    expect(agent.position.y).toBe(0)
    expect(agent.facingLeft).toBe(true)
  })

  it('eats the target carrot only when close enough', () => {
    const field = new CarrotField()
    field.spawn(1, { width: 20, height: 20, padding: 0 }, () => 0)
    const agent = new BernardAgent(bernard({ position: { x: 5, y: 5 } }), { x: 0, y: 0 })

    agent.chooseTarget(field)

    expect(agent.eatTarget(field)).toBe(true)
    expect(agent.carrotsEatenToday).toBe(1)
    expect(agent.targetCarrotId).toBeUndefined()
    expect(field.remaining()).toBe(0)
  })
})

function nextRandom(values: number[]) {
  let index = 0

  return () => values[index++] ?? values.at(-1) ?? 0
}
