# MicroTask Manager

Una aplicación de gestión de tareas basada en una arquitectura simulada de microservicios, desarrollada con React y Tailwind CSS.

## 🚀 Características

1.  **Microservicio de Autenticación (Simulado)**: Registro e inicio de sesión con persistencia local.
2.  **Microservicio de Tareas (Simulado)**: CRUD completo de tareas aislado por usuario.
3.  **Integración IA**: Generación de contenido asistida por Google Gemini.
4.  **UI/UX Moderno**: Diseño responsivo utilizando Tailwind CSS.

## 🛠️ Tecnologías

*   React 19
*   TypeScript
*   Tailwind CSS
*   Google GenAI SDK

## 📦 Instalación y Ejecución

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/pablomerchan/microtask-manage.git
    cd microtask-manager
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

3.  Configurar variables de entorno:
    Crea un archivo `.env` en la raíz (si es necesario para tu entorno local) o asegura que la API Key de Gemini esté disponible en `process.env.API_KEY`.

4.  Iniciar la aplicación:
    ```bash
    npm start
    ```


## 🏗️ Arquitectura

La aplicación utiliza un patrón de **Servicios** en el frontend para desacoplar la vista de la lógica de datos, simulando llamadas a APIs REST:

*   `services/authService.ts`: Maneja la lógica de usuarios.
*   `services/taskService.ts`: Maneja la lógica de negocio de las tareas.
