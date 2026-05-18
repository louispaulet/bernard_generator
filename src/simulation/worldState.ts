import type { CarrotField } from './CarrotField'
import type { Bernard, Vector2 } from './types'

export const INITIAL_BERNARDS = 5
export const MAX_GRAVES = 40

export type WorldSnapshot = {
  bernards: Array<Bernard & { facingLeft: boolean }>
  carrots: ReturnType<CarrotField['list']>
  gravePositions: Vector2[]
  activeHouseCount: number
  builtHouseCount: number
}
