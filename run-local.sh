#!/bin/bash

# Script para correr la aplicación SmartKin en local
# Uso: ./run-local.sh

set -e  # Salir si algún comando falla

echo "🧹 Limpiando archivos de build anteriores..."
# rm -rf dist/ .angular/

echo "🔑 Configurando variables de entorno..."
export VAULT_TOKEN=hvs.CAESIOCJZG1cGAf0NYDjv-L2dcd5NvvAx8spIE0WT88_pqmVGh4KHGh2cy41bTNiN2YzMEhGMjJxUUJFQ2ExZ0ZzSDY
export ENVM=qa-cloud
export VAULT_URL=http://prx-qa.vault.tst
# export ENVM=qa-cloud

echo "📋 Variables configuradas:"
echo "VAULT_TOKEN: $VAULT_TOKEN"
echo "ENVM: $ENVM"
echo "VAULT_URL: $VAULT_URL"

# echo "🏗️  Construyendo la aplicación SSR..."
# npm run build:ssr

echo "🚀 Iniciando servidor de desarrollo..."
npm run start-dev:unix
echo "🌐 Accede a la aplicación en https://localhost:7001"
