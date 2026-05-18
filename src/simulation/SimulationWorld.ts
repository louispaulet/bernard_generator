import { BernardAgent } from './BernardAgent'
import { CarrotField } from './CarrotField'
import { PopulationLedger } from './PopulationLedger'
import { CEMETERY_AREA } from './areas'
import { DEFAULT_SETTINGS, resolveDay } from './rules'
import {
  createInitialBernards,
  getHomePositionForResident,
  getHouseCountForPopulation,
  HOUSE_POSITION,
} from './spawn'
import type { SimulationSettings, SimulationStats, Vector2, WorldBounds } from './types'
import { INITIAL_BERNARDS, MAX_GRAVES, type WorldSnapshot } from './worldState'
export class SimulationWorld {
  private readonly carrots = new CarrotField()
  private readonly ledger = new PopulationLedger()
  private readonly gravePositions: Vector2[] = []
  private bernards: BernardAgent[] = []
  private dayElapsedMs = 0
  private nextBernardId = INITIAL_BERNARDS + 1
  private builtHouseCount = Math.max(1, getHouseCountForPopulation(INITIAL_BERNARDS))
  private settings: SimulationSettings = DEFAULT_SETTINGS

  constructor(private readonly bounds: WorldBounds, settings: SimulationSettings) {
    this.settings = settings
  }

  start(random = Math.random): void {
    this.bernards = createInitialBernards(INITIAL_BERNARDS).map(
      (bernard, index) => new BernardAgent(bernard, getHomePositionForResident(index)),
    )
    this.spawnCarrots(random)
  }

  tick(deltaMs: number, settings: SimulationSettings): void {
    this.settings = settings
    const simulatedDelta = deltaMs * settings.speed
    this.dayElapsedMs += simulatedDelta

    for (const bernard of this.bernards) {
      const target = bernard.chooseTarget(this.carrots)
      target ? bernard.moveToward(target.position, simulatedDelta) : bernard.wanderNearHome(this.dayElapsedMs, simulatedDelta)
      bernard.eatTarget(this.carrots)
    }

    if (this.dayElapsedMs >= settings.dayDurationMs) {
      this.finishDay()
    }
  }

  getStats(): SimulationStats {
    return {
      day: this.ledger.day,
      livingBernards: this.bernards.length,
      deadBernards: this.ledger.deadTotal,
      carrotsRemaining: this.carrots.remaining(),
      birthsToday: this.ledger.birthsToday,
      timeRemainingMs: Math.max(
        0,
        (this.settings.dayDurationMs - this.dayElapsedMs) / this.settings.speed,
      ),
      bernardsPerDay: this.ledger.history,
    }
  }

  getSnapshot(): WorldSnapshot {
    return {
      bernards: this.bernards.map((bernard) => ({ ...bernard.data, facingLeft: bernard.facingLeft })),
      carrots: this.carrots.list(),
      gravePositions: this.gravePositions.map((position) => ({ ...position })),
      activeHouseCount: getHouseCountForPopulation(this.bernards.length),
      builtHouseCount: this.builtHouseCount,
    }
  }

  private finishDay(): void {
    const resolution = resolveDay(this.bernards.map((bernard) => bernard.data), this.settings, HOUSE_POSITION, this.nextBernardId)
    this.ledger.recordBirths(resolution.newborns.length)
    this.ledger.recordDeaths(resolution.dead.length)
    this.nextBernardId += resolution.newborns.length
    this.gravePositions.push(...resolution.dead.map((bernard) => bernard.position))
    this.gravePositions.splice(0, Math.max(0, this.gravePositions.length - MAX_GRAVES))

    const nextPopulation = [...resolution.survivors, ...resolution.newborns]
    this.builtHouseCount = Math.max(this.builtHouseCount, getHouseCountForPopulation(nextPopulation.length), 1)
    this.bernards = nextPopulation.map((bernard, index) => new BernardAgent(
      { ...bernard, position: getHomePositionForResident(index) },
      getHomePositionForResident(index),
    ))
    this.ledger.advanceDay(this.bernards.length)
    this.dayElapsedMs = 0
    this.spawnCarrots()
  }

  private spawnCarrots(random = Math.random): void {
    this.carrots.spawn(this.settings.totalCarrots, this.bounds, random, [CEMETERY_AREA])
  }
}
