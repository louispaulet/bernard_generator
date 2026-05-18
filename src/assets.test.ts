import { describe, expect, it } from 'vitest'
import { ASSET_PATHS } from './assets'

describe('ASSET_PATHS', () => {
  it('points Phaser at the public svg assets', () => {
    expect(ASSET_PATHS).toEqual({
      bernard: '/assets/bernard.svg',
      carrot: '/assets/carrot.svg',
      grave: '/assets/grave.svg',
      house: '/assets/house.svg',
      tree: '/assets/tree.svg',
    })
  })
})
