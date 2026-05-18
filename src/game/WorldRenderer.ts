import type Phaser from 'phaser'
import { getHousePosition } from '../simulation/spawn'
import type { WorldSnapshot } from '../simulation/worldState'
import { TREE_POSITIONS, drawTerrain, getGraveDepth, getGravePosition } from './TerrainPainter'

type SpriteMap = Map<number, Phaser.GameObjects.Image>

export class WorldRenderer {
  private bernards: SpriteMap = new Map()
  private carrots: SpriteMap = new Map()
  private graves: Phaser.GameObjects.Image[] = []
  private houses: SpriteMap = new Map()
  private trees: Phaser.GameObjects.Image[] = []

  constructor(private readonly scene: Phaser.Scene) {}

  drawWorld(width: number, height: number): void {
    drawTerrain(this.scene, width, height)
    this.syncTrees()
  }

  render(snapshot: WorldSnapshot): void {
    this.syncHouses(snapshot.activeHouseCount, snapshot.builtHouseCount)
    this.syncCarrots(snapshot)
    this.syncBernards(snapshot)
    this.syncGraves(snapshot.gravePositions.length)
  }

  private syncHouses(activeHouseCount: number, builtHouseCount: number): void {
    for (let index = 0; index < builtHouseCount; index += 1) {
      let house = this.houses.get(index)

      if (!house) {
        const position = getHousePosition(index)
        house = this.scene.add.image(position.x, position.y, 'house').setScale(0.78).setDepth(2)
        this.houses.set(index, house)
      }

      index < activeHouseCount
        ? house.clearTint().setAlpha(1)
        : house.setTint(0x7d7f78).setAlpha(0.5)
    }
  }

  private syncCarrots(snapshot: WorldSnapshot): void {
    this.removeMissing(this.carrots, snapshot.carrots.map((carrot) => carrot.id))

    for (const carrot of snapshot.carrots) {
      const sprite = this.carrots.get(carrot.id) ?? this.createCarrot(carrot.id)
      sprite.setPosition(carrot.position.x, carrot.position.y)
    }
  }

  private syncBernards(snapshot: WorldSnapshot): void {
    this.removeMissing(this.bernards, snapshot.bernards.map((bernard) => bernard.id))

    for (const bernard of snapshot.bernards) {
      const sprite = this.bernards.get(bernard.id) ?? this.createBernard(bernard.id)
      sprite.setPosition(bernard.position.x, bernard.position.y)
      sprite.setFlipX(bernard.facingLeft)
    }
  }

  private syncGraves(count: number): void {
    while (this.graves.length < count) {
      this.graves.push(this.scene.add.image(0, 0, 'grave').setScale(0.38).setAlpha(0.82).setDepth(1))
    }

    while (this.graves.length > count) {
      this.graves.shift()?.destroy()
    }

    this.graves.forEach((grave, index) => {
      const position = getGravePosition(index)
      grave.setPosition(position.x, position.y)
      grave.setDepth(getGraveDepth(index))
    })
  }

  private syncTrees(): void {
    if (this.trees.length > 0) {
      return
    }

    this.trees = TREE_POSITIONS.map((position, index) => (
      this.scene.add.image(position.x, position.y, 'tree')
        .setScale(index % 3 === 0 ? 0.72 : 0.62)
        .setDepth(1)
    ))
  }

  private createCarrot(id: number): Phaser.GameObjects.Image {
    const sprite = this.scene.add.image(0, 0, 'carrot').setScale(0.42).setDepth(3)
    this.carrots.set(id, sprite)
    return sprite
  }

  private createBernard(id: number): Phaser.GameObjects.Image {
    const sprite = this.scene.add.image(0, 0, 'bernard').setScale(0.48).setDepth(4 + (id % 3))
    this.bernards.set(id, sprite)
    return sprite
  }

  private removeMissing(sprites: SpriteMap, activeIds: number[]): void {
    const active = new Set(activeIds)
    for (const [id, sprite] of sprites) {
      if (!active.has(id)) {
        sprite.destroy()
        sprites.delete(id)
      }
    }
  }
}
