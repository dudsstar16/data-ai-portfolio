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
  (New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5) -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration (New-TimeSpan -Days 3650))
)
try {
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers -Description "Analisa certificados novos do portfólio de Eduarda." -Force | Out-Null
} catch {
  $taskCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -RepositoryPath `"$RepositoryPath`""
  & schtasks.exe /Create /TN $TaskName /SC MINUTE /MO 30 /TR $taskCommand /F | Out-Null
  if ($LASTEXITCODE -ne 0) { throw }
}
Write-Output "Tarefa '$TaskName' instalada para o usuário atual."
