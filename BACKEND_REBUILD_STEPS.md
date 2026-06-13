# Backend Rebuild Steps

This guide explains where to start and what to build first so the frontend can connect to a rebuilt backend with the least friction.

Use these files together:

- `API_REFERENCE.md`: all frontend API routes and descriptions.
- `DATABASE_SCHEMA.sql`: PostgreSQL table design.
- `prisma/schema.prisma`: Prisma model version of the schema.
- `PROJECT_WORKFLOW.drawio`: total app workflow diagram.

## Recommended Stack

The frontend is already using token auth, `multipart/form-data`, JSON APIs, and file downloads. A good backend stack would be:

- Node.js + NestJS or Express
- PostgreSQL
- Prisma ORM
- JWT access tokens + refresh tokens
- Cloudinary for file and image storage
- SMTP provider for OTP and notifications

If you want the fastest rebuild, start with Express + Prisma. If you want cleaner long-term architecture, start with NestJS + Prisma.

## Phase 1: Project Setup

Start here before touching any feature module.

1. Create the backend project.

   Example folders:

   ```text
   backend/
   ├── prisma/
   ├── src/
   │   ├── modules/
   │   ├── common/
   │   ├── config/
   │   └── main.ts
   ├── uploads/
   ├── .env
   └── package.json
   ```

2. Add environment variables.

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/archicopro"
   JWT_ACCESS_SECRET="change_me"
   JWT_REFRESH_SECRET="change_me"
   ACCESS_TOKEN_EXPIRES_IN="15m"
   REFRESH_TOKEN_EXPIRES_IN="30d"
   FRONTEND_URL="http://localhost:5173"
   UPLOAD_DIR="./uploads"
   SMTP_HOST=""
   SMTP_PORT="587"
   SMTP_USER=""
   SMTP_PASSWORD=""
   SMTP_FROM_EMAIL=""
   SMTP_FROM_NAME="ARCHICOPRO"
   ```

3. Copy or move `prisma/schema.prisma` into the backend project.

4. Validate Prisma.

   ```bash
   npx prisma validate
   ```

5. Create the database migration.

   ```bash
   npx prisma migrate dev --name init
   ```

6. Generate Prisma client.

   ```bash
   npx prisma generate
   ```

## Phase 2: Seed Required Base Data

Do this before auth/login, otherwise users will not have valid roles or permissions.

1. Seed roles.

   Required role slugs from the frontend:

   ```text
   admin
   moderator
   membre
   auditeur
   partenaires_technicopro
   comite_coproprietaire
   ```

2. Seed permission features.

   Required features:

   ```text
   article
   document
   event
   forum
   training
   user
   ```

3. Seed role permissions.

   Recommended first version:

   ```text
   admin: all permissions for all features
   moderator: forum view/create/edit, article view, event view, training view, document view
   membre: view permissions for article, document, event, forum, training
   auditeur: view-only permissions
   partenaires_technicopro: limited view permissions
   comite_coproprietaire: limited view permissions
   ```

4. Seed one superuser.

   The frontend currently has login defaults:

   ```text
   email: admin@gmail.com
   password: admin
   ```

   You can seed this for local development, but change it before production.

## Phase 3: Auth First

Build auth before every other module. The frontend cannot enter the protected app without this.

Required endpoints:

```text
POST /auth/login
POST /auth/signup
POST /auth/send_otp
POST /auth/verify_otp
POST /auth/forgot_password
POST /auth/reset_password
POST /auth/refresh
GET  /user/users/me
```

Important frontend expectations:

- `POST /auth/login` uses `application/x-www-form-urlencoded`.
- Login response must include `access_token`, `refresh_token`, `token_type`, `status`, and role info.
- If user status is `pending`, the frontend blocks login.
- `GET /user/users/me` must return user profile, role details, role permissions, and user permission overrides.
- Protected endpoints need `Authorization: Bearer <access_token>`.
- If an API call returns `401`, the frontend calls `POST /auth/refresh`.

Build order:

1. Password hashing.
2. JWT access token generation.
3. Refresh token persistence in `refresh_tokens`.
4. Login endpoint.
5. Auth middleware/guard.
6. Current user endpoint.
7. Refresh endpoint.
8. OTP endpoints.
9. Forgot/reset password endpoints.

## Phase 4: User, Role, and Permission APIs

Build this immediately after auth because the sidebar, route access, admin panel, and action buttons depend on permissions.

Required endpoints:

```text
GET    /user/users
POST   /user/users
GET    /user/users/online
GET    /user/users/me
PATCH  /user/users/me
GET    /user/users/{id}
PATCH  /user/users/{id}
DELETE /user/users/{id}
PATCH  /user/users/{id}/restore
PATCH  /user/users/{id}/validate
PATCH  /user/users/{userId}/photo_upload
GET    /user/users/export/to_csv

GET    /user/roles
POST   /user/roles
PATCH  /user/roles/{id}
DELETE /user/roles/{id}

GET    /user/permissions?role_id={id}
POST   /user/permissions
PATCH  /user/permissions/{id}

GET    /user/user-permissions?user_id={id}
PATCH  /user/user-permissions/{id}
```

Build order:

1. `GET /user/users/me`.
2. `GET /user/roles`.
3. Role permission CRUD.
4. User permission override CRUD.
5. User list with filters: `archived`, `page`, `page_size`, `search`, `role_id`, `status`.
6. User create/update/delete/restore/validate.
7. Avatar upload.
8. CSV export.

Frontend response shape matters here. User objects should include:

```text
id
email
first_name
last_name
initials
avatar_url
role
role_details
status
is_superuser
is_payment_validated
membership_year
is_email_verified
is_online
last_seen_at
member_since
last_login_at
created_at
is_deleted
permissions
user_permissions
```

## Phase 5: Core Read-Only Home and Dashboard APIs

Build lightweight list/read endpoints next so the logged-in app has content to render.

Required endpoints:

```text
GET /stats
GET /home/?q={query}&limit={limit}
GET /admin%26modarator/dashboard/stats
GET /admin%26modarator/dashboard/activity
GET /admin%26modarator/dashboard/upcoming-events
GET /user/users/online
```

Build order:

1. `/stats`
2. `/user/users/online`
3. `/home` global search
4. dashboard stats
5. dashboard activity
6. dashboard upcoming events

Keep the strange route spelling exactly for now:

```text
admin%26modarator
admin&modarator
```

You can clean it later only after updating the frontend too.

## Phase 6: Articles

Build articles before events/trainings because several pages reuse article file upload for rich editor images.

Required endpoints:

```text
GET    /articles/articles
POST   /articles/articles
GET    /articles/my-articles
GET    /articles/articles/{id}
PATCH  /articles/articles/{id}
DELETE /articles/articles/{id}
POST   /articles/articles/{id}/publish

GET    /articles/article-categories
POST   /articles/article-categories?name={name}
PATCH  /articles/article-categories/{id}?name={name}
DELETE /articles/article-categories/{id}

GET    /articles/articles/{id}/permissions
PATCH  /articles/article/permissions/bulk

POST   /articles/file-upload
POST   /articles/file-delete
```

Build order:

1. Category list/create/update/delete.
2. Article list with pagination and status filter.
3. Article detail.
4. Article create/update with `multipart/form-data`.
5. Publish/delete.
6. File upload/delete.
7. Article permissions.

Article create/update must support:

```text
title
category_id
excerpt
body
status
thumbnail
structured_fields
files[]
remove_file_urls
```

## Phase 7: Forums and Moderation

Build forums before moderation because moderation works on forum posts.

Required forum endpoints:

```text
GET    /forums/forums
POST   /forums/forums
GET    /forums/forums/{forumId}
PATCH  /forums/forums/{forumId}
DELETE /forums/forums/{forumId}
GET    /forums/forums/{forumId}/permissions
PATCH  /forums/forums/permissions/bulk

GET    /forums/forums/{forumId}/topics
POST   /forums/forums/{forumId}/topics
PATCH  /forums/topics/{topicId}/update
DELETE /forums/topics/{topicId}/delete
PATCH  /forums/topics/{topicId}/pin
GET    /forums/topics/pinned

GET    /forums/topics/{topicId}/posts
POST   /forums/topics/{topicId}/posts
PATCH  /forums/posts/{postId}
DELETE /forums/posts/{postId}
PATCH  /forums/posts/{postId}/moderate
```

Required moderation endpoints:

```text
GET /admin&modarator/moderation/queue
GET /admin&modarator/moderation/logs
```

Build order:

1. Forum list/detail.
2. Forum create/update/delete.
3. Forum permissions.
4. Topic list/create/update/delete.
5. Topic pin/unpin.
6. Topic posts list/create/update/delete.
7. Post moderation status.
8. Moderation queue.
9. Moderation logs.

Important behavior:

- Topic and post creation use `multipart/form-data`.
- Posts have `moderation_status`: `pending`, `approved`, `rejected`, or `flagged`.
- Moderation actions update the post and create a moderation log.

## Phase 8: Events and Agenda

Required endpoints:

```text
GET    /events/events/upcoming
GET    /events/events/calendar-stats
GET    /events/events
GET    /events/events/{id}
POST   /events/events
PATCH  /events/events/{id}
DELETE /events/events/{id}
POST   /events/events/{id}/register
DELETE /events/events/{id}/register
GET    /events/events/{id}/registrations
```

Build order:

1. Monthly event list: filter by `year` and `month`.
2. Upcoming events.
3. Event detail.
4. Create/update with `multipart/form-data`.
5. Delete.
6. Register/unregister.
7. Registration list.
8. Calendar stats.

Event create/update must support:

```text
title
event_type
event_date
end_date
event_time
location
description
max_attendees
is_public
status
attachments[]
new_attachments[]
remove_attachment_urls[]
```

## Phase 9: Trainings

Required endpoints:

```text
GET    /trainings/trainings/upcoming
GET    /trainings/trainings
GET    /trainings/trainings/{id}
POST   /trainings/trainings
PATCH  /trainings/trainings/{id}
DELETE /trainings/trainings/{id}
POST   /trainings/trainings/{id}/register
DELETE /trainings/trainings/{id}/register
GET    /trainings/trainings/{id}/permissions
PATCH  /trainings/training/permissions/bulk
```

Build order:

1. Training list/detail.
2. Upcoming trainings.
3. Create/update with `multipart/form-data`.
4. Delete.
5. Register/unregister.
6. Training permissions.

Training create/update must support:

```text
title
description
instructor_name
format
training_date
end_date
duration_hours
max_attendees
status
thumbnail
attachments[]
new_attachments[]
remove_attachment_urls[]
```

## Phase 10: Documents

Required endpoints:

```text
GET    /documents/documents/folders
POST   /documents/documents/folders
PATCH  /documents/documents/folders/{id}
DELETE /documents/documents/folders/{id}
GET    /documents/documents/folders/{id}/permissions
PATCH  /documents/folder/permissions/bulk

GET    /documents/documents?folder_id={id}
POST   /documents/documents/upload
PATCH  /documents/documents/{id}
DELETE /documents/documents/{id}
GET    /documents/documents/{id}/download
```

Build order:

1. Folder tree endpoint.
2. Folder create/update/delete.
3. Folder permissions.
4. Document list by folder.
5. Document upload.
6. Rename/delete document.
7. Download endpoint.

Important frontend expectations:

- Folder response is a tree with `children`.
- Folder object includes `can_upload`.
- Document download returns:

```text
download_url
filename
mime_type
```

## Phase 11: Profile and Notifications

Some profile APIs were already built in user/auth phases. Add notification preferences here.

Required endpoints:

```text
GET   /settings/notifications/preferences
PATCH /settings/notifications/preferences
POST  /auth/reset_password
PATCH /user/users/me
PATCH /user/users/{userId}/photo_upload
```

Build order:

1. Notification preference seed per user.
2. Preference list endpoint.
3. Preference update endpoint.
4. Password reset.
5. Profile update.
6. Avatar upload.

Notification types expected by the frontend:

```text
account_approved
new_article
new_document
new_event
new_post
new_training
post_rejected
post_reply
```

## Phase 12: Admin Settings, Logs, and Backups

Build these last. They are important, but the main app can run without them during early rebuild.

Required endpoints:

```text
GET    /settings/admin/smtp
PUT    /settings/admin/smtp
POST   /settings/admin/smtp/test

GET    /settings/admin/logs
GET    /settings/admin/logs/download
DELETE /settings/admin/logs

GET    /settings/admin/backups
PUT    /settings/admin/backups/config
POST   /settings/admin/backups/run
DELETE /settings/admin/backups/{id}
GET    /settings/admin/backups/{id}/download

GET    admin&modarator/admin/activity-log
```

Build order:

1. SMTP settings read/update.
2. SMTP test email.
3. Activity logs.
4. System log read/download/clear.
5. Backup configuration.
6. Manual backup run.
7. Backup download/delete.

Download endpoints should return blobs/files and set:

```text
Content-Disposition: attachment; filename="..."
```

## Phase 13: File Upload and Storage Rules

Centralize file handling because many modules need it.

Files are used by:

```text
user avatars
article thumbnails
article files
forum thumbnails
topic attachments
post attachments
event attachments
training thumbnails
training attachments
documents
backup archives
```

Recommended Cloudinary folder layout:

```text
archicopro/
├── avatars/
├── articles/
├── forums/
├── events/
├── trainings/
├── documents/
└── backups/
```

Each uploaded file should store:

```text
original_name
stored_name
file_url
mime_type
file_size
created_at
uploaded_by_id where relevant
```

## Phase 14: Response Shapes and Pagination

The frontend expects paginated responses in this style:

```json
{
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5,
  "results": []
}
```

Use this for:

```text
users
articles
forum topics
topic posts
moderation queue
moderation logs
```

For list counts in users, include:

```json
{
  "counts": {
    "all": 0,
    "active": 0,
    "pending": 0,
    "suspended": 0,
    "archived": 0
  }
}
```

## Phase 15: Testing Order

Test in this exact order from frontend to backend.

1. Login as admin.
2. Refresh browser and confirm session persists.
3. Sidebar loads correct menu items.
4. Admin can open `/admin`.
5. Create a role.
6. Set role permissions.
7. Create a member.
8. Login as member and confirm restricted sidebar.
9. Create article category.
10. Create and publish article.
11. Create forum, topic, and post.
12. Moderate a post.
13. Create event and register.
14. Create training and register.
15. Create document folder and upload file.
16. Download document.
17. Update profile and avatar.
18. Toggle notification preferences.
19. Test SMTP.
20. Run and download backup.

## Minimum Backend to Make Frontend Usable

If you need a fast first version, build only this:

1. Auth login/refresh/current user.
2. Users, roles, permissions.
3. Home read endpoints.
4. Articles read/list.
5. Forums read/list.
6. Events read/list.
7. Trainings read/list.
8. Documents folder/list.

After that, add create/edit/delete flows module by module.

## Best Starting Point

Start with this exact order:

1. Prisma validation and migration.
2. Seed roles and permissions.
3. Auth module.
4. Current user profile with permissions.
5. User/role/permission admin APIs.
6. Home/dashboard read APIs.
7. Articles.
8. Forums and moderation.
9. Events.
10. Trainings.
11. Documents.
12. Notifications/profile extras.
13. SMTP/logs/backups.

The most important rule: make `GET /user/users/me` correct early. The frontend depends on that endpoint for identity, role, permissions, sidebar visibility, route access, and action buttons.
