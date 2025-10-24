import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Space,
  Statistic,
  Typography,
  theme,
} from 'antd'

const { Title, Paragraph, Text } = Typography

const Hero = () => {
  const { token } = theme.useToken()
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%)`,
        padding: `${token.paddingXL * 2}px 0`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: `0 ${token.paddingLG}px`,
        }}
      >
        <Row gutter={[token.marginXL, token.marginXL]} align="middle">
          {/* Left Content */}
          <Col xs={24} lg={12}>
            <Flex vertical gap={token.marginXL}>
              <Flex
                vertical
                gap={token.margin}
                style={{ marginBottom: token.marginLG }}
              >
                <Title
                  level={1}
                  style={{
                    fontWeight: token.fontWeightStrong,
                    fontSize: 48,
                    color: token.colorTextHeading,
                    lineHeight: 1.1,
                    marginBottom: 0,
                  }}
                >
                  Việc dạy học trở nên{' '}
                  <span style={{ color: token.colorPrimary }}>Dễ Dàng</span>
                </Title>
                <Paragraph
                  style={{
                    fontSize: 20,
                    color: token.colorTextDescription,
                    marginBottom: 0,
                  }}
                >
                  Sắp xếp lớp học của bạn với nền tảng tất cả trong một của
                  ChillTeacher. Tạo các bài học hấp dẫn, quản lý học sinh và
                  tiết kiệm thời gian quý báu với các công cụ trực quan của
                  chúng tôi được thiết kế bởi giáo viên, dành cho giáo viên.
                </Paragraph>
              </Flex>
              {/* CTA Buttons */}
              <Space
                direction="vertical"
                size={token.margin}
                style={{ maxWidth: 400 }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    fontWeight: token.fontWeightStrong,
                  }}
                >
                  Bắt đầu dùng thử miễn phí
                </Button>
                <Button
                  size="large"
                  icon={<PlayCircleOutlined />}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    fontWeight: token.fontWeightStrong,
                    borderColor: token.colorBorder,
                    color: token.colorText,
                  }}
                >
                  Xem Demo
                </Button>
              </Space>
              {/* Stats */}
              <Row gutter={token.margin} style={{ paddingTop: token.marginXL }}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic
                    title={
                      <Text style={{ color: token.colorTextDescription }}>
                        Giáo viên hài lòng
                      </Text>
                    }
                    value={'50.000+'}
                    valueStyle={{
                      color: token.colorPrimary,
                      fontSize: 32,
                      fontWeight: token.fontWeightStrong,
                    }}
                  />
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic
                    title={
                      <Text style={{ color: token.colorTextDescription }}>
                        Học sinh được tiếp cận
                      </Text>
                    }
                    value={'2.000.000+'}
                    valueStyle={{
                      color: token.colorPrimary,
                      fontSize: 32,
                      fontWeight: token.fontWeightStrong,
                    }}
                  />
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic
                    title={
                      <Text style={{ color: token.colorTextDescription }}>
                        Tỷ lệ hài lòng
                      </Text>
                    }
                    value={'99%'}
                    valueStyle={{
                      color: token.colorPrimary,
                      fontSize: 32,
                      fontWeight: token.fontWeightStrong,
                    }}
                  />
                </Col>
              </Row>
            </Flex>
          </Col>
          {/* Right Content - Hero Image */}
          <Col xs={24} lg={12}>
            <div style={{ position: 'relative' }}>
              <Card
                style={{
                  borderRadius: token.borderRadius,
                  boxShadow: token.boxShadowSecondary,
                  padding: 0,
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.3s',
                }}
                hoverable
              >
                <img
                  src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Teacher using ChillTeacher platform"
                  style={{
                    width: '100%',
                    height: 384,
                    objectFit: 'cover',
                    borderRadius: token.borderRadiusLG,
                  }}
                />
              </Card>
              {/* Floating Elements */}
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  right: -24,
                  background: token.colorWarning,
                  color: token.colorWhite,
                  padding: '8px 24px',
                  borderRadius: 999,
                  fontWeight: token.fontWeightStrong,
                  fontSize: 14,
                  boxShadow: token.boxShadowTertiary,
                }}
              >
                Dùng Thử Miễn Phí
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -24,
                  left: -24,
                  background: token.colorSuccess,
                  color: token.colorWhite,
                  padding: '8px 24px',
                  borderRadius: 999,
                  fontWeight: token.fontWeightStrong,
                  fontSize: 14,
                  boxShadow: token.boxShadowTertiary,
                }}
              >
                Được hơn 50.000 giáo viên tin dùng
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default Hero
