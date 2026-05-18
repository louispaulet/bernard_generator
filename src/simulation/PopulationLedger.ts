import type { PopulationDay } from './types'

export class PopulationLedger {
  day = 1
  deadTotal = 0
  birthsToday = 0
  private readonly days: PopulationDay[] = [{ day: 1, bernards: 5 }]

  recordDeaths(count: number): void {
    this.deadTotal += count
  }

  recordBirths(count: number): void {
    this.birthsToday = count
  }

  advanceDay(population: number): void {
    this.day += 1
    this.days.push({ day: this.day, bernards: population })
  }

  resetDailyCounts(): void {
    this.birthsToday = 0
  }

  get history(): PopulationDay[] {
    return this.days.map((entry) => ({ ...entry }))
  }
}
