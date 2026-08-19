# Makes sure no Read me row hides its own text.
#
# The six generated templates size their rows in build-templates.js. The eight
# originals have no build script, so this opens them in Excel and raises any row
# whose wrapped text needs more space than it has been given.
#
# Excel's own AutoFit is not usable here: those sheets merge three columns for
# the text, and AutoFit does nothing on a merged cell. The height is estimated
# from the character count against the merged width instead, generously — a row
# slightly too tall looks fine, a row slightly too short loses a sentence.
#
# Run with: npm run fix:readme

$ErrorActionPreference = 'Continue'
$dir = (Resolve-Path (Join-Path $PSScriptRoot '..\public\downloads')).Path

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$changed = 0
foreach ($file in Get-ChildItem $dir -Filter '*.xlsx' | Sort-Object Name) {
    $wb = $null
    try { $wb = $excel.Workbooks.Open($file.FullName, 0, $false) }
    catch { Write-Output ("  {0,-30} will not open, skipped" -f $file.Name); continue }

    try {
        $ws = $null
        foreach ($sheet in $wb.Worksheets) { if ($sheet.Name -match 'Read') { $ws = $sheet; break } }
        if ($null -eq $ws) { Write-Output ("  {0,-30} no Read me" -f $file.Name); continue }

        # Total width available to the text block on this sheet.
        $width = 0
        for ($c = 1; $c -le 3; $c++) { $width += $ws.Columns.Item($c).ColumnWidth }
        $perLine = [math]::Max(20, [math]::Floor($width * 0.92))

        $touched = 0
        $used = $ws.UsedRange
        $lastRow = $used.Row + $used.Rows.Count - 1
        for ($r = 1; $r -le $lastRow; $r++) {
            $v = $ws.Cells.Item($r, 1).Value2
            if ($null -eq $v -or $v -isnot [string] -or $v.Length -lt 60) { continue }
            $lines = [math]::Ceiling($v.Length / $perLine)
            $need = $lines * 12.75 + 4
            if ($ws.Rows.Item($r).RowHeight + 0.5 -lt $need) {
                $ws.Rows.Item($r).RowHeight = $need
                $touched++
            }
        }

        if ($touched -gt 0) {
            $wb.Save()
            $changed++
            Write-Output ("  {0,-30} raised {1} row(s)" -f $file.Name, $touched)
        } else {
            Write-Output ("  {0,-30} already fits" -f $file.Name)
        }
    }
    finally { if ($null -ne $wb) { $wb.Close($true) } }
}

$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
Write-Output "$changed file(s) changed."
