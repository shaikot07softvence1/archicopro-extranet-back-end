# ARCHICOPRO Extranet - Backend System Architecture

This document serves as the comprehensive architectural blueprint for the ARCHICOPRO Extranet Backend. It is designed to provide a complete understanding of the system's design, domain logic, and technical requirements so that any developer or AI assistant can immediately grasp the context and begin implementation.

## 1. High-Level System Overview

ARCHICOPRO Extranet is a secure, role-gated portal designed for members, partners, and administrators. The backend acts as a central hub for managing users, content (articles, events, trainings), document storage, and community interactions (forums). 

The system is heavily dependent on **Role-Based Access Control (RBAC)**, ensuring that every piece of content, file, or forum post is properly gated based on the user's role and specific permission overrides.

## 2. Recommended Tech Stack

Based on the required features (complex relational data, typed APIs, structured enterprise patterns, and multipart file uploads), the following stack is chosen:

- **Framework:** NestJS (Node.js) - Chosen for its modularity, dependency injection, and enterprise-grade architecture.
- **Language:** TypeScript.
- **Database:** PostgreSQL (Relational structure is strictly required).
- **ORM:** Prisma ORM.
- **Authentication:** JWT (JSON Web Tokens) with short-lived Access Tokens and long-lived Refresh Tokens.
- **Storage:** Cloudinary for production (for Images, PDFs, Docs).

## 3. Core Modules & Domain Boundaries

The application is divided into distinct, independent domains (Modules in NestJS):

### 3.1. Auth & Identity Module
- Handles Login, Signup, OTP generation/verification, Password resets, and Token Refresh logic.
- Maintains session security.

### 3.2. User & RBAC Module
- **Users:** Profile management, avatars, status (pending, active, suspended).
- **Roles & Permissions:** Dynamic role creation and permission assignment.
- **Granular Control:** Permissions are mapped to specific features (`article`, `document`, `forum`, etc.) and actions (`can_view`, `can_create`, `can_edit`, `can_delete`).

### 3.3. Content Management Modules
- **Articles:** News and updates with categories, rich text body, thumbnails, and PDF attachments.
- **Events (Agenda):** Calendar events with registration tracking and attachments.
- **Trainings:** Online/Offline training sessions, capacity limits, and attendee registration.

### 3.4. Document Library Module
- A hierarchical folder structure (Tree structure via `parent_id`).
- Handles file uploads (PDFs, Docs, Images).
- Folder-level permissions (e.g., specific roles can read or upload to specific folders).

### 3.5. Forum & Moderation Module
- **Hierarchy:** Forums -> Topics -> Posts (Replies).
- **Interactive:** Supports rich text and file attachments per topic/post.
- **Moderation:** A dedicated queue where Moderators/Admins can approve, reject, or flag posts before they become public.

### 3.6. System & Settings Module
- Admin-only configurations.
- Notification preferences, SMTP settings, Activity Logs, and Database Backups.

## 4. Role-Based Access Control (RBAC) Architecture

Security is the most critical component of this system. The RBAC model works on three levels:

1. **Global Role Permissions:** (`role_permissions` table) 
   - E.g., The "Moderator" role has `can_edit: true` for the "forum" feature globally.
2. **User-Specific Overrides:** (`user_permissions` table)
   - E.g., A specific "Member" might be granted `can_create: true` for articles, overriding their default role restrictions.
3. **Resource-Specific Permissions:** (e.g., `article_permissions`, `folder_permissions`)
   - E.g., A specific Document Folder is only visible to the `comite_coproprietaire` role.

**Execution Flow:** NestJS Guards (`JwtAuthGuard` -> `RolesGuard` -> `PermissionsGuard`) will intercept every request, load the user's aggregated permissions, and allow/deny access before hitting the Controller logic.

## 5. File & Media Handling Strategy

The application relies heavily on `multipart/form-data` for handling various file types (Images, PDFs, Word Docs).

- **Upload Flow:** NestJS `FileInterceptor` captures the file -> validates MIME type & size -> uploads to Cloudinary -> returns a generated `file_url` -> Prisma saves this URL to the respective table (e.g., `article_files`, `documents`).
- **Download Flow:** Protected endpoints (e.g., `/documents/documents/:id/download`) verify user permissions before streaming the file back with `Content-Disposition: attachment` headers.

## 6. Forum Architecture Deep Dive

The Forum is designed to be a highly interactive space:
- **Entities:** 
  - `forums`: The main categories (e.g., "General Discussion").
  - `forum_topics`: Individual threads inside a forum created by users.
  - `forum_posts`: Replies/Comments within a topic.
- **Nested Replies:** To support users replying to specific comments, the `forum_posts` model must be capable of handling a hierarchical structure (often implemented via a self-referencing `parent_id` column, though currently implied by UI logic).
- **Moderation:** Posts have a `moderation_status` (`pending`, `approved`, `rejected`). If a forum requires moderation, posts remain hidden until a Moderator acts via the Moderation Queue.

## 7. API Design Principles

- **RESTful Endpoints:** Standard REST patterns (`GET`, `POST`, `PATCH`, `DELETE`).
- **Pagination:** All list endpoints (Users, Articles, Topics) must return a standardized paginated response:
  ```json
  {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5,
    "results": [...]
  }
  ```
- **Error Handling:** Centralized Exception Filters in NestJS to return consistent error JSONs across the app.
- **Client Consumption:** Built to be consumed by an RTK Query (Redux) frontend that relies heavily on predictable data shapes and HTTP status codes (e.g., `401 Unauthorized` triggers token refresh).

## 8. Implementation Roadmap (Suggested)

1. **Foundation:** Initialize NestJS, setup Prisma schema, configure PostgreSQL.
2. **Auth & RBAC:** Implement JWT Login, Roles, and Permission Guards. (Crucial first step).
3. **User Profile:** Allow fetching `users/me` with aggregated permissions.
4. **Content Modules:** Build Articles, Events, and Trainings (CRUD + File Uploads).
5. **Forum Engine:** Build Forums, Topics, Posts, and the Moderation workflow.
6. **Documents:** Build the hierarchical folder system and secure file delivery.
7. **Admin Ops:** Settings, Logs, and Backups.