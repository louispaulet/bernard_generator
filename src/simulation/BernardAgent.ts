import { distanceBetween, isMovingLeft, movePointToward } from './geometry'
import type { Bernard, Vector2 } from './types'
import type { CarrotField } from './CarrotField'

export const BERNARD_SPEED_PIXELS_PER_MS = 0.055
export const EAT_DISTANCE = 18

export class BernardAgent {
  private bernard: Bernard
  readonly homePosition: Vector2
  facingLeft = false

  constructor(bernard: Bernard, homePosition: Vector2) {
    this.bernard = { ...bernard, position: { ...bernard.position } }
    this.homePosition = { ...homePosition }
  }

  get data(): Bernard {
    return {
      ...this.bernard,
      position: { ...this.bernard.position },
    }
  }

  get id(): number {
    return this.bernard.id
  }

  get position(): Vector2 {
    return { ...this.bernard.position }
  }

  get targetCarrotId(): number | undefined {
    return this.bernard.targetCarrotId
  }

  get carrotsEatenToday(): number {
    return this.bernard.carrotsEatenToday
  }

  chooseTarget(carrots: CarrotField) {
    const current = carrots.get(this.bernard.targetCarrotId)
    if (current) {
      return current
    }

    const target = carrots.claimNearest(this.bernard.position, this.id)
    this.bernard.targetCarrotId = target?.id

    return target
  }

  moveToward(target: Vector2, deltaMs: number): void {
    const previous = this.bernard.position
    this.bernard.position = movePointToward(
      previous,
      target,
      BERNARD_SPEED_PIXELS_PER_MS * deltaMs,
    )
    this.facingLeft = isMovingLeft(previous, target)
  }

  wanderNearHome(dayElapsedMs: number, deltaMs: number): void {
    this.moveToward(this.getWanderTarget(dayElapsedMs), deltaMs)
  }

  eatTarget(carrots: CarrotField): boolean {
    const target = carrots.get(this.bernard.targetCarrotId)

    if (!target || distanceBetween(this.bernard.position, target.position) > EAT_DISTANCE) {
      return false
    }

    this.bernard.carrotsEatenToday += 1
    this.bernard.targetCarrotId = undefined
    carrots.remove(target.id)

    return true
  }

  resetForNewDay(bernard: Bernard, homePosition: Vector2): void {
    this.bernard = { ...bernard, position: { ...homePosition } }
  }

  private getWanderTarget(dayElapsedMs: number): Vector2 {
    return {
      x: this.homePosition.x + Math.sin((dayElapsedMs + this.id * 700) / 900) * 26,
      y: this.homePosition.y + Math.cos((dayElapsedMs + this.id * 400) / 1100) * 18,
    }
  }
}
