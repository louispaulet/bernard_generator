import Phaser from 'phaser'
import { ASSET_PATHS } from '../../assets'
import { DEFAULT_SETTINGS } from '../../simulation/rules'
import { SimulationWorld } from '../../simulation/SimulationWorld'
import type { SimulationSettings, SimulationStats } from '../../simulation/types'
import { WorldRenderer } from '../WorldRenderer'

export const WORLD_SIZE = {
  width: 960,
  height: 640,
  padding: 48,
}

export class WorldScene extends Phaser.Scene {
  private worldRenderer?: WorldRenderer
  private world?: SimulationWorld
  private settings: SimulationSettings = DEFAULT_SETTINGS

  constructor(
    private readonly getLatestSettings: () => SimulationSettings,
    private readonly onStats: (stats: SimulationStats) => void,
  ) {
    super('WorldScene')
    this.settings = getLatestSettings()
  }

  preload(): void {
    this.load.svg('bernard', ASSET_PATHS.bernard, { width: 64, height: 96 })
    this.load.svg('carrot', ASSET_PATHS.carrot, { width: 72, height: 72 })
    this.load.svg('house', ASSET_PATHS.house, { width: 128, height: 128 })
    this.load.svg('grave', ASSET_PATHS.grave, { width: 64, height: 64 })
    this.load.svg('tree', ASSET_PATHS.tree, { width: 112, height: 128 })
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#cfe8c3')
    this.worldRenderer = new WorldRenderer(this)
    this.world = new SimulationWorld(WORLD_SIZE, this.settings)

    this.worldRenderer.drawWorld(WORLD_SIZE.width, WORLD_SIZE.height)
    this.world.start()
    this.publishWorld()
  }

  update(_time: number, delta: number): void {
    if (!this.world) {
      return
    }

    this.settings = this.getLatestSettings()
    this.world.tick(delta, this.settings)
    this.publishWorld()
  }

  private publishWorld(): void {
    if (!this.world || !this.worldRenderer) {
      return
    }

    this.worldRenderer.render(this.world.getSnapshot())
    this.onStats(this.world.getStats())
  }
}
