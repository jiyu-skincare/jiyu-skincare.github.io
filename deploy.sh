#!/bin/bash
# 官網一鍵發佈到 GitHub Pages
# 用法：bash deploy.sh
# 網址：https://jiyu-skincare.github.io/
set -e

cd "$(dirname "$0")"
URL="https://jiyu-skincare.github.io/"

echo "🚀 開始發佈官網..."

if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️  沒有變動，不用發佈"
  exit 0
fi

git add -A
git commit -m "update: $(date '+%Y-%m-%d %H:%M') 官網同步" --quiet
echo "✅ 1/3 已 commit"

git push origin main --quiet
echo "✅ 2/3 已 push 上 GitHub"

echo "⏳ 等 GitHub Pages 編譯中..."
for i in {1..12}; do
  STATUS=$(gh api 'repos/jiyu-skincare/jiyu-skincare.github.io/pages' --jq '.status' 2>/dev/null || echo "?")
  if [ "$STATUS" = "built" ]; then
    echo "✅ 3/3 Pages 上線完成"
    break
  fi
  sleep 10
done

echo ""
echo "🎉 完成：$URL"
open "$URL"
