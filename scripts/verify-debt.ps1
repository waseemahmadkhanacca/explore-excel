# Opens debt-payoff-calculator.xlsx in real Excel, recalculates it, and compares
# every scheduled month against a simulation written independently in
# scripts/expect-debt.js.
#
# Both 120-month schedules are checked in full — per-debt closing balances and
# the three totals for every row — plus the comparison sheet and the payoff
# dates. Ranges are read in one call each; cell-by-cell COM would take minutes.
#
# Run with: npm run verify:debt

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$file = Join-Path $root 'public\downloads\debt-payoff-calculator.xlsx'

$node = 'E:\Node\node-v24.18.0-win-x64'
if (Test-Path $node) { $env:Path = "$node;" + $env:Path }

$expected = (& node (Join-Path $PSScriptRoot 'expect-debt.js') | Out-String) | ConvertFrom-Json

# Geometry, mirroring the S map in build-templates.js.
$FIRST = 11
$ND    = [int]$expected.meta.debts
$LAST  = $FIRST + [int]$expected.meta.horizon - 1
$BAL1  = 13                 # column M
$TOTP  = 18; $TOTI = 19; $REM = 20

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$pass = 0; $fail = 0; $shown = 0
function Bad($msg) {
    $script:fail++
    if ($script:shown -lt 12) { Write-Output "  $msg"; $script:shown++ }
}

try {
    $wb = $excel.Workbooks.Open($file, 0, $true)
    $excel.CalculateFullRebuild()

    foreach ($method in @('Snowball', 'Avalanche')) {
        $ws = $wb.Worksheets.Item($method)
        # One read for the whole block: month, date, balances, then the totals.
        $block = $ws.Range($ws.Cells.Item($FIRST, 1), $ws.Cells.Item($LAST, $REM)).Value2
        $rows = $expected.methods.$method

        for ($i = 0; $i -lt $rows.Count; $i++) {
            $want = $rows[$i]
            $r = $i + 1
            $month = [int]$block.GetValue($r, 1)
            if ($month -ne [int]$want[0]) { Bad "$method row $($FIRST+$i): month $month, expected $($want[0])"; continue }

            $gotDate = [math]::Round([double]$block.GetValue($r, 2))
            if ($gotDate -ne [int]$want[1]) { Bad "$method month $month date serial $gotDate, expected $($want[1])" }
            else { $pass++ }

            for ($d = 0; $d -lt $ND; $d++) {
                $got = [math]::Round([double]$block.GetValue($r, ($BAL1 + $d)), 2)
                $exp = [math]::Round([double]$want[2 + $d], 2)
                if ([math]::Abs($got - $exp) -gt 0.005) {
                    Bad "$method month $month debt $($d+1) balance $got, expected $exp"
                } else { $pass++ }
            }
            # The parentheses matter: PowerShell's comma binds tighter than +,
            # so @($TOTP, 2 + $ND) would build @(18,2,5) rather than @(18,7).
            foreach ($pair in @(@($TOTP, (2 + $ND)), @($TOTI, (3 + $ND)), @($REM, (4 + $ND)))) {
                $got = [math]::Round([double]$block.GetValue($r, $pair[0]), 2)
                $exp = [math]::Round([double]$want[$pair[1]], 2)
                if ([math]::Abs($got - $exp) -gt 0.005) {
                    Bad "$method month $month col $($pair[0]) = $got, expected $exp"
                } else { $pass++ }
            }
        }
    }

    # Comparison sheet, and the ordering each method actually used.
    $cmp = $wb.Worksheets.Item('Comparison')
    $map = @{ Snowball = 5; Avalanche = 6 }
    foreach ($method in @('Snowball', 'Avalanche')) {
        $r = $map[$method]
        $c = $expected.comparison.$method
        $checks = @(
            @('months',        [double]$cmp.Cells.Item($r, 2).Value2, [double]$c.months),
            @('payoff date',   [math]::Round([double]$cmp.Cells.Item($r, 3).Value2), [double]$c.payoffSerial),
            @('interest paid', [math]::Round([double]$cmp.Cells.Item($r, 4).Value2, 2), [math]::Round([double]$c.totalInterest, 2)),
            @('total paid',    [math]::Round([double]$cmp.Cells.Item($r, 5).Value2, 2), [math]::Round([double]$c.totalPaid, 2))
        )
        foreach ($chk in $checks) {
            if ([math]::Abs($chk[1] - $chk[2]) -gt 0.005) {
                Bad "Comparison $method $($chk[0]): $($chk[1]), expected $($chk[2])"
            } else { $pass++ }
        }
        Write-Output ("  {0,-10} clears in {1,2} months on {2}, interest {3:N2}" -f `
            $method, $c.months, [datetime]::FromOADate($c.payoffSerial).ToString('MMM yyyy'), $c.totalInterest)
    }

    # The two methods must actually differ, or the comparison teaches nothing.
    if ($expected.comparison.Snowball.totalInterest -le $expected.comparison.Avalanche.totalInterest) {
        Bad "Avalanche should cost less interest than snowball; it does not"
    } else {
        $pass++
        $saved = $expected.comparison.Snowball.totalInterest - $expected.comparison.Avalanche.totalInterest
        Write-Output ("  Avalanche saves {0:N2} in interest" -f $saved)
    }

    # Nothing anywhere may show an error.
    foreach ($ws in $wb.Worksheets) {
        try {
            $f = $ws.UsedRange.SpecialCells(-4123)
            if ($null -ne $f) {
                foreach ($cell in $f.Cells) {
                    if ($cell.Text -match '^#(VALUE|REF|NAME|DIV/0|N/A|NUM|NULL|SPILL|CALC)') {
                        Bad "error cell $($ws.Name)!$($cell.Address(0,0)) = $($cell.Text)"
                    }
                }
            }
        } catch {}
    }

    $chk = $wb.Worksheets.Item('Debts').Range('B18').Text
    Write-Output "  Debts sheet check reads: $chk"
}
finally {
    if ($null -ne $wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}

Write-Output ''
Write-Output "$pass checks passed, $fail failed"
if ($fail -gt 0) { exit 1 }
Write-Output 'Both payoff schedules match an independent simulation, month by month.'
exit 0
