import React from "react"
import Guesser from "@/app/Guesser"
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock pour words.json
jest.mock('../../src/app/words.json', () => ['apple', 'grape', 'mango', 'banana'])

// Mock pour localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => null)
  Storage.prototype.setItem = jest.fn()
})

describe("Composant Guesser", () => {

  it('affiche les composants de base', () => {
    render(<Guesser />)
    expect(screen.getByText(/Wordle/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /valider/i })).toBeInTheDocument()
  })

  it('permet de saisir une supposition', () => {
    render(<Guesser />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'grape' } })
    expect(input).toHaveValue('grape')
  })

  it('ajoute une supposition et la réinitialise après soumission', async () => {
    render(<Guesser />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /valider/i })

    fireEvent.change(input, { target: { value: 'grape' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input).toHaveValue('')
      expect(screen.getByText(/G/)).toBeInTheDocument() // lettre affichée dans la grille
    })
  })

  it('affiche le message de victoire si le mot correct est deviné', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1 / 4) // force le mot 'grape'
    render(<Guesser />)

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /valider/i })

    fireEvent.change(input, { target: { value: 'grape' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Bravo !/i)).toBeInTheDocument()
    })

    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('affiche le message de défaite après 6 mauvaises tentatives', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0) // force le mot 'apple'
    render(<Guesser />)

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /valider/i })

    for (let i = 0; i < 6; i++) {
      fireEvent.change(input, { target: { value: 'wrong' } })
      fireEvent.click(button)
    }

    await waitFor(() => {
      expect(screen.getByText(/Le mot était APPLE/i)).toBeInTheDocument()
    })

    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('désactive le bouton après la fin de la partie', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0) // 'apple'
    render(<Guesser />)

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /valider/i })

    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(input).toBeDisabled()
    })

    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('sauvegarde les statistiques dans le localStorage', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1 / 4) // 'grape'
    const setItemMock = jest.fn()
    Storage.prototype.setItem = setItemMock

    render(<Guesser />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'grape' } })
    fireEvent.click(screen.getByRole('button', { name: /valider/i }))

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith(
        'wordleStats',
        expect.stringContaining('"wins":1')
      )
    })

    jest.spyOn(global.Math, 'random').mockRestore()
  })
})