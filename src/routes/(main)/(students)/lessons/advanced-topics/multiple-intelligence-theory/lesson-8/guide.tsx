// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Assets
import urls from './assets/urls.json'

const HomeworkSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Slide isActive={isActive} scrollable={true}>
    <div className="flex flex-col items-center justify-start h-full text-center p-6">
      <div className="bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl w-full">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Multiple Intelligence Theory
          <br />
          Lesson 8: Presentation
        </h2>

        <div className="text-left text-gray-800 space-y-6 text-base leading-relaxed">
          <h3 className="text-2xl font-bold text-blue-600">
            SAMPLE OUTLINE FOR PRESENTATION: “MULTIPLE INTELLIGENCES”
          </h3>

          <p>
            This is a sample outline for your presentation about{' '}
            <strong>Multiple Intelligences</strong>. You can use it as a model
            or make changes to create your own version. The outline includes
            both the <strong>onscreen content</strong> (what appears on the
            slide) and the <strong>speaker script</strong> (what you say during
            your presentation).
          </p>

          <div>
            <h4 className="text-xl font-semibold text-blue-600">
              1. Understanding the Goal
            </h4>
            <p>This presentation will:</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>
                Explain Howard Gardner’s Multiple Intelligence theory clearly.
              </li>
              <li>Describe each type of intelligence with examples.</li>
              <li>Discuss its implications for education.</li>
              <li>
                Connect the theory to your own learning style and experiences.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-blue-600">
              2. Presentation Structure (Slides Overview)
            </h4>

            <div className="ml-4">
              <h5 className="text-lg font-semibold text-blue-600">
                Introduction (Slides 1–3)
              </h5>
              <p>
                Introduce the topic and background of intelligence measurement.
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>Talk about:</strong> Alfred Binet’s IQ test and its
                  limits.
                </li>
                <li>
                  <strong>Talk about:</strong> Howard Gardner and the idea of
                  Multiple Intelligences.
                </li>
                <li>
                  <strong>Script example:</strong> “In the early 20th century,
                  intelligence was measured mainly by IQ. But later, Howard
                  Gardner from Harvard suggested that people are smart in many
                  different ways.”
                </li>
              </ul>
            </div>

            <div className="ml-4 mt-4">
              <h5 className="text-lg font-semibold text-blue-600">
                Main Content – Types of Intelligence (Slides 4–13)
              </h5>
              <p>
                Describe each intelligence type. Keep each slide focused on one
                type only.
              </p>

              <div className="ml-4 mt-2">
                <p className="font-semibold">a. Linguistic Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> reading, writing, speaking,
                    learning languages.
                  </li>
                  <li>
                    <strong>Script:</strong> “People with strong linguistic
                    intelligence enjoy reading and communicating. They can
                    develop it by reading books and joining discussions.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">
                  b. Logical-Mathematical Intelligence
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> working with numbers, solving
                    problems, finding patterns.
                  </li>
                  <li>
                    <strong>Script:</strong> “Logical thinkers enjoy puzzles and
                    problem-solving. They are good at reasoning and analyzing
                    information.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">c. Musical Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> rhythm, sound, music creation.
                  </li>
                  <li>
                    <strong>Script:</strong> “People with musical intelligence
                    recognize rhythm and melody easily. They learn through
                    music, singing, or playing instruments.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">d. Spatial Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> visual imagination, drawing,
                    directions.
                  </li>
                  <li>
                    <strong>Script:</strong> “Spatial learners think in
                    pictures. They are good at design, art, and visualizing
                    things in space.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">
                  e. Bodily-Kinesthetic Intelligence
                </p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> movement, hands-on activities,
                    expressing through body.
                  </li>
                  <li>
                    <strong>Script:</strong> “These learners use their bodies to
                    express ideas. They learn best through physical activities
                    or role-playing.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">f. Interpersonal Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> teamwork, understanding others,
                    communication.
                  </li>
                  <li>
                    <strong>Script:</strong> “Interpersonal learners are good at
                    understanding others and working in teams. They enjoy
                    discussions and group projects.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">g. Intrapersonal Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> self-awareness, emotions,
                    reflection.
                  </li>
                  <li>
                    <strong>Script:</strong> “Intrapersonal learners understand
                    their feelings and motivations. They prefer studying alone
                    and reflecting on their thoughts.”
                  </li>
                </ul>
              </div>

              <div className="ml-4 mt-2">
                <p className="font-semibold">h. Naturalist Intelligence</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Talk about:</strong> nature, animals, environment.
                  </li>
                  <li>
                    <strong>Script:</strong> “Naturalist learners are connected
                    to nature. They learn by exploring, observing, and
                    discovering the environment.”
                  </li>
                </ul>
              </div>
            </div>

            <div className="ml-4 mt-4">
              <h5 className="text-lg font-semibold text-blue-600">
                Educational Implications (Slides 14–15)
              </h5>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>Talk about:</strong> how MI theory affects classrooms.
                </li>
                <li>
                  <strong>Script:</strong> “Teachers should use varied methods —
                  reading, teamwork, problem-solving, and creative tasks — to
                  help all types of learners.”
                </li>
                <li>
                  <strong>Talk about:</strong> recognizing strengths, avoiding
                  one-size-fits-all teaching.
                </li>
              </ul>
            </div>

            <div className="ml-4 mt-4">
              <h5 className="text-lg font-semibold text-blue-600">
                Personal Reflection (Slides 16–17)
              </h5>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>Talk about:</strong> your strongest and weakest
                  intelligences.
                </li>
                <li>
                  <strong>Script example:</strong> “My strongest intelligences
                  are linguistic and interpersonal. I love communicating with
                  people and sharing ideas. My weakest one is logical, so I try
                  to practice problem-solving more often.”
                </li>
                <li>
                  <strong>Talk about:</strong> how you use your strengths and
                  improve weaker areas.
                </li>
              </ul>
            </div>

            <div className="ml-4 mt-4">
              <h5 className="text-lg font-semibold text-blue-600">
                Conclusion (Slides 18–20)
              </h5>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>Talk about:</strong> the idea that intelligence is not
                  fixed.
                </li>
                <li>
                  <strong>Script:</strong> “In conclusion, intelligence comes in
                  many forms. Every person has different strengths that can be
                  developed. Education should support every learner’s unique way
                  of thinking.”
                </li>
                <li>
                  <strong>Talk about:</strong> thanking the audience and
                  acknowledging sources.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Slide>
)

const HomeworkPage: React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => navigate({ to: '..' })

  const slides = [HomeworkSlide]
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
  '/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-8/guide',
)({
  component: HomeworkPage,
})
