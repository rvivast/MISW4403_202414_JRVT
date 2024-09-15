# Parcial Jefferson Ricardo Vivas Torres - Enunciado 2

Este es un proyecto basado en el framework [NestJS](https://nestjs.com/), diseñado para ser modular y escalable en Node.js. El proyecto utiliza **PostgreSQL** como base de datos y está configurada para levantarse con **Docker Compose**.

## Descripción

Proyecto **parcialjrvt**, creado con NestJS, incluye varias dependencias para manejar bases de datos con TypeORM, realizar pruebas con Jest, y trabajar con PostgreSQL. Está configurado para el ciclo completo de desarrollo, pruebas.

## Requisitos

- **Node.js** >= 20.x
- **NPM** >= 8.x
- **Docker** y **Docker Compose** instalados
- **NestJS** >= 10.x

## Instalación

Sigue estos pasos para configurar tu entorno de desarrollo:

1. Ubicarse dentro del directorio raiz
2. Ejecutar el comando docker-compose up
3. Ejecutar el comando npm run start:dev
2. La base de datos se llama **parcial** si al ejecutar el comando npm run start:dev la base de datos no se crea, crearla manualmente mediante un cliente de postgres.
3. Ejecutar los test unitarios mediante el comando npm run test
