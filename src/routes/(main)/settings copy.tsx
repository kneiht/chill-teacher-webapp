import { createFileRoute } from '@tanstack/react-router'

import {
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
} from 'antd'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import type React from 'react'
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface UserRole {
  key: string
  name: string
  permissions: Array<string>
  userCount: number
  status: 'active' | 'inactive'
}

const Settings: React.FC = () => {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [userForm] = Form.useForm()
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { t } = useLang()

  // Mock data for user roles
  const [userRoles, setUserRoles] = useState<Array<UserRole>>([
    {
      key: '1',
      name: 'Administrator',
      permissions: ['all'],
      userCount: 2,
      status: 'active',
    },
    {
      key: '2',
      name: 'Teacher',
      permissions: ['view_students', 'manage_attendance', 'view_reports'],
      userCount: 15,
      status: 'active',
    },
    {
      key: '3',
      name: 'Student',
      permissions: ['view_profile', 'view_grades'],
      userCount: 1245,
      status: 'active',
    },
    {
      key: '4',
      name: 'Parent',
      permissions: [
        'view_child_profile',
        'view_child_grades',
        'view_attendance',
      ],
      userCount: 890,
      status: 'active',
    },
  ])

  const mockUsers = [
    {
      key: '1',
      name: 'Admin',
      email: 'admin@school.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2024-01-26 09:30',
    },
    {
      key: '2',
      name: 'Cô Sarah Wilson',
      email: 'sarah.wilson@school.com',
      role: 'Teacher',
      status: 'active',
      lastLogin: '2024-01-26 08:45',
    },
    {
      key: '3',
      name: 'An An',
      email: 'alice.johnson@email.com',
      role: 'Student',
      status: 'active',
      lastLogin: '2024-01-25 16:20',
    },
  ]

  const handleSaveSettings = (values: any) => {
    console.log('Settings saved:', values)
    message.success(t('Settings saved successfully'))
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    userForm.resetFields()
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    userForm.setFieldsValue(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: t('Are you sure you want to delete this user?'),
      content: t('This action cannot be undone.'),
      okText: t('Yes, Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: () => {
        message.success(t('User deleted successfully'))
      },
    })
  }

  const handleUserModalOk = () => {
    userForm.validateFields().then((values) => {
      if (selectedUser) {
        message.success(t('User updated successfully'))
      } else {
        message.success(t('User added successfully'))
      }
      setIsUserModalOpen(false)
      userForm.resetFields()
    })
  }

  const userColumns: ColumnsType<any> = [
    {
      title: t('User'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">{record.email}</Text>
        </div>
      ),
    },
    {
      title: t('Role'),
      dataIndex: 'role',
      key: 'role',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'active' ? 'green' : 'red'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('Last Login'),
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.key)}
          />
        </Space>
      ),
    },
  ]

  const roleColumns: ColumnsType<UserRole> = [
    {
      title: t('Role Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Users'),
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'active' ? 'green' : 'red'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Settings')}</Title>
        <Text type="secondary">
          {t('Manage system configuration, user roles, and preferences')}
        </Text>
      </div>

      <Tabs defaultActiveKey="general">
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              {t('General')}
            </span>
          }
          key="general"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={t('School Information')}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSaveSettings}
                  initialValues={{
                    schoolName: 'Greenwood High School',
                    address: '123 Education Street, Learning City, LC 12345',
                    phone: '+1 (555) 123-4567',
                    email: 'info@greenwoodhigh.edu',
                    website: 'www.greenwoodhigh.edu',
                    principalName: 'Dr. Michael Johnson',
                    establishedYear: '1985',
                    studentCapacity: 1500,
                  }}
                >
                  <Form.Item
                    name="schoolName"
                    label={t('School Name')}
                    rules={[
                      {
                        required: true,
                        message: t('Please enter school name'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label={t('Address')}
                    rules={[
                      { required: true, message: t('Please enter address') },
                    ]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label={t('Phone')}
                        rules={[
                          { required: true, message: t('Please enter phone') },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label={t('Email')}
                        rules={[
                          { required: true, message: t('Please enter email') },
                          {
                            type: 'email',
                            message: t('Please enter valid email'),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="website" label={t('Website')}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="establishedYear"
                        label={t('Established Year')}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="principalName"
                        label={t('Principal Name')}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="studentCapacity"
                        label={t('Student Capacity')}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                    >
                      {t('Save Changes')}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title={t('School Logo')}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </div>
                <Upload
                  name="logo"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />} block>
                    {t('Upload New Logo')}
                  </Button>
                </Upload>
                <Text
                  type="secondary"
                  style={{
                    display: 'block',
                    marginTop: 8,
                    textAlign: 'center',
                  }}
                >
                  {t('Recommended size: 200x200px, Max size: 2MB')}
                </Text>
              </Card>

              <Card
                title={t('Academic Year Settings')}
                style={{ marginTop: 16 }}
              >
                <Form layout="vertical">
                  <Form.Item label={t('Current Academic Year')}>
                    <Select defaultValue="2023-2024">
                      <Option value="2023-2024">2023-2024</Option>
                      <Option value="2024-2025">2024-2025</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Semester System')}>
                    <Select defaultValue="2-semester">
                      <Option value="2-semester">{t('2 Semester')}</Option>
                      <Option value="3-trimester">{t('3 Trimester')}</Option>
                      <Option value="4-quarter">{t('4 Quarter')}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Grading System')}>
                    <Select defaultValue="letter">
                      <Option value="letter">{t('Letter Grades (A-F)')}</Option>
                      <Option value="percentage">
                        {t('Percentage (0-100)')}
                      </Option>
                      <Option value="gpa">{t('GPA (0-4.0)')}</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BellOutlined />
              {t('Notifications')}
            </span>
          }
          key="notifications"
        >
          <Card title={t('Notification Settings')}>
            <Form layout="vertical">
              <Title level={4}>{t('Email Notifications')}</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label={t('Student Attendance Alerts')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Grade Updates')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Assignment Due Dates')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Fee Payment Reminders')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Event Announcements')}>
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('System Maintenance')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>{t('SMS Notifications')}</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label={t('Emergency Alerts')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Absence Notifications')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Event Reminders')}>
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('Fee Due Alerts')}>
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Button type="primary" icon={<SaveOutlined />}>
                {t('Save Notification Settings')}
              </Button>
            </Form>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SecurityScanOutlined />
              {t('Security')}
            </span>
          }
          key="security"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={t('Password Policy')}>
                <Form layout="vertical">
                  <Form.Item label={t('Minimum Password Length')}>
                    <Select defaultValue="8">
                      <Option value="6">{t('6 characters')}</Option>
                      <Option value="8">{t('8 characters')}</Option>
                      <Option value="10">{t('10 characters')}</Option>
                      <Option value="12">{t('12 characters')}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Password Requirements')}>
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Switch defaultChecked />{' '}
                        {t('Require uppercase letters')}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Switch defaultChecked />{' '}
                        {t('Require lowercase letters')}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Switch defaultChecked /> {t('Require numbers')}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Switch /> {t('Require special characters')}
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item label={t('Password Expiry')}>
                    <Select defaultValue="90">
                      <Option value="30">{t('30 days')}</Option>
                      <Option value="60">{t('60 days')}</Option>
                      <Option value="90">{t('90 days')}</Option>
                      <Option value="never">{t('Never')}</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title={t('Login Security')}>
                <Form layout="vertical">
                  <Form.Item label={t('Session Timeout')}>
                    <Select defaultValue="30">
                      <Option value="15">{t('15 minutes')}</Option>
                      <Option value="30">{t('30 minutes')}</Option>
                      <Option value="60">{t('1 hour')}</Option>
                      <Option value="120">{t('2 hours')}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Failed Login Attempts')}>
                    <Select defaultValue="5">
                      <Option value="3">{t('3 attempts')}</Option>
                      <Option value="5">{t('5 attempts')}</Option>
                      <Option value="10">{t('10 attempts')}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Account Lockout Duration')}>
                    <Select defaultValue="15">
                      <Option value="5">{t('5 minutes')}</Option>
                      <Option value="15">{t('15 minutes')}</Option>
                      <Option value="30">{t('30 minutes')}</Option>
                      <Option value="60">{t('1 hour')}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label={t('Two-Factor Authentication')}>
                    <Switch /> {t('Enable 2FA for all users')}
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <Card title={t('Data Backup')} style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form layout="vertical">
                  <Form.Item label={t('Automatic Backup')}>
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item label={t('Backup Frequency')}>
                    <Select defaultValue="daily">
                      <Option value="hourly">{t('Hourly')}</Option>
                      <Option value="daily">{t('Daily')}</Option>
                      <Option value="weekly">{t('Weekly')}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label={t('Backup Retention')}>
                    <Select defaultValue="30">
                      <Option value="7">{t('7 days')}</Option>
                      <Option value="30">{t('30 days')}</Option>
                      <Option value="90">{t('90 days')}</Option>
                      <Option value="365">{t('1 year')}</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    background: '#f5f5f5',
                    borderRadius: 8,
                  }}
                >
                  <Text strong>{t('Last Backup:')}</Text>
                  <br />
                  <Text>January 26, 2024 at 2:00 AM</Text>
                  <br />
                  <Text strong>{t('Status:')}</Text>
                  <br />
                  <Tag color="green">{t('Successful')}</Tag>
                  <br />
                  <Button type="primary" style={{ marginTop: 16 }}>
                    {t('Create Backup Now')}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              {t('User Management')}
            </span>
          }
          key="users"
        >
          <Card
            title={t('User Accounts')}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddUser}
              >
                {t('Add User')}
              </Button>
            }
          >
            <Table
              columns={userColumns}
              dataSource={mockUsers}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>

          <Card title={t('User Roles')} style={{ marginTop: 16 }}>
            <Table
              columns={roleColumns}
              dataSource={userRoles}
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add/Edit User Modal */}
      <Modal
        title={selectedUser ? t('Edit User') : t('Add New User')}
        open={isUserModalOpen}
        onOk={handleUserModalOk}
        onCancel={() => setIsUserModalOpen(false)}
        width={600}
      >
        <Form form={userForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('Full Name')}
                rules={[{ required: true, message: t('Please enter name') }]}
              >
                <Input />
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
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label={t('Role')}
                rules={[{ required: true, message: t('Please select role') }]}
              >
                <Select>
                  <Option value="Administrator">{t('Administrator')}</Option>
                  <Option value="Teacher">{t('Teacher')}</Option>
                  <Option value="Student">{t('Student')}</Option>
                  <Option value="Parent">{t('Parent')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t('Status')}
                rules={[{ required: true, message: t('Please select status') }]}
              >
                <Select>
                  <Option value="active">{t('Active')}</Option>
                  <Option value="inactive">{t('Inactive')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!selectedUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={t('Password')}
                  rules={[
                    { required: true, message: t('Please enter password') },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label={t('Confirm Password')}
                  rules={[
                    {
                      required: true,
                      message: t('Please confirm your password'),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error(t('Passwords do not match')),
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/(main)/settings copy')({
  component: Settings,
})
