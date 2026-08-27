#!/usr/bin/env bash
# AnveshakSutra CLI Quick Installer for Linux & macOS
set -e

echo "🚀 Installing AnveshakSutra CLI (v1.0.0)..."

# Ensure Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found. Please install Python 3.9+."
    exit 1
fi

# Install directly via pip
python3 -m pip install --upgrade pip
python3 -m pip install "git+https://github.com/GuruMachanica/AnveshakSutra.git#subdirectory=cli"

echo ""
echo "✅ AnveshakSutra CLI installed successfully!"
echo "👉 Run 'anveshak --help' to start scanning and self-healing."
