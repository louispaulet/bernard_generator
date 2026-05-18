export type SimulationSpeed = 1 | 2 | 3

export type Vector2 = {
  x: number
  y: number
}

export type SimulationSettings = {
  carrotsToSurvive: number
  carrotsToReproduce: number
  speed: SimulationSpeed
  dayDurationMs: number
}

export type Bernard = {
  id: number
  position: Vector2
  carrotsEatenToday: number
  alive: boolean
  targetCarrotId?: number
}

export type Carrot = {
  id: number
  position: Vector2
  claimedBy?: number
}

export type WorldBounds = {
  width: number
  height: number
  padding: number
}

export type DayResolution = {
  survivors: Bernard[]
  newborns: Bernard[]
  dead: Bernard[]
}

export type SimulationStats = {
  day: number
  livingBernards: number
  deadBernards: number
  carrotsRemaining: number
  birthsToday: number
  timeRemainingMs: number
}
