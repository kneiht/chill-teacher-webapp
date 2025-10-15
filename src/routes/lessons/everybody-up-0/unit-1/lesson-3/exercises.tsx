import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import urls from './assets/urls.json'

type SupplyKey =
  | 'paper'
  | 'glue'
  | 'paint'
  | 'scissors'
  | 'pen'
  | 'pencil'
  | 'marker'
  | 'crayon'

const supplies: Record<SupplyKey, { label: string; image: string }> = {
  paper: { label: 'Paper', image: '/vocab-images/paper.webp' },
  glue: { label: 'Glue', image: '/vocab-images/glue.webp' },
  paint: { label: 'Paint', image: '/vocab-images/paint.webp' },
  scissors: { label: 'Scissors', image: '/vocab-images/scissors.webp' },
  pen: { label: 'Pen', image: '/vocab-images/pen.webp' },
  pencil: { label: 'Pencil', image: '/vocab-images/pencil.webp' },
  marker: { label: 'Marker', image: '/vocab-images/marker.webp' },
  crayon: { label: 'Crayon', image: '/vocab-images/crayon.webp' },
}

type CharacterTask = {
  id: string
  name: string
  prompt: string
  options: Array<SupplyKey>
  correct: Array<SupplyKey>
}

const characterTasks: Array<CharacterTask> = [
  {
    id: 'tom',
    name: 'Tom',
    prompt: 'I have ...',
    options: ['paper', 'glue', 'marker', 'paint'],
    correct: ['paper', 'glue'],
  },
  {
    id: 'jenny',
    name: 'Jenny',
    prompt: 'I have ...',
    options: ['paint', 'scissors', 'pen', 'crayon'],
    correct: ['paint', 'scissors'],
  },
  {
    id: 'lisa',
    name: 'Lisa',
    prompt: 'I have ...',
    options: ['pen', 'pencil', 'paper', 'marker'],
    correct: ['pen', 'pencil'],
  },
  {
    id: 'teacher',
    name: 'Teacher',
    prompt: 'I have ...',
    options: ['marker', 'crayon', 'glue', 'paper'],
    correct: ['marker', 'crayon'],
  },
]

type PictureQuestion = {
  id: string
  prompt: string
  options: Array<{ value: SupplyKey; image: string; label: string }>
  correct: SupplyKey
}

const pictureQuestions: Array<PictureQuestion> = [
  {
    id: 'q1',
    prompt: 'What do you have? I have glue.',
    options: [
      { value: 'glue', image: supplies.glue.image, label: supplies.glue.label },
      {
        value: 'paper',
        image: supplies.paper.image,
        label: supplies.paper.label,
      },
      {
        value: 'crayon',
        image: supplies.crayon.image,
        label: supplies.crayon.label,
      },
    ],
    correct: 'glue',
  },
  {
    id: 'q2',
    prompt: 'What do you have? I have a pencil.',
    options: [
      {
        value: 'pencil',
        image: supplies.pencil.image,
        label: supplies.pencil.label,
      },
      {
        value: 'marker',
        image: supplies.marker.image,
        label: supplies.marker.label,
      },
      {
        value: 'paint',
        image: supplies.paint.image,
        label: supplies.paint.label,
      },
    ],
    correct: 'pencil',
  },
]

type StoryCheckQuestion = {
  id: string
  prompt: string
  answers: Array<string>
  correct: string
}

const storyCheckQuestions: Array<StoryCheckQuestion> = [
  {
    id: 'end',
    prompt:
      'How do they feel at the end? (Họ cảm thấy như thế nào ở cuối truyện)',
    answers: [
      'They have fun together',
      'They go home early',
      'They lose their supplies',
    ],
    correct: 'They have fun together',
  },
  {
    id: 'ask',
    prompt: 'What does Lisa ask Tom? (Lisa hỏi gì Tom)',
    answers: [
      'What do you have today?',
      'Where is the teacher?',
      'Can I go outside?',
    ],
    correct: 'What do you have today?',
  },
  {
    id: 'need',
    prompt: 'What does the teacher have? (Giáo viên có gì)',
    answers: ['Markers and crayons', 'Paper and glue', 'Paint and scissors'],
    correct: 'Markers and crayons',
  },
]

type CharacterSelections = Record<string, Array<SupplyKey>>

type CharacterFeedback = Record<string, boolean | null>

type PictureAnswers = Record<string, SupplyKey | ''>

type PictureFeedback = Record<string, boolean | null>

type StoryAnswers = Record<string, string>

type StoryFeedback = Record<string, boolean | null>

const createCharacterSelections = () =>
  characterTasks.reduce<CharacterSelections>((acc, task) => {
    acc[task.id] = []
    return acc
  }, {})

const createCharacterFeedback = () =>
  characterTasks.reduce<CharacterFeedback>((acc, task) => {
    acc[task.id] = null
    return acc
  }, {})

const createPictureAnswers = () =>
  pictureQuestions.reduce<PictureAnswers>((acc, question) => {
    acc[question.id] = ''
    return acc
  }, {})

const createPictureFeedback = () =>
  pictureQuestions.reduce<PictureFeedback>((acc, question) => {
    acc[question.id] = null
    return acc
  }, {})

const createStoryAnswers = () =>
  storyCheckQuestions.reduce<StoryAnswers>((acc, question) => {
    acc[question.id] = ''
    return acc
  }, {})

const createStoryFeedback = () =>
  storyCheckQuestions.reduce<StoryFeedback>((acc, question) => {
    acc[question.id] = null
    return acc
  }, {})

const ReadingExercisesSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  const [characterSelections, setCharacterSelections] =
    useState<CharacterSelections>(() => createCharacterSelections())
  const [characterFeedback, setCharacterFeedback] = useState<CharacterFeedback>(
    () => createCharacterFeedback(),
  )
  const [pictureAnswers, setPictureAnswers] = useState<PictureAnswers>(() =>
    createPictureAnswers(),
  )
  const [pictureFeedback, setPictureFeedback] = useState<PictureFeedback>(() =>
    createPictureFeedback(),
  )
  const [storyAnswers, setStoryAnswers] = useState<StoryAnswers>(() =>
    createStoryAnswers(),
  )
  const [storyFeedback, setStoryFeedback] = useState<StoryFeedback>(() =>
    createStoryFeedback(),
  )
  const [score, setScore] = useState<number | null>(null)

  const toggleSupplySelection = (taskId: string, supplyKey: SupplyKey) => {
    setCharacterSelections((prev) => {
      const current = prev[taskId] || []
      const exists = current.includes(supplyKey)
      const updated = exists
        ? current.filter((item) => item !== supplyKey)
        : [...current, supplyKey]
      return { ...prev, [taskId]: updated }
    })
  }

  const gradeExercises = () => {
    let correct = 0

    const newCharacterFeedback = createCharacterFeedback()
    const newPictureFeedback = createPictureFeedback()
    const newStoryFeedback = createStoryFeedback()

    characterTasks.forEach((task) => {
      const selected = characterSelections[task.id] || []
      const isCorrect =
        task.correct.every((key) => selected.includes(key)) &&
        selected.length === task.correct.length
      newCharacterFeedback[task.id] = isCorrect
      if (isCorrect) correct += 1
    })

    pictureQuestions.forEach((question) => {
      const answer = pictureAnswers[question.id]
      const isCorrect = answer === question.correct
      newPictureFeedback[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    storyCheckQuestions.forEach((question) => {
      const answer = storyAnswers[question.id]
      const isCorrect = answer === question.correct
      newStoryFeedback[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    const total =
      characterTasks.length +
      pictureQuestions.length +
      storyCheckQuestions.length
    setCharacterFeedback(newCharacterFeedback)
    setPictureFeedback(newPictureFeedback)
    setStoryFeedback(newStoryFeedback)
    setScore(Math.round((correct / total) * 100))
  }

  const resetExercises = () => {
    setCharacterSelections(createCharacterSelections())
    setCharacterFeedback(createCharacterFeedback())
    setPictureAnswers(createPictureAnswers())
    setPictureFeedback(createPictureFeedback())
    setStoryAnswers(createStoryAnswers())
    setStoryFeedback(createStoryFeedback())
    setScore(null)
  }

  return (
    <Slide isActive={isActive} scrollable={true}>
      <div className="flex flex-row gap-2 h-full w-full">
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <h2 className="text-4xl font-bold text-indigo-700 text-center">
            In the Art Class
          </h2>
          <div className="space-y-6 text-xl text-gray-800">
            <p>In the Art Class, there are 4 friends, Lisa, Jenny and Tom.</p>
            <div className="bg-indigo-50 rounded-2xl p-4 space-y-3">
              <p>Lisa: Hi Jenny, Hi Tom. How are you?</p>
              <p>Jenny: Hi Lisa. I’m good!</p>
              <p>Tom: Hello Lisa. I’m great!</p>
              <p>Lisa: Tom, what do you have today?</p>
              <p>Tom: I have paper and glue.</p>
              <p>Tom: Jenny, what do you have?</p>
              <p>Jenny: I have paint and scissors.</p>
              <p>Jenny: What about you? What do you have, Lisa?</p>
              <p>Lisa: I have a pen and a pencil.</p>
              <p>Tom: But we don’t have a marker and a crayon.</p>
              <p>Lisa: Oh no!</p>
              <p>Teacher: Don’t worry, children! I have markers and crayons.</p>
            </div>
            <p>Then, they have fun together in the Art Class</p>
          </div>
        </div>
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <h2 className="text-4xl font-bold text-pink-600 text-center">
            Reading Comprehension (Đọc hiểu)
          </h2>
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              1. What do you have?
            </h3>
            <p className="text-lg text-gray-600 text-center">
              Bấm vào đồ vật mà các bạn trong câu truyện có:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {characterTasks.map((task) => {
                const selected = characterSelections[task.id] || []
                const feedbackValue = characterFeedback[task.id]
                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border-4 p-4 space-y-4 transition-all ${
                      feedbackValue === null
                        ? 'border-pink-200'
                        : feedbackValue
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="text-center space-y-1">
                      <p className="text-xl font-bold text-indigo-700">
                        {task.name}
                      </p>
                      <p className="text-base text-gray-600">{task.prompt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {task.options.map((supplyKey) => {
                        const supply = supplies[supplyKey]
                        const isSelected = selected.includes(supplyKey)
                        return (
                          <button
                            key={supplyKey}
                            type="button"
                            onClick={() =>
                              toggleSupplySelection(task.id, supplyKey)
                            }
                            className={`rounded-xl border-4 p-2 flex flex-col items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 scale-105'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <img
                              src={supply.image}
                              alt={supply.label}
                              className="h-20 w-20 object-contain"
                            />
                            <span className="text-lg font-semibold text-gray-700">
                              {supply.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              2. Picture choice (chọn hình)
            </h3>
            <p className="text-lg text-gray-600 text-center">
              Chọn hình phù hợp với câu.
            </p>
            <div className="space-y-4">
              {pictureQuestions.map((question) => {
                const answer = pictureAnswers[question.id]
                const feedbackValue = pictureFeedback[question.id]
                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border-4 p-4 space-y-3 transition-all ${
                      feedbackValue === null
                        ? 'border-purple-200'
                        : feedbackValue
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <p className="text-xl font-semibold text-indigo-700 text-center">
                      {question.prompt}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setPictureAnswers((prev) => ({
                              ...prev,
                              [question.id]: option.value,
                            }))
                          }
                          className={`rounded-xl border-4 p-3 flex flex-col items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            answer === option.value
                              ? 'border-indigo-500 bg-indigo-50 scale-105'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <img
                            src={option.image}
                            alt={option.label}
                            className="h-20 w-20 object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              3. Story check (Kiểm tra mức độ hiểu câu chuyện)
            </h3>
            <p className="text-lg text-gray-600 text-center">
              Chọn ý đúng với câu chuyện.
            </p>
            <div className="space-y-4">
              {storyCheckQuestions.map((question) => {
                const answer = storyAnswers[question.id]
                const feedbackValue = storyFeedback[question.id]
                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border-4 p-4 space-y-3 transition-all ${
                      feedbackValue === null
                        ? 'border-yellow-200'
                        : feedbackValue
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <p className="text-xl font-semibold text-indigo-700 text-center">
                      {question.prompt}
                    </p>
                    <div className="grid gap-3">
                      {question.answers.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setStoryAnswers((prev) => ({
                              ...prev,
                              [question.id]: option,
                            }))
                          }
                          className={`rounded-xl border-4 px-4 py-3 text-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            answer === option
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
            <button
              onClick={gradeExercises}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xl font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Check my answers
            </button>
            <button
              onClick={resetExercises}
              className="rounded-xl bg-white border-2 border-indigo-300 px-6 py-3 text-xl font-semibold text-indigo-600 shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Start again
            </button>
            {score !== null && (
              <div className="text-2xl font-bold text-gray-800 text-center md:text-right">
                Score: <span className="text-indigo-700">{score}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  )
}

const ExercisesPage: React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => navigate({ to: '..' })
  const slides = [ReadingExercisesSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={urls.background}
      onHomeClick={goHome}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-3/exercises',
)({
  component: ExercisesPage,
})
