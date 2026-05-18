import { describe, expect, it } from 'vitest'
import { CarrotField } from './CarrotField'

describe('CarrotField', () => {
  it('spawns and lists carrots without exposing mutable internals', () => {
    const field = new CarrotField()

    field.spawn(1, { width: 100, height: 100, padding: 10 }, () => 0.5)
    const [carrot] = field.list()
    carrot.position.x = 999

    expect(field.remaining()).toBe(1)
    expect(field.list()[0].position).toEqual({ x: 50, y: 50 })
  })

  it('does not offer a carrot claimed by another Bernard', () => {
    const field = new CarrotField()
    field.spawn(2, { width: 100, height: 100, padding: 0 }, nextRandom([0.1, 0.1, 0.2, 0.2]))

    expect(field.claimNearest({ x: 0, y: 0 }, 1)).toMatchObject({ id: 1, claimedBy: 1 })
    expect(field.claimNearest({ x: 0, y: 0 }, 2)).toMatchObject({ id: 2, claimedBy: 2 })
  })

  it('removes eaten carrots from the field', () => {
    const field = new CarrotField()
    field.spawn(1, { width: 100, height: 100, padding: 0 }, () => 0)

    field.remove(1)

    expect(field.get(1)).toBeUndefined()
    expect(field.remaining()).toBe(0)
  })
})

function nextRandom(values: number[]) {
  let index = 0

  return () => values[index++] ?? values.at(-1) ?? 0
}
