import { describe, expect, it } from 'vitest'
import { WorldRenderer } from './WorldRenderer'
import type { WorldSnapshot } from '../simulation/worldState'
import type Phaser from 'phaser'

type FakeScene = {
  add: {
    images: FakeImage[]
    graphicsCalls: number
    graphics: () => ReturnType<typeof createGraphics>
    image: (x: number, y: number, key: string) => FakeImage
  }
}

describe('WorldRenderer', () => {
  it('draws terrain and syncs sprites from world snapshots', () => {
    const scene = createScene()
    const renderer = new WorldRenderer(scene as unknown as Phaser.Scene)

    renderer.drawWorld(960, 640)
    renderer.render(snapshot())
    renderer.render({ ...snapshot(), bernards: [], carrots: [], gravePositions: [] })

    expect(scene.add.graphicsCalls).toBe(1)
    const imageKeys = scene.add.images.map((image: FakeImage) => image.key)

    expect(imageKeys).toContain('house')
    expect(imageKeys).toContain('bernard')
    expect(imageKeys).toContain('carrot')
    expect(imageKeys).toContain('grave')
    expect(scene.add.images.some((image: FakeImage) => image.destroyed)).toBe(true)
  })
})

function snapshot(): WorldSnapshot {
  return {
    activeHouseCount: 1,
    builtHouseCount: 2,
    bernards: [
      {
        id: 1,
        position: { x: 20, y: 30 },
        carrotsEatenToday: 0,
        alive: true,
        facingLeft: true,
      },
    ],
    carrots: [{ id: 1, position: { x: 80, y: 90 } }],
    gravePositions: [{ x: 100, y: 100 }],
  }
}

function createScene(): FakeScene {
  const images: FakeImage[] = []

  return {
    add: {
      images,
      graphicsCalls: 0,
      graphics() {
        this.graphicsCalls += 1
        return createGraphics()
      },
      image(x: number, y: number, key: string) {
        const image = new FakeImage(x, y, key)
        images.push(image)
        return image
      },
    },
  }
}

function createGraphics() {
  const graphics = {
    fillStyle: () => graphics,
    fillRect: () => graphics,
    fillRoundedRect: () => graphics,
    fillCircle: () => graphics,
    lineStyle: () => graphics,
    strokeRoundedRect: () => graphics,
    lineBetween: () => graphics,
  }

  return graphics
}

class FakeImage {
  destroyed = false

  constructor(
    public x: number,
    public y: number,
    public key: string,
  ) {}

  setScale() {
    return this
  }

  setDepth() {
    return this
  }

  setAlpha() {
    return this
  }

  clearTint() {
    return this
  }

  setTint() {
    return this
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  setFlipX() {
    return this
  }

  destroy() {
    this.destroyed = true
  }
}
