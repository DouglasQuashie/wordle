export const getLetterColors = (guess, correctWord) => {
    const colors = Array(guess.length).fill('gray')
    const correctLetters = correctWord.split('')
    const guessLetters = guess.split('')
    const letterCount = {}

    for (let l of correctLetters) {
      letterCount[l] = (letterCount[l] || 0) + 1
    }

    guessLetters.forEach((letter, i) => {
      if (letter === correctLetters[i]) {
        colors[i] = 'green'
        letterCount[letter]--
      }
    })

    guessLetters.forEach((letter, i) => {
      if (colors[i] === 'gray' && letterCount[letter] > 0) {
        colors[i] = 'gold'
        letterCount[letter]--
      }
    })

    return colors
  }