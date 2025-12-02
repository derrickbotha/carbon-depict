# Technical Implementation Plan: Carbon Depict Gap Resolution (GCP Edition)

## 1. Introduction and Scope
This document serves as the technical roadmap for bringing the Carbon Depict application to an MVP-Ready and subsequently Production-Ready state, with a focus on leveraging Google Cloud Platform (GCP) for hosting and services.

The scope of this document covers the implementation details for all P0 (Critical), P1 (High), and P2 (Medium) priority gaps identified across Frontend, Backend, Testing, Documentation, and Infrastructure categories. Specific implementation details provided here are intended to guide the engineering team and resolve the identified vulnerabilities and quality risks using a GCP-centric stack where appropriate.

## 2. Overall Implementation Strategy
The strategy will be a phased approach, strictly following the defined priorities to de-risk the application foundation first:
- **Phase 1 (P0: Critical):** Focus on Security, Data Integrity, and Production Visibility. (Estimated 2 weeks)
- **Phase 2 (P1: High):** Focus on Core Feature Completion, Performance Optimization, and Quality Assurance (Testing). (Estimated 2 months)
- **Phase 3 (P2: Medium):** Focus on User Experience (UX), Accessibility, Mobile Support, and Advanced Infrastructure. (Estimated 2 months)

## 3. P0 (Critical) Implementation Tasks
These tasks are mandatory and blocking for MVP readiness and must be completed before any production deployment.

| Priority | Category | Gap | Implementation Task & Details (GCP Focused) |
| :--- | :--- | :--- | :--- |
| P0 | Backend | Rate limiting disabled (Security vulnerability) | Implement **Google Cloud Armor** for IP-based rate limiting at the load balancer level. As a secondary defense, use `express-rate-limit` in the application. Configure a global window (e.g., 100 requests / 15 minutes) and a more aggressive limiter for authentication endpoints (e.g., 5 requests / 5 minutes per IP). |
| P0 | Backend | No file upload system (Blocks compliance proofs) | **Secure File Upload Service:** 1. Implement a dedicated backend endpoint (`POST /api/uploads/compliance`). 2. Use **Multer** for handling `multipart/form-data`. 3. Configure Multer to stream directly to **Google Cloud Storage (GCS)** using the `@google-cloud/storage` SDK, avoiding local disk storage. 4. Store a reference (GCS object name, MIME type) in the database. 5. Implement server-side validation for file type (MIME) and size. |
| P0 | Infra | No database backups (Data loss risk) | **Automated Backup Strategy:** 1. For **Google Cloud SQL**, configure native automated daily snapshots with a minimum 7-day retention policy. 2. For self-hosted databases on GCE, set up a Cron job using `pg_dump` or `mysqldump`. 3. The dump file must be compressed and securely uploaded to a separate, regional **Google Cloud Storage** bucket with encryption and versioning enabled. |
| P0 | Backend | Missing error logging (No production visibility) | Integrate **Google Cloud Error Reporting** (for real-time error tracking) and **Google Cloud Logging** (for structured logging). 1. Configure the application to automatically report all unhandled exceptions to Error Reporting. 2. Implement structured logging (JSON format) using Winston/Pino. Logs written to `stdout` from Cloud Run or GKE are automatically ingested by Cloud Logging. |
| P0 | Backend | Admin routes incomplete (Can't manage users) | **Complete Basic User Management CRUD:** 1. Finalize and protect all `/api/admin/*` routes with an Authorization Middleware check (RBAC). 2. Implement endpoints to list, create, edit roles/permissions, and soft-delete/deactivate users. 3. Ensure all user modification actions are logged to an Audit Log table in the database. |
| P0 | Backend | AI integration has TODOs (Features not implemented) | **MVP Implementation:** Resolve the highest priority TODO in the AI integration. If the AI is for carbon calculation, implement the core calculation logic/API call to a service like **Google Cloud's Vertex AI** and return the response. Stub out any complex/advanced features for Phase 2. |

## 4. P1 (High) Implementation Tasks
These tasks focus on application quality, core feature completion, and performance optimization.

| Priority | Category | Gap | Implementation Task & Details (GCP Focused) |
| :--- | :--- | :--- | :--- |
| P1 | Testing | Test coverage <5% (Quality risk) | **Unit Test Implementation:** 1. Backend: Establish Jest and target all core services/models. 2. Frontend: Establish React Testing Library and test all critical state-managing components and custom hooks. 3. Target: Achieve a minimum of 50% coverage before proceeding. Integrate coverage reporting into the **Cloud Build** CI pipeline. |
| P1 | Backend | PDF generation incomplete | **Implement Serverless PDF Generation:** Use Puppeteer within a **Google Cloud Function (2nd gen)** or a **Cloud Run** service. The endpoint should accept necessary data, render an HTML template, generate the PDF, and use the GCS service (from P0) to store the result, returning a temporary signed URL to the client. |
| P1 | Backend | Missing indexes (Performance) | **Database Optimization:** 1. Use **Cloud SQL Query Insights** to identify the top 5 slowest queries. 2. Implement B-tree indexes on all foreign key columns. 3. Add composite indexes where queries frequently use multiple columns in the `WHERE` clause (e.g., `(user_id, status)`). |
| P1 | Backend | Data versioning | Implement simple Optimistic Locking or a dedicated version field (e.g., a timestamp or integer) on core models. Require the client to send the current version number on update requests. If the stored version does not match, reject the update and throw a `409 Conflict` error. |
| P1 | Frontend | Missing form validation | Implement client-side validation using a modern library (e.g., **React Hook Form with Yup** schema validation). Ensure all form fields have validation rules and display clear, accessible error messages. |
| P1 | Documentation | No Swagger/OpenAPI spec | Integrate `swagger-jsdoc` to auto-generate the OpenAPI 3.0 specification from backend code comments. Host the resulting `swagger-ui` on a dedicated path within the application, accessible in the staging environment. |

## 5. P2 (Medium) Implementation Tasks
These tasks focus on polish, user experience, and infrastructure stability for long-term maintenance.

| Priority | Category | Gap | Implementation Task & Details (GCP Focused) |
| :--- | :--- | :--- | :--- |
| P2 | Frontend | No loading skeletons | Replace hard-coded loading spinners with Skeleton Loaders on all data-intensive pages (e.g., dashboards, reports). Use a skeleton loader that mimics the final layout to improve perceived performance. |
| P2 | Frontend | Accessibility <50% WCAG | **A11y Audit & Fixes:** 1. Install `eslint-plugin-jsx-a11y`. 2. Implement proper ARIA roles, alt attributes, and keyboard navigation on all interactive components. 3. Ensure sufficient color contrast based on WCAG AA standards. |
| P2 | Frontend | Mobile responsiveness issues | Adopt a Mobile-First CSS Strategy. Refactor existing CSS/Styles to use modern techniques (CSS Grid, Flexbox) and media queries to ensure a usable experience on standard mobile device sizes (360px+). |
| P2 | Infra | No CI/CD pipeline | Set up a **Google Cloud Build** pipeline. The pipeline must include: Lint -> Test -> Build (Docker images) -> Deploy (to **Cloud Run** or **GKE**). Use environment variables and secrets stored in **Secret Manager** for all deployment configuration. |
| P2 | Infra | No monitoring | Complete the integration of **Google Cloud Monitoring** for Application Performance Monitoring (APM). Configure agents to track request latency, database query times, and resource utilization (CPU/Memory). Set up critical alerts for resource thresholds. |
| P2 | Infra | No caching (Redis) | Implement **Memorystore for Redis**. 1. Use Redis for Session Management. 2. Implement a caching layer for high-read, low-write endpoints (e.g., static config data) using a Time-To-Live (TTL) cache invalidation strategy. |
| P2 | Documentation | Missing developer onboarding | Create a `CONTRIBUTING.md` and a comprehensive Developer Onboarding Guide. Must include: Project structure, Local setup instructions, Database seeding, Testing commands, and a guide to the **Cloud Build** CI/CD process. |

## 6. Required Technology Stack Updates (GCP Focused)
The following tools and frameworks must be integrated/updated to execute this plan:

| Category | Tool/Technology | Purpose |
| :--- | :--- | :--- |
| Backend | `express-rate-limit` / **Google Cloud Armor** | Critical Security: Rate Limiting |
| Backend | Multer + **@google-cloud/storage** | File Uploads & Storage |
| Backend | **Google Cloud Error Reporting** | Production Error Tracking |
| Backend | Winston / Pino | Structured Server-side Logging |
| Frontend | React Hook Form + Yup | Robust Form Validation |
| Frontend | React Testing Library / Jest | Frontend Unit Testing |
| Testing | Cypress | E2E Test Implementation |
| Infrastructure | **Google Cloud Build** | Automated CI/CD Pipeline |
| Infrastructure | **Google Cloud Monitoring** | APM and Metrics Monitoring |
| Infrastructure | **Memorystore for Redis** | Caching and Session Management |
| Infrastructure | Puppeteer | Server-side PDF Generation |
| Documentation | `swagger-jsdoc` | API Specification Generation |
