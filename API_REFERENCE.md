# API Reference

This file was extracted from the frontend API layer in `src/redux/features/**/**Api.ts`.

## Base configuration

- Base URL: `import.meta.env.VITE_API_BASE_URL`
- Default headers:
  - `Accept: application/json`
  - `Authorization: Bearer <token>` when a user token exists
- Automatic token refresh:
  - On `401` for non-auth endpoints, the app calls `POST /auth/refresh` and retries the original request if refresh succeeds

## Core

### Stats

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/stats` | Fetches shared summary stats used by the app-wide API slice. |

## Auth

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Mutation | `POST` | `/auth/login` | Signs a user in with email, password, and optional OTP value. |
| Mutation | `POST` | `/auth/signup` | Creates a new user account from signup form data. |
| Mutation | `POST` | `/auth/send_otp` | Sends a one-time password to an email for a given purpose. |
| Mutation | `POST` | `/auth/refresh` | Exchanges a refresh token for a new access token pair. |
| Query | `GET` | `/user/users/me` | Returns the authenticated user profile. |
| Mutation | `POST` | `/auth/verify_otp` | Verifies an OTP code for email-based flows. |
| Mutation | `POST` | `/auth/forgot_password` | Resets a password using email, new password, and verified session key. |
| Mutation | `POST` | `/auth/reset_password` | Changes the current user password using old and new password values. |

## Dashboard

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/admin%26modarator/dashboard/stats` | Loads the main admin/moderator dashboard KPI counters. |
| Query | `GET` | `/admin%26modarator/dashboard/activity` | Fetches recent dashboard activity items across system content. |
| Query | `GET` | `/admin%26modarator/dashboard/upcoming-events` | Returns upcoming events shown on the dashboard. |
| Query | `GET` | `/home/?q={query}&limit={limit}` | Runs the dashboard global search across articles, topics, events, and trainings. |

## Members / Users

### Users

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/user/users?archived={bool}&page={n}&page_size={n}&search={text}&role_id={id}&status={value}` | Lists users with archive, paging, search, role, and status filters. |
| Mutation | `POST` | `/user/users` | Creates a new user, including optional avatar and profile fields. |
| Query | `GET` | `/user/users/online` | Returns the currently online users list. |
| Query | `GET` | `/user/users/me` | Fetches the authenticated user's profile for member settings/screens. |
| Mutation | `PATCH` | `/user/users/me` | Updates the authenticated user's own profile. |
| Query | `GET` | `/user/users/{id}` | Fetches a single user by id. |
| Mutation | `PATCH` | `/user/users/{id}` | Updates an existing user record. |
| Mutation | `DELETE` | `/user/users/{id}` | Soft-deletes or removes a user from the user list. |
| Mutation | `PATCH` | `/user/users/{id}/restore` | Restores an archived/deleted user. |
| Mutation | `PATCH` | `/user/users/{id}/validate` | Marks a user as validated or approved. |
| Mutation | `PATCH` | `/user/users/{userId}/photo_upload` | Uploads and updates a member profile photo. |
| Mutation | `GET` | `/user/users/export/to_csv` | Downloads the users export as a CSV file. |

### Roles

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/user/roles` | Lists available user roles. |
| Mutation | `POST` | `/user/roles` | Creates a new user role. |
| Mutation | `PATCH` | `/user/roles/{id}` | Updates an existing role definition. |
| Mutation | `DELETE` | `/user/roles/{id}` | Deletes a user role. |

### Role Permissions

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/user/permissions?role_id={id}` | Lists permissions assigned to a role. |
| Mutation | `POST` | `/user/permissions` | Creates a new permission entry for a role. |
| Mutation | `PATCH` | `/user/permissions/{id}` | Updates a role permission entry. |

### Member-specific Permissions

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/user/user-permissions?user_id={id}` | Lists user-specific permission overrides for a member. |
| Mutation | `PATCH` | `/user/user-permissions/{id}` | Updates an individual member permission override. |

## Articles

### Articles

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/articles/articles?page={n}&page_size={n}&status={value}` | Lists articles with pagination and optional status filtering. |
| Mutation | `POST` | `/articles/articles` | Creates a new article with body content, metadata, thumbnail, and files. |
| Query | `GET` | `/articles/my-articles?page={n}&page_size={n}` | Lists articles created by the current user. |
| Query | `GET` | `/articles/articles/{id}` | Fetches a single article by id. |
| Mutation | `DELETE` | `/articles/articles/{id}` | Deletes an article. |
| Mutation | `POST` | `/articles/articles/{id}/publish` | Publishes an article. |
| Mutation | `PATCH` | `/articles/articles/{id}` | Updates article content, metadata, thumbnail, or attachments. |

### Article Categories

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/articles/article-categories` | Lists article categories. |
| Mutation | `POST` | `/articles/article-categories?name={name}` | Creates a new article category. |
| Mutation | `PATCH` | `/articles/article-categories/{id}?name={name}` | Renames or updates an article category. |
| Mutation | `DELETE` | `/articles/article-categories/{id}` | Deletes an article category. |

### Article Permissions and Files

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/articles/articles/{id}/permissions` | Fetches permission rules for a specific article. |
| Mutation | `PATCH` | `/articles/article/permissions/bulk` | Bulk-updates article access permissions. |
| Mutation | `POST` | `/articles/file-upload` | Uploads a file for article content or attachments. |
| Mutation | `POST` | `/articles/file-delete` | Deletes an uploaded article file by URL. |

## Events

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/events/events/upcoming?limit={n}` | Lists upcoming events for home/dashboard views. |
| Query | `GET` | `/events/events/calendar-stats` | Returns event calendar summary stats. |
| Query | `GET` | `/events/events?year={yyyy}&month={mm}` | Lists events for a given calendar month. |
| Query | `GET` | `/events/events/{id}` | Fetches one event by id. |
| Mutation | `POST` | `/events/events` | Creates a new event with attachments and schedule data. |
| Mutation | `PATCH` | `/events/events/{id}` | Updates an event and its attachments. |
| Mutation | `DELETE` | `/events/events/{id}` | Deletes an event. |
| Mutation | `POST` | `/events/events/{id}/register` | Registers the current user for an event. |
| Mutation | `DELETE` | `/events/events/{id}/register` | Cancels the current user's event registration. |
| Query | `GET` | `/events/events/{id}/registrations` | Lists registrations/attendees for an event. |

## Trainings

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/trainings/trainings/upcoming?page={n}&page_size={n}` | Lists upcoming trainings with pagination. |
| Query | `GET` | `/trainings/trainings` | Lists all trainings. |
| Query | `GET` | `/trainings/trainings/{id}` | Fetches one training by id. |
| Query | `GET` | `/trainings/trainings/{id}/permissions` | Returns permission rules for a training. |
| Mutation | `PATCH` | `/trainings/training/permissions/bulk` | Bulk-updates training permissions. |
| Mutation | `POST` | `/trainings/trainings` | Creates a training with attachments, thumbnail, and schedule data. |
| Mutation | `PATCH` | `/trainings/trainings/{id}` | Updates training details and attachments. |
| Mutation | `DELETE` | `/trainings/trainings/{id}` | Deletes a training. |
| Mutation | `POST` | `/trainings/trainings/{id}/register` | Registers the current user for a training. |
| Mutation | `DELETE` | `/trainings/trainings/{id}/register` | Cancels the current user's training registration. |

## Documents

### Folders

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/documents/documents/folders` | Lists the document folder tree. |
| Mutation | `POST` | `/documents/documents/folders` | Creates a document folder. |
| Mutation | `PATCH` | `/documents/documents/folders/{id}` | Updates folder metadata such as name, color, or parent. |
| Mutation | `DELETE` | `/documents/documents/folders/{id}` | Deletes a document folder. |
| Query | `GET` | `/documents/documents/folders/{id}/permissions` | Fetches folder-level access permissions. |
| Mutation | `PATCH` | `/documents/folder/permissions/bulk` | Bulk-updates permissions for one or more folders. |

### Documents

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/documents/documents?folder_id={id}` | Lists documents inside a specific folder. |
| Mutation | `POST` | `/documents/documents/upload` | Uploads a new document into a folder. |
| Mutation | `PATCH` | `/documents/documents/{id}` | Renames or updates a document record. |
| Mutation | `DELETE` | `/documents/documents/{id}` | Deletes a document. |
| Query | `GET` | `/documents/documents/{id}/download` | Returns the document download resource. |

## Forums

### Forums

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/forums/forums` | Lists all forums. |
| Mutation | `POST` | `/forums/forums?name={name}&author_name={name}&description={text}&forum_type={value}` | Creates a forum, optionally with a thumbnail upload. |
| Mutation | `PATCH` | `/forums/forums/{forumId}?name={name}&author_name={name}&description={text}&forum_type={value}` | Updates forum metadata and optional thumbnail. |
| Mutation | `DELETE` | `/forums/forums/{forumId}` | Deletes a forum. |
| Query | `GET` | `/forums/forums/{forumId}` | Fetches forum details. |
| Query | `GET` | `/forums/forums/{forumId}/permissions` | Lists permissions for a forum. |
| Mutation | `PATCH` | `/forums/forums/permissions/bulk` | Bulk-updates forum permissions. |

### Forum Topics

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/forums/forums/{forumId}/topics?page={n}&page_size={n}` | Lists topics inside a forum. |
| Mutation | `POST` | `/forums/forums/{forumId}/topics` | Creates a new topic in a forum with optional file attachments. |
| Mutation | `DELETE` | `/forums/topics/{topicId}/delete` | Deletes a forum topic. |
| Mutation | `PATCH` | `/forums/topics/{topicId}/update` | Updates topic title, content, and attachments. |
| Mutation | `PATCH` | `/forums/topics/{topicId}/pin?pinned={bool}` | Pins or unpins a topic. |
| Query | `GET` | `/forums/topics/pinned` | Lists pinned topics across forums. |

### Topic Posts

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/forums/topics/{topicId}/posts?page={n}&page_size={n}` | Lists posts/replies in a topic. |
| Mutation | `POST` | `/forums/topics/{topicId}/posts` | Creates a new post in a topic. |
| Mutation | `PATCH` | `/forums/posts/{postId}` | Updates an existing topic post. |
| Mutation | `DELETE` | `/forums/posts/{postId}` | Deletes a topic post. |

## Moderation

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/admin&modarator/moderation/logs?page={n}&page_size={n}` | Lists moderation activity logs. |
| Query | `GET` | `/admin&modarator/moderation/queue?page={n}&page_size={n}` | Lists posts waiting in the moderation queue. |
| Mutation | `PATCH` | `/forums/posts/{postId}/moderate` | Approves, rejects, or otherwise moderates a forum post. |

## Notifications

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/settings/notifications/preferences` | Fetches the current user's notification preference settings. |
| Mutation | `PATCH` | `/settings/notifications/preferences` | Updates one or more notification preferences. |

## Admin

### Activity Logs

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `admin&modarator/admin/activity-log?page={n}&page_size={n}` | Fetches paginated admin activity logs. |

### SMTP

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/settings/admin/smtp` | Loads SMTP configuration settings. |
| Mutation | `PUT` | `/settings/admin/smtp` | Updates SMTP configuration settings. |
| Mutation | `POST` | `/settings/admin/smtp/test` | Sends a test request to validate SMTP settings. |

### System Logs

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/settings/admin/logs` | Fetches admin system logs with request params for filtering. |
| Mutation | `GET` | `/settings/admin/logs/download` | Downloads the system logs file. |
| Mutation | `DELETE` | `/settings/admin/logs` | Clears stored system logs. |

### Backups

| Type | Method | Path | Description |
| --- | --- | --- | --- |
| Query | `GET` | `/settings/admin/backups` | Loads backup configuration and backup history. |
| Mutation | `PUT` | `/settings/admin/backups/config` | Updates backup configuration settings. |
| Mutation | `POST` | `/settings/admin/backups/run` | Triggers a new backup job. |
| Mutation | `DELETE` | `/settings/admin/backups/{id}` | Deletes a backup file/record. |
| Mutation | `GET` | `/settings/admin/backups/{id}/download` | Downloads a generated backup archive. |

## Notes

- Descriptions are inferred from frontend usage and endpoint naming.
- The file intentionally focuses on backend API calls from RTK Query slices, not third-party embed URLs like Office or YouTube.
- A few backend paths contain encoded or misspelled segments such as `modarator` and `%26`; they are documented exactly as used in the frontend.
