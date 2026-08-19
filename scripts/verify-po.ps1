# Opens purchase-order.xlsx in real Excel, recalculates, and checks the order
# document, the log's ageing and the summary against scripts/expect-po.js.
#
# Ageing depends on TODAY(), so the workbook's own date cell is read first and
# handed to the expectation script. That way the check follows the file as it
# ages instead of testing a frozen day nobody will ever see.
#
# Run with: npm run verify:po

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$file = Join-Path $root 'public\downloads\purchase-order.xlsx'

$node = 'E:\Node\node-v24.18.0-win-x64'
if (Test-Path $node) { $env:Path = "$node;" + $env:Path }

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$pass = 0; $fail = 0
function Bad($m) { $script:fail++; Write-Output "  MISMATCH $m" }
function Same($label, $got, $want, $tol = 0.005) {
    if ([math]::Abs([double]$got - [double]$want) -le $tol) { $script:pass++ }
    else { Bad "$label -> got $got, expected $want" }
}

try {
    $wb = $excel.Workbooks.Open($file, 0, $true)
    $excel.CalculateFullRebuild()

    $lg = $wb.Worksheets.Item('PO Log')
    $todaySerial = [math]::Round([double]$lg.Range('C4').Value2)
    Write-Output "  Workbook TODAY() = $([datetime]::FromOADate($todaySerial).ToString('dd MMM yyyy'))"

    $exp = (& node (Join-Path $PSScriptRoot 'expect-po.js') $todaySerial | Out-String) | ConvertFrom-Json

    # --- the printable order ---
    $po = $wb.Worksheets.Item('Purchase Order')
    $lf = [int]$exp.geometry.lineFirst
    for ($i = 0; $i -lt $exp.order.lines.Count; $i++) {
        Same "order line $($i+1)" $po.Cells.Item($lf + $i, 4).Value2 $exp.order.lines[$i]
    }
    $sub = [int]$exp.geometry.subtotal
    Same 'subtotal'     $po.Cells.Item($sub, 4).Value2      $exp.order.subtotal
    Same 'sales tax'    $po.Cells.Item($sub + 1, 4).Value2  $exp.order.tax
    Same 'order total'  $po.Cells.Item($sub + 2, 4).Value2  $exp.order.total
    Same 'expected delivery' ([math]::Round([double]$po.Range('D6').Value2)) $exp.order.expectedDelivery
    Write-Output ("  Order: subtotal {0:N2} + tax {1:N2} = {2:N2}" -f $exp.order.subtotal, $exp.order.tax, $exp.order.total)

    # --- the log ---
    $first = [int]$exp.geometry.logFirst
    for ($i = 0; $i -lt $exp.rows.Count; $i++) {
        $r = $first + $i
        $e = $exp.rows[$i]
        Same "$($e.po) outstanding" $lg.Cells.Item($r, 7).Value2 $e.outstanding
        Same "$($e.po) days late"   $lg.Cells.Item($r, 8).Value2 $e.daysLate
        $gotStatus = $lg.Cells.Item($r, 9).Text
        if ($gotStatus -eq $e.status) { $pass++ } else { Bad "$($e.po) status -> got '$gotStatus', expected '$($e.status)'" }
        $gotAction = $lg.Cells.Item($r, 11).Text
        if ($gotAction -eq $e.action) { $pass++ } else { Bad "$($e.po) action -> got '$gotAction', expected '$($e.action)'" }
        Write-Output ("    {0}  {1,-22} outstanding {2,10:N2}  {3,3} days late  {4,-13} {5}" -f `
            $e.po, $e.vendor, $e.outstanding, $e.daysLate, $e.status, $e.action)
    }

    # --- the summary ---
    $sm = $wb.Worksheets.Item('Summary')
    for ($i = 0; $i -lt $exp.summary.buckets.Count; $i++) {
        $r = 6 + $i
        $b = $exp.summary.buckets[$i]
        Same "bucket $($b.bucket) count"       $sm.Cells.Item($r, 2).Value2 $b.count
        Same "bucket $($b.bucket) outstanding" $sm.Cells.Item($r, 3).Value2 $b.outstanding
    }
    Same 'total aged outstanding' $sm.Range('C11').Value2 $exp.summary.totalOutstandingAged
    Same 'orders raised'          $sm.Range('C14').Value2 $exp.summary.ordersRaised
    Same 'fully received'         $sm.Range('C15').Value2 $exp.summary.fullyReceived
    Same 'needing a chase'        $sm.Range('C16').Value2 $exp.summary.needingChase
    Same 'total committed'        $sm.Range('C17').Value2 $exp.summary.totalCommitted
    Same 'still to arrive'        $sm.Range('C18').Value2 $exp.summary.stillToArrive
    Same 'overdue value'          $sm.Range('C19').Value2 $exp.summary.overdueValue

    # Row 21 is the "Check" heading; the formula sits on the row below it.
    $chk = $sm.Range('C22').Text
    if ($chk -eq 'Agrees') { $pass++; Write-Output "  Summary self-check reads: Agrees" }
    else { Bad "self-check -> '$chk'" }

    # Nothing may show an error anywhere.
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
}
finally {
    if ($null -ne $wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}

Write-Output ''
Write-Output "$pass checks passed, $fail failed"
if ($fail -gt 0) { exit 1 }
Write-Output 'The purchase order, its log and its summary all agree with an independent calculation.'
exit 0
