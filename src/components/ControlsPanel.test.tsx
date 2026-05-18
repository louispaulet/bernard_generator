import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS } from '../simulation/rules'
import { ControlsPanel } from './ControlsPanel'

describe('ControlsPanel', () => {
  it('emits updates for ranges and speed choices', () => {
    const setCarrotsToSurvive = vi.fn()
    const setCarrotsToReproduce = vi.fn()
    const setTotalCarrots = vi.fn()
    const setSpeed = vi.fn()

    render(
      <ControlsPanel
        settings={DEFAULT_SETTINGS}
        setCarrotsToSurvive={setCarrotsToSurvive}
        setCarrotsToReproduce={setCarrotsToReproduce}
        setTotalCarrots={setTotalCarrots}
        setSpeed={setSpeed}
      />,
    )

    fireEvent.change(screen.getByLabelText('Survive'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Reproduce'), { target: { value: '8' } })
    fireEvent.change(screen.getByLabelText('Total Carrots'), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('button', { name: '3x' }))

    expect(setCarrotsToSurvive).toHaveBeenCalledWith(4)
    expect(setCarrotsToReproduce).toHaveBeenCalledWith(8)
    expect(setTotalCarrots).toHaveBeenCalledWith(80)
    expect(setSpeed).toHaveBeenCalledWith(3)
  })
})
