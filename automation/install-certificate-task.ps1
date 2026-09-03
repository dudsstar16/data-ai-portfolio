param(
  [string]$RepositoryPath = (Split-Path -Parent $PSScriptRoot),
  [string]$TaskName = "PortfolioDudsCertificateIngestion"
)

$ErrorActionPreference = "Stop"
$scriptPath = Join-Path $RepositoryPath "automation\watch-certificates.ps1"
if (-not (Test-Path -LiteralPath $scriptPath)) { throw "Script não encontrado: $scriptPath" }
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -RepositoryPath `"$RepositoryPath`""
$triggers = @(
  (New-ScheduledTaskTrigger -AtLogOn),
  (New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes(5) -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration (New-TimeSpan -Days 3650))
)
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers -Description "Analisa certificados novos do portfólio de Eduarda." -Force | Out-Null
Write-Output "Tarefa '$TaskName' instalada para o usuário atual."
