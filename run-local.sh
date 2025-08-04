#!/bin/bash

# Script para correr la aplicación SmartKin en local
# Uso: ./run-local.sh

set -e  # Salir si algún comando falla

echo "🧹 Limpiando archivos de build anteriores..."
rm -rf dist/ .angular/

echo "🔑 Configurando variables de entorno..."
export VAULT_TOKEN=<tu_token_de_vault_aqui>
export ENVM=qa
# export ENVM=qa-cloud

echo "📋 Variables configuradas:"
echo "VAULT_TOKEN: $VAULT_TOKEN"
echo "ENVM: $ENVM"

echo "🏗️  Construyendo la aplicación SSR..."
npm run build:ssr

echo "🚀 Iniciando servidor de desarrollo..."
npm run dev:unix
echo "🌐 Accede a la aplicación en http://localhost:7001"
