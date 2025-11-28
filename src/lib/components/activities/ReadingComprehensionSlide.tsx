import React, { useState, useMemo } from 'react'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Types
export type ReadingOption = {
  value: string
  label: string
}

// Reading Item (for image-based questions)
export type ReadingItem = {
  label: string
  image: string
}

// Question Types
export type SingleChoiceQuestion = {
  id: string
  prompt: string
  options: ReadingOption[]
  correct: string
}

export type TfNgQuestion = {
  id: string
  statement: string
  correct: 'true' | 'false' | 'not_given'
}

export type MatchingQuestion = {
  id: string
  statement: string
  correct: string
}

export type SummaryQuestion = {
  id: string
  prompt: string
  answers: string[]
}

export type ShortAnswerQuestion = {
  id: string
  prompt: string
}

// NEW: Multi-select with items (e.g., "What do you have?")
export type MultiSelectItemQuestion = {
  id: string
  name: string
  prompt: string
  options: string[] // item keys
  correct: string[] // item keys that should be selected
}

// NEW: Picture choice with images
export type PictureChoiceQuestion = {
  id: string
  prompt: string
  options: string[] // item keys
  correct: string // single item key
}

// NEW: Text comprehension (simple multiple choice with text only)
export type TextComprehensionQuestion = {
  id: string
  prompt: string
  answers: string[] // text options
  correct: string // correct text answer
}

// Reading Content Types
export type ReadingParagraph = {
  heading?: string
  content?: string
  text?: string // alias for content
  list?: string[]
  dialog?: string[] // For dialog-style content
  className?: string
}

export type ReadingComprehensionData = {
  title: string
  passage: ReadingParagraph[] // Reading content
  items?: Record<string, ReadingItem> // Dictionary of items for image-based questions
  questions: {
    singleChoice?: SingleChoiceQuestion[]
    tfng?: TfNgQuestion[]
    matching?: {
      questions: MatchingQuestion[]
      options: ReadingOption[]
    }
    summary?: SummaryQuestion[]
    shortAnswer?: ShortAnswerQuestion[]
    multiSelectItem?: MultiSelectItemQuestion[] // NEW
    pictureChoice?: PictureChoiceQuestion[] // NEW
    textComprehension?: TextComprehensionQuestion[] // NEW
  }
}

type FeedbackRecord = Record<string, boolean | null>
type StringRecord = Record<string, string>
type ArrayRecord = Record<string, string[]>

type FeedbackState = {
  singleChoice: FeedbackRecord
  tfng: FeedbackRecord
  matching: FeedbackRecord
  summary: FeedbackRecord
  multiSelectItem: FeedbackRecord
  pictureChoice: FeedbackRecord
  textComprehension: FeedbackRecord
}

const createStringRecord = (questions: Array<{ id: string }>) =>
  questions.reduce<StringRecord>((acc, question) => {
    acc[question.id] = ''
    return acc
  }, {})

const createArrayRecord = (questions: Array<{ id: string }>) =>
  questions.reduce<ArrayRecord>((acc, question) => {
    acc[question.id] = []
    return acc
  }, {})

const createFeedbackRecord = (questions: Array<{ id: string }>) =>
  questions.reduce<FeedbackRecord>((acc, question) => {
    acc[question.id] = null
    return acc
  }, {})

const normalizeAnswer = (value: string) => value.trim().toLowerCase()

interface ReadingComprehensionSlideCoreProps {
  isActive: boolean
  data: ReadingComprehensionData
}

const ReadingComprehensionSlideCore: React.FC<
  ReadingComprehensionSlideCoreProps
> = ({ isActive, data }) => {
  const { title, passage, items = {}, questions } = data

  // Extract all question types
  const singleChoiceQuestions = questions.singleChoice || []
  const tfNgQuestions = questions.tfng || []
  const matchingQuestions = questions.matching?.questions || []
  const matchingOptions = questions.matching?.options || []
  const summaryQuestions = questions.summary || []
  const shortAnswerQuestions = questions.shortAnswer || []
  const multiSelectItemQuestions = questions.multiSelectItem || []
  const pictureChoiceQuestions = questions.pictureChoice || []
  const textComprehensionQuestions = questions.textComprehension || []

  const [singleChoiceAnswers, setSingleChoiceAnswers] = useState<
    Record<string, string>
  >(() => createStringRecord(singleChoiceQuestions))

  const [tfngAnswers, setTfngAnswers] = useState<Record<string, string>>(() =>
    createStringRecord(tfNgQuestions),
  )

  const [matchingAnswers, setMatchingAnswers] = useState<
    Record<string, string>
  >(() => createStringRecord(matchingQuestions))

  const [summaryAnswers, setSummaryAnswers] = useState<Record<string, string>>(
    () => createStringRecord(summaryQuestions),
  )

  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>(() =>
    createStringRecord(shortAnswerQuestions),
  )

  const [multiSelectAnswers, setMultiSelectAnswers] = useState<ArrayRecord>(
    () => createArrayRecord(multiSelectItemQuestions),
  )

  const [pictureChoiceAnswers, setPictureChoiceAnswers] =
    useState<StringRecord>(() => createStringRecord(pictureChoiceQuestions))

  const [textComprehensionAnswers, setTextComprehensionAnswers] =
    useState<StringRecord>(() => createStringRecord(textComprehensionQuestions))

  const [feedback, setFeedback] = useState<FeedbackState>(() => ({
    singleChoice: createFeedbackRecord(singleChoiceQuestions),
    tfng: createFeedbackRecord(tfNgQuestions),
    matching: createFeedbackRecord(matchingQuestions),
    summary: createFeedbackRecord(summaryQuestions),
    multiSelectItem: createFeedbackRecord(multiSelectItemQuestions),
    pictureChoice: createFeedbackRecord(pictureChoiceQuestions),
    textComprehension: createFeedbackRecord(textComprehensionQuestions),
  }))

  const [score, setScore] = useState<number | null>(null)

  const toggleItemSelection = (questionId: string, itemKey: string) => {
    setMultiSelectAnswers((prev) => {
      const current = prev[questionId] || []
      const exists = current.includes(itemKey)
      const updated = exists
        ? current.filter((key) => key !== itemKey)
        : [...current, itemKey]
      return { ...prev, [questionId]: updated }
    })
  }

  const gradeTest = () => {
    let correct = 0

    const newFeedback: FeedbackState = {
      singleChoice: createFeedbackRecord(singleChoiceQuestions),
      tfng: createFeedbackRecord(tfNgQuestions),
      matching: createFeedbackRecord(matchingQuestions),
      summary: createFeedbackRecord(summaryQuestions),
      multiSelectItem: createFeedbackRecord(multiSelectItemQuestions),
      pictureChoice: createFeedbackRecord(pictureChoiceQuestions),
      textComprehension: createFeedbackRecord(textComprehensionQuestions),
    }

    singleChoiceQuestions.forEach((question) => {
      const isCorrect = singleChoiceAnswers[question.id] === question.correct
      newFeedback.singleChoice[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    tfNgQuestions.forEach((question) => {
      const isCorrect = tfngAnswers[question.id] === question.correct
      newFeedback.tfng[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    matchingQuestions.forEach((question) => {
      const isCorrect = matchingAnswers[question.id] === question.correct
      newFeedback.matching[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    summaryQuestions.forEach((question) => {
      const userAnswer = normalizeAnswer(summaryAnswers[question.id] || '')
      const isCorrect = question.answers.some(
        (answer) => normalizeAnswer(answer) === userAnswer,
      )
      newFeedback.summary[question.id] = isCorrect && userAnswer.length > 0
      if (newFeedback.summary[question.id]) correct += 1
    })

    multiSelectItemQuestions.forEach((question) => {
      const selected = multiSelectAnswers[question.id] || []
      const isCorrect =
        question.correct.every((key) => selected.includes(key)) &&
        selected.length === question.correct.length
      newFeedback.multiSelectItem[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    pictureChoiceQuestions.forEach((question) => {
      const isCorrect = pictureChoiceAnswers[question.id] === question.correct
      newFeedback.pictureChoice[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    textComprehensionQuestions.forEach((question) => {
      const isCorrect =
        textComprehensionAnswers[question.id] === question.correct
      newFeedback.textComprehension[question.id] = isCorrect
      if (isCorrect) correct += 1
    })

    const totalGradedQuestions =
      singleChoiceQuestions.length +
      tfNgQuestions.length +
      matchingQuestions.length +
      summaryQuestions.length +
      multiSelectItemQuestions.length +
      pictureChoiceQuestions.length +
      textComprehensionQuestions.length

    setFeedback(newFeedback)
    setScore(
      totalGradedQuestions > 0
        ? Math.round((correct / totalGradedQuestions) * 100)
        : 0,
    )
  }

  const resetTest = () => {
    setSingleChoiceAnswers(createStringRecord(singleChoiceQuestions))
    setTfngAnswers(createStringRecord(tfNgQuestions))
    setMatchingAnswers(createStringRecord(matchingQuestions))
    setSummaryAnswers(createStringRecord(summaryQuestions))
    setShortAnswers(createStringRecord(shortAnswerQuestions))
    setMultiSelectAnswers(createArrayRecord(multiSelectItemQuestions))
    setPictureChoiceAnswers(createStringRecord(pictureChoiceQuestions))
    setTextComprehensionAnswers(createStringRecord(textComprehensionQuestions))
    setFeedback({
      singleChoice: createFeedbackRecord(singleChoiceQuestions),
      tfng: createFeedbackRecord(tfNgQuestions),
      matching: createFeedbackRecord(matchingQuestions),
      summary: createFeedbackRecord(summaryQuestions),
      multiSelectItem: createFeedbackRecord(multiSelectItemQuestions),
      pictureChoice: createFeedbackRecord(pictureChoiceQuestions),
      textComprehension: createFeedbackRecord(textComprehensionQuestions),
    })
    setScore(null)
  }

  return (
    <Slide isActive={isActive} scrollable={true}>
      <div className="flex flex-row gap-2 h-full w-full">
        {/* Reading Passage */}
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">{title}</h2>
          <div className="space-y-6 text-xl text-gray-800">
            {passage.map((para, index) => (
              <div key={index} className={para.className}>
                {para.heading && (
                  <h3 className="text-3xl font-bold text-indigo-700 mb-3">
                    {para.heading}
                  </h3>
                )}
                {(para.content || para.text) && (
                  <p className="text-xl text-gray-700 whitespace-pre-line">
                    {para.content || para.text}
                  </p>
                )}
                {para.list && (
                  <ul className="list-disc list-inside space-y-3 text-xl text-gray-700">
                    {para.list.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                )}
                {para.dialog && (
                  <div className="bg-indigo-50 rounded-2xl p-4 space-y-3">
                    {para.dialog.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Questions Panel */}
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <h2 className="text-3xl font-bold text-indigo-700">
            Reading Comprehension
          </h2>

          {/* Single Choice Questions */}
          {singleChoiceQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                1. Multiple Choice Questions
              </h3>
              <p className="text-lg text-gray-600">
                Choose the best answer A, B, or C.
              </p>
              <div className="space-y-4">
                {singleChoiceQuestions.map((question) => {
                  const isCorrect = feedback.singleChoice[question.id]
                  const correctLabel = question.options.find(
                    (option) => option.value === question.correct,
                  )?.label
                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm"
                    >
                      <p className="text-xl text-gray-800 font-semibold">
                        {question.prompt}
                      </p>
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, index) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-3 text-xl text-gray-700"
                          >
                            <input
                              type="radio"
                              name={`sc-${question.id}`}
                              value={option.value}
                              checked={
                                singleChoiceAnswers[question.id] ===
                                option.value
                              }
                              onChange={(e) =>
                                setSingleChoiceAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: e.target.value,
                                }))
                              }
                            />
                            <span>
                              {String.fromCharCode(65 + index)}. {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {isCorrect !== null && (
                        <p
                          className={
                            isCorrect
                              ? 'mt-3 text-lg font-semibold text-green-600'
                              : 'mt-3 text-lg font-semibold text-red-600'
                          }
                        >
                          {isCorrect
                            ? 'Correct!'
                            : `Not quite. The correct answer is: ${correctLabel}.`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* True/False/Not Given */}
          {tfNgQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                2. True / False / Not Given
              </h3>
              <p className="text-lg text-gray-600">
                Decide whether the statements agree with the passage.
              </p>
              <div className="space-y-4">
                {tfNgQuestions.map((question) => {
                  const isCorrect = feedback.tfng[question.id]
                  const correctLabel = question.correct
                    .replace('_', ' ')
                    .toUpperCase()
                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm"
                    >
                      <p className="text-xl text-gray-800 font-semibold">
                        {question.statement}
                      </p>
                      <div className="mt-3 space-y-2">
                        {['true', 'false', 'not_given'].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-3 text-xl text-gray-700"
                          >
                            <input
                              type="radio"
                              name={`tfng-${question.id}`}
                              value={option}
                              checked={tfngAnswers[question.id] === option}
                              onChange={(e) =>
                                setTfngAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: e.target.value,
                                }))
                              }
                            />
                            <span>
                              {option.replace('_', ' ').toUpperCase()}
                            </span>
                          </label>
                        ))}
                      </div>
                      {isCorrect !== null && (
                        <p
                          className={
                            isCorrect
                              ? 'mt-3 text-lg font-semibold text-green-600'
                              : 'mt-3 text-lg font-semibold text-red-600'
                          }
                        >
                          {isCorrect
                            ? 'Correct!'
                            : `Not quite. The correct answer is: ${correctLabel}.`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Matching Headings */}
          {matchingQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                3. Matching Headings
              </h3>
              <p className="text-lg text-gray-600">
                Match each heading to the correct paragraph.
              </p>
              <div className="space-y-4">
                {matchingQuestions.map((question) => {
                  const isCorrect = feedback.matching[question.id]
                  const correctLabel = matchingOptions.find(
                    (option) => option.value === question.correct,
                  )?.label
                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm"
                    >
                      <p className="text-xl text-gray-800 font-semibold">
                        {question.statement}
                      </p>
                      <select
                        className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={matchingAnswers[question.id]}
                        onChange={(e) =>
                          setMatchingAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>
                          Select a paragraph
                        </option>
                        {matchingOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {isCorrect !== null && (
                        <p
                          className={
                            isCorrect
                              ? 'mt-3 text-lg font-semibold text-green-600'
                              : 'mt-3 text-lg font-semibold text-red-600'
                          }
                        >
                          {isCorrect
                            ? 'Correct!'
                            : `Not quite. The correct paragraph is: ${correctLabel}.`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Summary Completion */}
          {summaryQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                4. Summary Completion
              </h3>
              <p className="text-lg text-gray-600">
                Complete the sentences with no more than three words.
              </p>
              <div className="space-y-4">
                {summaryQuestions.map((question) => {
                  const isCorrect = feedback.summary[question.id]
                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm"
                    >
                      <p className="text-xl text-gray-800 font-semibold">
                        {question.prompt}
                      </p>
                      <input
                        type="text"
                        className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={summaryAnswers[question.id]}
                        onChange={(e) =>
                          setSummaryAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        placeholder="Type your answer here"
                      />
                      {isCorrect !== null && (
                        <p
                          className={
                            isCorrect
                              ? 'mt-3 text-lg font-semibold text-green-600'
                              : 'mt-3 text-lg font-semibold text-red-600'
                          }
                        >
                          {isCorrect
                            ? 'Correct!'
                            : 'Not quite. Please give another answer.'}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Short Answer Questions */}
          {shortAnswerQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                5. Short Answer Questions (Viết ra giấy giúp thầy, phần này chưa
                phát triển xong, nên chưa lưu kết quả trả lời được)
              </h3>
              <p className="text-lg text-gray-600">
                Respond in full sentences. These responses are not auto-graded.
              </p>
              <div className="space-y-4">
                {shortAnswerQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm"
                  >
                    <p className="text-xl text-gray-800 font-semibold">
                      {question.prompt}
                    </p>
                    <textarea
                      className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      value={shortAnswers[question.id]}
                      onChange={(e) =>
                        setShortAnswers((prev) => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      placeholder="Write your response here"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Multi-Select Item Questions */}
          {multiSelectItemQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 text-center">
                What do they have?
              </h3>
              <p className="text-lg text-gray-600 text-center">
                Bấm vào đồ vật mà các nhân vật trong câu truyện có:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {multiSelectItemQuestions.map((question) => {
                  const selected = multiSelectAnswers[question.id] || []
                  const feedbackValue = feedback.multiSelectItem[question.id]
                  return (
                    <div
                      key={question.id}
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
                          {question.name}
                        </p>
                        <p className="text-base text-gray-600">
                          {question.prompt}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {question.options.map((itemKey) => {
                          const item = items[itemKey]
                          if (!item) return null
                          const isSelected = selected.includes(itemKey)
                          return (
                            <button
                              key={itemKey}
                              type="button"
                              onClick={() =>
                                toggleItemSelection(question.id, itemKey)
                              }
                              className={`rounded-xl border-4 p-2 flex flex-col items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.label}
                                className="h-20 w-20 object-contain"
                              />
                              <span className="text-lg font-semibold text-gray-700">
                                {item.label}
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
          )}

          {/* Picture Choice Questions */}
          {pictureChoiceQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 text-center">
                Picture choice (chọn hình)
              </h3>
              <p className="text-lg text-gray-600 text-center">
                Chọn hình phù hợp với câu.
              </p>
              <div className="space-y-4">
                {pictureChoiceQuestions.map((question) => {
                  const answer = pictureChoiceAnswers[question.id]
                  const feedbackValue = feedback.pictureChoice[question.id]
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
                        {question.options.map((itemKey) => {
                          const item = items[itemKey]
                          if (!item) return null
                          return (
                            <button
                              key={itemKey}
                              type="button"
                              onClick={() =>
                                setPictureChoiceAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: itemKey,
                                }))
                              }
                              className={`rounded-xl border-4 p-3 flex flex-col items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                answer === itemKey
                                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.label}
                                className="h-20 w-20 object-contain"
                              />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Text Comprehension Questions */}
          {textComprehensionQuestions.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 text-center">
                Text Comprehension (Kiểm tra mức độ hiểu bài đọc)
              </h3>
              <p className="text-lg text-gray-600 text-center">
                Chọn ý đúng với bài đọc.
              </p>
              <div className="space-y-4">
                {textComprehensionQuestions.map((question) => {
                  const answer = textComprehensionAnswers[question.id]
                  const feedbackValue = feedback.textComprehension[question.id]
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
                              setTextComprehensionAnswers((prev) => ({
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
          )}

          {/* Grade Button and Score */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
            <button
              onClick={gradeTest}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xl font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Check my answers
            </button>
            <button
              onClick={resetTest}
              className="rounded-xl bg-white border-2 border-indigo-300 px-6 py-3 text-xl font-semibold text-indigo-600 shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Start again
            </button>
            {score !== null && (
              <div className="text-2xl font-bold text-gray-800">
                Score: <span className="text-indigo-700">{score}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  )
}

// Main Component Interface
interface ReadingComprehensionSlideProps {
  readingComprehensionData: ReadingComprehensionData
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const ReadingComprehensionSlide: React.FC<ReadingComprehensionSlideProps> = ({
  readingComprehensionData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const slides = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <ReadingComprehensionSlideCore
          isActive={isActive}
          data={readingComprehensionData}
        />
      ),
    ],
    [readingComprehensionData],
  )

  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export default ReadingComprehensionSlide
