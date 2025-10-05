#!/bin/bash

# --- Configuration ---
# Source .env if it exists and export variables
if [ -f ".env" ]; then
    echo -e "\033[0;36mLoading environment variables from .env file...\033[0m"
    set -o allexport
    # shellcheck disable=SC1091
    source .env
    set +o allexport
else
    echo -e "\033[1;33mWarning: .env file not found. Some commands might not work as expected.\033[0m"
fi

# Warning: make sure to set the correct values in .env
echo -e "\033[1;33mWarning: Please ensure all variables are set in .env file.\033[0m"

read -p "Have you set all variables in .env file? (y/n): " ENV_VARS_SET
if [[ "$ENV_VARS_SET" =~ ^[Yy]$ ]]; then
    echo -e "\033[1;32mAll variables are set in .env file.\033[0m"
    echo -e "\033[1;32mContinuing...\033[0m"
else
    echo -e "\033[1;31mError: Please ensure all variables are set in .env file.\033[0m"
    exit 1
fi

# Directories (from env or defaults)
FRONTEND_DIR=${FRONTEND_DIR}
SCRIPTS_DIR=${SCRIPTS_DIR}

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# --- Helper Functions ---
print_header() {
    echo
    echo -e "${BLUE}=== App CLI ===${NC}"
    echo
}


_ensure_env_var() {
    local var_name="$1"
    local var_value="${!var_name}" # Indirect expansion
    if [ -z "$var_value" ]; then
        echo -e "${RED}Error: Environment variable $var_name is not set.${NC}"
        echo -e "${YELLOW}Please set it in your .env file or current environment.${NC}"
        return 1
    fi
    return 0
}

# --- Setup ---
setup_scripts() {
    echo -e "${BLUE}Making scripts executable...${NC}"
    chmod +x "$SCRIPTS_DIR"/*.sh
    echo -e "${GREEN}✓ Scripts are now executable${NC}"
}

# --- Frontend ---
frontend_install() {
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    (cd "$FRONTEND_DIR" && pnpm install)
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
}

frontend_dev() {
    echo -e "${BLUE}Starting React development server...${NC}"
    echo -e "${YELLOW}Frontend available at: http://localhost:3000${NC}"
    (cd "$FRONTEND_DIR" && pnpm run dev)
}

frontend_check() {
    echo -e "${BLUE}Running TypeScript type checks...${NC}"
    (cd "$FRONTEND_DIR" && pnpm run check)
    echo -e "${GREEN}✓ Type checks complete${NC}"
}

frontend_build() {
    frontend_check # Dependency
    echo -e "${BLUE}Building React for production...${NC}"
    (cd "$FRONTEND_DIR" && pnpm run build)
    echo -e "${GREEN}✓ React build complete${NC}"
    echo -e "${YELLOW}Static files output to: $FRONTEND_DIR/dist${NC}"
}

frontend_preview() {
    frontend_check # Dependency
    echo -e "${BLUE}Starting React preview server...${NC}"
    echo -e "${YELLOW}Preview available at: http://localhost:4173${NC}"
    (cd "$FRONTEND_DIR" && pnpm run serve)
}

frontend_lint() {
    echo -e "${BLUE}Linting frontend code...${NC}"
    (cd "$FRONTEND_DIR" && pnpm run lint)
    echo -e "${GREEN}✓ Linting complete${NC}"
}

frontend_fix_lint() {
    echo -e "${BLUE}Formatting frontend code (Prettier)...${NC}"
    (cd "$FRONTEND_DIR" && pnpm run format)
    echo -e "${GREEN}✓ Formatting complete${NC}"
}


# --- Deployment ---
_get_deploy_params() {
    # Use existing environment variables if set, otherwise prompt with defaults
    read -p "Enter server IP address (default: ${SERVER_IP}): " SERVER_IP_INPUT
    SERVER_IP="${SERVER_IP_INPUT:-${SERVER_IP}}"
    read -p "Enter SSH username (default: ${DEPLOY_USER:-root}): " USERNAME_INPUT
    DEPLOY_USER="${USERNAME_INPUT:-${DEPLOY_USER:-root}}"
    read -p "Enter SSH port (default: ${SSH_DEPLOY_PORT:-22}): " SSH_PORT_INPUT
    SSH_DEPLOY_PORT="${SSH_PORT_INPUT:-${SSH_DEPLOY_PORT:-22}}"
}

deploy_generate_key() {
    echo -e "${CYAN}Generating SSH key...${NC}"
    if [ -f ~/.ssh/id_rsa ]; then
        echo -e "${YELLOW}SSH key already exists at ~/.ssh/id_rsa${NC}"
    else
        ssh-keygen -t rsa -b 4096
        echo -e "${GREEN}✅ SSH key generated successfully!${NC}"
    fi
}

deploy_copy_key() {
    echo -e "${CYAN}Copying SSH key to server...${NC}"
    read -p "Enter server IP address for key copy: " SERVER_IP_COPY
    read -p "Enter SSH username for key copy (default: root): " USER_COPY
    USER_COPY="${USER_COPY:-root}"
    read -p "Enter SSH port for key copy (default: 22): " SSH_PORT_COPY
    SSH_PORT_COPY="${SSH_PORT_COPY:-22}"
    echo -e "${YELLOW}Copying key to ${USER_COPY}@${SERVER_IP_COPY}:${SSH_PORT_COPY}...${NC}"
    ssh-copy-id -p "$SSH_PORT_COPY" "${USER_COPY}@${SERVER_IP_COPY}"
    echo -e "${GREEN}✅ SSH key copied successfully!${NC}"
}

deploy_test_conn() {
    echo -e "${CYAN}Testing SSH connection...${NC}"
    read -p "Enter server IP address for test: " SERVER_IP_TEST_CONN
    read -p "Enter SSH username for test (default: root): " USER_TEST_CONN
    USER_TEST_CONN="${USER_TEST_CONN:-root}"
    read -p "Enter SSH port for test (default: 22): " SSH_PORT_TEST_CONN
    SSH_PORT_TEST_CONN="${SSH_PORT_TEST_CONN:-22}"
    echo -e "${YELLOW}Testing connection to ${USER_TEST_CONN}@${SERVER_IP_TEST_CONN}:${SSH_PORT_TEST_CONN}...${NC}"
    ssh -p "$SSH_PORT_TEST_CONN" "${USER_TEST_CONN}@${SERVER_IP_TEST_CONN}" "echo -e '${GREEN}✅ SSH connection successful!${NC}'"
}

deploy_app() {
    setup_scripts # Dependency
    echo -e "${CYAN}Deploying application to server...${NC}"
    _get_deploy_params
    echo -e "${YELLOW}Deploying to ${DEPLOY_USER}@${SERVER_IP}:${SSH_DEPLOY_PORT}...${NC}"
    "$SCRIPTS_DIR/frontend-deploy.sh" "$SERVER_IP" "$DEPLOY_USER" "$SSH_DEPLOY_PORT"
    echo -e "${GREEN}✅ Application deployment complete!${NC}"
}

deploy_setup() {
    deploy_generate_key
    deploy_copy_key
    deploy_test_conn
    deploy_app
    echo -e "${BOLD}${GREEN}=== Full deployment setup complete! ===${NC}"
}

# --- Tools & Cleanup ---
_clean_action() {
    local force_clean_node_modules=false
    if [[ "$1" == "--force" ]]; then
        force_clean_node_modules=true
    fi

    if [ -d "$FRONTEND_DIR/node_modules" ]; then
        if $force_clean_node_modules; then
            echo -e "${BLUE}Removing $FRONTEND_DIR/node_modules...${NC}"
            rm -rf "$FRONTEND_DIR/node_modules"
            echo -e "${GREEN}✓ Removed node_modules${NC}"
        else
            echo -en "${YELLOW}Remove frontend node_modules? (y/N): ${NC}"
            read -r answer
            if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
                echo -e "${BLUE}Removing $FRONTEND_DIR/node_modules...${NC}"
                rm -rf "$FRONTEND_DIR/node_modules"
                echo -e "${GREEN}✓ Removed node_modules${NC}"
            else
                echo -e "${YELLOW}Skipping node_modules removal.${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Frontend node_modules directory not found.${NC}"
    fi
}

clean_normal() {
    _clean_action
}

clean_force() {
    _clean_action --force
}

# --- Menu Functions ---
show_frontend_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Frontend (React) ---${NC}"
        local options=(
            "Install dependencies (pnpm install)"
            "Run dev server (pnpm run dev)"
            "Build for production (pnpm run build)"
            "Preview production build (pnpm run serve)"
            "Lint code (pnpm run lint)"
            "Fix lint issues (Format with Prettier)"
            "Run type checks (TypeScript)"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Frontend action? "
        select opt in "${options[@]}"; do
            case $REPLY in
                1) frontend_install; break ;;
                2) frontend_dev; break ;;
                3) frontend_build; break ;;
                4) frontend_preview; break ;;
                5) frontend_lint; break ;;
                6) frontend_fix_lint; break ;;
                7) frontend_check; break ;;
                $((${#options[@]}))) return ;;
                *) echo -e "${RED}Invalid option $REPLY${NC}" ;;
            esac
        done
    done
}

show_deploy_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Deployment ---${NC}"
        local options=(
            "Generate SSH key (if needed)"
            "Copy SSH public key to server"
            "Test SSH connection to server"
            "Deploy application"
            "Run full deployment setup (key, copy, test, app)"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Deployment action? "
        select opt in "${options[@]}"; do
            case $REPLY in
                1) deploy_generate_key; break ;;
                2) deploy_copy_key; break ;;
                3) deploy_test_conn; break ;;
                4) deploy_app; break ;;
                5) deploy_setup; break ;;
                $((${#options[@]}))) return ;;
                *) echo -e "${RED}Invalid option $REPLY${NC}" ;;
            esac
        done
    done
}

show_tools_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Tools & Cleanup ---${NC}"
        local options=(
            "Install/Check cargo-sweep"
            "Install/Check cargo-watch"
            "Clean unused Rust build artifacts (cargo-sweep)"
            "Clean (backend + optional frontend node_modules)"
            "Clean Force (backend + frontend node_modules)"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Tool/Cleanup action? "
        select opt in "${options[@]}"; do
            case $REPLY in
                1) tools_install_sweep; break ;;
                2) tools_install_watch; break ;;
                3) tools_clean_cargo; break ;;
                4) clean_normal; break ;;
                5) clean_force; break ;;
                $((${#options[@]}))) return ;;
                *) echo -e "${RED}Invalid option $REPLY${NC}" ;;
            esac
        done
    done
}

# --- Main Menu ---
main_menu() {
    while true; do
        print_header
        echo -e "${BOLD}${MAGENTA}Select a category:${NC}"
        COLUMNS=1 # Ensure select options are listed vertically for the main menu as well
        PS3="Enter your choice (or q to quit): "
        local main_options=(
            "Setup Scripts (make executable)"
            "Frontend (React)"
            "Deployment"
            "Tools & Cleanup"
            "Quit"
        )
        select opt in "${main_options[@]}"; do
            # Check if REPLY is 'q' or 'Q' for quitting, in addition to the numbered option
            if [[ "$REPLY" == "q" || "$REPLY" == "Q" ]]; then
                echo -e "${GREEN}Exiting EnglishCoaching CLI. Goodbye!${NC}"; exit 0
            fi

            case $REPLY in
                1) setup_scripts; break ;;
                2) show_frontend_menu; break ;;
                3) show_deploy_menu; break ;;
                4) show_tools_menu; break ;;
                $((${#main_options[@]}))) echo -e "${GREEN}Exiting EnglishCoaching CLI. Goodbye!${NC}"; exit 0 ;;
                *) echo -e "${RED}Invalid option $REPLY. Type 'q' or the number of 'Quit' to exit.${NC}" ;;
            esac
        done
    done
}

# --- Entry Point ---
# Start the main menu
main_menu