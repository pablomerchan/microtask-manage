# MicroTask Manager

Una aplicación de gestión de tareas basada en una arquitectura simulada de microservicios, desarrollada con React y Tailwind CSS.

## 🚀 Características

1.  **Microservicio de Autenticación (Simulado)**: Registro e inicio de sesión con persistencia local (`localStorage`).
2.  **Microservicio de Tareas (Simulado)**: CRUD completo de tareas (Crear, Leer, Actualizar, Borrar) aislado por ID de usuario.
3.  **UI/UX Moderno**: Diseño limpio y responsivo utilizando Tailwind CSS.

## 🛠️ Tecnologías

*   **Frontend**: React 18
*   **Lenguaje**: TypeScript
*   **Estilos**: Tailwind CSS
*   **Iconos**: FontAwesome

## 📦 Instalación y Ejecución

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/pablomerchan/microtask-manage.git
    cd microtask-manager
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

   Esto descargará React, Vite, TypeScript y Tailwind según lo definido en el package.json.


3.  **Iniciar la aplicación**:
    ```bash
    npm run dev
    ```
Vera un mensaje indicando que el servidor está corriendo, generalmente en: 
http://localhost:3000.

# 📘 Uso de la Aplicación

Abra el navegador en la dirección indicada.  
La aplicación simula una base de datos local utilizando **localStorage**.

---

## 🔑 Registro
- Al entrar verás la pantalla de **Login**.
- Haz clic en **"Registrarse"**.
- Llena los datos: **Nombre, Usuario, Contraseña**.
- Crea tu cuenta.

---

## 🔐 Login
- Usa las credenciales que acabas de crear para ingresar.

---

## 🗂️ Gestión de Tareas

### ➕ Crear
- Botón **"Nueva"** arriba a la derecha.

### ✏️ Editar
- Icono de **lápiz** sobre una tarea (aparece al pasar el mouse).

### 🗑️ Borrar
- Icono de **basura**.

### 🔍 Filtros
- Usa los botones **"Todas / Pendientes / Completadas"** para filtrar la lista.

---

## 💾 Persistencia de Datos
- Si cierras el navegador y vuelves a entrar, tus datos seguirán ahí.
- Los datos se guardan en el **almacenamiento local del navegador**, simulando una base de datos real.
- Ten en cuenta que si borras la caché del navegador, se eliminarán tus datos.



## 🏗️ Arquitectura y Estructura

La aplicación utiliza un patrón de **Servicios** en el frontend para desacoplar la vista de la lógica de datos, simulando la interacción con Microservicios reales.

### Estructura de Directorios

```text
/
├── components/            # Componentes de UI (Vistas y Reutilizables)
│   ├── AuthView.tsx       # Login y Registro
│   ├── DashboardView.tsx  # Panel principal
│   ├── TaskModal.tsx      # Formulario de Tareas
│   └── ...
├── services/              # Capa de Abstracción de API (Simulación de Backend)
│   ├── authService.ts     # Cliente del Microservicio de Usuarios
│   └── taskService.ts     # Cliente del Microservicio de Tareas
├── types.ts               # Definiciones de TypeScript (Modelos)
├── App.tsx                # Controlador Principal
└── index.tsx              # Punto de entrada
```

### Nota sobre los Servicios
Los archivos en la carpeta `services/` actúan como proxies. Actualmente persisten datos en `localStorage` para facilitar la demostración sin necesidad de desplegar un backend real. Para conectar con una API real en el futuro, solo es necesario modificar estos archivos para realizar peticiones HTTP (fetch/axios) sin alterar la interfaz de usuario.

