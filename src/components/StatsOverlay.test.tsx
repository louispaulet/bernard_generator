import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatsOverlay } from './StatsOverlay'

describe('StatsOverlay', () => {
  it('opens and renders the recent population history', () => {
    render(<StatsOverlay history={[{ day: 1, bernards: 5 }, { day: 2, bernards: 8 }]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Stats' }))

    expect(screen.getByText('Bernards Per Day')).toBeInTheDocument()
    expect(screen.getByLabelText('Day 2: 8 Bernards')).toBeInTheDocument()
  })
})
