import { describe, expect, it, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Scene: class {
      load = { svg: vi.fn() }
      cameras = { main: { setBackgroundColor: vi.fn() } }
      add = createSceneAdd()

      constructor(public key?: string) {}
    },
  },
}))

import { DEFAULT_SETTINGS } from '../../simulation/rules'
import { WorldScene } from './WorldScene'

describe('WorldScene', () => {
  it('loads assets, starts the world, and publishes stats', () => {
    const onStats = vi.fn()
    const scene = new WorldScene(() => DEFAULT_SETTINGS, onStats)

    scene.preload()
    scene.create()
    scene.update(0, 16)

    expect(scene.load.svg).toHaveBeenCalledTimes(4)
    expect(scene.cameras.main.setBackgroundColor).toHaveBeenCalledWith('#cfe8c3')
    expect(onStats).toHaveBeenCalledWith(expect.objectContaining({
      day: 1,
      livingBernards: 5,
    }))
  })
})

function createSceneAdd() {
  return {
    graphics: () => createGraphics(),
    image: () => new FakeImage(),
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

  setPosition() {
    return this
  }

  setFlipX() {
    return this
  }

  destroy() {}
}
