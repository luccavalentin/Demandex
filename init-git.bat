@echo off
cd /d "%~dp0"
git init
git add components/ app/globals.css .gitignore package.json tsconfig.json next.config.js postcss.config.js tailwind.config.ts
git commit -m "feat: Melhorias no sidebar - menu colapsável, cores dos ícones, layout responsivo e mobile otimizado"
echo Git inicializado e commit realizado!

