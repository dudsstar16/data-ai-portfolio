param(
  [string]$RepositoryPath = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $RepositoryPath
$logPath = Join-Path $RepositoryPath "automation\certificate-watch.log"

function Write-Log([string]$Message) {
  "$(Get-Date -Format o) $Message" | Add-Content -LiteralPath $logPath -Encoding utf8
}

$branch = (git branch --show-current).Trim()
if (-not $branch) { Write-Log "Interrompido: não há branch ativa."; exit 0 }
$untrackedCertificates = @(git ls-files --others --exclude-standard -- "curriculo/06-certificados/*.pdf")
if ($untrackedCertificates.Count -eq 0) { exit 0 }

$status = @(git status --porcelain)
$allowedPattern = '^(\?\? |[ MADRCU]{2} )(curriculo/06-certificados/.*\.pdf|data/certificates\.json|data/projects\.json|curriculo/04-revisao/painel-profissional\.md|curriculo/02-fonte/curriculo-analista-de-dados\.md|curriculo/03-layout/curriculo-analista-de-dados\.html|public/documents/curriculo-eduarda-reis\.pdf)$'
if (@($status | Where-Object { $_ -notmatch $allowedPattern }).Count -gt 0) {
  Write-Log "Interrompido: há alterações fora da automação; revise e faça commit antes da próxima tentativa."
  exit 0
}

git fetch origin $branch
git merge --ff-only "origin/$branch"
npm.cmd run sync:certificates
npm.cmd run curate:content
npm.cmd run career:review
npm.cmd run resume:sync
npm.cmd run resume:render

$managed = @(
  "data/certificates.json", "data/projects.json", "curriculo/04-revisao/painel-profissional.md",
  "curriculo/02-fonte/curriculo-analista-de-dados.md", "curriculo/03-layout/curriculo-analista-de-dados.html",
  "public/documents/curriculo-eduarda-reis.pdf"
) + $untrackedCertificates
git add -- $managed
if (git diff --cached --quiet) { exit 0 }
git config user.name "Eduarda portfolio automation"
git config user.email "eduarda-portfolio-automation@users.noreply.github.com"
git commit -m "chore(content): ingest new certificates"
git push origin $branch
Write-Log "Certificados processados e enviados: $($untrackedCertificates.Count)."
