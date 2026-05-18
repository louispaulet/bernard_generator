import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatsOverlay } from './StatsOverlay'

describe('StatsOverlay', () => {
  it('opens and renders the recent population history', () => {
    render(<StatsOverlay history={[{ day: 1, bernards: 5 }, { day: 2, bernards: 8 }]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Stats' }))

    expect(screen.getByText('Bernards Per Day')).toBeInTheDocument()
    expect(screen.getByText('2 days in the current run.')).toBeInTheDocument()
    expect(screen.getByLabelText('Day 2: 8 Bernards')).toBeInTheDocument()
  })

  it('keeps the full population history available', () => {
    const history = Array.from({ length: 30 }, (_, index) => ({
      day: index + 1,
      bernards: index + 5,
    }))

    render(<StatsOverlay history={history} />)
    fireEvent.click(screen.getByRole('button', { name: 'Stats' }))

    expect(screen.getByLabelText('Day 1: 5 Bernards')).toBeInTheDocument()
    expect(screen.getByLabelText('Day 30: 34 Bernards')).toBeInTheDocument()
  })
})
