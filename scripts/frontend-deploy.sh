#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Source .env if it exists
if [ -f ".env" ]; then
    set -o allexport
    source .env
    set +o allexport
fi

# Read from env or use defaults
SERVER_IP=${SERVER_IP}
USERNAME=${SERVER_USER:-"root"}
SSH_PORT=${SSH_PORT:-"22"}
DOMAIN=${DOMAIN}

REMOTE_DIR=${REMOTE_DIR}

# Path to project root (from env)
PROJECT_ROOT=${PROJECT_ROOT}
FRONTEND_DIR=${FRONTEND_DIR}
FRONTEND_BUILD_DIR="$FRONTEND_DIR/dist"


# Check if server_ip is still default
if [ "$SERVER_IP" == "your_server_ip" ]; then
    echo -e "${RED}Please provide the actual server IP address!${NC}"
    echo -e "${YELLOW}Usage: ./scripts/frontend-deploy.sh [server_ip] [username] [ssh_port]${NC}"
    echo -e "${YELLOW}Or set SERVER_IP, SERVER_USER, SERVER_PASSWORD, DOMAIN in .env${NC}"
    exit 1
fi


# Set up SSH Control Master to reuse SSH connection
SSH_CONTROL_PATH="/tmp/ssh_mux_%h_%p_%r"
SSH_OPTS="-o ControlMaster=auto -o ControlPath=$SSH_CONTROL_PATH -o ControlPersist=1h -o StrictHostKeyChecking=accept-new"
SSH_CMD="ssh $SSH_OPTS -p $SSH_PORT $USERNAME@$SERVER_IP"
echo -e $SSH_CMD
SCP_CMD="scp -P $SSH_PORT $SSH_OPTS"

# Check if SSH key authentication works
echo -e "${BLUE}Checking SSH connection...${NC}"
if $SSH_CMD -o BatchMode=yes "echo 'SSH key authentication works!'" &>/dev/null; then
    echo -e "${GREEN}✓ SSH key authentication works! No password needed.${NC}"
else
    echo -e "${YELLOW}⚠️ SSH key authentication not working. You may need to enter password.${NC}"
    echo -e "${YELLOW}To set up SSH key authentication, run: ssh-copy-id -p $SSH_PORT $USERNAME@$SERVER_IP${NC}"
    if [ -n "$SERVER_PASSWORD" ]; then
        echo -e "${YELLOW}Using SERVER_PASSWORD from env for authentication.${NC}"
        SSH_CMD="sshpass -p '$SERVER_PASSWORD' ssh $SSH_OPTS -p $SSH_PORT $USERNAME@$SERVER_IP"
        SCP_CMD="sshpass -p '$SERVER_PASSWORD' scp -P $SSH_PORT $SSH_OPTS"
        echo -e $SSH_CMD
    fi
fi


echo ""
echo -e "${BLUE}=== DEPLOY APP TO SERVER ===${NC}"
echo -e "${YELLOW}Server IP: ${SERVER_IP}${NC}"
echo -e "${YELLOW}Username: ${USERNAME}${NC}"
echo -e "${YELLOW}SSH Port: ${SSH_PORT}${NC}"
echo -e "${YELLOW}Domain: ${DOMAIN}${NC}"
echo -e "${YELLOW}Remote Directory: ${REMOTE_DIR}${NC}"
echo ""


# Create directories on server
echo -e "${BLUE}Creating directories on server...${NC}"
$SSH_CMD "mkdir -p $REMOTE_DIR && mkdir -p $REMOTE_DIR/static"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create directories on server!${NC}"
    echo -e "${YELLOW}Check SERVER_PASSWORD in .env or install sshpass locally.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Directories created successfully!${NC}"




# Ask user if they want to rebuild static files
read -p "Do you want to build and copy static files to server? (y/n): " BUILD_STATIC
if [[ "$BUILD_STATIC" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Building React ...${NC}"
    chmod +x ./scripts/build-react.sh
    ./scripts/build-react.sh

    # Copy static files to server if available
    echo -e "${BLUE}Copying static files to server...${NC}"
    if [ -d "$FRONTEND_BUILD_DIR" ]; then
        cd $FRONTEND_BUILD_DIR && tar -czf $FRONTEND_DIR/static-files.tar.gz .
        cd $FRONTEND_DIR
        $SCP_CMD static-files.tar.gz $USERNAME@$SERVER_IP:$REMOTE_DIR/
        $SSH_CMD "cd $REMOTE_DIR && tar -xzf static-files.tar.gz -C static/"

        echo -e "${GREEN}✓ Static files copied successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️ Static files directory not found. You can update later with 'make update-static' command.${NC}"
    fi
fi


# Check status of containers
echo -e "${BLUE}Checking status of containers...${NC}"
$SSH_CMD "cd $REMOTE_DIR && docker-compose ps"

# Check logs of app container
# echo -e "${BLUE}Check logs of backend ${APP_CONTAINER_NAME} container...${NC}"
# $SSH_CMD "cd $REMOTE_DIR && docker logs ${APP_CONTAINER_NAME} 2>&1 | tail -n 20"

# Check logs of caddy container
# echo -e "${BLUE}Checking logs of caddy container...${NC}"
# $SSH_CMD "cd $REMOTE_DIR && docker logs caddy 2>&1 | tail -n 20"

# Cleanup
echo -e "${BLUE}Cleanup...${NC}"
# rm -rf ./scripts/english-coaching-image.tar.gz
# rm -rf ./scripts/static-files.tar.gz
docker image prune -f

# Close SSH Control Master connection
echo -e "${BLUE}Closing SSH connection...${NC}"
ssh $SSH_OPTS -p $SSH_PORT -O exit $USERNAME@$SERVER_IP

echo -e "${GREEN}=== DEPLOY COMPLETED SUCCESSFULLY! ===${NC}"
echo -e "${YELLOW}Application is running at:${NC}"
echo -e "${YELLOW}- HTTP: http://${SERVER_IP} (sẽ tự động chuyển hướng sang HTTPS)${NC}"
echo -e "${YELLOW}- HTTPS: https://${SERVER_IP} (Caddy sẽ tự động lấy SSL certificates)${NC}"
echo -e "${YELLOW}- Domain: https://${DOMAIN} (after configuring DNS to point to ${SERVER_IP})${NC}"
echo -e "${YELLOW}To check status, run: ssh -p $SSH_PORT $USERNAME@$SERVER_IP \"cd ${REMOTE_DIR} && docker-compose ps\"${NC}"
echo -e "${YELLOW}To view logs, run: ssh -p $SSH_PORT $USERNAME@$SERVER_IP \"cd ${REMOTE_DIR} && docker-compose logs\"${NC}"
echo -e "${YELLOW}To view Caddy logs, run: ssh -p $SSH_PORT $USERNAME@$SERVER_IP \"cd ${REMOTE_DIR} && docker-compose logs caddy\"${NC}"