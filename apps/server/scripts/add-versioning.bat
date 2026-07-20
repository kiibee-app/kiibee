@echo off
REM Script to add API versioning to all controllers (Windows compatible)
REM Usage: scripts\add-versioning.bat

echo 🔧 Adding API versioning to all controllers...

for /r "src\modules" %%f in (*.controller.ts) do (
    echo Processing: %%f
    
    REM Check if already versioned
    findstr /C:"version:" "%%f" >nul
    if not errorlevel 1 (
        echo   ✓ Already versioned
        goto :continue
    )
    
    REM Extract controller name
    for /f "tokens=2 delims='" %%g in ('findstr /C:"@Controller('" "%%f"') do (
        set CONTROLLER_NAME=%%g
        
        echo   📝 Updating @Controller('!CONTROLLER_NAME!')...
        
        REM Replace @Controller('name') with versioned version
        powershell -Command "(Get-Content '%%f') -replace \"@Controller\('!CONTROLLER_NAME!'\)\", \"@Controller({ path: '!CONTROLLER_NAME!', version: '1' })\" | Set-Content '%%f'"
        
        REM Add import for ApiVersion decorator if not present
        findstr /C:"ApiVersion" "%%f" >nul
        if errorlevel 1 (
            powershell -Command "$content = Get-Content '%%f'; $lastImport = ($content | Select-String '^import' | Select-Object -Last 1).LineNumber; $content[$lastImport] = $content[$lastImport] + \"`r`nimport { ApiVersion } from '../../common/decorators/api-version.decorator';\"; Set-Content '%%f' $content"
            echo   ✓ Added ApiVersion import
        )
        
        echo   ✓ Updated
    )
    
    :continue
)

echo.
echo ✅ API versioning added to all controllers!
echo.
echo Next steps:
echo 1. Test all endpoints
echo 2. Verify versioning in responses
echo 3. Update API documentation
