$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$remotes = @(
    @{ Name = "GitHub";  Remote = "github" },
    @{ Name = "GitCode"; Remote = "gitcode" },
    @{ Name = "Gitee";   Remote = "gitee" }
)

Write-Host "`nPushing to 3 remotes in parallel..." -ForegroundColor Cyan

$jobs = foreach ($r in $remotes) {
    Start-Job -ScriptBlock {
        param($n, $rem, $dir)
        Push-Location $dir
        $out = git push $rem 2>&1
        $ok = $LASTEXITCODE -eq 0
        Pop-Location
        return @{ Name = $n; Success = $ok; Output = "$out" }
    } -ArgumentList $r.Name, $r.Remote, $repoDir
}

$results = $jobs | Wait-Job | Receive-Job
Remove-Job -Id $jobs.Id

Write-Host "`n--- Results ---" -ForegroundColor Cyan
$allOk = $true
foreach ($r in $results) {
    if ($r.Success) {
        Write-Host "  [OK] $($r.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $($r.Name)" -ForegroundColor Red
        $r.Output -split "`n" | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkRed }
        $allOk = $false
    }
}

if ($allOk) {
    Write-Host "`nAll pushed successfully." -ForegroundColor Green
} else {
    Write-Host "`nSome remotes failed." -ForegroundColor Yellow
    exit 1
}
