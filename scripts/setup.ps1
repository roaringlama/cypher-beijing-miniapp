$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
npm.cmd install
Write-Host 'Cypher Beijing dependencies are ready.' -ForegroundColor Green

