Add-Type -AssemblyName System.Drawing

function Generate-Icon([int]$size, [string]$outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgColor = [System.Drawing.Color]::FromArgb(255, 17, 20, 23)
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Gold Border
    $goldColor = [System.Drawing.Color]::FromArgb(255, 197, 168, 128)
    $penWidth = [Math]::Max(2.0, [float]($size * 0.02))
    $goldPen = New-Object System.Drawing.Pen($goldColor, $penWidth)
    $inset = [float]($size * 0.05)
    $g.DrawRectangle($goldPen, $inset, $inset, [float]($size - ($inset * 2)), [float]($size - ($inset * 2)))

    # Gold Monogram Text "P"
    $fontSize = [float]($size * 0.38)
    $fontP = New-Object System.Drawing.Font("Georgia", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $goldBrush = New-Object System.Drawing.SolidBrush($goldColor)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rectP = [System.Drawing.RectangleF]::new(0.0, [float]($size * 0.08), [float]$size, [float]($size * 0.55))
    $g.DrawString("P", $fontP, $goldBrush, $rectP, $sf)

    # Subtext "PRADEEP"
    $fontTextSize = [Math]::Max(9.0, [float]($size * 0.075))
    $fontText = New-Object System.Drawing.Font("Arial", $fontTextSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 238, 234, 226))
    $rectText = [System.Drawing.RectangleF]::new(0.0, [float]($size * 0.68), [float]$size, [float]($size * 0.14))
    $g.DrawString("PRADEEP", $fontText, $whiteBrush, $rectText, $sf)

    # Subtext "ATELIER"
    $fontSubSize = [Math]::Max(7.0, [float]($size * 0.045))
    $fontSub = New-Object System.Drawing.Font("Arial", $fontSubSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 175, 168, 156))
    $rectSub = [System.Drawing.RectangleF]::new(0.0, [float]($size * 0.82), [float]$size, [float]($size * 0.11))
    $g.DrawString("ATELIER", $fontSub, $subBrush, $rectSub, $sf)

    $g.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Success generating $outputPath"
}

Generate-Icon 192 "public\icons\icon-192x192.png"
Generate-Icon 512 "public\icons\icon-512x512.png"
Generate-Icon 180 "public\icons\apple-touch-icon.png"
