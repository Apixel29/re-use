# ReuseFront ♻️

Este es el frontend de la aplicación **RE-USE**, desarrollado con [Angular CLI](https://github.com/angular/angular-cli) versión 21.2.11.

---

## 🚀 Cómo ejecutar el proyecto de frontend

Sigue estos pasos para instalar las herramientas necesarias y ejecutar el proyecto localmente.

### 1. Instalar Node.js
El proyecto requiere Node.js para gestionar las dependencias y ejecutar el servidor de desarrollo.
1. Descarga e instala la versión LTS de Node.js desde su sitio oficial: [nodejs.org](https://nodejs.org/).
2. Para comprobar la correcta instalación, abre una terminal y ejecuta:
   ```bash
   node -v
   npm -v
   ```

### 2. Instalar Angular CLI de forma global
Para poder utilizar los comandos de Angular (`ng`), debes instalar la interfaz de línea de comandos (CLI) globalmente:
```bash
npm install -g @angular/cli@21.2.11
```
*(Nota: Se recomienda usar la versión `@21.2.11` para asegurar la compatibilidad con el proyecto).*

### 3. Instalar las dependencias del proyecto
Dentro de la carpeta raíz del proyecto (`reuse-front`), ejecuta el siguiente comando para descargar e instalar todas las dependencias necesarias:
```bash
npm install
```

### 4. Ejecutar el Servidor de Desarrollo
Una vez instaladas las dependencias, inicia el servidor local de desarrollo:
```bash
npm start
```
o alternativamente:
```bash
ng serve
```

### 5. Acceder a la Aplicación
Abre tu navegador web e ingresa a:
👉 **[http://localhost:4200/](http://localhost:4200/)**

La aplicación se actualizará automáticamente en el navegador cuando realices cambios en los archivos fuente.
