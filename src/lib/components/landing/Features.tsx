import {
  BarChartOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  PrinterOutlined,
  ReadOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Typography, theme } from 'antd'

const { Title, Paragraph } = Typography

const features = [
  {
    icon: <UserOutlined />,
    title: 'Quản lý học sinh',
    description:
      'Theo dõi học sinh, sự tiến bộ của họ và thông tin quan trọng ở cùng một nơi.',
  },
  {
    icon: <ReadOutlined />,
    title: 'Flashcard kỹ thuật số',
    description:
      'Tạo flashcard tương tác cho bất kỳ chủ đề nào có hỗ trợ đa phương tiện và lặp lại ngắt quãng.',
  },
  {
    icon: <FileTextOutlined />,
    title: 'Kế hoạch bài học',
    description:
      'Thiết kế các kế hoạch bài học toàn diện với các mẫu, mục tiêu và sự phù hợp với chương trình giảng dạy.',
  },
  {
    icon: <FundProjectionScreenOutlined />,
    title: 'Bài học tương tác',
    description:
      'Thu hút học sinh bằng các bài thuyết trình tương tác, các cuộc thăm dò ý kiến và sự tham gia trong thời gian thực.',
  },
  {
    icon: <PrinterOutlined />,
    title: 'Bảng tính có thể in',
    description:
      'Tạo các bảng tính và hoạt động tùy chỉnh phù hợp với mục tiêu giảng dạy của bạn.',
  },
  {
    icon: <TrophyOutlined />,
    title: 'Trò chơi giáo dục',
    description:
      'Làm cho việc học trở nên thú vị với các hoạt động được trò chơi hóa và các cuộc thi cho lớp học của bạn.',
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Công cụ tiết kiệm thời gian',
    description:
      'Tự động hóa các công việc thường ngày như chấm điểm, điểm danh và theo dõi tiến độ.',
  },
  {
    icon: <BarChartOutlined />,
    title: 'Phân tích & Thông tin chi tiết',
    description:
      'Theo dõi sự tiến bộ của học sinh và nhận thông tin chi tiết để cải thiện hiệu quả giảng dạy của bạn.',
  },
]

const Features = () => {
  const { token } = theme.useToken()
  return (
    <section
      id="features"
      style={{
        padding: `${token.paddingXL * 2}px 0`,
        background: token.colorBgContainer,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: `0 ${token.paddingLG}px`,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: token.marginXL * 2 }}>
          <Title
            level={2}
            style={{
              fontWeight: token.fontWeightStrong,
              fontSize: 36,
              color: token.colorTextHeading,
              marginBottom: token.marginLG,
            }}
          >
            Mọi thứ bạn cần, trong một nền tảng
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: token.colorTextDescription,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            ChillTeacher hội tụ tất cả công cụ bạn cần để tạo nên những bài
            giảng lôi cuốn, hiệu quả, đồng thời tiết kiệm thời gian quản lý hành
            chính.
          </Paragraph>
        </div>
        <Row gutter={[token.margin, token.margin]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: token.borderRadiusLG,
                  boxShadow: token.boxShadowSecondary,
                  border: `1px solid ${token.colorBorder}`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: token.borderRadius,
                    background: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    marginBottom: token.margin,
                    fontSize: 24,
                  }}
                >
                  {feature.icon}
                </Flex>
                <Title
                  level={4}
                  style={{
                    fontWeight: token.fontWeightStrong,
                    fontSize: 20,
                    color: token.colorTextHeading,
                    marginBottom: token.marginSM,
                  }}
                >
                  {feature.title}
                </Title>
                <Paragraph
                  style={{ color: token.colorTextDescription, fontSize: 16 }}
                >
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        {/* CTA Section */}
        <div style={{ marginTop: token.marginXL * 2, textAlign: 'center' }}>
          <Card
            style={{
              background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorInfo} 100%)`,
              borderRadius: token.borderRadius,
              padding: token.paddingXL * 2,
              boxShadow: token.boxShadowTertiary,
            }}
          >
            <Title
              level={3}
              style={{
                color: token.colorWhite,
                fontWeight: token.fontWeightStrong,
                marginBottom: token.marginLG,
              }}
            >
              Sẵn sàng đổi mới phương pháp giảng dạy?
            </Title>
            <Paragraph
              style={{
                color: token.colorInfoBg,
                fontSize: 20,
                marginBottom: token.marginXL,
              }}
            >
              Gia nhập cộng đồng hàng ngàn giáo viên đã tạo nên sự khác biệt với
              ChillTeacher.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: token.borderRadiusLG,
                fontWeight: token.fontWeightStrong,
                background: token.colorWhite,
                color: token.colorPrimary,
              }}
            >
              Bắt đầu dùng thử miễn phí
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Features
