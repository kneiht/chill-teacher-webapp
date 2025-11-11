import React, { useState, useEffect } from 'react'
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Table,
  Select,
  message,
  Card,
  Typography,
  Row,
  Col,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  DragOutlined,
} from '@ant-design/icons'
import type { Lesson } from '@/lib/utils/lesson-helpers'

const { TextArea } = Input

interface LessonEditModalProps {
  lesson: Lesson
  visible: boolean
  onClose: () => void
}

interface VocabItem {
  word: string
  phonics: string
  image?: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
  partOfSpeech?: string
  wordPronunciation?: string
  sentencePronunciation?: string
}

interface MenuItem {
  type: 'activity' | 'page' | 'video' | 'googleSlide' | 'embedPage'
  id: string
}

interface ExternalContentItem {
  id: string
  url: string
  title?: string
}

interface LessonData {
  background: string
  title: string
  description: string
  vocab: VocabItem[]
  menu: MenuItem[]
  externalContent?: {
    videos?: ExternalContentItem[]
    googleSlides?: ExternalContentItem[]
    embedPages?: ExternalContentItem[]
  }
  pages?: any[]
  clozeData?: any
  questions?: any[]
  readingComprehensionData?: any
}

export const LessonEditModal: React.FC<LessonEditModalProps> = ({
  lesson,
  visible,
  onClose,
}) => {
  const [form] = Form.useForm()
  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Load lesson data when modal opens
  useEffect(() => {
    if (visible && lesson) {
      loadLessonData()
    }
  }, [visible, lesson])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      const data = await import(
        `@/mock-data/lessons/${lesson.course}/${lesson.unit}/${lesson.lesson}.json`
      )
      const lessonContent = data.default[lesson.lesson]
      setLessonData(lessonContent)
      form.setFieldsValue(lessonContent)
    } catch (error) {
      message.error('Failed to load lesson data')
      console.error('Error loading lesson data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Create the complete lesson JSON structure
      const completeLessonData = {
        [lesson.lesson]: {
          ...values,
        },
      }

      // Download as JSON file
      downloadJson(completeLessonData, `${lesson.lesson}.json`)
      message.success('Lesson JSON downloaded successfully!')
    })
  }

  const downloadJson = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const updateLessonData = (field: string, value: any) => {
    setLessonData((prev) => (prev ? { ...prev, [field]: value } : null))
    form.setFieldValue(field, value)
  }

  // Vocabulary editor columns
  const vocabColumns = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      editable: true,
    },
    {
      title: 'Phonics',
      dataIndex: 'phonics',
      key: 'phonics',
      editable: true,
    },
    {
      title: 'Vietnamese',
      dataIndex: 'vietnameseMeaning',
      key: 'vietnameseMeaning',
      editable: true,
    },
    {
      title: 'Sample Sentence',
      dataIndex: 'sampleSentence',
      key: 'sampleSentence',
      editable: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: VocabItem, index: number) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editVocabItem(index, record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteVocabItem(index)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const addVocabItem = () => {
    const newItem: VocabItem = {
      word: '',
      phonics: '',
      vietnameseMeaning: '',
      sampleSentence: '',
      vietnameseTranslation: '',
    }
    const updatedVocab = [...(lessonData?.vocab || []), newItem]
    updateLessonData('vocab', updatedVocab)
  }

  const editVocabItem = (index: number, item: VocabItem) => {
    // This would open a sub-modal for editing the item
    // For now, we'll use a simple prompt
    const updatedVocab = [...(lessonData?.vocab || [])]
    updatedVocab[index] = { ...item }
    updateLessonData('vocab', updatedVocab)
  }

  const deleteVocabItem = (index: number) => {
    const updatedVocab = lessonData?.vocab?.filter((_, i) => i !== index) || []
    updateLessonData('vocab', updatedVocab)
  }

  // Menu editor
  const addMenuItem = () => {
    const newItem: MenuItem = {
      type: 'activity',
      id: 'vocabulary',
    }
    const updatedMenu = [...(lessonData?.menu || []), newItem]
    updateLessonData('menu', updatedMenu)
  }

  const deleteMenuItem = (index: number) => {
    const updatedMenu = lessonData?.menu?.filter((_, i) => i !== index) || []
    updateLessonData('menu', updatedMenu)
  }

  const renderBasicInfo = () => (
    <Card title="Basic Information">
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Background Image URL"
        name="background"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Card>
  )

  const renderVocabulary = () => (
    <Card
      title="Vocabulary"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addVocabItem}>
          Add Vocabulary
        </Button>
      }
    >
      <Table
        dataSource={lessonData?.vocab || []}
        columns={vocabColumns}
        rowKey={(record, index) => index?.toString() || '0'}
        pagination={false}
        size="small"
      />
    </Card>
  )

  const renderMenu = () => (
    <Card
      title="Menu Order"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addMenuItem}>
          Add Menu Item
        </Button>
      }
    >
      {lessonData?.menu?.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <DragOutlined style={{ cursor: 'move' }} />
          <Select
            value={item.type}
            onChange={(value) => {
              const updatedMenu = [...(lessonData?.menu || [])]
              updatedMenu[index] = { ...item, type: value }
              updateLessonData('menu', updatedMenu)
            }}
            style={{ width: 150 }}
            options={[
              { value: 'activity', label: 'Activity' },
              { value: 'page', label: 'Page' },
              { value: 'video', label: 'Video' },
              { value: 'googleSlide', label: 'Google Slide' },
              { value: 'embedPage', label: 'Embed Page' },
            ]}
          />
          <Input
            value={item.id}
            onChange={(e) => {
              const updatedMenu = [...(lessonData?.menu || [])]
              updatedMenu[index] = { ...item, id: e.target.value }
              updateLessonData('menu', updatedMenu)
            }}
            placeholder="ID"
            style={{ flex: 1 }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteMenuItem(index)}
          />
        </div>
      ))}
    </Card>
  )

  const renderExternalContent = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Videos" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {lessonData?.externalContent?.videos?.map((video, index) => (
              <div key={index}>
                <Input
                  placeholder="Video ID"
                  value={video.id}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.videos![index].id = e.target.value
                    setLessonData(updated)
                  }}
                  style={{ marginBottom: 4 }}
                />
                <Input
                  placeholder="YouTube URL"
                  value={video.url}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.videos![index].url = e.target.value
                    setLessonData(updated)
                  }}
                />
              </div>
            ))}
          </Space>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Google Slides" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {lessonData?.externalContent?.googleSlides?.map((slide, index) => (
              <div key={index}>
                <Input
                  placeholder="Slide ID"
                  value={slide.id}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.googleSlides![index].id =
                      e.target.value
                    setLessonData(updated)
                  }}
                  style={{ marginBottom: 4 }}
                />
                <Input
                  placeholder="Google Slides URL"
                  value={slide.url}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.googleSlides![index].url =
                      e.target.value
                    setLessonData(updated)
                  }}
                />
              </div>
            ))}
          </Space>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Embed Pages" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {lessonData?.externalContent?.embedPages?.map((embed, index) => (
              <div key={index}>
                <Input
                  placeholder="Embed ID"
                  value={embed.id}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.embedPages![index].id =
                      e.target.value
                    setLessonData(updated)
                  }}
                  style={{ marginBottom: 4 }}
                />
                <Input
                  placeholder="Embed URL"
                  value={embed.url}
                  onChange={(e) => {
                    const updated = { ...lessonData }
                    updated.externalContent!.embedPages![index].url =
                      e.target.value
                    setLessonData(updated)
                  }}
                />
              </div>
            ))}
          </Space>
        </Card>
      </Col>
    </Row>
  )

  const renderPages = () => (
    <Card
      title="Pages"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            const newPage = {
              id: `page-${Date.now()}`,
              title: 'New Page',
              root: [
                {
                  tag: 'p',
                  attributes: { class: 'text-lg' },
                  children: [{ text: 'New page content' }],
                },
              ],
              containerClassName: 'bg-white bg-opacity-90 rounded-xl p-6',
            }
            const updatedPages = [...(lessonData?.pages || []), newPage]
            updateLessonData('pages', updatedPages)
          }}
        >
          Add Page
        </Button>
      }
    >
      {lessonData?.pages?.map((page, index) => (
        <Card key={index} size="small" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Page ID"
            value={page.id}
            onChange={(e) => {
              const updatedPages = [...(lessonData?.pages || [])]
              updatedPages[index] = { ...page, id: e.target.value }
              updateLessonData('pages', updatedPages)
            }}
            style={{ marginBottom: 8 }}
          />
          <Input
            placeholder="Page Title"
            value={page.title}
            onChange={(e) => {
              const updatedPages = [...(lessonData?.pages || [])]
              updatedPages[index] = { ...page, title: e.target.value }
              updateLessonData('pages', updatedPages)
            }}
            style={{ marginBottom: 8 }}
          />
          <TextArea
            placeholder="Page Content (JSON)"
            value={JSON.stringify(page.root || [], null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                const updatedPages = [...(lessonData?.pages || [])]
                updatedPages[index] = { ...page, root: parsed }
                updateLessonData('pages', updatedPages)
              } catch (error) {
                // Invalid JSON
              }
            }}
            rows={8}
            style={{ fontFamily: 'monospace', marginBottom: 8 }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const updatedPages =
                lessonData?.pages?.filter((_, i) => i !== index) || []
              updateLessonData('pages', updatedPages)
            }}
          >
            Delete Page
          </Button>
        </Card>
      ))}
    </Card>
  )

  const renderSpecialData = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Cloze Data" size="small">
          <TextArea
            placeholder="Cloze game data (JSON)"
            value={JSON.stringify(lessonData?.clozeData || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                updateLessonData('clozeData', parsed)
              } catch (error) {
                // Invalid JSON
              }
            }}
            rows={10}
            style={{ fontFamily: 'monospace' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Candy Crush Questions" size="small">
          <TextArea
            placeholder="Candy Crush questions (JSON)"
            value={JSON.stringify(lessonData?.questions || [], null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                updateLessonData('questions', parsed)
              } catch (error) {
                // Invalid JSON
              }
            }}
            rows={10}
            style={{ fontFamily: 'monospace' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Reading Comprehension" size="small">
          <TextArea
            placeholder="Reading comprehension data (JSON)"
            value={JSON.stringify(
              lessonData?.readingComprehensionData || {},
              null,
              2,
            )}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                updateLessonData('readingComprehensionData', parsed)
              } catch (error) {
                // Invalid JSON
              }
            }}
            rows={10}
            style={{ fontFamily: 'monospace' }}
          />
        </Card>
      </Col>
    </Row>
  )

  const renderAdvanced = () => (
    <Card title="Complete Lesson Data (JSON)">
      <TextArea
        value={JSON.stringify(lessonData, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value)
            setLessonData(parsed)
          } catch (error) {
            // Invalid JSON, don't update state
          }
        }}
        rows={20}
        style={{ fontFamily: 'monospace' }}
      />
    </Card>
  )

  return (
    <Modal
      title={`Edit Lesson: ${lesson.lessonDisplay || lesson.lesson}`}
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleSave}
        >
          Download JSON
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'basic',
              label: 'Basic Info',
              children: renderBasicInfo(),
            },
            {
              key: 'vocabulary',
              label: 'Vocabulary',
              children: renderVocabulary(),
            },
            {
              key: 'menu',
              label: 'Menu',
              children: renderMenu(),
            },
            {
              key: 'external',
              label: 'External Content',
              children: renderExternalContent(),
            },
            {
              key: 'pages',
              label: 'Pages',
              children: renderPages(),
            },
            {
              key: 'special',
              label: 'Special Data',
              children: renderSpecialData(),
            },
            {
              key: 'advanced',
              label: 'Advanced (JSON)',
              children: renderAdvanced(),
            },
          ]}
        />
      </Form>
    </Modal>
  )
}
