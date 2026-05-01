@echo off
chcp 65001 >nul
title Pushing to all remotes...

echo.
echo ===== [1/3] GitHub =====
git push github

echo.
echo ===== [2/3] GitCode =====
git push gitcode

echo.
echo ===== [3/3] Gitee =====
git push gitee

echo.
echo All done!
echo.
pause
