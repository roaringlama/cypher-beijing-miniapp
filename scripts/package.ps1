$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
npm.cmd run verify
$Output = Join-Path $Root 'dist\cypher-beijing-checkpoint-a.zip'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Output) | Out-Null
$Items = @('miniprogram', 'cloudfunctions', 'database', 'docs', 'prototype', 'artifacts\checkpoint-a', 'project.config.json', 'package.json', 'README.md')
Compress-Archive -Path $Items -DestinationPath $Output -Force
Write-Host "Package created: $Output" -ForegroundColor Green
