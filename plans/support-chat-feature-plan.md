# Support Chat Feature Plan for Payflow Platform

## Overview
This plan outlines the implementation of a support chat feature for the Payflow platform. The feature will allow users and admins to communicate through a real-time chat interface, with admins having the ability to enable or disable the chat feature for specific users.

## Current System Architecture Analysis

### Payflow Platform Structure:
- **Frontend**: React 18 + TypeScript + Vite (client/pages/payflow/)
- **Backend API**: Express.js server (server/routes/payflow.ts)
- **Database**: Django ORM with SQLite (banking_admin/api/ models/views)
- **State Management**: LocalStorage for user/admin authentication
- **API Integration**: Django REST API endpoints consumed by Express server

### Key Files:
- [`client/pages/payflow/Dashboard.tsx`](client/pages/payflow/Dashboard.tsx) - User dashboard
- [`client/pages/payflow/AdminDashboard.tsx`](client/pages/payflow/AdminDashboard.tsx) - Admin dashboard
- [`server/routes/payflow.ts`](server/routes/payflow.ts) - Express API routes
- [`banking_admin/api/payflow_views.py`](banking_admin/api/payflow_views.py) - Django API views
- [`banking_admin/api/models.py`](banking_admin/api/models.py) - Database models
- [`banking_admin/api/serializers.py`](banking_admin/api/serializers.py) - DRF serializers

## Feature Requirements

### 1. Chat Functionality
- Real-time messaging between users and admins
- Chat window interface in user dashboard
- Admin chat interface in admin dashboard
- Message history persistence

### 2. Admin Control
- Admin can enable/disable chat feature for individual users
- Toggle switch in admin user management interface
- Chat feature visibility control based on admin settings

### 3. User Experience
- Chat button visible only when feature is enabled
- Chat window with message history and input field
- Notifications for new messages
- Message timestamps

### 4. Data Persistence
- Messages stored in database
- Message history retrieval for existing conversations
- Support for multiple concurrent chat sessions

## Database Design

### New Models Required:

1. **ChatSession** - Represents a chat conversation between user and admin
```python
class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_chat_sessions', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

2. **ChatMessage** - Stores individual chat messages
```python
class ChatMessage(models.Model):
    chat_session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
```

3. **UserAccount** - Modification to existing model
```python
class UserAccount(models.Model):
    # Existing fields
    chat_enabled = models.BooleanField(default=True)  # New field
```

## API Endpoints

### Django REST API (banking_admin/api/payflow_views.py)

1. **Toggle Chat Feature** - Admin only
   ```
   PUT /api/payflow/admin/user/{userId}/chat-toggle
   ```

2. **Get Chat Sessions** - User and Admin
   ```
   GET /api/payflow/chat/sessions
   GET /api/payflow/admin/chat/sessions
   ```

3. **Get Chat Messages** - User and Admin
   ```
   GET /api/payflow/chat/session/{sessionId}/messages
   ```

4. **Send Chat Message** - User and Admin
   ```
   POST /api/payflow/chat/session/{sessionId}/messages
   ```

5. **Create Chat Session** - User
   ```
   POST /api/payflow/chat/sessions
   ```

### Express API (server/routes/payflow.ts)

Corresponding Express routes that proxy requests to Django API

## Frontend Components

### User Dashboard (client/pages/payflow/Dashboard.tsx)

1. **Chat Button** - Visible only when `chat_enabled` is true
   - Floating button in bottom-right corner
   - Shows unread message count

2. **Chat Window** - Sliding drawer or modal
   - Message history display
   - Input field with send button
   - Auto-scroll to latest message
   - Message timestamps

3. **Notification Badge** - Shows unread message count

### Admin Dashboard (client/pages/payflow/AdminDashboard.tsx)

1. **User Management Table Enhancement**
   - Add "Chat Enabled" column with toggle switch
   - Toggle switch updates user's `chat_enabled` status

2. **Chat Management Interface**
   - Chat history panel showing all active chat sessions
   - User information and message preview
   - Unread message indicators

3. **Chat Window** - Similar to user interface
   - Message history with sender identification
   - Input field with send button
   - Mark messages as read

## Implementation Plan

### Phase 1: Backend Development (Django)

1. [ ] Create ChatSession model
2. [ ] Create ChatMessage model
3. [ ] Add chat_enabled field to UserAccount model
4. [ ] Create serializers for ChatSession and ChatMessage
5. [ ] Implement API views for chat operations
6. [ ] Add URLs for chat endpoints
7. [ ] Test backend API endpoints

### Phase 2: Backend Development (Express)

1. [ ] Create Express routes for chat operations
2. [ ] Implement proxy methods to call Django API
3. [ ] Add types to shared/api.ts
4. [ ] Test Express API endpoints

### Phase 3: Frontend Development (User Dashboard)

1. [ ] Add chat button component to Dashboard.tsx
2. [ ] Implement chat window/drawer component
3. [ ] Add message history display
4. [ ] Implement message sending functionality
5. [ ] Add real-time message polling
6. [ ] Implement unread message notifications

### Phase 4: Frontend Development (Admin Dashboard)

1. [ ] Add "Chat Enabled" column to user table
2. [ ] Implement toggle switch for chat feature
3. [ ] Create chat management interface
4. [ ] Add chat window component
5. [ ] Implement message sending and history
6. [ ] Add unread message indicators

### Phase 5: Testing and Integration

1. [ ] Test chat functionality with multiple users
2. [ ] Verify admin control of chat feature
3. [ ] Test edge cases (user disabled while chatting)
4. [ ] Performance testing for message retrieval
5. [ ] Cross-browser and responsive testing

## Technical Decisions

### Real-time Communication
- **Polling approach** - Simple to implement, use interval-based polling
- **Interval**: 5 seconds for message updates
- **Scalability**: Can upgrade to WebSockets later if needed

### Storage
- **Database**: SQLite (existing), can be upgraded to PostgreSQL if needed
- **Message retention**: Unlimited (or configurable) message history

### Security
- **User authentication**: Existing JWT-based authentication
- **Message visibility**: Users only see their own chat messages
- **Admin privileges**: Only admins can toggle chat feature

## Risk Assessment

### Low Priority
- WebSocket implementation complexity
- Message encryption (not required for MVP)
- File attachments (can be added in future versions)

### Medium Priority
- Real-time message delivery latency
- Large message history performance
- Unread message count accuracy

### High Priority
- Chat feature visibility control
- Message persistence reliability
- Admin control functionality

## MVP Scope

### Included Features
- Chat window interface for users
- Chat management for admins
- Message history retrieval
- Admin toggle for chat feature
- Basic unread message notifications

### Excluded Features (Future Versions)
- File attachments
- Emojis and rich text
- Typing indicators
- Online status
- Push notifications

## Success Metrics

1. **Feature Availability**: Chat visible to enabled users
2. **Functionality**: Messages sent/received correctly
3. **Performance**: Chat responsive under normal load
4. **Usability**: Admin toggle works correctly
5. **Reliability**: Message history persists correctly
