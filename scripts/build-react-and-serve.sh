#!/bin/bash

# Thiết lập màu sắc cho output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Đường dẫn tới thư mục gốc của dự án
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
BACKEND_STATIC_DIR="$BACKEND_DIR/static"

echo -e "${BLUE}=== Tích hợp SvelteKit với Axum ===${NC}"

# Build SvelteKit
echo -e "${YELLOW}Đang build SvelteKit...${NC}"
"$PROJECT_ROOT/scripts/build-svelte.sh" || { echo -e "${RED}Build SvelteKit thất bại${NC}"; exit 1; }


# Tạo thư mục static trong backend nếu chưa tồn tại
echo -e "${YELLOW}>>> Chuẩn bị thư mục static trong backend...${NC}"
mkdir -p "$BACKEND_STATIC_DIR" || { echo -e "${RED}Không thể tạo thư mục static${NC}"; exit 1; }
echo -e ""
# Xóa nội dung cũ trong thư mục static (nếu có)
echo -e "${YELLOW}>>> Xóa nội dung cũ trong thư mục static...${NC}"
rm -rf "$BACKEND_STATIC_DIR"/* || { echo -e "${RED}Không thể xóa nội dung cũ${NC}"; exit 1; }
echo -e ""
# Copy các file static từ SvelteKit build vào thư mục static của backend
echo -e "${YELLOW}>>> Copy static files từ SvelteKit vào backend...${NC}"
cp -r "$FRONTEND_DIR/build/"* "$BACKEND_STATIC_DIR/" || { echo -e "${RED}Không thể copy static files${NC}"; exit 1; }

echo -e "${GREEN}Build và copy hoàn tất! Static files đã được đặt trong thư mục backend/static${NC}"









# Thiết lập biến môi trường và chạy Axum
echo -e "${YELLOW}Khởi động server Axum...${NC}"

# Di chuyển vào thư mục backend
cd "$BACKEND_DIR" || { echo -e "${RED}Không thể truy cập thư mục backend${NC}"; exit 1; }

echo -e "${BLUE}Đang biên dịch và chạy server Axum...${NC}"
echo -e "${YELLOW}Server sẽ chạy tại địa chỉ: http://localhost:3000${NC}"
echo -e "${YELLOW}API Health check: http://localhost:3000/api/health${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000/${NC}"

# Chạy server với cargo
cargo run