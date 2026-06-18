@echo off
:: Configurar la consola para aceptar acentos y caracteres UTF-8
chcp 65001 > nul
color 0B

echo ========================================================
echo        SISTEMA RE-USE - INICIO AUTOMATIZADO
echo ========================================================
echo.

:: 1. Verificar Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR CRITICO] No se detecto Node.js ni NPM en este equipo.
    echo Por favor, descarga e instala Node.js desde https://nodejs.org/
    echo Presiona cualquier tecla para salir...
    pause > nul
    exit /b
)

:: 2. Inicializacion de Base de Datos (PostgreSQL)
echo [*] Verificando PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] El comando 'psql' no se reconoce.
    echo Asegurate de que PostgreSQL este instalado y la carpeta 'bin' este en las Variables de Entorno (PATH).
    echo Saltando la configuracion de la base de datos...
    echo.
) else (
    echo [!] Se detecto psql. Vamos a preparar la base de datos.
    set /p pg_user="Ingresa tu usuario de PostgreSQL (Enter para usar 'postgres'): "
    if "%pg_user%"=="" set pg_user=postgres
    
    set /p PGPASSWORD="Ingresa la contrasena para el usuario de base de datos: "
    
    echo.
    echo Creando la base de datos 'reuse_db' (ignorando error si ya existe)...
    psql -U %pg_user% -c "CREATE DATABASE reuse_db;" >nul 2>nul
    
    echo Ejecutando script de construccion (tablas y semillas)...
    psql -U %pg_user% -d reuse_db -f "respaldo_completo.sql"
    
    if %errorlevel% neq 0 (
        echo [ADVERTENCIA] Hubo errores al correr el script SQL. Verifica los mensajes arriba o asegurate de que 'respaldo_completo.sql' exista en la raiz del proyecto.
    ) else (
        echo [OK] Base de datos sincronizada correctamente.
    )
    echo.
)

:: 3. Rutina del Backend
echo [*] Revisando servidor Backend...
cd backend
if not exist "node_modules\" (
    echo [!] Dependencias faltantes en el Backend. Instalando...
    call npm install
) else (
    echo [OK] Modulos del Backend listos.
)
cd ..

:: 4. Rutina del Frontend
echo.
echo [*] Revisando cliente Angular...
cd frontend
if not exist "node_modules\" (
    echo [!] Dependencias faltantes en el Frontend. Instalando...
    call npm install
) else (
    echo [OK] Modulos del Frontend listos.
)
cd ..

:: 5. Ejecucion paralela
echo.
echo ========================================================
echo Levantando servidores en ventanas independientes...
echo ========================================================

start "RE-USE - Backend (API REST)" cmd /k "cd backend && npm run dev"
start "RE-USE - Frontend (Angular)" cmd /k "cd frontend && npm start"

echo.
echo [EXITO] Las terminales se han abierto.
echo * Nota: El backend fallara si no tienen el archivo .env configurado.
echo.
pause