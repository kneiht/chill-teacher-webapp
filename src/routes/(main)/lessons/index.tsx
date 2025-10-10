import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography

const lessons = [
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 1: Vocabulary - Part 1',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-1/',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=3334&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Everybody Up Starter - Unit 1',
    description: 'Lesson 1: School Supplies',
    path: '../../lessons/everybody-up-0/unit-1/lesson-1/',
    imageUrl:
      'https://images.unsplash.com/photo-1522072176733-94d6a1c17a83?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

export const Route = createFileRoute('/(main)/lessons/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Title level={2}>Available Lessons</Title>
      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => (
          <Col xs={24} sm={12} md={8} key={lesson.path}>
            <Link to={lesson.path}>
              <Card
                hoverable
                cover={
                  <img
                    alt={lesson.title}
                    src={lesson.imageUrl}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={lesson.title}
                  description={lesson.description}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}
