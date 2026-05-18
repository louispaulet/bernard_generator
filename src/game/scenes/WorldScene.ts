import Phaser from 'phaser'
import { ASSET_PATHS } from '../../assets'
import { DEFAULT_SETTINGS, resolveDay } from '../../simulation/rules'
import {
  createCarrots,
  createInitialBernards,
  getHomePositionForResident,
  getHouseCountForPopulation,
  getHousePosition,
  HOUSE_POSITION,
} from '../../simulation/spawn'
import type {
  Bernard,
  Carrot,
  PopulationDay,
  SimulationSettings,
  SimulationStats,
  WorldBounds,
} from '../../simulation/types'

type BernardView = {
  data: Bernard
  homePosition: { x: number; y: number }
  sprite: Phaser.GameObjects.Image
}

type CarrotView = {
  data: Carrot
  sprite: Phaser.GameObjects.Image
}

type HouseView = {
  sprite: Phaser.GameObjects.Image
}

export const WORLD_SIZE = {
  width: 960,
  height: 640,
  padding: 48,
}

const BERNARD_SPEED_PIXELS_PER_MS = 0.055
const EAT_DISTANCE = 18
const INITIAL_BERNARDS = 5
const MAX_GRAVES = 40
const CEMETERY = {
  x: 604,
  y: 374,
  width: 300,
  height: 196,
  cols: 8,
  cellWidth: 34,
  cellHeight: 38,
}

export class WorldScene extends Phaser.Scene {
  private settings: SimulationSettings = DEFAULT_SETTINGS
  private onStats?: (stats: SimulationStats) => void
  private bernards = new Map<number, BernardView>()
  private carrots = new Map<number, CarrotView>()
  private graves: Phaser.GameObjects.Image[] = []
  private houses = new Map<number, HouseView>()
  private day = 1
  private deadTotal = 0
  private birthsToday = 0
  private dayElapsedMs = 0
  private nextBernardId = INITIAL_BERNARDS + 1
  private builtHouseCount = Math.max(1, getHouseCountForPopulation(INITIAL_BERNARDS))
  private meadow?: Phaser.GameObjects.Graphics
  private bernardsPerDay: PopulationDay[] = [{ day: 1, bernards: INITIAL_BERNARDS }]

  constructor(
    getSettings: () => SimulationSettings,
    onStats: (stats: SimulationStats) => void,
  ) {
    super('WorldScene')
    this.settings = getSettings()
    this.getLatestSettings = getSettings
    this.onStats = onStats
  }

  private getLatestSettings: () => SimulationSettings = () => DEFAULT_SETTINGS

  preload() {
    this.load.svg('bernard', ASSET_PATHS.bernard, { width: 64, height: 96 })
    this.load.svg('carrot', ASSET_PATHS.carrot, { width: 72, height: 72 })
    this.load.svg('house', ASSET_PATHS.house, { width: 128, height: 128 })
    this.load.svg('grave', ASSET_PATHS.grave, { width: 64, height: 64 })
  }

  create() {
    this.cameras.main.setBackgroundColor('#cfe8c3')
    this.drawWorld()
    this.updateHouses(INITIAL_BERNARDS)
    this.startFirstDay()
  }

  update(_time: number, delta: number) {
    this.settings = this.getLatestSettings()
    const simulatedDelta = delta * this.settings.speed
    this.dayElapsedMs += simulatedDelta

    this.updateBernards(simulatedDelta)

    if (this.dayElapsedMs >= this.settings.dayDurationMs) {
      this.finishDay()
    }

    this.emitStats()
  }

  private drawWorld() {
    this.meadow = this.add.graphics()
    this.meadow.fillStyle(0xcfe8c3, 1)
    this.meadow.fillRect(0, 0, WORLD_SIZE.width, WORLD_SIZE.height)
    this.meadow.fillStyle(0xb7d99d, 1)
    this.meadow.fillRoundedRect(24, 24, WORLD_SIZE.width - 48, WORLD_SIZE.height - 48, 22)
    this.meadow.fillStyle(0x8bbf79, 1)
    this.meadow.fillCircle(820, 140, 92)
    this.meadow.fillCircle(760, 520, 72)
    this.meadow.fillStyle(0xf0d58f, 1)
    this.meadow.fillRoundedRect(84, 304, 780, 32, 16)
    this.meadow.fillStyle(0xb9b5aa, 1)
    this.meadow.fillRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 14)
    this.meadow.lineStyle(3, 0x837f75, 1)
    this.meadow.strokeRoundedRect(CEMETERY.x, CEMETERY.y, CEMETERY.width, CEMETERY.height, 14)
    this.meadow.lineStyle(1, 0xa6a195, 0.75)
    for (let row = 1; row < 4; row += 1) {
      const y = CEMETERY.y + 24 + row * CEMETERY.cellHeight
      this.meadow.lineBetween(CEMETERY.x + 18, y, CEMETERY.x + CEMETERY.width - 18, y)
    }
  }

  private startFirstDay() {
    this.bernards.clear()
    for (const bernard of createInitialBernards(INITIAL_BERNARDS)) {
      this.addBernard(bernard)
    }
    this.spawnCarrots()
    this.emitStats()
  }

  private finishDay() {
    const resolution = resolveDay(
      Array.from(this.bernards.values()).map((view) => view.data),
      this.settings,
      HOUSE_POSITION,
      this.nextBernardId,
    )

    this.birthsToday = resolution.newborns.length
    this.deadTotal += resolution.dead.length
    this.nextBernardId += resolution.newborns.length

    for (const view of this.bernards.values()) {
      view.sprite.destroy()
    }
    this.bernards.clear()

    for (const dead of resolution.dead) {
      const grave = this.add
        .image(dead.position.x, dead.position.y, 'grave')
        .setScale(0.38)
        .setAlpha(0.82)
        .setDepth(1)
      this.graves.push(grave)
    }
    while (this.graves.length > MAX_GRAVES) {
      this.graves.shift()?.destroy()
    }
    this.layoutGraves()

    for (const view of this.carrots.values()) {
      view.sprite.destroy()
    }
    this.carrots.clear()

    const nextPopulation = [...resolution.survivors, ...resolution.newborns].map(
      (bernard, index) => ({
        ...bernard,
        position: getHomePositionForResident(index),
      }),
    )

    this.updateHouses(nextPopulation.length)

    for (const bernard of nextPopulation) {
      this.addBernard(bernard)
    }

    this.day += 1
    this.dayElapsedMs = 0
    this.bernardsPerDay.push({ day: this.day, bernards: this.bernards.size })
    this.spawnCarrots()
  }

  private updateHouses(population: number) {
    const activeHouseCount = getHouseCountForPopulation(population)
    this.builtHouseCount = Math.max(this.builtHouseCount, activeHouseCount, 1)

    for (let index = 0; index < this.builtHouseCount; index += 1) {
      let house = this.houses.get(index)

      if (!house) {
        const position = getHousePosition(index)
        house = {
          sprite: this.add.image(position.x, position.y, 'house').setScale(0.78).setDepth(2),
        }
        this.houses.set(index, house)
      }

      if (index < activeHouseCount) {
        house.sprite.clearTint().setAlpha(1)
      } else {
        house.sprite.setTint(0x7d7f78).setAlpha(0.5)
      }
    }
  }

  private layoutGraves() {
    this.graves.forEach((grave, index) => {
      const column = index % CEMETERY.cols
      const row = Math.floor(index / CEMETERY.cols)
      const x = CEMETERY.x + 30 + column * CEMETERY.cellWidth
      const y = CEMETERY.y + 32 + row * CEMETERY.cellHeight

      grave.setPosition(x, y)
    })
  }

  private addBernard(bernard: Bernard) {
    const homePosition = getHomePositionForResident(this.bernards.size)
    const sprite = this.add
      .image(bernard.position.x, bernard.position.y, 'bernard')
      .setScale(0.48)
      .setDepth(4 + (bernard.id % 3))
    this.bernards.set(bernard.id, { data: bernard, homePosition, sprite })
  }

  private spawnCarrots() {
    const bounds: WorldBounds = {
      width: WORLD_SIZE.width,
      height: WORLD_SIZE.height,
      padding: WORLD_SIZE.padding,
    }
    const count = this.settings.totalCarrots

    for (const carrot of createCarrots(count, bounds)) {
      const sprite = this.add
        .image(carrot.position.x, carrot.position.y, 'carrot')
        .setScale(0.42)
        .setDepth(3)
      this.carrots.set(carrot.id, { data: carrot, sprite })
    }
  }

  private updateBernards(deltaMs: number) {
    for (const bernardView of this.bernards.values()) {
      const target = this.getTargetCarrot(bernardView.data)
      if (!target) {
        this.wanderNearHouse(bernardView, deltaMs)
        continue
      }

      this.moveToward(bernardView, target.data.position, deltaMs)

      const distance = Phaser.Math.Distance.Between(
        bernardView.data.position.x,
        bernardView.data.position.y,
        target.data.position.x,
        target.data.position.y,
      )

      if (distance <= EAT_DISTANCE) {
        bernardView.data.carrotsEatenToday += 1
        bernardView.data.targetCarrotId = undefined
        target.sprite.destroy()
        this.carrots.delete(target.data.id)
      }
    }
  }

  private getTargetCarrot(bernard: Bernard): CarrotView | undefined {
    const current = bernard.targetCarrotId ? this.carrots.get(bernard.targetCarrotId) : undefined
    if (current) {
      return current
    }

    let nearest: CarrotView | undefined
    let nearestDistance = Number.POSITIVE_INFINITY

    for (const carrot of this.carrots.values()) {
      if (carrot.data.claimedBy && carrot.data.claimedBy !== bernard.id) {
        continue
      }

      const distance = Phaser.Math.Distance.Between(
        bernard.position.x,
        bernard.position.y,
        carrot.data.position.x,
        carrot.data.position.y,
      )

      if (distance < nearestDistance) {
        nearest = carrot
        nearestDistance = distance
      }
    }

    if (nearest) {
      nearest.data.claimedBy = bernard.id
      bernard.targetCarrotId = nearest.data.id
    }

    return nearest
  }

  private moveToward(bernardView: BernardView, target: { x: number; y: number }, deltaMs: number) {
    const { data, sprite } = bernardView
    const angle = Phaser.Math.Angle.Between(data.position.x, data.position.y, target.x, target.y)
    const distance = Phaser.Math.Distance.Between(data.position.x, data.position.y, target.x, target.y)
    const step = Math.min(distance, BERNARD_SPEED_PIXELS_PER_MS * deltaMs)

    data.position = {
      x: data.position.x + Math.cos(angle) * step,
      y: data.position.y + Math.sin(angle) * step,
    }

    sprite.setPosition(data.position.x, data.position.y)
    sprite.setFlipX(Math.cos(angle) < 0)
  }

  private wanderNearHouse(bernardView: BernardView, deltaMs: number) {
    const offset = {
      x:
        bernardView.homePosition.x +
        Math.sin((this.dayElapsedMs + bernardView.data.id * 700) / 900) * 26,
      y:
        bernardView.homePosition.y +
        Math.cos((this.dayElapsedMs + bernardView.data.id * 400) / 1100) * 18,
    }
    this.moveToward(bernardView, offset, deltaMs)
  }

  private emitStats() {
    this.onStats?.({
      day: this.day,
      livingBernards: this.bernards.size,
      deadBernards: this.deadTotal,
      carrotsRemaining: this.carrots.size,
      birthsToday: this.birthsToday,
      timeRemainingMs: Math.max(
        0,
        (this.settings.dayDurationMs - this.dayElapsedMs) / this.settings.speed,
      ),
      bernardsPerDay: [...this.bernardsPerDay],
    })
  }
}
