import { Store } from '@tanstack/react-store'

// Define game state
export interface GameState {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
}

// Define game store
export const gameStore = new Store<GameState>({
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
})

// Action to increase score
export const increaseScore = (amount: number) => {
  gameStore.setState((prev) => ({ ...prev, score: prev.score + amount }))
}

// Action to mark an answer as correct
export const answerCorrect = () => {
  gameStore.setState((prev) => ({
    ...prev,
    correctAnswers: prev.correctAnswers + 1,
    score: prev.score + 10,
  }))
}

// Action to mark an answer as incorrect
export const answerIncorrect = () => {
  gameStore.setState((prev) => ({
    ...prev,
    incorrectAnswers: prev.incorrectAnswers + 1,
  }))
}

// Action to set the total number of questions
export const setTotalQuestions = (total: number) => {
  console.log('setTotalQuestions', total)
  gameStore.setState((prev) => ({ ...prev, totalQuestions: total }))
  console.log('totalQuestions', gameStore.state.totalQuestions)
}

// Action to reset the game state
export const resetGame = () => {
  gameStore.setState(() => ({
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  }))
}
