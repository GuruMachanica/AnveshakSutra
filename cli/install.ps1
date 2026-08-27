# AnveshakSutra CLI Quick Installer for Windows PowerShell
Write-Host "🚀 Installing AnveshakSutra CLI (v1.0.0)..." -ForegroundColor Cyan

# Check for python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is required but not found. Please install Python 3.9+ from python.org or Microsoft Store." -ForegroundColor Red
    exit 1
}

# Install directly from repository
python -m pip install --upgrade pip
python -m pip install "git+https://github.com/GuruMachanica/AnveshakSutra.git#subdirectory=cli"

Write-Host ""
Write-Host "✅ AnveshakSutra CLI installed successfully!" -ForegroundColor Green
Write-Host "👉 Run 'anveshak --help' to start scanning and self-healing." -ForegroundColor Yellow
