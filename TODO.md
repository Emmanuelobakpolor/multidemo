# Support Chat Feature Implementation for PayFlow

## Backend Changes
- [ ] Add `chat_enabled` field to UserAccount model
- [ ] Create ChatMessage model
- [ ] Add chat-related API views in payflow_views.py
- [ ] Add chat URL patterns in urls.py
- [ ] Add ChatMessage serializer
- [ ] Run database migrations

## Frontend Changes
- [ ] Add chat toggle in AdminDashboard.tsx
- [ ] Add chat interface in AdminDashboard.tsx
- [ ] Add conditional chat widget in Dashboard.tsx
- [ ] Create ChatWidget component
- [ ] Create AdminChatInterface component
- [ ] Create ChatMessage component
- [ ] Update shared/api.ts with chat types

## Testing
- [ ] Test chat functionality between admin and users
- [ ] Ensure proper authentication and authorization
