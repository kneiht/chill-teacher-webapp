import {
  FacebookFilled,
  InstagramOutlined,
  LinkedinOutlined,
  SmileOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from '@ant-design/icons'
import { Col, Flex, Row, Typography, theme } from 'antd'

import { Link } from '@tanstack/react-router'

const { Paragraph } = Typography

const Footer = () => {
  const { token } = theme.useToken()
  return (
    <footer style={{ background: token.colorBgLayout, color: token.colorText }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
        }}
      >
        <Row gutter={[token.marginXL, token.marginXL]}>
          {/* Company Info */}
          <Col xs={24} md={12} lg={6}>
            <Flex
              align="center"
              gap={token.marginSM}
              style={{ marginBottom: token.margin }}
            >
              <SmileOutlined
                style={{ fontSize: 32, color: token.colorPrimary }}
              />
              <span
                style={{ fontSize: 28, fontWeight: token.fontWeightStrong }}
              >
                ChillTeacher
              </span>
            </Flex>
            <Paragraph
              style={{
                color: token.colorTextDescription,
                fontSize: 16,
                marginBottom: token.marginLG,
              }}
            >
              Tiếp sức cho nhà giáo bằng những công cụ sáng tạo, giúp tạo ra
              trải nghiệm học tập hứng khởi, hiệu quả, đồng thời tiết kiệm thời
              gian và giảm bớt căng thẳng.
            </Paragraph>
            <Flex gap={token.marginSM}>
              <FacebookFilled
                style={{
                  fontSize: 24,
                  color: token.colorTextDescription,
                  cursor: 'pointer',
                }}
              />
              <TwitterOutlined
                style={{
                  fontSize: 24,
                  color: token.colorTextDescription,
                  cursor: 'pointer',
                }}
              />
              <InstagramOutlined
                style={{
                  fontSize: 24,
                  color: token.colorTextDescription,
                  cursor: 'pointer',
                }}
              />
              <LinkedinOutlined
                style={{
                  fontSize: 24,
                  color: token.colorTextDescription,
                  cursor: 'pointer',
                }}
              />
              <YoutubeFilled
                style={{
                  fontSize: 24,
                  color: token.colorTextDescription,
                  cursor: 'pointer',
                }}
              />
            </Flex>
          </Col>
          {/* Sản phẩm */}
          <Col xs={24} md={12} lg={6}>
            <div
              style={{
                fontWeight: token.fontWeightStrong,
                fontSize: 18,
                marginBottom: token.margin,
              }}
            >
              Sản Phẩm
            </div>
            <Flex vertical gap={token.marginSM}>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Tính Năng
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Bảng Giá
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Dùng Thử
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Ứng Dụng Di Động
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                API
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Tích Hợp
              </Link>
            </Flex>
          </Col>
          {/* Tài nguyên */}
          <Col xs={24} md={12} lg={6}>
            <div
              style={{
                fontWeight: token.fontWeightStrong,
                fontSize: 18,
                marginBottom: token.margin,
              }}
            >
              Tài Nguyên
            </div>
            <Flex vertical gap={token.marginSM}>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Trung Tâm Hỗ Trợ
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Blog
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Hội Thảo
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Biểu Mẫu
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Cộng Đồng
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Tình Huống Thực Tế
              </Link>
            </Flex>
          </Col>
          {/* Company */}
          <Col xs={24} md={12} lg={6}>
            <div
              style={{
                fontWeight: token.fontWeightStrong,
                fontSize: 18,
                marginBottom: token.margin,
              }}
            >
              Công Ty
            </div>
            <Flex vertical gap={token.marginSM}>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Về Chúng Tôi
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Tuyển Dụng
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Báo Chí
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Đối Tác
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Liên Hệ
              </Link>
              <Link
                to="/"
                style={{
                  color: token.colorTextDescription,
                  textDecoration: 'none',
                }}
              >
                Trạng Thái
              </Link>
            </Flex>
          </Col>
        </Row>
        <div
          style={{
            borderTop: `1px solid ${token.colorBorder}`,
            marginTop: token.marginXL * 2,
            paddingTop: token.marginXL,
            textAlign: 'center',
            color: token.colorTextDescription,
            fontSize: 14,
          }}
        >
          © {new Date().getFullYear()} ChillTeacher. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  )
}

export default Footer
