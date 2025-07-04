import { getLetterColors } from '../../src/app/utils/gameLogic'

describe('getLetterColors', () => {
  test('should return all green for correct word', () => {
    const guess = 'react'
    const correctWord = 'react'
    const result = getLetterColors(guess, correctWord)
    expect(result).toEqual(['green', 'green', 'green', 'green', 'green'])
  })

  test('should return correct colors for partial match', () => {
    const guess = 'react'
    const correctWord = 'trace'
    const result = getLetterColors(guess, correctWord)
    expect(result).toEqual(['gold', 'gold', 'green', 'green', 'gold']) 
  })

  test('should handle duplicate letters correctly', () => {
    const guess = 'alloy'
    const correctWord = 'llama'
    const result = getLetterColors(guess, correctWord)
    expect(result).toEqual(['gold', 'green', 'gold', 'gray', 'gray']) 
  })

  test('should handle any letter found', () => {
    const guess = 'apple'
    const correctWord = 'month'
    const result = getLetterColors(guess, correctWord)
    expect(result).toEqual(['gray', 'gray', 'gray', 'gray', 'gray']) 
  })
})
