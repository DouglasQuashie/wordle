'use client'
import React, { useState, useEffect } from 'react'
import words from './words.json'
import { InputText } from 'primereact/inputtext'
import {getLetterColors} from './utils/gameLogic'

const Guesser = () => {
  const [correctWord, setCorrectWord] = useState("")
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)
  const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0, totalAttempts: 0 })

  const maxAttempts = 6

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * words.length)
    setCorrectWord(words[randomIndex].toLowerCase())

    const savedStats = JSON.parse(localStorage.getItem('wordleStats'))
    if (savedStats) setStats(savedStats)
  }, [])

  useEffect(() => {
    if (!correctWord || guesses.length === 0) return

    const hasWon = guesses.includes(correctWord)
    const gameFinished = hasWon || guesses.length >= maxAttempts

    if (gameFinished) {
      setIsGameOver(true)

      const newStats = { ...stats }
      newStats.games += 1

      if (hasWon) {
        newStats.wins += 1
        newStats.streak += 1
        newStats.totalAttempts += guesses.length
      } else {
        newStats.streak = 0
      }

      setStats(newStats)
      localStorage.setItem('wordleStats', JSON.stringify(newStats))
    }
  }, [guesses])

  const handleGuess = () => {
    if (isGameOver) return

    const guess = currentGuess.toLowerCase()
    
    /* 
    if (!/^[a-zA-Z]{10}$/.test(guess)) {
      alert("Mot invalide. Nombre de lettres incorrects. 10 MAX")
      return
    } */

    /* if (!words.includes(guess)) {
      alert("Mot non reconnu dans le dictionnaire.")
      return
    } */

    setGuesses([...guesses, guess])
    setCurrentGuess("")
  }
  

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Wordle</h2>

      <div style={{ marginBottom: "10px" }}>
        <InputText
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          maxLength={correctWord.length}
          disabled={isGameOver}
          onKeyDown={(e) => e.key === "Enter" && handleGuess()}
        />
        <button onClick={handleGuess} disabled={isGameOver}>Valider</button>
      </div>

      <div>
        {guesses.map((guess, i) => {
          const colors = getLetterColors(guess,correctWord)
          return (
            <div key={i} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
              {guess.split("").map((letter, j) => (
                <div
                  key={j}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: colors[j],
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    borderRadius: "4px",
                  }}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {isGameOver && (
        <p style={{ fontWeight: "bold", marginTop: "10px" }}>
          {guesses.includes(correctWord)
            ? "Bravo ! Vous avez trouvé le mot !"
            : `Perdu ! Le mot était ${correctWord.toUpperCase()}`}
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <h4>Statistiques</h4>
        <p>Parties : {stats.games}</p>
        <p>Victoires : {stats.wins}</p>
        <p>Série actuelle : {stats.streak}</p>
        <p>Moyenne de tentatives : {stats.wins ? (stats.totalAttempts / stats.wins).toFixed(2) : "-"}</p>
      </div>

      {/* Debug 
      <p style={{ fontSize: "0.8rem", marginTop: "20px", color: "#999" }}>
        (Debug) Mot à deviner : <strong>{correctWord}</strong>
      </p>
      */}
    </div>
  )
}

export default Guesser