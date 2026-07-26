$port = 5000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
    Start-Process "http://localhost:$port/"
} catch {
    Write-Error $_.Exception.Message
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.ToLower()
        $method = $request.HttpMethod.ToUpper()

        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

        if ($method -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        # 1. POST /api/chat
        if ($path -eq "/api/chat" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $jsonBody = $reader.ReadToEnd() | ConvertFrom-Json
            $q = if ($jsonBody.question) { $jsonBody.question.ToLower() } else { "" }

            $ans = "SAP Copilot Response: For query '" + $jsonBody.question + "', check T-Codes: FS00, FB50, VKOA, OB52, OBYC."
            if ($q.Contains("vkoa") -or $q.Contains("revenue")) {
                $ans = "SD-FI Account Determination (VKOA): SPRO -> SD -> Basic Functions -> Account Assignment -> Revenue Account Determination. Keys: Application V, Chart of Accounts, Sales Org, Cust. Acct Grp, Account Key."
            } elseif ($q.Contains("obyc") -or $q.Contains("goods receipt") -or $q.Contains("bsx")) {
                $ans = "MM-FI Account Determination (OBYC): Key Transactions: BSX (Inventory Posting), WRX (GR/IR Clearing), GBB (Inventory Offsetting/COGS)."
            } elseif ($q.Contains("ob52") -or $q.Contains("period")) {
                $ans = "OB52 Posting Period Error: Run OB52, update open period to 07/2026, and open account types + and S."
            }

            $resObj = @{ answer = $ans; timestamp = (Get-Date).ToString("o") } | ConvertTo-Json
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # 2. POST /api/vkoa/simulate
        if ($path -eq "/api/vkoa/simulate" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $jsonBody = $reader.ReadToEnd() | ConvertFrom-Json

            $coa = if ($jsonBody.coa) { $jsonBody.coa } else { "INT" }
            $salesOrg = if ($jsonBody.salesOrg) { $jsonBody.salesOrg } else { "1000" }
            $custGroup = if ($jsonBody.custGroup) { $jsonBody.custGroup } else { "01" }
            $accountKey = if ($jsonBody.accountKey) { $jsonBody.accountKey } else { "ERL" }
            $amount = [double]($jsonBody.amount)

            $glAcc = "400000 Domestic Sales Revenue"
            if ($accountKey -eq "ERS") { $glAcc = "410000 Sales Cash Discounts" }
            if ($accountKey -eq "MWS") { $glAcc = "175000 Output Sales Tax Payable" }

            $cStr = $coa.PadRight(5)
            $sStr = $salesOrg.PadRight(5)
            $gStr = $custGroup.PadRight(5)
            $aStr = $accountKey.PadRight(4)
            $condRecord = "APP | KTOPL | VKORG | KTGRD | KVSL ==> G/L ACCOUNT`nV   | $cStr | $sStr | $gStr | $aStr ==> $glAcc"

            $resObj = @{
                conditionRecord = $condRecord
                journalEntry = @{
                    debit = @{ pk = "01"; account = "Customer Accounts Receivable"; amount = $amount }
                    credit = @{ pk = "50"; account = $glAcc; amount = $amount }
                }
            } | ConvertTo-Json -Depth 5

            $bytes = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # 3. POST /api/spec/generate
        if ($path -eq "/api/spec/generate" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $jsonBody = $reader.ReadToEnd() | ConvertFrom-Json

            $title = if ($jsonBody.title) { $jsonBody.title } else { "Custom S/4HANA FI Revenue Report" }
            $type = if ($jsonBody.type) { $jsonBody.type } else { "Report" }
            $tcode = if ($jsonBody.tcode) { $jsonBody.tcode } else { "ZFI_REV_AGING" }
            $tables = if ($jsonBody.tables) { $jsonBody.tables } else { "ACDOCA, BKPF, BSEG" }

            $tUpper = $type.ToUpper()
            $markdown = "# FUNCTIONAL SPECIFICATION (RICEF: $tUpper)`nTitle: $title`nTarget T-Code: $tcode`nDatabase Tables: $tables`n`n1. Objective: Provide custom analytical report for S/4HANA finance team.`n2. Logic: Query BKPF for document header, join ACDOCA for G/L line items, link VBRK for SD invoice metadata.`n3. Output: Standard ALV Grid display with export options."

            $resObj = @{ markdown = $markdown } | ConvertTo-Json
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # 4. GET /api/errors
        if ($path -eq "/api/errors" -and $method -eq "GET") {
            $errList = @(
                @{
                    id = "OB52_PERIOD_CLOSED"
                    code = "F5 063 / F5 201"
                    title = "Posting Period Closed (OB52)"
                    spro = "SPRO -> Financial Accounting -> Document -> Posting Periods -> Open and Close Posting Periods"
                    fix = "Open T-Code OB52, find posting period variant, update open fiscal period to 07/2026, and ensure account types + and S are open."
                },
                @{
                    id = "VKOA_DETERMINATION_MISSING"
                    code = "VKOA 001 / VF 051"
                    title = "Revenue Account Determination Missing (VKOA)"
                    spro = "SPRO -> SD -> Basic Functions -> Account Assignment -> Revenue Account Determination"
                    fix = "Execute VKOA, select Table 001, add missing Sales Org and Account Key entry."
                },
                @{
                    id = "OBYC_AUTOMATIC_POSTING"
                    code = "M8 008 / BSX / WRX"
                    title = "MM Automatic Posting Missing (OBYC)"
                    spro = "SPRO -> MM -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings"
                    fix = "Execute OBYC, double click BSX/WRX, assign G/L account for Valuation Class."
                }
            )
            $resObj = $errList | ConvertTo-Json -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # 5. GET /api/tables/acdoca
        if ($path -eq "/api/tables/acdoca" -and $method -eq "GET") {
            $tableObj = @{
                tableName = "ACDOCA"
                description = "S/4HANA Universal Journal Line Items Repository"
                fields = @(
                    @{ name = "BUKRS"; label = "Company Code"; type = "CHAR 4" },
                    @{ name = "BELNR"; label = "Accounting Document Number"; type = "CHAR 10" },
                    @{ name = "GJAHR"; label = "Fiscal Year"; type = "NUMC 4" },
                    @{ name = "RACCT"; label = "G/L Account Number"; type = "CHAR 10" },
                    @{ name = "PRCTR"; label = "Profit Center"; type = "CHAR 10" },
                    @{ name = "HSL"; label = "Amount in Local Currency"; type = "CURR 23,2" }
                )
                mappingFlow = "SD Billing Invoice (VBRK-VBELN)`n   |`n   v Links via BKPF-AWKEY = VBRK-VBELN`nFI Header Document (BKPF-BELNR)`n   |`n   v 1-to-Many Line Items`nS/4HANA Universal Journal (ACDOCA-BELNR)"
            }
            $resObj = $tableObj | ConvertTo-Json -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # Fallback: serve index.html
        $indexPath = Join-Path "C:\Users\uzuma\Downloads\Telegram Desktop" "index.html"
        $bytes = [System.IO.File]::ReadAllBytes($indexPath)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.OutputStream.Close()
    } catch {
        # ignore disconnects
    }
}
