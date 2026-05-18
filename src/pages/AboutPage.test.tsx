import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AboutPage } from './AboutPage'

describe('AboutPage', () => {
  it('renders the project explanation and architecture facts', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'A tiny pressure cooker for tiny people.' })).toBeInTheDocument()
    expect(screen.getByText('Phaser renders the simulated world.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Simulator' })).toBeInTheDocument()
  })
})
