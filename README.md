# Gestor de Organizaciones y Miembros

Una aplicación web de página única (SPA) para gestionar organizaciones y sus miembros, implementando un sistema completo de autenticación, autorización y gestión de datos en AWS.

## Tech Stack

### Frontend

- **Angular 14+**: Framework principal para la interfaz de usuario
- **Angular Material**: Componentes de UI y estilos
- **Angular Router**: Gestión de rutas y protección de rutas
- **AWS Amplify**: Integración con Cognito para autenticación

### Backend

- **AWS Lambda (Python)**: Funciones serverless para la lógica de negocio
- **API Gateway**: Exposición de endpoints RESTful
- **DynamoDB**: Base de datos NoSQL para persistencia de datos
- **SES (Simple Email Service)**: Envío de correos electrónicos para invitaciones

### Infraestructura (IaC)

- **AWS CDK en Python**: Definición de infraestructura como código
- **CloudFormation**: Despliegue automatizado de recursos AWS
- **IAM**: Gestión de permisos con principio de mínimo privilegio

### Herramientas de Desarrollo

- **TypeScript**: Tipado estático para desarrollo en Angular
- **Jest/Karma**: Testing en frontend
- **Pytest**: Testing en backend
- **ESLint/Prettier**: Linting y formateo de código
- **CloudWatch**: Monitoreo y logging

## Estructura del Proyecto

```
gestor-orgs/
│
├── frontend/                 # Aplicación Angular
│   └── gestor-orgs-ui/       # Código fuente del frontend
│       ├── src/              # Código de la aplicación
│       │   ├── app/          # Componentes, servicios, etc.
│       │   ├── assets/       # Recursos estáticos
│       │   └── environments/ # Configuración por entorno
│       ├── angular.json      # Configuración de Angular
│       └── package.json      # Dependencias de Node.js
│
├── backend/                  # Código de las funciones Lambda
│   ├── requirements.txt      # Dependencias de Python
│   ├── organizations/        # Lambda para gestión de organizaciones
│   ├── members/              # Lambda para gestión de miembros
│   └── invitations/          # Lambda para gestión de invitaciones
│
├── infra/                    # Infraestructura como código (AWS CDK)
│   ├── infra/                # Stacks de CDK
│   │   ├── __init__.py
│   │   └── infra_stack.py    # Definición de recursos AWS
│   ├── app.py                # Punto de entrada de la aplicación CDK
│   └── requirements.txt      # Dependencias de CDK
│
└── docs/                     # Documentación técnica y diagramas
    ├── architecture.png      # Diagrama de arquitectura
    └── api-spec.md           # Especificación de la API
```

## Prerrequisitos

- **Node.js**: versión 18.0.0 o superior
- **Angular CLI**: `npm install -g @angular/cli`
- **Python**: versión 3.9 o superior
- **AWS CLI**: configurado con credenciales válidas
- **AWS CDK**: `npm install -g aws-cdk`

## Configuración

### Configurar AWS CLI

```bash
aws configure --profile gestor-orgs
```

Introducir los siguientes datos:

- AWS Access Key ID
- AWS Secret Access Key
- Default region: eu-west-1 (o la región deseada)
- Default output format: json

### Frontend (Angular)

```bash
# Instalar dependencias
cd frontend/gestor-orgs-ui
npm install

# Servir la aplicación en modo desarrollo
ng serve

# La aplicación estará disponible en http://localhost:4200
```

### Backend e Infraestructura (AWS CDK)

```bash
# Crear y activar entorno virtual
cd infra
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Desplegar la infraestructura
cdk bootstrap
cdk deploy --profile gestor-orgs
```

## Scripts Útiles

### Frontend

En `frontend/gestor-orgs-ui/package.json` se incluyen los siguientes scripts:

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm run test`: Ejecuta pruebas unitarias
- `npm run lint`: Verifica el estilo del código

### Backend e Infraestructura

Makefile en la raíz del proyecto:

```make
.PHONY: deploy-all deploy-frontend deploy-backend test-frontend test-backend clean

# Despliegue completo
deploy-all: deploy-backend deploy-frontend

# Despliegue del frontend
deploy-frontend:
	cd frontend/gestor-orgs-ui && npm run build
	aws s3 sync frontend/gestor-orgs-ui/dist/gestor-orgs-ui s3://gestor-orgs-web --profile gestor-orgs

# Despliegue del backend/infra
deploy-backend:
	cd infra && source .venv/bin/activate && cdk deploy --profile gestor-orgs

# Tests
test-frontend:
	cd frontend/gestor-orgs-ui && npm run test

test-backend:
	cd infra && source .venv/bin/activate && pytest

# Limpiar artefactos de compilación
clean:
	rm -rf frontend/gestor-orgs-ui/dist
	rm -rf infra/cdk.out
```

## API REST

La API expone los siguientes endpoints:

- **GET /orgs**: Listar organizaciones
- **POST /orgs**: Crear organización
- **GET /orgs/{id}**: Obtener detalles de una organización
- **PUT /orgs/{id}**: Actualizar organización
- **DELETE /orgs/{id}**: Eliminar organización
- **GET /orgs/{id}/members**: Listar miembros de una organización
- **POST /orgs/{id}/members**: Añadir miembro a una organización
- **DELETE /orgs/{id}/members/{userId}**: Eliminar miembro de una organización
- **GET /invitations**: Listar invitaciones
- **POST /invitations**: Crear invitación
- **PUT /invitations/{id}/accept**: Aceptar invitación
- **PUT /invitations/{id}/reject**: Rechazar invitación

## Monitoreo y Logging

- **CloudWatch**: Monitoreo de métricas y logs de Lambda
- **X-Ray**: Trazado de solicitudes entre servicios

## Autor

Victor Raul Rucalcaba Barajas

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.
