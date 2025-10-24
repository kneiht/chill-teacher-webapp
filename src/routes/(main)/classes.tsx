import { createFileRoute } from '@tanstack/react-router'

import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Transfer,
  Typography,
} from 'antd'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import type React from 'react'
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const { Option } = Select

interface ClassData {
  key: string
  id: string
  name: string
  grade: string
  section: string
  subject: string
  teacher: {
    id: string
    name: string
    avatar: string
  }
  students: Array<{
    id: string
    name: string
    avatar: string
  }>
  capacity: number
  schedule: Array<{
    day: string
    time: string
    room: string
  }>
  status: 'active' | 'inactive' | 'completed'
}

const Classes: React.FC = () => {
  const { t } = useLang()
  const { message } = AntApp.useApp()
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Mock data
  const [classes, setClasses] = useState<Array<ClassData>>([
    {
      key: '1',
      id: 'CLS001',
      name: 'Toán 10A',
      grade: '10',
      section: 'A',
      subject: 'Toán',
      teacher: {
        id: 'TEA001',
        name: 'Cô Nguyễn Thị Mai',
        avatar:
          'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      },
      students: [
        {
          id: 'STU001',
          name: 'Nguyễn Văn An',
          avatar:
            'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
        {
          id: 'STU002',
          name: 'Trần Thị Bình',
          avatar:
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
        {
          id: 'STU003',
          name: 'Lê Quốc Cường',
          avatar:
            'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
      ],
      capacity: 30,
      schedule: [
        { day: t('Monday'), time: '9:00-10:00', room: 'Phòng 101' },
        { day: t('Wednesday'), time: '9:00-10:00', room: 'Phòng 101' },
        { day: t('Friday'), time: '9:00-10:00', room: 'Phòng 101' },
      ],
      status: 'active',
    },
    {
      key: '2',
      id: 'CLS002',
      name: 'Vật Lý 10B',
      grade: '10',
      section: 'B',
      subject: 'Vật Lý',
      teacher: {
        id: 'TEA002',
        name: 'Thầy John Davis',
        avatar:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      },
      students: [
        {
          id: 'STU004',
          name: 'David Wilson',
          avatar:
            'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
        {
          id: 'STU005',
          name: 'Emma Brown',
          avatar:
            'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
      ],
      capacity: 25,
      schedule: [
        { day: t('Tuesday'), time: '10:00-11:00', room: 'Lab 201' },
        { day: t('Thursday'), time: '10:00-11:00', room: 'Lab 201' },
      ],
      status: 'active',
    },
    {
      key: '3',
      id: 'CLS003',
      name: 'Văn học 11-A',
      grade: '11',
      section: 'A',
      subject: 'Văn học',
      teacher: {
        id: 'TEA003',
        name: 'Cô Emma Thompson',
        avatar:
          'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      },
      students: [],
      capacity: 20,
      schedule: [
        { day: t('Monday'), time: '2:00-3:00', room: 'Phòng 301' },
        { day: t('Wednesday'), time: '2:00-3:00', room: 'Phòng 301' },
      ],
      status: 'inactive',
    },
  ])

  // Mock available students and teachers for assignment
  const mockStudents = [
    { key: 'STU001', title: 'An An (STU001)' },
    { key: 'STU002', title: 'Bình An (STU002)' },
    { key: 'STU003', title: 'Chiêu Dương (STU003)' },
    { key: 'STU004', title: 'David Wilson (STU004)' },
    { key: 'STU005', title: 'Emma Brown (STU005)' },
    { key: 'STU006', title: 'Frank Miller (STU006)' },
    { key: 'STU007', title: 'Grace Lee (STU007)' },
    { key: 'STU008', title: 'Henry Taylor (STU008)' },
  ]

  const mockTeachers = [
    { value: 'TEA001', label: 'Cô Sarah Wilson - Toán' },
    { value: 'TEA002', label: 'Thầy John Davis - Khoa học' },
    { value: 'TEA003', label: 'Cô Emma Thompson - Tiếng Anh' },
    { value: 'TEA004', label: 'Thầy Michael Brown - Lịch sử' },
    { value: 'TEA005', label: 'Cô Lisa Anderson - Sinh học' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'orange'
      case 'completed':
        return 'blue'
      default:
        return 'default'
    }
  }

  const handleAddClass = () => {
    setSelectedClass(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditClass = (classData: ClassData) => {
    setSelectedClass(classData)
    form.setFieldsValue({
      ...classData,
      teacherId: classData.teacher.id,
    })
    setIsModalOpen(true)
  }

  const handleViewClass = (classData: ClassData) => {
    setSelectedClass(classData)
    setIsDrawerOpen(true)
  }

  const handleAssignStudents = (classData: ClassData) => {
    setSelectedClass(classData)
    setIsAssignModalOpen(true)
  }

  const handleDeleteClass = (classId: string) => {
    Modal.confirm({
      title: t('Are you sure you want to delete this class?'),
      content: t('This action cannot be undone.'),
      okText: t('Yes, Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: () => {
        setClasses(classes.filter((c) => c.id !== classId))
        message.success(t('Class deleted successfully'))
      },
    })
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const selectedTeacher = mockTeachers.find(
        (t) => t.value === values.teacherId,
      )
      const classData = {
        ...values,
        teacher: {
          id: values.teacherId,
          name: selectedTeacher?.label.split(' - ')[0] || 'Unknown Teacher',
          avatar:
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        },
        schedule: [],
      }

      if (selectedClass) {
        // Update existing class
        setClasses(
          classes.map((c) =>
            c.id === selectedClass.id ? { ...c, ...classData } : c,
          ),
        )
        message.success(t('Class updated successfully'))
      } else {
        // Add new class
        const newClass: ClassData = {
          key: Date.now().toString(),
          id: `CLS${String(classes.length + 1).padStart(3, '0')}`,
          name: `${values.subject} ${values.grade}-${values.section}`,
          students: [],
          schedule: [
            { day: t('Monday'), time: '9:00-10:00', room: t('TBD') },
            { day: t('Wednesday'), time: '9:00-10:00', room: t('TBD') },
            { day: t('Friday'), time: '9:00-10:00', room: t('TBD') },
          ],
          ...classData,
        }
        setClasses([...classes, newClass])
        message.success(t('Class added successfully'))
      }

      setIsModalOpen(false)
      form.resetFields()
    })
  }

  const handleStudentAssignment = (targetKeys: Array<string>) => {
    if (selectedClass) {
      const assignedStudents = targetKeys.map((key) => {
        const student = mockStudents.find((s) => s.key === key)
        return {
          id: key,
          name: student?.title.split(' (')[0] || 'Unknown',
          avatar:
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        }
      })

      setClasses(
        classes.map((c) =>
          c.id === selectedClass.id ? { ...c, students: assignedStudents } : c,
        ),
      )

      setIsAssignModalOpen(false)
      message.success(t('Students assigned successfully'))
    }
  }

  const filteredClasses = classes.filter((classData) => {
    const matchesSearch =
      classData.name.toLowerCase().includes(searchText.toLowerCase()) ||
      classData.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      classData.teacher.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesGrade = !selectedGrade || classData.grade === selectedGrade
    const matchesStatus = !selectedStatus || classData.status === selectedStatus

    return matchesSearch && matchesGrade && matchesStatus
  })

  const columns: ColumnsType<ClassData> = [
    {
      title: t('Class'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">{record.id}</Text>
        </div>
      ),
    },
    {
      title: t('Grade & Section'),
      dataIndex: 'grade',
      key: 'grade',
      render: (_, record) => (
        <div>
          <Tag color="blue">
            {t('Grade')} {record.grade}
          </Tag>
          <br />
          <Tag color="green">
            {t('Section')} {record.section}
          </Tag>
        </div>
      ),
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: t('Teacher'),
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => (
        <Space>
          <Avatar src={teacher.avatar} icon={<UserOutlined />} size="small" />
          <Text>{teacher.name}</Text>
        </Space>
      ),
    },
    {
      title: t('Students'),
      dataIndex: 'students',
      key: 'students',
      render: (students, record) => (
        <div>
          <Text strong>
            {students.length}/{record.capacity}
          </Text>
          <br />
          <Progress
            percent={Math.round((students.length / record.capacity) * 100)}
            size="small"
            showInfo={false}
            strokeColor={
              students.length >= record.capacity ? '#ff4d4f' : '#52c41a'
            }
          />
        </div>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={getStatusColor(text)}>{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewClass(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClass(record)}
          />
          <Button
            type="text"
            icon={<UsergroupAddOutlined />}
            onClick={() => handleAssignStudents(record)}
            style={{ color: '#1890ff' }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClass(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Classes')}</Title>
        <Text type="secondary">
          {t('Manage class schedules, assign students and teachers')}
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Total Classes')}
              value={classes.length}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Active Classes')}
              value={classes.filter((c) => c.status === 'active').length}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Total Enrolled')}
              value={classes.reduce((sum, c) => sum + c.students.length, 0)}
              prefix={<TeamOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters and Search */}
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Input
            placeholder={t('Search classes...')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder={t('Filter by grade')}
            allowClear
            value={selectedGrade}
            onChange={setSelectedGrade}
            style={{ width: 120 }}
          >
            <Option value="10">{t('Grade 10')}</Option>
            <Option value="11">{t('Grade 11')}</Option>
            <Option value="12">{t('Grade 12')}</Option>
          </Select>
          <Select
            placeholder={t('Filter by status')}
            allowClear
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
          >
            <Option value="active">{t('Active')}</Option>
            <Option value="inactive">{t('Inactive')}</Option>
            <Option value="completed">{t('Completed')}</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClass}
          >
            {t('Add Class')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredClasses}
          pagination={{
            total: filteredClasses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('classes')}`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Class Modal */}
      <Modal
        title={selectedClass ? t('Edit Class') : t('Add New Class')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            capacity: 30,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subject"
                label={t('Subject')}
                rules={[{ required: true, message: t('Please enter subject') }]}
              >
                <Input placeholder={t('Enter subject name')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacherId"
                label={t('Teacher')}
                rules={[
                  { required: true, message: t('Please select teacher') },
                ]}
              >
                <Select placeholder={t('Select teacher')}>
                  {mockTeachers.map((teacher) => (
                    <Option key={teacher.value} value={teacher.value}>
                      {teacher.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="grade"
                label={t('Grade')}
                rules={[{ required: true, message: t('Please select grade') }]}
              >
                <Select placeholder={t('Select grade')}>
                  <Option value="10">{t('Grade 10')}</Option>
                  <Option value="11">{t('Grade 11')}</Option>
                  <Option value="12">{t('Grade 12')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="section"
                label={t('Section')}
                rules={[{ required: true, message: t('Please enter section') }]}
              >
                <Input placeholder={t('e.g., A, B, C')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="capacity"
                label={t('Capacity')}
                rules={[
                  { required: true, message: t('Please enter capacity') },
                ]}
              >
                <Input type="number" placeholder={t('Max students')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label={t('Status')}
            rules={[{ required: true, message: t('Please select status') }]}
          >
            <Select>
              <Option value="active">{t('Active')}</Option>
              <Option value="inactive">{t('Inactive')}</Option>
              <Option value="completed">{t('Completed')}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Student Assignment Modal */}
      <Modal
        title={t('Assign Students to Class')}
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedClass && (
          <Transfer
            dataSource={mockStudents}
            targetKeys={selectedClass.students.map((s) => s.id)}
            // TODO: fix this bug
            // onChange={handleStudentAssignment}
            render={(item) => item.title}
            titles={[t('Available Students'), t('Assigned Students')]}
            listStyle={{
              width: 300,
              height: 400,
            }}
          />
        )}
      </Modal>

      {/* Class Details Drawer */}
      <Drawer
        title={t('Class Details')}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={600}
      >
        {selectedClass && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{selectedClass.name}</Title>
              <Text type="secondary">{selectedClass.id}</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title={t('Enrolled')}
                    value={selectedClass.students.length}
                    suffix={`/ ${selectedClass.capacity}`}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic title={t('Grade')} value={selectedClass.grade} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div>
                    <Text type="secondary">{t('Status')}</Text>
                    <br />
                    <Tag color={getStatusColor(selectedClass.status)}>
                      {selectedClass.status.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>{t('Teacher')}</Title>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={selectedClass.teacher.avatar} />}
                  title={selectedClass.teacher.name}
                  description={selectedClass.subject}
                />
              </List.Item>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>{t('Schedule')}</Title>
              <List
                size="small"
                dataSource={selectedClass.schedule}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <Tag color="blue">{item.day}</Tag>
                      <Text>{item.time}</Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">{item.room}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>

            <div>
              <Title level={5}>
                {t('Students')} ({selectedClass.students.length})
              </Title>
              <List
                dataSource={selectedClass.students}
                renderItem={(student) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={student.avatar} icon={<UserOutlined />} />
                      }
                      title={student.name}
                      description={student.id}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export const Route = createFileRoute('/(main)/classes')({ component: Classes })
