$docxPath = "c:\Users\juice\Desktop\PROJETOS\aula-ai-agents\6. Vibe Coding & AI Agents - Dan Morais.docx"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlStr = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$xmlStr = $xmlStr -replace '<w:p\b[^>]*>', "`n" -replace '<[^>]*>', '' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>'
Write-Output $xmlStr
