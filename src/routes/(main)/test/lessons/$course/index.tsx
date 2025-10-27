import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography

interface Lesson {
  title: string
  description: string
  course: string
  unit: string
  lesson: string
  bg: string
}

export const Route = createFileRoute('/(main)/test/lessons/$course/')({
  loader: async ({ params }): Promise<Array<Lesson> | { error: string }> => {
    try {
      const data = (await import(
        `../../mock-data/courses/${params.course}.json`
      )) as { default: Array<Lesson> }
      return data.default
    } catch {
      return { error: 'Cannot find this course' }
    }
  },
  component: LessonProgram,
})

function LessonProgram() {
  const data = Route.useLoaderData()

  if ('error' in data) {
    return (
      <div>
        <Title level={2}>Error</Title>
        <p>{data.error}</p>
      </div>
    )
  }

  const lessons = data

  return (
    <div>
      <Title level={2}>Available Lessons</Title>

      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => {
          const lessonPath = `/test/lessons/${lesson.course}/lessons/${lesson.course}/${lesson.unit}/${lesson.lesson}`

          return (
            <Col
              key={lessonPath}
              xs={24} // 1 column for extra small screens
              sm={12} // 2 columns for small screens
              md={8} // 3 columns for medium screens and up
              lg={6} // 4 columns for large screens and up
            >
              <a
                href={lessonPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        position: 'relative',
                        height: 200,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        alt={lesson.title}
                        src={lesson.bg}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#fff',
                          fontSize: 24,
                          fontWeight: 700,
                          textAlign: 'center',
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {lesson.title}
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={lesson.title}
                    description={lesson.description}
                  />
                </Card>
              </a>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
