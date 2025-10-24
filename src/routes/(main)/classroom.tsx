import { createFileRoute } from '@tanstack/react-router'
import {
  // BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  // MessageOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  // List,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  // Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import type React from 'react'
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

interface Student {
  id: string
  name: string
  avatar: string
  status: 'present' | 'absent' | 'late'
  arrivalTime?: string
  behavior: 'excellent' | 'good' | 'fair' | 'poor'
}

interface ClassSession {
  id: string
  name: string
  subject: string
  grade: string
  section: string
  time: string
  room: string
  teacher: string
  date: string
}

const Classroom: React.FC = () => {
  const { message } = AntApp.useApp()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const { t } = useLang()

  // Mock data for active classes
  const activeClasses: Array<ClassSession> = [
    {
      id: 'CLS001',
      name: 'Toán 10-A',
      subject: 'Toán',
      grade: '10',
      section: 'A',
      time: '9:00-10:00',
      room: 'Phòng 101',
      teacher: 'Cô Sarah Wilson',
      date: dayjs().format('YYYY-MM-DD'),
    },
    {
      id: 'CLS002',
      name: 'Lý 10-B',
      subject: 'Lý',
      grade: '10',
      section: 'B',
      time: '10:00-11:00',
      room: 'Lab 201',
      teacher: 'Thầy John Davis',
      date: dayjs().format('YYYY-MM-DD'),
    },
    {
      id: 'CLS003',
      name: 'Văn 11-A',
      subject: 'Văn',
      grade: '11',
      section: 'A',
      time: '2:00-3:00',
      room: 'Phòng 301',
      teacher: 'Cô Emma Thompson',
      date: dayjs().format('YYYY-MM-DD'),
    },
  ]

  // Mock student data with attendance
  const [students, setStudents] = useState<Array<Student>>([
    {
      id: 'STU001',
      name: 'An An',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      status: 'present',
      arrivalTime: '8:55',
      behavior: 'excellent',
    },
    {
      id: 'STU002',
      name: 'Bình An',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      status: 'late',
      arrivalTime: '9:10',
      behavior: 'good',
    },
    {
      id: 'STU003',
      name: 'Chiêu Dương',
      avatar:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      status: 'present',
      arrivalTime: '8:50',
      behavior: 'excellent',
    },
    {
      id: 'STU004',
      name: 'David Wilson',
      avatar:
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      status: 'absent',
      behavior: 'good',
    },
    {
      id: 'STU005',
      name: 'Emma Brown',
      avatar:
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      status: 'present',
      arrivalTime: '8:58',
      behavior: 'fair',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'green'
      case 'absent':
        return 'red'
      case 'late':
        return 'orange'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'absent':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      case 'late':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />
      default:
        return null
    }
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'excellent':
        return 'green'
      case 'good':
        return 'blue'
      case 'fair':
        return 'orange'
      case 'poor':
        return 'red'
      default:
        return 'default'
    }
  }

  const handleAttendanceChange = (
    studentId: string,
    status: 'present' | 'absent' | 'late',
  ) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status,
              arrivalTime:
                status === 'present' ? dayjs().format('HH:mm') : undefined,
            }
          : student,
      ),
    )
    message.success(
      `Attendance updated for ${students.find((s) => s.id === studentId)?.name}`,
    )
  }

  const handleBehaviorChange = (
    studentId: string,
    behavior: 'excellent' | 'good' | 'fair' | 'poor',
  ) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, behavior } : student,
      ),
    )
    message.success(
      `Behavior updated for ${students.find((s) => s.id === studentId)?.name}`,
    )
  }

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) {
      message.error(t('Please enter an announcement'))
      return
    }
    if (!selectedClass) {
      message.error(t('Please select a class'))
      return
    }

    message.success(t('Announcement sent to all students and parents'))
    setAnnouncement('')
    setIsAnnouncementModalOpen(false)
  }

  const selectedClassData = activeClasses.find((c) => c.id === selectedClass)

  const presentCount = students.filter((s) => s.status === 'present').length
  const absentCount = students.filter((s) => s.status === 'absent').length
  const lateCount = students.filter((s) => s.status === 'late').length
  const attendanceRate = Math.round((presentCount / students.length) * 100)

  const columns: ColumnsType<Student> = [
    {
      title: t('Student'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('Attendance'),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Space>
            {getStatusIcon(status)}
            <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          </Space>
          {record.arrivalTime && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('Arrived')}: {record.arrivalTime}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('Mark Attendance'),
      key: 'markAttendance',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type={record.status === 'present' ? 'primary' : 'default'}
            icon={<CheckCircleOutlined />}
            onClick={() => handleAttendanceChange(record.id, 'present')}
          >
            {t('Present')}
          </Button>
          <Button
            size="small"
            type={record.status === 'late' ? 'primary' : 'default'}
            icon={<ClockCircleOutlined />}
            onClick={() => handleAttendanceChange(record.id, 'late')}
          >
            {t('Late')}
          </Button>
          <Button
            size="small"
            danger={record.status === 'absent'}
            type={record.status === 'absent' ? 'primary' : 'default'}
            icon={<CloseCircleOutlined />}
            onClick={() => handleAttendanceChange(record.id, 'absent')}
          >
            {t('Absent')}
          </Button>
        </Space>
      ),
    },
    {
      title: t('Behavior'),
      dataIndex: 'behavior',
      key: 'behavior',
      render: (behavior, record) => (
        <div>
          <Tag color={getBehaviorColor(behavior)}>{behavior.toUpperCase()}</Tag>
          <br />
          <Select
            size="small"
            value={behavior}
            onChange={(value) => handleBehaviorChange(record.id, value)}
            style={{ width: 100, marginTop: 4 }}
          >
            <Option value="excellent">{t('Excellent')}</Option>
            <Option value="good">{t('Good')}</Option>
            <Option value="fair">{t('Fair')}</Option>
            <Option value="poor">{t('Poor')}</Option>
          </Select>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Classroom Management')}</Title>
        <Text type="secondary">
          {t(
            'Track attendance, manage behavior, and communicate with students',
          )}
        </Text>
      </div>

      {/* Class Selection */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>{t('Select Class:')}</Text>
          </Col>
          <Col>
            <Select
              placeholder={t('Choose a class')}
              value={selectedClass}
              onChange={setSelectedClass}
              style={{ width: 250 }}
            >
              {activeClasses.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.time}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Text strong>{t('Date')}:</Text>
          </Col>
          <Col>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </Col>
          {/* <Col flex="auto" style={{ textAlign: 'right' }}>
						<Space>
							<Button
								type="primary"
								icon={<MessageOutlined />}
								onClick={() => setIsAnnouncementModalOpen(true)}
								disabled={!selectedClass}
							>
								{t('Send Announcement')}
							</Button>
							<Button icon={<BellOutlined />}>{t('Ring Bell')}</Button>
						</Space>
					</Col> */}
        </Row>

        {/* {selectedClassData && (
					<div
						style={{
							marginTop: 16,
							padding: 16,
							background: '#f5f5f5',
							borderRadius: 8,
						}}
					>
						<Row gutter={16}>
							<Col>
								<Text strong>{t('Subject')}:</Text> {selectedClassData.subject}
							</Col>
							<Col>
								<Text strong>{t('Grade')}:</Text> {selectedClassData.grade}-
								{selectedClassData.section}
							</Col>
							<Col>
								<Text strong>{t('Room')}:</Text> {selectedClassData.room}
							</Col>
							<Col>
								<Text strong>{t('Teacher')}:</Text> {selectedClassData.teacher}
							</Col>
						</Row>
					</div>
				)} */}
      </Card>

      {selectedClass && (
        <>
          {/* Attendance Summary */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Present')}
                  value={presentCount}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Absent')}
                  value={absentCount}
                  prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Late')}
                  value={lateCount}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <div>
                  <Text type="secondary">{t('Attendance Rate')}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      type="circle"
                      percent={attendanceRate}
                      width={60}
                      strokeColor={
                        attendanceRate >= 90
                          ? '#52c41a'
                          : attendanceRate >= 70
                            ? '#faad14'
                            : '#ff4d4f'
                      }
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Student List */}
          <Card
            title={
              <Space>
                <UserOutlined />
                <Text strong>
                  {t('Student List')} ({students.length})
                </Text>
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setStudents(
                      students.map((s) => ({
                        ...s,
                        status: 'present',
                        arrivalTime: dayjs().format('HH:mm'),
                      })),
                    )
                    message.success(t('All students marked as present'))
                  }}
                >
                  {t('Mark All Present')}
                </Button>
                <Button
                  onClick={() => {
                    setStudents(
                      students.map((s) => ({
                        ...s,
                        status: 'absent',
                        arrivalTime: undefined,
                      })),
                    )
                    message.success(t('All students marked as absent'))
                  }}
                >
                  {t('Mark All Absent')}
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>

          {/* Quick Actions */}
          {/* <Card title={t('Quick Actions')} style={{ marginTop: 24 }}>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<div style={{ marginBottom: 16 }}>
									<Title level={5}>{t('Classroom Controls')}</Title>
									<Space direction="vertical" style={{ width: '100%' }}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Text>{t('Projector')}</Text>
											<Switch defaultChecked />
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Text>{t('Air Conditioning')}</Text>
											<Switch />
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Text>{t('Smart Board')}</Text>
											<Switch defaultChecked />
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Text>{t('Microphone')}</Text>
											<Switch />
										</div>
									</Space>
								</div>
							</Col>
							<Col xs={24} md={12}>
								<div>
									<Title level={5}>{t('Recent Announcements')}</Title>
									<List
										size="small"
										dataSource={[
											{
												title: t('Quiz scheduled for next week'),
												time: t('10 minutes ago'),
											},
											{
												title: t('Assignment due date extended'),
												time: t('1 hour ago'),
											},
											{
												title: t('Parent-teacher meeting reminder'),
												time: t('2 hours ago'),
											},
										]}
										renderItem={(item) => (
											<List.Item>
												<div>
													<Text>{item.title}</Text>
													<br />
													<Text type="secondary" style={{ fontSize: 12 }}>
														{item.time}
													</Text>
												</div>
											</List.Item>
										)}
									/>
								</div>
							</Col>
						</Row>
					</Card> */}
        </>
      )}

      {/* Announcement Modal */}
      <Modal
        title={t('Send Announcement')}
        open={isAnnouncementModalOpen}
        onOk={handleSendAnnouncement}
        onCancel={() => setIsAnnouncementModalOpen(false)}
        width={500}
      >
        <div>
          <Text strong>{t('To:')} </Text>
          <Text>
            {selectedClassData?.name} - {t('All students and parents')}
          </Text>
        </div>
        <div style={{ marginTop: 16 }}>
          <Text strong>{t('Message:')}</Text>
          <TextArea
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder={t('Enter your announcement message...')}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/(main)/classroom')({
  component: Classroom,
})
