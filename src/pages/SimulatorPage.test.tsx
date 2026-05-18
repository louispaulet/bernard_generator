import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { SimulatorPage } from './SimulatorPage'

vi.mock('../game/BernardGame', () => ({
  BernardGame: ({ onStats }: { onStats: (stats: unknown) => void }) => (
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
  ),
}))

describe('SimulatorPage', () => {
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
})
