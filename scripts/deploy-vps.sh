#!/bin/bash

# VPS 部署腳本
# 此腳本應該在 VPS 上執行

set -e  # 遇到錯誤時退出

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
PROJECT_DIR="${VPS_PROJECT_PATH:-/opt/towebp}"
BRANCH="${DEPLOY_BRANCH:-main}"
BACKUP_DIR="${PROJECT_DIR}/backups"

echo -e "${GREEN}🚀 開始部署 ToWebP...${NC}"

# 檢查是否為 root 或有 sudo 權限
if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
    echo -e "${RED}❌ 此腳本需要 root 權限或 sudo 權限${NC}"
    exit 1
fi

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安裝${NC}"
    exit 1
fi

# 檢查 Docker Compose 是否安裝
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安裝${NC}"
    exit 1
fi

# 進入專案目錄
cd "$PROJECT_DIR" || exit 1

# 創建備份目錄
mkdir -p "$BACKUP_DIR"

# 備份當前版本（如果容器正在運行）
if docker ps | grep -q towebp; then
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${YELLOW}📦 備份當前版本為 ${BACKUP_NAME}...${NC}"
    
    # 備份環境變數
    if [ -f .env.local ]; then
        cp .env.local "$BACKUP_DIR/${BACKUP_NAME}.env.local"
    fi
    
    # 記錄當前版本
    git rev-parse HEAD > "$BACKUP_DIR/${BACKUP_NAME}.commit"
fi

# 清理舊備份（保留最近 5 個）
echo -e "${YELLOW}🧹 清理舊備份...${NC}"
cd "$BACKUP_DIR"
ls -t | tail -n +11 | xargs -r rm
cd "$PROJECT_DIR"

# 拉取最新代碼
echo -e "${YELLOW}📥 拉取最新代碼...${NC}"
git fetch origin
BEFORE_COMMIT=$(git rev-parse HEAD)
git pull origin "$BRANCH"
AFTER_COMMIT=$(git rev-parse HEAD)

if [ "$BEFORE_COMMIT" = "$AFTER_COMMIT" ]; then
    echo -e "${GREEN}✅ 代碼已是最新版本，無需更新${NC}"
    read -p "是否強制重新部署？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# 檢查環境變數檔案
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️ .env.local 不存在，從範例創建...${NC}"
    cp .env.local.example .env.local
    echo -e "${RED}⚠️ 請編輯 .env.local 設定正確的環境變數！${NC}"
    echo -e "${YELLOW}按 Enter 繼續，或 Ctrl+C 取消...${NC}"
    read
fi

# 停止現有容器
echo -e "${YELLOW}🛑 停止現有容器...${NC}"
docker-compose down

# 建置新映像
echo -e "${YELLOW}🔨 建置 Docker 映像...${NC}"
docker-compose build --no-cache

# 啟動容器
echo -e "${YELLOW}🚀 啟動容器...${NC}"
docker-compose up -d

# 等待容器啟動
echo -e "${YELLOW}⏳ 等待容器啟動...${NC}"
sleep 10

# 健康檢查
echo -e "${YELLOW}🏥 執行健康檢查...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker ps | grep -q towebp && docker inspect --format='{{.State.Health.Status}}' towebp 2>/dev/null | grep -q "healthy"; then
        echo -e "${GREEN}✅ 容器健康檢查通過！${NC}"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}❌ 健康檢查失敗！${NC}"
        echo -e "${YELLOW}📋 顯示容器日誌：${NC}"
        docker-compose logs --tail=50
        exit 1
    fi
    
    echo -e "${YELLOW}等待健康檢查... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 2
done

# 清理未使用的映像
echo -e "${YELLOW}🧹 清理未使用的 Docker 映像...${NC}"
docker image prune -f

# 顯示容器狀態
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${YELLOW}📊 容器狀態：${NC}"
docker-compose ps

# 顯示最近的日誌
echo -e "${YELLOW}📋 最近的日誌：${NC}"
docker-compose logs --tail=30

# 顯示版本資訊
echo -e "${GREEN}🎉 部署成功！${NC}"
echo -e "版本資訊："
echo -e "  提交: $(git rev-parse --short HEAD)"
echo -e "  分支: $(git rev-parse --abbrev-ref HEAD)"
echo -e "  時間: $(date)"

# 顯示服務 URL
echo -e "${GREEN}🌐 服務已啟動：${NC}"
echo -e "  本地: http://localhost:3001"
if [ -f .env.local ]; then
    BASE_URL=$(grep NEXT_PUBLIC_BASE_URL .env.local | cut -d '=' -f2)
    if [ -n "$BASE_URL" ]; then
        echo -e "  網址: $BASE_URL"
    fi
fi
