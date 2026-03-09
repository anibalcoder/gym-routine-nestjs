<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Gym Routine API</h1>

<div align="center">
  <p>
  API REST para gestionar <strong>rutinas de gimnasio</strong>, permitiendo administrar usuarios, ejercicios y planes de entrenamiento.
  </p>

  <p>
  Incluye <strong>autenticación basada en JWT</strong> para proteger los endpoints y controlar el acceso a los recursos.
  </p>
</div>

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/anibalcoder/gym-routine-nestjs.git
cd gym-routine-nestjs
```

### 2. Crear el archivo de variables de entorno

Copiar el archivo `.env.template` y renombrarlo a `.env`.

```bash
cp .env.template .env
```

### 3. Instala las dependencias

```bash
pnpm install
```

4. **Instalar Nest CLI (si no lo tienes)**

```bash
pnpm add -g @nestjs/cli
```

5. **Levantar la base de datos con Docker**

```bash
docker-compose up -d
```

6. **Ejecutar la aplicación en modo desarrollo**

```bash
pnpm start:dev
```