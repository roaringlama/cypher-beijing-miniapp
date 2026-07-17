$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Write-Host 'Starting Checkpoint A preview at http://127.0.0.1:4173' -ForegroundColor Cyan
npm.cmd run preview

