# Opens personal-budget-planner.xlsx in real Excel, forces a full recalculation,
# and compares every formula result against values computed independently in
# JavaScript by scripts/expect-budget.js.
#
# Opening without an error only proves the file is well formed. This proves the
# arithmetic is right.
#
# Run with: npm run verify:budget

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$file = Join-Path $root 'public\downloads\personal-budget-planner.xlsx'

$node = 'E:\Node\node-v24.18.0-win-x64'
if (Test-Path $node) { $env:Path = "$node;" + $env:Path }

$json = & node (Join-Path $PSScriptRoot 'expect-budget.js') | Out-String
$expected = $json | ConvertFrom-Json

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$pass = 0; $fail = 0
try {
    $wb = $excel.Workbooks.Open($file, 0, $false)
    $excel.CalculateFullRebuild()

    foreach ($sheetName in @('Planner', 'Summary')) {
        $ws = $wb.Worksheets.Item($sheetName)
        $cells = $expected.$sheetName
        foreach ($addr in $cells.PSObject.Properties.Name) {
            $want = [double]$cells.$addr
            $got = $ws.Range($addr).Value2
            if ($null -eq $got) { $got = 0 }
            $got = [math]::Round([double]$got, 2)
            $want = [math]::Round($want, 2)
            if ([math]::Abs($got - $want) -lt 0.005) {
                $pass++
            } else {
                $fail++
                Write-Output ("  MISMATCH {0}!{1,-6} expected {2,12:N2}  got {3,12:N2}" -f $sheetName, $addr, $want, $got)
            }
        }
    }

    # The workbook's own reconciliation line.
    $chk = $wb.Worksheets.Item('Summary').Range($expected.meta.checkCell).Text
    if ($chk -eq $expected.meta.checkExpects) {
        $pass++
        Write-Output "  Workbook self-check reads: $chk"
    } else {
        $fail++
        Write-Output "  MISMATCH self-check: expected '$($expected.meta.checkExpects)', got '$chk'"
    }

    # Nothing anywhere may show an error.
    $errs = 0
    foreach ($ws in $wb.Worksheets) {
        try {
            $f = $ws.UsedRange.SpecialCells(-4123)
            if ($null -ne $f) {
                foreach ($cell in $f.Cells) {
                    if ($cell.Text -match '^#(VALUE|REF|NAME|DIV/0|N/A|NUM|NULL|SPILL|CALC)') {
                        $errs++
                        Write-Output ("  ERROR CELL {0}!{1} = {2}" -f $ws.Name, $cell.Address(0,0), $cell.Text)
                    }
                }
            }
        } catch {}
    }
    if ($errs -gt 0) { $fail += $errs }

    # Change the focus month and confirm the INDEX/MATCH actually re-reads.
    $sm = $wb.Worksheets.Item('Summary')
    $before = [double]$sm.Range('B7').Value2
    $sm.Range('B4').Value2 = 'Dec'
    $excel.CalculateFullRebuild()
    $after = [double]$sm.Range('B7').Value2
    if ($before -eq $after) {
        Write-Output "  MISMATCH: changing the month did not change the figures (INDEX/MATCH is not live)"
        $fail++
    } else {
        Write-Output ("  Month switch Mar -> Dec moves Housing from {0:N0} to {1:N0}" -f $before, $after)
        $pass++
    }
}
finally {
    if ($null -ne $wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}

Write-Output ''
Write-Output "$pass checks passed, $fail failed"
if ($fail -gt 0) { exit 1 }
Write-Output 'Every formula in the personal budget planner returns the expected value.'
exit 0
