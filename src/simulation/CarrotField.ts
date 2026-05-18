import { distanceBetween } from './geometry'
import { createCarrots } from './spawn'
import type { RectArea } from './areas'
import type { Carrot, Vector2, WorldBounds } from './types'

export class CarrotField {
  private carrots = new Map<number, Carrot>()

  spawn(count: number, bounds: WorldBounds, random = Math.random, excludedAreas: RectArea[] = []): void {
    this.carrots.clear()

    for (const carrot of createCarrots(count, bounds, random, excludedAreas)) {
      this.carrots.set(carrot.id, carrot)
    }
  }

  get(id: number | undefined): Carrot | undefined {
    const carrot = id ? this.carrots.get(id) : undefined
    return carrot ? cloneCarrot(carrot) : undefined
  }

  claimNearest(position: Vector2, bernardId: number): Carrot | undefined {
    let nearest: Carrot | undefined
    let nearestDistance = Number.POSITIVE_INFINITY

    for (const carrot of this.carrots.values()) {
      if (carrot.claimedBy && carrot.claimedBy !== bernardId) {
        continue
      }

      const distance = distanceBetween(position, carrot.position)
      if (distance < nearestDistance) {
        nearest = carrot
        nearestDistance = distance
      }
    }

    if (!nearest) {
      return undefined
    }

    nearest.claimedBy = bernardId
    return cloneCarrot(nearest)
  }

  remove(id: number): void {
    this.carrots.delete(id)
  }

  remaining(): number {
    return this.carrots.size
  }

  list(): Carrot[] {
    return Array.from(this.carrots.values(), cloneCarrot)
  }
}

function cloneCarrot(carrot: Carrot): Carrot {
  return {
    ...carrot,
    position: { ...carrot.position },
  }
}
