@echo off
chcp 65001 >nul
title Pushing to all remotes...

echo.
echo ===== [1/4] GitHub =====
git push github

echo.
echo ===== [2/4] GitCode =====
git push gitcode

echo.
echo ===== [3/4] Gitee =====
git push gitee

echo.
echo ===== [4/4] GitLab =====
git push gitlab

echo.
echo All done!
echo.
pause
