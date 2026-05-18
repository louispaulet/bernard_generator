import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./game/BernardGame', () => ({
  BernardGame: () => <div>Mock Game</div>,
}))

describe('App', () => {
  it('routes to the simulator page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText('Bernard Simulator')).toBeInTheDocument()
    expect(screen.getByText('Mock Game')).toBeInTheDocument()
  })

  it('routes to the about page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText('What Is This?')).toBeInTheDocument()
  })
})
