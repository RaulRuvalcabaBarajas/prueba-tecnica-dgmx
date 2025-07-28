# Fase 5: Documentación Técnica

## 1. Decisiones de diseño

- **Persistencia de datos**: Uso de **DynamoDB** por su escalabilidad on‑demand y modelo NoSQL flexible.
- **Modelo de datos**: Tres tablas:
  - `OrgsTable` (PK=`id`).
  - `MembersTable` (PK=`organizationId`, SK=`id`, GSI=`userId`).
  - `InvitationsTable` (PK=`token`).
- **Infraestructura como Código**: AWS CDK en Python para mantener todo versionado y reproducible.
- **Frameworks**:
  - Frontend: Angular 14+ con Angular Material.
  - Backend: AWS Lambda Python 3.9.
  - Infra: AWS CDK Python.

## 2. Seguridad

- **Autenticación & Autorización**: AWS Cognito (User Pool, App Client, Identity Pool).
- **Políticas IAM**: Lambdas con permisos mínimos (acceso a tablas específicas y SES).
- **Cifrado**: DynamoDB encriptado con AWS‑managed KMS y HTTPS en API Gateway.
- **Gestión de secretos**: No almacenar credenciales en código, usar AWS Secrets Manager o variables de entorno.

## 3. Escalabilidad y alta disponibilidad

- **DynamoDB**: Modo `PAY_PER_REQUEST`, escalado automático sin aprovisionamiento.
- **Lambda**: Python 3.9, posible uso de **Provisioned Concurrency** para reducir cold starts.
- **API Gateway**: Regional o Edge‑optimized según requisitos de latencia mundial.
- **Resiliencia**: Retries y backoff en Lambdas, Dead‑Letter Queues (DLQ) habilitadas.

## 4. Roadmap de mejoras

1. **Pruebas Unitarias & E2E**: Jasmine/Karma en frontend, pytest en backend, Cypress para flujos críticos.
2. **CI/CD**: Pipeline con GitHub Actions y AWS CDK Pipelines para infra y despliegue.
3. **Monitorización Avanzada**: CloudWatch Alarms, Logs Insights y AWS X-Ray para trazabilidad.
4. **Internacionalización & PWA**: i18n en Angular y configuración PWA para modo offline.
5. **Gestión de Errores**: Integración de Sentry o AWS SNS para alertas y notificaciones.
