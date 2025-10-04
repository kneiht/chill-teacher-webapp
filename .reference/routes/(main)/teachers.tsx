import { createFileRoute } from '@tanstack/react-router'
import {
  BookOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import type React from 'react'
import { useLang } from '@/hooks/use-lang'

const { Title, Text } = Typography
const { Option } = Select

interface Teacher {
  key: string
  id: string
  name: string
  email: string
  phone: string
  department: string
  subjects: Array<string>
  status: 'active' | 'inactive' | 'on-leave'
  joiningDate: string
  avatar: string
  address: string
  qualification: string
  experience: number
  salary: number
  classes: Array<string>
  schedule: Array<{ day: string; time: string; subject: string; class: string }>
}

const Teachers: React.FC = () => {
  const { message } = AntApp.useApp()
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const { t } = useLang()

  // Mock data
  const [teachers, setTeachers] = useState<Array<Teacher>>([
    {
      key: '1',
      id: 'TEA001',
      name: 'Cô Sarah Wilson',
      email: 'sarah.wilson@school.com',
      phone: '+1 234-567-8901',
      department: 'Toán',
      subjects: ['Đại số', 'Giải tích', 'Thống kê'],
      status: 'active',
      joiningDate: '2020-08-15',
      avatar:
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      address: '123 Teacher Lane, City, State 12345',
      qualification: 'Tiến sĩ Toán học',
      experience: 8,
      salary: 65000,
      classes: ['10-A', '11-A', '12-A'],
      schedule: [
        {
          day: t('Monday'),
          time: '9:00-10:00',
          subject: 'Đại số',
          class: '10-A',
        },
        {
          day: t('Monday'),
          time: '10:00-11:00',
          subject: 'Giải tích',
          class: '11-A',
        },
        {
          day: t('Tuesday'),
          time: '9:00-10:00',
          subject: 'Thống kê',
          class: '12-A',
        },
        {
          day: t('Wednesday'),
          time: '9:00-10:00',
          subject: 'Đại số',
          class: '10-A',
        },
        {
          day: t('Thursday'),
          time: '10:00-11:00',
          subject: 'Giải tích',
          class: '11-A',
        },
        {
          day: t('Friday'),
          time: '9:00-10:00',
          subject: 'Thống kê',
          class: '12-A',
        },
      ],
    },
    {
      key: '2',
      id: 'TEA002',
      name: 'Thầy John Davis',
      email: 'john.davis@school.com',
      phone: '+1 234-567-8902',
      department: 'Khoa học',
      subjects: ['Lý', 'Hóa'],
      status: 'active',
      joiningDate: '2019-09-01',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      address: '456 Science St, City, State 12345',
      qualification: 'Thạc sĩ Vật lý',
      experience: 10,
      salary: 62000,
      classes: ['10-B', '11-B'],
      schedule: [
        {
          day: t('Monday'),
          time: '11:00-12:00',
          subject: 'Lý',
          class: '10-B',
        },
        {
          day: t('Tuesday'),
          time: '10:00-11:00',
          subject: 'Hóa',
          class: '11-B',
        },
        {
          day: t('Wednesday'),
          time: '11:00-12:00',
          subject: 'Lý',
          class: '10-B',
        },
        {
          day: t('Thursday'),
          time: '10:00-11:00',
          subject: 'Hóa',
          class: '11-B',
        },
        {
          day: t('Friday'),
          time: '11:00-12:00',
          subject: 'Lý',
          class: '10-B',
        },
      ],
    },
    {
      key: '3',
      id: 'TEA003',
      name: 'Cô Emma Thompson',
      email: 'emma.thompson@school.com',
      phone: '+1 234-567-8903',
      department: 'Tiếng Anh',
      subjects: ['Văn', 'Ngữ pháp'],
      status: 'on-leave',
      joiningDate: '2021-01-10',
      avatar:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      address: '789 Literature Ave, City, State 12345',
      qualification: 'Thạc sĩ Văn học Anh',
      experience: 5,
      salary: 55000,
      classes: ['10-A', '10-B'],
      schedule: [
        {
          day: t('Monday'),
          time: '2:00-3:00',
          subject: 'Văn',
          class: '10-A',
        },
        {
          day: t('Tuesday'),
          time: '2:00-3:00',
          subject: 'Ngữ pháp',
          class: '10-B',
        },
        {
          day: t('Wednesday'),
          time: '2:00-3:00',
          subject: 'Văn',
          class: '10-A',
        },
        {
          day: t('Thursday'),
          time: '2:00-3:00',
          subject: 'Ngữ pháp',
          class: '10-B',
        },
      ],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'on-leave':
        return 'orange'
      default:
        return 'default'
    }
  }

  const handleAddTeacher = () => {
    setSelectedTeacher(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    form.setFieldsValue({
      ...teacher,
      joiningDate: dayjs(teacher.joiningDate),
    })
    setIsModalOpen(true)
  }

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsDrawerOpen(true)
  }

  const handleDeleteTeacher = (teacherId: string) => {
    Modal.confirm({
      title: t('Are you sure you want to delete this teacher?'),
      content: t('This action cannot be undone.'),
      okText: t('Yes, Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: () => {
        setTeachers(teachers.filter((t) => t.id !== teacherId))
        message.success(t('Teacher deleted successfully'))
      },
    })
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const teacherData = {
        ...values,
        joiningDate: values.joiningDate.format('YYYY-MM-DD'),
        avatar:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
        schedule: [], // Will be populated separately
      }

      if (selectedTeacher) {
        // Update existing teacher
        setTeachers(
          teachers.map((t) =>
            t.id === selectedTeacher.id ? { ...t, ...teacherData } : t,
          ),
        )
        message.success(t('Teacher updated successfully'))
      } else {
        // Add new teacher
        const newTeacher: Teacher = {
          key: Date.now().toString(),
          id: `TEA${String(teachers.length + 1).padStart(3, '0')}`,
          ...teacherData,
        }
        setTeachers([...teachers, newTeacher])
        message.success(t('Teacher added successfully'))
      }

      setIsModalOpen(false)
      form.resetFields()
    })
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchText.toLowerCase())
    const matchesDepartment =
      !selectedDepartment || teacher.department === selectedDepartment
    const matchesStatus = !selectedStatus || teacher.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const columns: ColumnsType<Teacher> = [
    {
      title: t('Teacher'),
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
      title: t('Contact'),
      dataIndex: 'contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text>{record.email}</Text>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            <Text>{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: t('Department'),
      dataIndex: 'department',
      key: 'department',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('Subjects'),
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: Array<string>) => (
        <div>
          {subjects.map((subject, index) => (
            <Tag key={index} color="green" style={{ marginBottom: 4 }}>
              {subject}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: t('Experience'),
      dataIndex: 'experience',
      key: 'experience',
      render: (years) => <Text>{`${years} ${t('years')}`}</Text>,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={getStatusColor(text)}>{t(text.toUpperCase())}</Tag>
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
            onClick={() => handleViewTeacher(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTeacher(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTeacher(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Teachers')}</Title>
        <Text type="secondary">{t('Manage teachers')}</Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Total Teachers')}
              value={teachers.length}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Active Teachers')}
              value={teachers.filter((t) => t.status === 'active').length}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Avg. Experience')}
              value={Math.round(
                teachers.reduce((sum, t) => sum + t.experience, 0) /
                  teachers.length,
              )}
              suffix={t('years')}
              prefix={<BookOutlined style={{ color: '#faad14' }} />}
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
            placeholder={t('Search teachers...')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder={t('Filter by department')}
            allowClear
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            style={{ width: 180 }}
          >
            <Option value="Mathematics">Mathematics</Option>
            <Option value="Science">Science</Option>
            <Option value="English">English</Option>
            <Option value="History">History</Option>
            <Option value="Physical Education">Physical Education</Option>
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
            <Option value="on-leave">{t('On Leave')}</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTeacher}
          >
            {t('Add Teacher')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredTeachers}
          pagination={{
            total: filteredTeachers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('teachers')}`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Teacher Modal */}
      <Modal
        title={selectedTeacher ? t('Edit Teacher') : t('Add New Teacher')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            experience: 0,
            salary: 50000,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('Full Name')}
                rules={[
                  { required: true, message: t('Please enter teacher name') },
                ]}
              >
                <Input placeholder={t('Enter full name')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={t('Email')}
                rules={[
                  { required: true, message: t('Please enter email') },
                  { type: 'email', message: t('Please enter valid email') },
                ]}
              >
                <Input placeholder={t('Enter email address')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={t('Phone')}
                rules={[
                  { required: true, message: t('Please enter phone number') },
                ]}
              >
                <Input placeholder={t('Enter phone number')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label={t('Department')}
                rules={[
                  { required: true, message: t('Please select department') },
                ]}
              >
                <Select placeholder={t('Select department')}>
                  <Option value="Mathematics">Mathematics</Option>
                  <Option value="Science">Science</Option>
                  <Option value="English">English</Option>
                  <Option value="History">History</Option>
                  <Option value="Physical Education">Physical Education</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subjects"
                label={t('Subjects')}
                rules={[
                  { required: true, message: t('Please select subjects') },
                ]}
              >
                <Select mode="multiple" placeholder={t('Select subjects')}>
                  <Option value="Algebra">Algebra</Option>
                  <Option value="Calculus">Calculus</Option>
                  <Option value="Statistics">Statistics</Option>
                  <Option value="Physics">Physics</Option>
                  <Option value="Chemistry">Chemistry</Option>
                  <Option value="Biology">Biology</Option>
                  <Option value="Literature">Literature</Option>
                  <Option value="Grammar">Grammar</Option>
                  <Option value="History">History</Option>
                  <Option value="Geography">Geography</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="classes"
                label={t('Classes')}
                rules={[
                  { required: true, message: t('Please select classes') },
                ]}
              >
                <Select mode="multiple" placeholder={t('Select classes')}>
                  <Option value="10-A">10-A</Option>
                  <Option value="10-B">10-B</Option>
                  <Option value="11-A">11-A</Option>
                  <Option value="11-B">11-B</Option>
                  <Option value="12-A">12-A</Option>
                  <Option value="12-B">12-B</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="experience"
                label={t('Experience (years)')}
                rules={[
                  { required: true, message: t('Please enter experience') },
                ]}
              >
                <Input type="number" placeholder={t('Years')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="salary"
                label={t('Salary')}
                rules={[{ required: true, message: t('Please enter salary') }]}
              >
                <Input type="number" prefix="$" placeholder={t('Amount')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label={t('Status')}
                rules={[{ required: true, message: t('Please select status') }]}
              >
                <Select>
                  <Option value="active">{t('Active')}</Option>
                  <Option value="inactive">{t('Inactive')}</Option>
                  <Option value="on-leave">{t('On Leave')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="joiningDate"
                label={t('Joining Date')}
                rules={[
                  { required: true, message: t('Please select joining date') },
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="qualification"
                label={t('Qualification')}
                rules={[
                  { required: true, message: t('Please enter qualification') },
                ]}
              >
                <Input placeholder={t('e.g., M.Sc. in Physics')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label={t('Address')}
            rules={[{ required: true, message: t('Please enter address') }]}
          >
            <Input.TextArea rows={2} placeholder={t('Enter full address')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Teacher Details Drawer */}
      <Drawer
        title={t('Teacher Details')}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={600}
      >
        {selectedTeacher && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                src={selectedTeacher.avatar}
                size={80}
                icon={<UserOutlined />}
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                {selectedTeacher.name}
              </Title>
              <Text type="secondary">{selectedTeacher.id}</Text>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label={t('Email')}>
                {selectedTeacher.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('Phone')}>
                {selectedTeacher.phone}
              </Descriptions.Item>
              <Descriptions.Item label={t('Department')}>
                <Tag color="blue">{selectedTeacher.department}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('Subjects')}>
                {selectedTeacher.subjects.map((subject, index) => (
                  <Tag key={index} color="green" style={{ marginRight: 4 }}>
                    {subject}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label={t('Classes')}>
                {selectedTeacher.classes.map((cls, index) => (
                  <Tag key={index} color="blue" style={{ marginRight: 4 }}>
                    {cls}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label={t('Status')}>
                <Tag color={getStatusColor(selectedTeacher.status)}>
                  {selectedTeacher.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('Experience')}>
                {selectedTeacher.experience} {t('years')}
              </Descriptions.Item>
              <Descriptions.Item label={t('Qualification')}>
                {selectedTeacher.qualification}
              </Descriptions.Item>
              <Descriptions.Item label={t('Salary')}>
                ${selectedTeacher.salary.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('Joining Date')}>
                {dayjs(selectedTeacher.joiningDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label={t('Address')}>
                {selectedTeacher.address}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                {t('Weekly Schedule')}
              </Title>
              <List
                dataSource={selectedTeacher.schedule}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.day}</Text>
                          <Text type="secondary">{item.time}</Text>
                        </Space>
                      }
                      description={
                        <Space>
                          <Tag color="green">{item.subject}</Tag>
                          <Tag color="blue">{item.class}</Tag>
                        </Space>
                      }
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

export const Route = createFileRoute('/(main)/teachers')({
  component: Teachers,
})
