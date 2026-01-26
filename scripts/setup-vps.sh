#!/bin/bash

# VPS 初始化設定腳本
# 此腳本用於首次在 VPS 上設定專案環境

set -e

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 ToWebP VPS 環境設定${NC}"
echo -e "${YELLOW}此腳本將協助您在 VPS 上設定 ToWebP 專案${NC}"
echo ""

# 檢查是否為 root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}❌ 此腳本需要 root 權限，請使用 sudo 執行${NC}"
    exit 1
fi

# 讀取配置
read -p "請輸入專案目錄路徑 [/opt/towebp]: " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-/opt/towebp}

read -p "請輸入 Git 儲存庫 URL: " GIT_REPO
if [ -z "$GIT_REPO" ]; then
    echo -e "${RED}❌ Git 儲存庫 URL 不能為空${NC}"
    exit 1
fi

read -p "請輸入要部署的分支 [main]: " BRANCH
BRANCH=${BRANCH:-main}

# 1. 更新系統
echo -e "${YELLOW}📦 更新系統套件...${NC}"
apt-get update
apt-get upgrade -y

# 2. 安裝必要工具
echo -e "${YELLOW}🔧 安裝必要工具...${NC}"
apt-get install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ufw \
    fail2ban

# 3. 安裝 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 安裝 Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # 啟動 Docker
    systemctl start docker
    systemctl enable docker
    
    echo -e "${GREEN}✅ Docker 安裝完成${NC}"
else
    echo -e "${GREEN}✅ Docker 已安裝${NC}"
fi

# 4. 安裝 Docker Compose
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose V1 已安裝${NC}"
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose V2 已安裝${NC}"
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${YELLOW}🐳 安裝 Docker Compose V2...${NC}"
    # Docker Compose V2 通常隨 Docker 一起安裝
    # 如果沒有，安裝 V1
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    DOCKER_COMPOSE="docker-compose"
    echo -e "${GREEN}✅ Docker Compose 安裝完成${NC}"
fi

# 5. 配置防火牆
echo -e "${YELLOW}🔥 配置防火牆...${NC}"
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp  # ToWebP 服務端口

echo -e "${GREEN}✅ 防火牆配置完成${NC}"

# 6. 創建專案目錄
echo -e "${YELLOW}📁 創建專案目錄...${NC}"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 7. 克隆專案
echo -e "${YELLOW}📥 克隆專案...${NC}"
if [ -d ".git" ]; then
    echo -e "${YELLOW}專案已存在，拉取最新代碼...${NC}"
    git pull origin "$BRANCH"
else
    git clone "$GIT_REPO" .
    git checkout "$BRANCH"
fi

# 8. 創建環境變數檔案
echo -e "${YELLOW}⚙️ 設定環境變數...${NC}"
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    
    echo ""
    echo -e "${BLUE}請設定以下環境變數：${NC}"
    
    read -p "網站域名 (例如: https://towebp.com): " BASE_URL
    sed -i "s|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=${BASE_URL}|" .env.local
    
    read -p "Google Site Verification (選填): " GOOGLE_VERIFICATION
    if [ -n "$GOOGLE_VERIFICATION" ]; then
        sed -i "s|NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=.*|NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${GOOGLE_VERIFICATION}|" .env.local
    fi
    
    echo -e "${GREEN}✅ 環境變數已設定${NC}"
else
    echo -e "${YELLOW}⚠️ .env.local 已存在，跳過創建${NC}"
fi

# 9. 設定 Git 配置
echo -e "${YELLOW}🔧 配置 Git...${NC}"
git config --global --add safe.directory "$PROJECT_DIR"

# 10. 建置並啟動容器
echo -e "${YELLOW}🐳 建置並啟動 Docker 容器...${NC}"
$DOCKER_COMPOSE build
$DOCKER_COMPOSE up -d

# 11. 等待容器啟動
echo -e "${YELLOW}⏳ 等待容器啟動...${NC}"
sleep 15

# 12. 檢查容器狀態
echo -e "${YELLOW}📊 檢查容器狀態...${NC}"
$DOCKER_COMPOSE ps

# 13. 設定自動更新腳本權限
chmod +x scripts/*.sh

# 14. 設定 cron job（選填）
read -p "是否設定自動重啟 cron job？(y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ "$DOCKER_COMPOSE" = "docker-compose" ]; then
        echo "0 4 * * 0 cd $PROJECT_DIR && docker-compose restart" | crontab -
    else
        echo "0 4 * * 0 cd $PROJECT_DIR && docker compose restart" | crontab -
    fi
    echo -e "${GREEN}✅ 已設定每週日凌晨 4 點自動重啟容器${NC}"
fi

# 15. 顯示完成資訊
echo ""
echo -e "${GREEN}🎉 VPS 環境設定完成！${NC}"
echo ""
echo -e "${BLUE}專案資訊：${NC}"
echo -e "  專案目錄: $PROJECT_DIR"
echo -e "  Git 儲存庫: $GIT_REPO"
echo -e "  當前分支: $BRANCH"
echo -e "  服務端口: 3001"
echo ""
echo -e "${BLUE}常用命令：${NC}"
if [ "$DOCKER_COMPOSE" = "docker-compose" ]; then
    echo -e "  查看日誌: cd $PROJECT_DIR && docker-compose logs -f"
    echo -e "  重啟服務: cd $PROJECT_DIR && docker-compose restart"
    echo -e "  停止服務: cd $PROJECT_DIR && docker-compose down"
else
    echo -e "  查看日誌: cd $PROJECT_DIR && docker compose logs -f"
    echo -e "  重啟服務: cd $PROJECT_DIR && docker compose restart"
    echo -e "  停止服務: cd $PROJECT_DIR && docker compose down"
fi
echo -e "  更新部署: cd $PROJECT_DIR && bash scripts/deploy-vps.sh"
echo ""
echo -e "${BLUE}下一步：${NC}"
echo -e "  1. 配置 Nginx 反向代理（如需要）"
echo -e "  2. 設定 SSL 憑證（使用 Let's Encrypt）"
echo -e "  3. 在 GitHub 儲存庫設定 Secrets："
echo -e "     - VPS_HOST: VPS IP 地址"
echo -e "     - VPS_USERNAME: SSH 用戶名"
echo -e "     - VPS_SSH_KEY: SSH 私鑰"
echo -e "     - VPS_PORT: SSH 端口 (預設 22)"
echo -e "     - VPS_PROJECT_PATH: $PROJECT_DIR"
echo ""
echo -e "${GREEN}✅ 設定完成！服務已啟動於: http://$(hostname -I | awk '{print $1}'):3001${NC}"
