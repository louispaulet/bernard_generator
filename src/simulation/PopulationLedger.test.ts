import { describe, expect, it } from 'vitest'
import { PopulationLedger } from './PopulationLedger'

describe('PopulationLedger', () => {
  it('tracks deaths, births, days, and immutable history', () => {
    const ledger = new PopulationLedger()

    ledger.recordDeaths(2)
    ledger.recordBirths(3)
    ledger.advanceDay(6)
    const history = ledger.history
    history[0].bernards = 999

    expect(ledger.day).toBe(2)
    expect(ledger.deadTotal).toBe(2)
    expect(ledger.birthsToday).toBe(3)
    expect(ledger.history).toEqual([
      { day: 1, bernards: 5 },
      { day: 2, bernards: 6 },
    ])
  })

  it('can reset daily birth counts', () => {
    const ledger = new PopulationLedger()

    ledger.recordBirths(4)
    ledger.resetDailyCounts()

    expect(ledger.birthsToday).toBe(0)
  })
})
