# Switches gridlines off on every sheet of every template.
#
# The four generated templates already ship with gridlines off; this exists for
# the eight originals, which have no build script. Excel itself rewrites the
# files, so the output is guaranteed to be valid.
#
# Run with: npm run fix:gridlines

$ErrorActionPreference = 'Continue'
$dir = (Resolve-Path (Join-Path $PSScriptRoot '..\public\downloads')).Path

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.AskToUpdateLinks = $false

$changed = 0
foreach ($file in Get-ChildItem $dir -Filter '*.xlsx' | Sort-Object Name) {
    $wb = $null
    try {
        $wb = $excel.Workbooks.Open($file.FullName, 0, $false)   # writable
    }
    catch {
        Write-Output ("  {0,-30} SKIPPED - will not open" -f $file.Name)
        continue
    }

    try {
        $touched = $false
        foreach ($ws in $wb.Worksheets) {
            $ws.Activate()
            if ($excel.ActiveWindow.DisplayGridlines) {
                $excel.ActiveWindow.DisplayGridlines = $false
                $touched = $true
            }
        }
        # Leave the first sheet selected rather than whichever was last.
        $wb.Worksheets.Item(1).Activate()

        if ($touched) {
            $wb.Save()
            $changed++
            Write-Output ("  {0,-30} gridlines off" -f $file.Name)
        } else {
            Write-Output ("  {0,-30} already off" -f $file.Name)
        }
    }
    finally {
        if ($null -ne $wb) { $wb.Close($true) }
    }
}

$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
Write-Output "$changed file(s) changed."
