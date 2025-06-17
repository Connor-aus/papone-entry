# Load env vars from .env
$envVars = Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $name, $value = $matches[1].Trim(), $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value)
    }
}

$bucket = $env:S3_BUCKET_NAME
$region = $env:AWS_REGION_DEPLOYMENT
$domainName = $env:DOMAIN_NAME
$certArn = $env:ACM_CERT_ARN  # This must be in us-east-1
$accountId = $env:AWS_ACCOUNT_ID

# 1. Build app
npm install
npm run build

# 2. Deploy to S3
aws s3 sync ./build/ "s3://$bucket" --delete

# 3. Create or reuse CloudFront OAC (Origin Access Control)
$oacName = "cf-oac-$bucket"
$oacId = aws cloudfront list-origin-access-controls `
  --query "OriginAccessControlList.Items[?Name=='$oacName'].Id" `
  --output text

if (-not $oacId -or $oacId -eq "" -or $oacId -eq "None") {
    Write-Host "Creating new Origin Access Control..."

    $oacCreateResponse = aws cloudfront create-origin-access-control `
        --origin-access-control-config "{
            `"Name`": `"$oacName`",
            `"Description`": `"OAC for $bucket`",
            `"SigningProtocol`": `"sigv4`",
            `"SigningBehavior`": `"always`",
            `"OriginAccessControlOriginType`": `"s3`"
        }" | ConvertFrom-Json

    $oacId = $oacCreateResponse.OriginAccessControl.Id

    if (-not $oacId -or $oacId -eq "" -or $oacId -eq "None") {
        Write-Host "Failed to create or retrieve OAC ID. Exiting."
        exit 1
    }

    Write-Host "Created OAC: $oacId"
} else {
    Write-Host "Using existing OAC: $oacId"
}

# 4. Create or reuse CloudFront distribution
$originDomain = "$bucket.s3.$region.amazonaws.com"
$cfDistId = aws cloudfront list-distributions `
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='$originDomain'].Id" `
  --output text

if (-not $cfDistId -or $cfDistId -eq "" -or $cfDistId -eq "None") {
    Write-Host "Creating new CloudFront distribution..."

    $cfConfig = @{
        CallerReference = ("ref-" + [guid]::NewGuid().ToString())
        Comment = "Distribution for $domainName"
        Enabled = $true
        Origins = @{
            Quantity = 1
            Items = @(@{
                Id = "S3Origin"
                DomainName = $originDomain
                S3OriginConfig = @{ OriginAccessIdentity = "" }
                OriginAccessControlId = $oacId
            })
        }
        DefaultCacheBehavior = @{
            TargetOriginId = "S3Origin"
            ViewerProtocolPolicy = "redirect-to-https"
            AllowedMethods = @{
                Quantity = 2
                Items = @("GET", "HEAD")
                CachedMethods = @{
                    Quantity = 2
                    Items = @("GET", "HEAD")
                }
            }
            Compress = $true
            CachePolicyId = "658327ea-f89d-4fab-a63d-7e88639e58f6"
        }
        ViewerCertificate = @{
            ACMCertificateArn = $certArn
            SSLSupportMethod = "sni-only"
            MinimumProtocolVersion = "TLSv1.2_2021"
        }
        Aliases = @{
            Quantity = 1
            Items = @($domainName)
        }
        DefaultRootObject = "index.html"
    }

    $configPath = "infra/cf-distribution-config.json"
    $cfConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $configPath -Encoding utf8NoBOM

    $cfDistId = aws cloudfront create-distribution `
        --distribution-config file://$configPath `
        --query "Distribution.Id" `
        --output text

    if (-not $cfDistId -or $cfDistId -eq "" -or $cfDistId -eq "None") {
        Write-Host "Failed to create CloudFront distribution. Exiting."
        exit 1
    }

    Write-Host "Created CloudFront distribution: $cfDistId"
} else {
    Write-Host "Found existing CloudFront distribution: $cfDistId"
}

# 5. Apply bucket policy to allow CloudFront access only
$cfDistArn = "arn:aws:cloudfront::${accountId}:distribution/$cfDistId"
$policyTemplate = Get-Content "infra/bucket-policy.json" -Raw
arn:aws:cloudfront::$accountId:distribution/$cfDistId
$policy = $policyTemplate `
    -replace '__BUCKET_NAME__', $bucket `
    -replace '__CLOUDFRONT_DIST_ARN__', $cfDistArn

$policyPath = "infra/bucket-policy-applied.json"
Set-Content -Path $policyPath -Value $policy -Encoding utf8NoBOM

aws s3api put-bucket-policy --bucket $bucket --policy file://$policyPath

# 6. Output helpful info
Write-Host "`nDeployment complete. Your site will be available via CloudFront once DNS is updated."
Write-Host "CloudFront distribution ID: $cfDistId"
Write-Host "Visit: https://$domainName"
