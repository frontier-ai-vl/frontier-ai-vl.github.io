#!/bin/bash

# Git 推送脚本
# 使用方法: ./git-push.sh [分支名]

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 如果提供了分支名参数，使用该分支，否则使用当前分支
if [ $# -eq 1 ]; then
    TARGET_BRANCH="$1"
else
    TARGET_BRANCH="$CURRENT_BRANCH"
fi

echo -e "${BLUE}=== Git 推送脚本 ===${NC}"
echo -e "${YELLOW}当前分支: ${GREEN}$CURRENT_BRANCH${NC}"
echo -e "${YELLOW}目标分支: ${GREEN}$TARGET_BRANCH${NC}"

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "\n${RED}警告: 检测到未提交的更改！${NC}"
    git status --short
    echo -e "\n${YELLOW}是否先提交这些更改？(y/n)${NC}"
    read -r commit_response
    
    if [[ "$commit_response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}请输入提交信息:${NC}"
        read -r commit_message
        git add .
        git commit -m "$commit_message"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ 提交成功！${NC}"
        else
            echo -e "${RED}✗ 提交失败！${NC}"
            exit 1
        fi
    fi
fi

# 检查是否有本地提交未推送
LOCAL_COMMITS=$(git log origin/"$TARGET_BRANCH".."$TARGET_BRANCH" --oneline 2>/dev/null | wc -l)

if [ "$LOCAL_COMMITS" -eq 0 ]; then
    echo -e "\n${YELLOW}没有新的提交需要推送${NC}"
    
    # 检查远程是否有更新
    echo -e "\n${YELLOW}检查远程更新...${NC}"
    git fetch origin "$TARGET_BRANCH"
    
    REMOTE_COMMITS=$(git log "$TARGET_BRANCH"..origin/"$TARGET_BRANCH" --oneline 2>/dev/null | wc -l)
    if [ "$REMOTE_COMMITS" -gt 0 ]; then
        echo -e "${YELLOW}远程有 $REMOTE_COMMITS 个新提交，是否拉取？(y/n)${NC}"
        read -r pull_response
        
        if [[ "$pull_response" =~ ^[Yy]$ ]]; then
            git pull origin "$TARGET_BRANCH"
        fi
    else
        echo -e "${GREEN}✓ 本地已是最新${NC}"
    fi
    exit 0
fi

echo -e "\n${YELLOW}=== 即将推送的提交 (共 $LOCAL_COMMITS 个) ===${NC}"
git log origin/"$TARGET_BRANCH".."$TARGET_BRANCH" --oneline

# 询问是否继续
echo -e "\n${YELLOW}是否推送到 origin/$TARGET_BRANCH？(y/n)${NC}"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${RED}已取消推送${NC}"
    exit 0
fi

# 执行推送
echo -e "\n${GREEN}推送到远程仓库...${NC}"
git push origin "$TARGET_BRANCH"

# 检查推送是否成功
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ 推送成功！${NC}"
    echo -e "${GREEN}已将 $LOCAL_COMMITS 个提交推送到 origin/$TARGET_BRANCH${NC}"
    
    # 显示远程分支状态
    echo -e "\n${YELLOW}=== 远程分支最新提交 ===${NC}"
    git log origin/"$TARGET_BRANCH" --oneline -n 5
else
    echo -e "\n${RED}✗ 推送失败！${NC}"
    echo -e "${YELLOW}可能的原因:${NC}"
    echo -e "  1. 远程仓库有新的提交，需要先拉取: ${GREEN}git pull origin $TARGET_BRANCH${NC}"
    echo -e "  2. 没有推送权限"
    echo -e "  3. 网络连接问题"
    exit 1
fi
