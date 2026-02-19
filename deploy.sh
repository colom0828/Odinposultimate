#!/bin/bash

# 🚀 ODIN POS - Script de Deployment
# Este script facilita el deployment en diferentes plataformas

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ODIN POS - Deployment Script${NC}"
echo ""

# Función para mostrar el menú
show_menu() {
    echo "Selecciona la plataforma de deployment:"
    echo ""
    echo "1) Vercel (Recomendado)"
    echo "2) Netlify"
    echo "3) GitHub Pages"
    echo "4) Render"
    echo "5) Railway"
    echo "6) Build local solamente"
    echo "7) Preview local"
    echo "0) Salir"
    echo ""
}

# Verificar que pnpm está instalado
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}⚠️  pnpm no está instalado. Instalando...${NC}"
        npm install -g pnpm
    fi
}

# Limpiar build anterior
clean_build() {
    echo -e "${YELLOW}🧹 Limpiando build anterior...${NC}"
    rm -rf dist
}

# Build del proyecto
build_project() {
    echo -e "${BLUE}📦 Instalando dependencias...${NC}"
    pnpm install

    echo -e "${BLUE}🔨 Building proyecto...${NC}"
    pnpm build

    echo -e "${GREEN}✅ Build completado en ./dist${NC}"
}

# Deploy a Vercel
deploy_vercel() {
    echo -e "${BLUE}🟢 Deployando a Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
        npm i -g vercel
    fi

    vercel --prod
    echo -e "${GREEN}✅ Deployed a Vercel!${NC}"
}

# Deploy a Netlify
deploy_netlify() {
    echo -e "${BLUE}🟢 Deployando a Netlify...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}⚠️  Netlify CLI no está instalado. Instalando...${NC}"
        npm i -g netlify-cli
    fi

    netlify deploy --prod
    echo -e "${GREEN}✅ Deployed a Netlify!${NC}"
}

# Deploy a GitHub Pages
deploy_github_pages() {
    echo -e "${BLUE}🟢 Preparando para GitHub Pages...${NC}"
    
    # Verificar que estamos en un repo git
    if [ ! -d .git ]; then
        echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
        exit 1
    fi

    # Build
    clean_build
    build_project

    # Commit y push
    git add .
    git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main

    echo -e "${GREEN}✅ Pushed a GitHub. El workflow se ejecutará automáticamente.${NC}"
    echo -e "${YELLOW}📝 Verifica el progreso en: https://github.com/TU_USUARIO/TU_REPO/actions${NC}"
}

# Deploy a Render
deploy_render() {
    echo -e "${BLUE}🟢 Deployando a Render...${NC}"
    
    if [ ! -d .git ]; then
        echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
        exit 1
    fi

    git add .
    git commit -m "Deploy to Render - $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main

    echo -e "${GREEN}✅ Pushed a GitHub. Render detectará los cambios automáticamente.${NC}"
}

# Deploy a Railway
deploy_railway() {
    echo -e "${BLUE}🟣 Deployando a Railway...${NC}"
    
    if [ ! -d .git ]; then
        echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
        exit 1
    fi

    git add .
    git commit -m "Deploy to Railway - $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main

    echo -e "${GREEN}✅ Pushed a GitHub. Railway detectará los cambios automáticamente.${NC}"
}

# Build local
build_local() {
    clean_build
    build_project
}

# Preview local
preview_local() {
    echo -e "${BLUE}👀 Iniciando preview local...${NC}"
    
    if [ ! -d dist ]; then
        clean_build
        build_project
    fi

    echo -e "${GREEN}✅ Preview disponible en: http://localhost:4173${NC}"
    pnpm preview
}

# Main loop
check_pnpm

while true; do
    show_menu
    read -p "Opción: " option

    case $option in
        1)
            clean_build
            build_project
            deploy_vercel
            ;;
        2)
            clean_build
            build_project
            deploy_netlify
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            deploy_render
            ;;
        5)
            deploy_railway
            ;;
        6)
            build_local
            ;;
        7)
            preview_local
            ;;
        0)
            echo -e "${GREEN}👋 ¡Hasta luego!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opción inválida${NC}"
            ;;
    esac

    echo ""
    echo -e "${YELLOW}Presiona Enter para continuar...${NC}"
    read
    clear
done
