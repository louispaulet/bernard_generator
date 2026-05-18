import type { Bernard, DayResolution, SimulationSettings, Vector2 } from './types'

export const DEFAULT_DAY_DURATION_MS = 30_000

export const DEFAULT_SETTINGS: SimulationSettings = {
  carrotsToSurvive: 3,
  carrotsToReproduce: 6,
  totalCarrots: 40,
  speed: 1,
  dayDurationMs: DEFAULT_DAY_DURATION_MS,
}

export function getRealDayDurationMs(settings: SimulationSettings): number {
  return settings.dayDurationMs / settings.speed
}

export function resolveDay(
  bernards: Bernard[],
  settings: SimulationSettings,
  housePosition: Vector2,
  nextIdStart: number,
): DayResolution {
  let nextId = nextIdStart
  const survivors: Bernard[] = []
  const newborns: Bernard[] = []
  const dead: Bernard[] = []

  for (const bernard of bernards) {
    if (bernard.carrotsEatenToday < settings.carrotsToSurvive) {
      dead.push({ ...bernard, alive: false, targetCarrotId: undefined })
      continue
    }

    survivors.push(resetBernardForNewDay(bernard, housePosition))

    if (bernard.carrotsEatenToday >= settings.carrotsToReproduce) {
      newborns.push({
        id: nextId,
        position: { ...housePosition },
        carrotsEatenToday: 0,
        alive: true,
      })
      nextId += 1
    }
  }

  return { survivors, newborns, dead }
}

export function resetBernardForNewDay(bernard: Bernard, housePosition: Vector2): Bernard {
  return {
    ...bernard,
    position: { ...housePosition },
    carrotsEatenToday: 0,
    alive: true,
    targetCarrotId: undefined,
  }
}

export function clampSetting(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
