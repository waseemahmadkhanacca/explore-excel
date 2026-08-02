# Opens every template in real Excel and fails if any needs repair, shows a
# formula error, or has gridlines switched on.
#
# Reading a workbook back with exceljs proves only that exceljs can parse its
# own output. It does not prove Excel will accept it. This does.
#
# With DisplayAlerts off, Excel cannot show its "we found a problem with some
# content" prompt, so Workbooks.Open raises instead. That exception is the
# corruption signal, verified against a known-bad control file.
#
# Run with: npm run verify:templates

$ErrorActionPreference = 'Continue'
$dir = (Resolve-Path (Join-Path $PSScriptRoot '..\public\downloads')).Path

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.AskToUpdateLinks = $false

$failed = 0
$results = @()

foreach ($file in Get-ChildItem $dir -Filter '*.xlsx' | Sort-Object Name) {
    $status = 'OK'
    $notes = @()
    $wb = $null

    try {
        # UpdateLinks 0, ReadOnly true. Anything Excel would repair raises here.
        $wb = $excel.Workbooks.Open($file.FullName, 0, $true)
    }
    catch {
        $results += [pscustomobject]@{
            File = $file.Name; Status = 'NEEDS REPAIR'; Sheets = 0; Notes = 'Excel refused to open it'
        }
        $failed++
        continue
    }

    try {
        $excel.CalculateFullRebuild()

        $gridOn = @()
        $errCells = 0
        foreach ($ws in $wb.Worksheets) {
            $ws.Activate()
            try {
                if ($excel.ActiveWindow.DisplayGridlines) { $gridOn += $ws.Name }
            } catch {}

            # Only formula cells can show an error; checking those is far
            # cheaper than walking every used cell.
            try {
                $f = $ws.UsedRange.SpecialCells(-4123)  # xlCellTypeFormulas
                if ($null -ne $f) {
                    foreach ($cell in $f.Cells) {
                        if ($cell.Text -match '^#(VALUE|REF|NAME|DIV/0|N/A|NUM|NULL|SPILL|CALC)') { $errCells++ }
                    }
                }
            } catch {}
        }

        if ($gridOn.Count -gt 0) { $notes += "gridlines on: $($gridOn -join ',')"; $status = 'GRIDLINES'; $failed++ }
        if ($errCells -gt 0)     { $notes += "$errCells formula error cells"; $status = 'FORMULA ERRORS'; $failed++ }

        $results += [pscustomobject]@{
            File = $file.Name; Status = $status; Sheets = $wb.Worksheets.Count
            Notes = ($notes -join '; ')
        }
    }
    finally {
        if ($null -ne $wb) { $wb.Close($false) }
    }
}

$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null

$results | Format-Table -AutoSize

if ($failed -gt 0) { Write-Output "FAILED: $failed problem(s)."; exit 1 }
Write-Output 'All templates open cleanly in Excel: no repairs, no formula errors, no gridlines.'
exit 0
