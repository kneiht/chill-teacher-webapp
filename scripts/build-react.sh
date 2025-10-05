#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Source .env if it exists
if [ -f ".env" ]; then
    set -o allexport
    source .env
    set +o allexport
fi

# Path to project root
FRONTEND_DIR=${FRONTEND_DIR}

# If FRONTEND_DIR is not set, exit
if [ -z "$FRONTEND_DIR" ]; then
    echo -e "${RED}FRONTEND_DIR is not set. Please set it in .env file or current environment.${NC}"
    exit 1
fi

echo -e "${BLUE}=== Build React to static files ===${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to continue.${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}pnpm is not installed. Please install pnpm to continue.${NC}"
    exit 1
fi

# Build React
echo -e "${YELLOW}>>> Building React to static files...${NC}"
cd "$FRONTEND_DIR" || { echo -e "${RED}Cannot access frontend directory${NC}"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    pnpm install || { echo -e "${RED}Failed to install dependencies${NC}"; exit 1; }
fi

# Run type-check
echo -e "${YELLOW}Running TypeScript type-check...${NC}"
pnpm run check || { echo -e "${RED}TypeScript type-check failed. Fix type errors before building.${NC}"; exit 1; }

# Build React
echo -e "${YELLOW}Building React...${NC}"
pnpm run build || { echo -e "${RED}Build React failed${NC}"; exit 1; }
echo -e ""

echo -e "${YELLOW}>>> Build successful${NC}"
echo -e ""