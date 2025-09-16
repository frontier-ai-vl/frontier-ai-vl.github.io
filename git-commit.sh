#!/bin/bash

# Git 提交脚本
# 使用方法: ./git-commit.sh "提交信息"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo -e "${RED}错误: 请提供提交信息${NC}"
    echo "使用方法: ./git-commit.sh \"提交信息\""
    exit 1
fi

# 获取提交信息
COMMIT_MESSAGE="$1"

# 显示当前状态
echo -e "${YELLOW}=== Git 状态 ===${NC}"
git status --short

# 询问是否继续
echo -e "\n${YELLOW}是否继续提交？(y/n)${NC}"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${RED}已取消提交${NC}"
    exit 0
fi

# 添加所有更改
echo -e "\n${GREEN}添加所有更改...${NC}"
git add .

# 再次显示要提交的更改
echo -e "\n${YELLOW}=== 即将提交的更改 ===${NC}"
git status --short

# 执行提交
echo -e "\n${GREEN}执行提交...${NC}"
git commit -m "$COMMIT_MESSAGE"

# 检查提交是否成功
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ 提交成功！${NC}"
    echo -e "${GREEN}提交信息: $COMMIT_MESSAGE${NC}"
    
    # 显示最近的提交
    echo -e "\n${YELLOW}=== 最近的提交 ===${NC}"
    git log --oneline -n 5
else
    echo -e "\n${RED}✗ 提交失败！${NC}"
    exit 1
fi