import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography

const lessons = [
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 1: Vocabulary - Part 1',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-1/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 2: Vocabulary - Part 2',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-2/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 3: Vocabulary - Part 3',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-3/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 4: Reading',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-4/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 5: Listening',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-5/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 6: Shadowing',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-6/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 7: Writing',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-7/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 8: Presentation',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-8/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
]

export const Route = createFileRoute('/(main)/(students)/lessons/advanced')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Title level={2}>Available Lessons</Title>

      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => (
          <Col
            key={lesson.path}
            xs={24} // 1 column for extra small screens
            sm={12} // 2 columns for small screens
            md={8} // 3 columns for medium screens and up
            lg={6} // 4 columns for large screens and up
          >
            <a
              href={lesson.path}
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
                      src={lesson.imageUrl}
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
                      {lesson.description}
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
        ))}
      </Row>
    </div>
  )
}
