import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SimulatorPage } from './SimulatorPage'

const { gameMounts } = vi.hoisted(() => ({
  gameMounts: vi.fn(),
}))

vi.mock('../game/BernardGame', async () => {
  const React = await import('react')

  return {
    BernardGame: ({ onStats }: { onStats: (stats: unknown) => void }) => {
      React.useEffect(() => {
        gameMounts()
      }, [])

      return (
        <button
          type="button"
          onClick={() =>
            onStats({
              day: 2,
              livingBernards: 7,
              deadBernards: 1,
              carrotsRemaining: 12,
              birthsToday: 2,
              timeRemainingMs: 9_000,
              bernardsPerDay: [{ day: 1, bernards: 5 }, { day: 2, bernards: 7 }],
            })
          }
        >
          Mock Game
        </button>
      )
    },
  }
})

describe('SimulatorPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    gameMounts.mockClear()
  })

  it('renders controls and updates stats from the game', () => {
    render(
      <MemoryRouter>
        <SimulatorPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mock Game' }))

    expect(screen.getByText('Carrots, naps, consequences.')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('9s')).toBeInTheDocument()
  })

  it('requires confirmation before restarting the simulation', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MemoryRouter>
        <SimulatorPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mock Game' }))
    fireEvent.click(screen.getByRole('button', { name: 'Restart Simulation' }))

    expect(confirm).toHaveBeenCalled()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('resets stats and remounts the game after restart confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter>
        <SimulatorPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mock Game' }))
    expect(screen.getByText('7')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restart Simulation' }))

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(gameMounts).toHaveBeenCalledTimes(2)
  })
})
