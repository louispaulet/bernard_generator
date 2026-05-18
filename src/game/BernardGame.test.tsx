import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS } from '../simulation/rules'
import { BernardGame } from './BernardGame'

const phaser = vi.hoisted(() => {
  const destroy = vi.fn()
  const game = vi.fn(() => ({ destroy }))

  return { destroy, game }
})

vi.mock('phaser', () => ({
  default: {
    AUTO: 'AUTO',
    Game: phaser.game,
    Scale: {
      FIT: 'FIT',
      CENTER_BOTH: 'CENTER_BOTH',
    },
    Scene: class {
      constructor(public key?: string) {}
    },
  },
}))

describe('BernardGame', () => {
  it('mounts and destroys a Phaser game', () => {
    const onStats = vi.fn()

    const { unmount } = render(<BernardGame settings={DEFAULT_SETTINGS} onStats={onStats} />)

    expect(phaser.game).toHaveBeenCalledWith(expect.objectContaining({
      width: 960,
      height: 640,
      backgroundColor: '#cfe8c3',
    }))

    unmount()

    expect(phaser.destroy).toHaveBeenCalledWith(true)
  })
})
