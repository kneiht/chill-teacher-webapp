import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import urls from './assets/urls.json'

type Option = {
  value: string
  label: string
}

type SingleChoiceQuestion = {
  id: string
  prompt: string
  options: Array<Option>
  correct: string
}

type TfNgQuestion = {
  id: string
  statement: string
  correct: 'true' | 'false' | 'not_given'
}

type MatchingQuestion = {
  id: string
  statement: string
  correct: string
}

type SummaryQuestion = {
  id: string
  prompt: string
  answers: Array<string>
}

type ShortAnswerQuestion = {
  id: string
  prompt: string
}

const singleChoiceQuestions: Array<SingleChoiceQuestion> = [
  {
    id: 'sc1',
    prompt: 'What was the main limitation of the first IQ tests?',
    options: [
      {
        value: 'too-hard',
        label: 'They were too difficult for young learners.',
      },
      {
        value: 'narrow-focus',
        label: 'They only measured linguistic and logical-mathematical skills.',
      },
      {
        value: 'ignored-numbers',
        label: 'They failed to include any numerical tasks.',
      },
    ],
    correct: 'narrow-focus',
  },
  {
    id: 'sc2',
    prompt:
      'Which statement best describes Gardner’s Multiple Intelligence theory?',
    options: [
      {
        value: 'single-score',
        label: 'Intelligence can be represented by one exact score.',
      },
      {
        value: 'varied-profile',
        label: 'Each person has a unique profile of different intelligences.',
      },
      {
        value: 'fixed-talent',
        label: 'Talents are fixed and cannot be developed.',
      },
    ],
    correct: 'varied-profile',
  },
  {
    id: 'sc3',
    prompt:
      'According to the passage, how many types of intelligence does Gardner describe explicitly?',
    options: [
      { value: 'six', label: 'Six' },
      { value: 'eight', label: 'Eight' },
      { value: 'ten', label: 'Ten' },
    ],
    correct: 'eight',
  },
  {
    id: 'sc4',
    prompt: 'Which activity is recommended to strengthen spatial intelligence?',
    options: [
      { value: 'journaling', label: 'Keeping a reflective journal.' },
      { value: 'drawing', label: 'Drawing and solving mazes.' },
      { value: 'teamwork', label: 'Joining teamwork and role-play.' },
    ],
    correct: 'drawing',
  },
  {
    id: 'sc5',
    prompt:
      'What does Gardner suggest about spiritual and existential intelligence?',
    options: [
      {
        value: 'fully-defined',
        label: 'They are fully defined with clear conclusions.',
      },
      { value: 'excluded', label: 'They are excluded from his theory.' },
      {
        value: 'speculative',
        label: 'They are possible but not clearly concluded.',
      },
    ],
    correct: 'speculative',
  },
]

const tfNgQuestions: Array<TfNgQuestion> = [
  {
    id: 'tfng1',
    statement: 'Alfred Binet developed the first intelligence test in France.',
    correct: 'true',
  },
  {
    id: 'tfng2',
    statement:
      'Gardner claimed that all learners should follow the same classroom activities.',
    correct: 'false',
  },
  {
    id: 'tfng3',
    statement:
      'The passage states that MI theory immediately replaced IQ tests worldwide.',
    correct: 'not_given',
  },
  {
    id: 'tfng4',
    statement:
      'Developing one intelligence can support growth in other intelligences.',
    correct: 'true',
  },
  {
    id: 'tfng5',
    statement:
      'Gardner insists that teachers must design one unique lesson for every student.',
    correct: 'false',
  },
]

const paragraphOptions: Array<Option> = [
  { value: 'paragraph1', label: 'Paragraph 1' },
  { value: 'paragraph2', label: 'Paragraph 2' },
  { value: 'paragraph3', label: 'Paragraph 3' },
  { value: 'paragraph4', label: 'Paragraph 4' },
  { value: 'paragraph5', label: 'Paragraph 5' },
]

const matchingQuestions: Array<MatchingQuestion> = [
  {
    id: 'match1',
    statement: 'Historical origins of IQ testing',
    correct: 'paragraph1',
  },
  {
    id: 'match2',
    statement: 'Gardner’s core principles about learners',
    correct: 'paragraph2',
  },
  {
    id: 'match3',
    statement: 'Descriptions of the eight main intelligences',
    correct: 'paragraph3',
  },
  {
    id: 'match4',
    statement: 'Educational implications for classroom practice',
    correct: 'paragraph4',
  },
  {
    id: 'match5',
    statement: 'Overall conclusion on intelligence',
    correct: 'paragraph5',
  },
]

const summaryQuestions: Array<SummaryQuestion> = [
  {
    id: 'summary1',
    prompt:
      'Complete the sentence: IQ tests traditionally focused on ______ skills.',
    answers: [
      'linguistic and logical-mathematical',
      'language and logical-mathematical',
    ],
  },
  {
    id: 'summary2',
    prompt:
      'Complete the sentence: Gardner argues that people do not learn in the same ______.',
    answers: ['way', 'manner'],
  },
  {
    id: 'summary3',
    prompt:
      'Complete the sentence: Interpersonal intelligence involves working with ______.',
    answers: ['other people', 'others'],
  },
  {
    id: 'summary4',
    prompt:
      'Complete the sentence: Developing one intelligence may help improve ______ areas.',
    answers: ['other', 'other intelligence', 'other intelligences'],
  },
  {
    id: 'summary5',
    prompt:
      'Complete the sentence: Schools should respect differences so every ______ can succeed.',
    answers: ['mind', 'learner'],
  },
]

const shortAnswerQuestions: Array<ShortAnswerQuestion> = [
  {
    id: 'sa1',
    prompt:
      'Which type of intelligence from the passage do you relate to most, and why?',
  },
  {
    id: 'sa2',
    prompt:
      'How could a teacher support multiple intelligences in one classroom activity?',
  },
  {
    id: 'sa3',
    prompt:
      'Describe a personal experience where developing one skill helped you improve another.',
  },
  {
    id: 'sa4',
    prompt:
      'Which intelligence do you think educators often overlook, and what could be done?',
  },
  {
    id: 'sa5',
    prompt:
      'What opportunity would help you strengthen an intelligence you want to improve?',
  },
]

type FeedbackRecord = Record<string, boolean | null>

type FeedbackState = {
  singleChoice: FeedbackRecord
  tfng: FeedbackRecord
  matching: FeedbackRecord
  summary: FeedbackRecord
}

const createStringRecord = (questions: Array<{ id: string }>) =>
  questions.reduce<Record<string, string>>((acc, question) => {
    acc[question.id] = ''
    return acc
  }, {})

const createFeedbackRecord = (questions: Array<{ id: string }>) =>
  questions.reduce<FeedbackRecord>((acc, question) => {
    acc[question.id] = null
    return acc
  }, {})

const normalizeAnswer = (value: string) => value.trim().toLowerCase()

const ReadingAssessmentSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
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
  const [feedback, setFeedback] = useState<FeedbackState>(() => ({
    singleChoice: createFeedbackRecord(singleChoiceQuestions),
    tfng: createFeedbackRecord(tfNgQuestions),
    matching: createFeedbackRecord(matchingQuestions),
    summary: createFeedbackRecord(summaryQuestions),
  }))
  const [score, setScore] = useState<number | null>(null)

  const gradeTest = () => {
    let correct = 0

    const newFeedback: FeedbackState = {
      singleChoice: createFeedbackRecord(singleChoiceQuestions),
      tfng: createFeedbackRecord(tfNgQuestions),
      matching: createFeedbackRecord(matchingQuestions),
      summary: createFeedbackRecord(summaryQuestions),
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

    const totalGradedQuestions =
      singleChoiceQuestions.length +
      tfNgQuestions.length +
      matchingQuestions.length +
      summaryQuestions.length

    setFeedback(newFeedback)
    setScore(Math.round((correct / totalGradedQuestions) * 100))
  }

  return (
    <Slide isActive={isActive} scrollable={true}>
      <div className="flex flex-row gap-2 h-full w-full">
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              The Implications of Multiple Intelligence Theory
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              At the beginning of the 20th century, Alfred Binet in France
              created the first test to measure intelligence. From this, the
              idea of IQ (Intelligence Quotient) became popular. For many years,
              IQ tests were used in schools and workplaces around the world.
              However, these tests only measured language skills and
              logical-mathematical skills, which made the idea of intelligence
              too narrow.
            </p>
            <p className="text-xl text-gray-700 mb-4">
              Later, the American professor Howard Gardner from Harvard
              University introduced a new way of thinking. He developed the
              Multiple Intelligence (MI) theory, which changed how people
              understood intelligence. Gardner explained three important points:
              people are not all the same, people do not all learn in the same
              way, and education is more effective if it respects these
              differences.
            </p>
            <p className="text-xl text-gray-700">
              According to Gardner, there are at least eight types of
              intelligence:
            </p>
          </div>
          <ul className="list-disc list-inside space-y-3 text-xl text-gray-700">
            <li>
              <span className="font-semibold">Linguistic intelligence</span>:
              the ability to read, write, speak, and learn languages. It can be
              developed by reading books, listening to recordings, and joining
              discussions.
            </li>
            <li>
              <span className="font-semibold">
                Logical-mathematical intelligence
              </span>
              : the ability to work with numbers, patterns, and logical
              problems. It can be developed through puzzles, games, and
              problem-solving tasks.
            </li>
            <li>
              <span className="font-semibold">Musical intelligence</span>: the
              ability to understand and create music, rhythm, or dance. It can
              be developed by listening to music, singing, or playing
              instruments.
            </li>
            <li>
              <span className="font-semibold">Spatial intelligence</span>: the
              ability to see and create images, shapes, and directions. It can
              be improved by drawing, solving mazes, and practicing imagination.
            </li>
            <li>
              <span className="font-semibold">
                Bodily-kinesthetic intelligence
              </span>
              : the ability to use the body to learn and express ideas. It can
              be developed through sports, acting, or creative movement.
            </li>
            <li>
              <span className="font-semibold">Interpersonal intelligence</span>:
              the ability to understand and work with other people. It can be
              developed through teamwork, group projects, and role-play.
            </li>
            <li>
              <span className="font-semibold">Intrapersonal intelligence</span>:
              the ability to understand yourself and your emotions. It can be
              developed through journaling, reflection, or independent study.
            </li>
            <li>
              <span className="font-semibold">Naturalist intelligence</span>:
              the ability to understand nature and the environment. It can be
              developed through exploring nature, observing animals, or
              collecting natural items.
            </li>
          </ul>
          <p className="text-xl text-gray-700">
            Gardner also suggested the possibility of spiritual intelligence and
            existential intelligence, but he did not make clear conclusions
            about them.
          </p>
          <div className="space-y-4 pt-4">
            <h3 className="text-3xl font-bold text-indigo-700">
              How It Affects Education
            </h3>
            <p className="text-xl text-gray-700">
              Gardner believes that these intelligences are separate but
              connected. Each person has a unique profile: some intelligences
              may be stronger, others weaker. If one area is developed, it may
              also help improve other areas.
            </p>
            <p className="text-xl text-gray-700">
              For teachers, this means students cannot all learn in the same
              way. A classroom full of different learners needs different
              activities. While it is impossible to design one special lesson
              for every student, teachers can create a variety of tasks that use
              different intelligences. For example, a lesson might include
              reading, group work, problem-solving, and creative activities, so
              every learner finds a way to connect.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <h3 className="text-3xl font-bold text-indigo-700">Conclusion</h3>
            <p className="text-xl text-gray-700">
              The Multiple Intelligence theory suggests that intelligence is not
              fixed and not limited to language or mathematics. Instead, people
              have many different strengths that can grow with practice and
              opportunity. For teachers, this means education should not treat
              all students the same. Instead, schools should respect differences
              and create lessons that help every kind of mind succeed.
            </p>
          </div>
        </div>
        <div className="w-1/2 bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 text-left overflow-y-auto">
          <h2 className="text-3xl font-bold text-indigo-700">
            Reading Comprehension
          </h2>
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
                              singleChoiceAnswers[question.id] === option.value
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
                          <span>{option.replace('_', ' ').toUpperCase()}</span>
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
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              3. Matching Headings
            </h3>
            <p className="text-lg text-gray-600">
              Match each heading to the correct paragraph (1–5).
            </p>
            <div className="space-y-4">
              {matchingQuestions.map((question) => {
                const isCorrect = feedback.matching[question.id]
                const correctLabel = paragraphOptions.find(
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
                      {paragraphOptions.map((option) => (
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
                // const correctChoices = question.answers.join(', ')
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
                          : `Not quite. Please give another answer.`}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              5. Short Answer Questions
            </h3>
            <p className="text-lg text-gray-600">
              Respond in full sentences. These responses are not auto-graded.
              (Chưa có chức năng lưu lại câu trả lời, các em ghi vào vở gửi cho
              thầy nhé)
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
            <button
              onClick={gradeTest}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xl font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Grade my answers
            </button>
            {score !== null && (
              <div className="text-2xl font-bold text-gray-800">
                Your score: <span className="text-indigo-700">{score}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  )
}

const HomeworkPage: React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => navigate({ to: '..' })
  const slides = [ReadingAssessmentSlide]
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
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-4/exercises',
)({
  component: HomeworkPage,
})
