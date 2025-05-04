# EventFlow - Event Management Platform
![EventFlow Banner](https://github.com/user-attachments/assets/8aa4835f-f10f-4555-8252-6aafafcc475c)

A streamlined event management platform that handles event registrations and interactions between organizers and attendees.

## Live Deployment

- **Frontend**: [Vercel Deployment Link](https://event-flow-eight.vercel.app/)
- **Backend**: [Render Deployment Link](https://eventflow-1wso.onrender.com)

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL (Neon)

## Features Implemented

### Core Features
- ✅ Attendee registration/login with mock email auth
- ✅ Event browsing and registration
- ✅ Organizer dashboard for event management
- ✅ Engagement scoring system
- ✅ Secure API endpoints with JWT
- ✅ Data encryption for sensitive fields
- ✅ Audit logging system

### Bonus Features
- 🔔 Real-time notifications (WebSockets)
- 📊 Advanced engagement analytics

## User Flow System

```mermaid
flowchart TD
    A[Start] --> B{User Type?}
    B -->|Attendee| C[Browse Events]
    B -->|Organizer| D[Login to Dashboard]
    
    C --> E[View Event Details]
    E --> F{Register?}
    F -->|Yes| G[Complete Registration]
    F -->|No| C
    
    D --> I[Create New Event]
    I --> J[Manage Event Details]
    J --> K[View Registrations]
    K --> L[Track Engagement Score]
    
    H --> M[Receive Updates]
    L --> N[Improve Event]
    
    style A fill:#4CAF50,stroke:#388E3C
    style B fill:#FFC107,stroke:#FFA000
    style C,D fill:#2196F3,stroke:#1976D2
    style E,F,G,H fill:#9C27B0,stroke:#7B1FA2
    style I,J,K,L fill:#3F51B5,stroke:#303F9F
    style M,N fill:#009688,stroke:#00796B
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    USER {
        string id PK
        string email
        string password_hash
        string role "attendee|organizer"
        datetime created_at
    }
    
    EVENT ||--o{ REGISTRATION : has
    EVENT {
        string id PK
        string title
        string description
        datetime start_time
        datetime end_time
        string location
        string organizer_id FK
        float engagement_score
        datetime created_at
        datetime updated_at
    }
    
    REGISTRATION {
        string id PK
        string event_id FK
        string attendee_id FK
        boolean attendance_confirmed
        integer feedback_rating
        datetime registered_at
    }
    
    AUDIT_LOG {
        string id PK
        string action
        string user_email
        string organizer_id
        datetime timestamp
        json metadata
    }
```
# EventFlow

## Engagement Scoring Algorithm

The engagement score (0-6 points) is calculated as:

### Registrations (0-2 pts):
- **0**: Less than 10 registrations  
- **1**: 10-50 registrations  
- **2**: More than 50 registrations  

### Confirmation Rate (0-2 pts):
- **0**: Less than 30% confirmed  
- **1**: 30-70% confirmed  
- **2**: More than 70% confirmed  

### Organizer Responsiveness (0-1 pt):
- **1**: Organizer updated event details within 48h of creation  

### Attendee Feedback (0-1 pt):
- **1**: Average rating ≥ 4/5  

---

## Installation Guide

### Frontend Development

#### Clone the repository
```bash
git clone https://github.com/yourusername/eventflow.git
cd eventflow
cd frontend
npm install
cp .env.example .env.local
# Update environment variables
npm run dev
```

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Update environment variables
npx prisma migrate dev
npm run dev
```

## 🗄️ Database Setup

### Install PostgreSQL

1. Ensure PostgreSQL is installed on your system.
2. Create a new database.

### Configure Environment

Update the following in `backend/.env`:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

### License
MIT License - See LICENSE for details.
