# 🏙️ NagarSeva: Smart Civic Complaint & Tracking Portal

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://nagar-seva-iota.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-blue?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

![NagarSeva Hero](./public/assets/images/hero.png)

## 🚀 Overview

**NagarSeva** is a state-of-the-art, AI-powered civic engagement platform designed to bridge the gap between citizens and municipal authorities. Built with a focus on transparency, efficiency, and real-time responsiveness, it empowers citizens to report issues effortlessly while providing administrators with robust tools for field agent management and complaint resolution.

### 🎯 Multi-Role Platform

#### 🏘️ Citizen Experience
- **Smart Reporting**: File complaints with photos, videos, and GPS location
- **Real-time Tracking**: Monitor complaint status from filing to resolution
- **Multimedia Evidence**: Upload images, videos, and documents
- **Feedback System**: Rate and provide feedback on resolutions
- **Mobile-First Design**: Report issues on-the-go with responsive interface

#### 🤝 Volunteer Portal
- **Task Management**: Self-assign complaints from open queue
- **Field Operations**: GPS navigation to complaint locations
- **Progress Updates**: Update status with photo evidence
- **Performance Tracking**: Monitor personal workload and resolution metrics
- **On-Duty System**: Toggle availability for smart task assignments

#### 🛡️ Admin Dashboard
- **City-Wide Oversight**: Manage all complaints across the municipality
- **Worker Assignment**: Manual and automated (Round Robin) task distribution
- **Analytics Suite**: Comprehensive reporting and insights
- **System Monitoring**: Real-time performance and activity tracking
- **Role Management**: Manage volunteers and system permissions

### [🔗 Live Demo](https://nagar-seva-iota.vercel.app/)
### [ Admin Pass ]("admin@seva")
---

## ✨ Key Features

### 🤖 Context-Aware AI Chatbot
- **Page-Specific Intelligence**: Whether you're a citizen, an admin, or a volunteer, the Gemini-powered AI provides contextual assistance tailored to your current view.
- **Natural Language Reporting**: Simplifies the complaint filing process through guided interactions.

### 🛠️ Robust Worker Management
- **Intelligent Assignment**: Supports both manual and automated (Round Robin) task assignment to field agents.
- **Workload Tracking**: Real-time monitoring of agent tasks and performance.
- **Atomic Updates**: Ensures data consistency through server-side API integration.

### 📊 Comprehensive Dashboards
- **Citizen Portal**: Track reported issues with live progress bars and multimedia evidence.
- **Admin Command Center**: Holistic view of city-wide issues with advanced analytics and mapping.
- **Volunteer/Field Agent Mode**: On-duty tracking and step-by-step resolution flow.

### 📍 Geolocation & Multimedia
- **Interactive Mapping**: Precision location reporting using GPS coordinates.
- **Evidence Support**: Attach high-quality images and videos for faster incident verification.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React Icons](https://lucide.dev/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **AI Engine**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)
- **Styling**: Vanilla CSS + Modern Glassmorphism

---

## 📁 Project Structure

```text
immortals/
├── src/
│   ├── app/            # Next.js Route Handlers & Pages
│   ├── components/     # Atomic UI & Feature-specific Components
│   ├── hooks/          # Custom React hooks (Data fetching, Auth)
│   ├── lib/            # Shared Utilities & Supabase Client
│   ├── services/       # Core Business Logic & API Layer
│   └── types/          # Centralized TypeScript Definitions
├── public/             # Static Assets & Hero Images
└── supabase/           # SQL Schemas & Database Migrations
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- Supabase Project
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SumitPujari30/immortals.git
   cd immortals
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. **Choose Your Role**:
   - **Citizens**: Visit `/signup` to register and start reporting issues
   - **Volunteers**: Apply during signup or contact admin for field agent access
   - **Admins**: Access `/admin/login` for system management

---

## 🎯 Quick Start Guide

### 🏘️ For Citizens
1. **Register**: Create account with email verification
2. **File Complaint**: Use `/complaints/new` with photo/video evidence
3. **Track Progress**: Monitor status in real-time on `/dashboard`
4. **Rate Resolution**: Provide feedback after issue resolution

### 🤝 For Volunteers  
1. **Apply**: Register as volunteer during signup
2. **Go On-Duty**: Toggle availability in volunteer portal
3. **Assign Tasks**: Self-assign complaints from open queue
4. **Navigate**: Use GPS to locate issue addresses
5. **Update Status**: Progress through workflow with evidence photos

### 🛡️ For Administrators
1. **Login**: Access `/admin/login` with admin credentials
2. **Monitor**: View city-wide complaint dashboard
3. **Assign**: Distribute tasks to volunteers (manual or auto)
4. **Analyze**: Review performance analytics and reports
5. **Manage**: oversee user roles and system settings

---

## � User Roles & Access

### 🛡️ Administrator
- **Access**: `/admin` dashboard with full system control
- **Features**: 
  - Manage all complaints city-wide
  - Assign workers to complaints (manual & Round Robin)
  - View analytics and reporting dashboards
  - Manage worker profiles and assignments
  - Monitor system performance
- **Default Login**: Use admin credentials or register as admin

### 🤝 Volunteer / Field Agent
- **Access**: `/volunteer` portal for field operations
- **Features**:
  - Self-assign complaints from open queue
  - Update complaint status with progress tracking
  - GPS navigation to complaint locations
  - Upload evidence and resolution photos
  - Track personal workload and performance
- **On-Duty System**: Toggle availability for task assignments

### 🏘️ Citizen
- **Access**: `/dashboard` for personal complaint tracking
- **Features**:
  - File new complaints with multimedia evidence
  - Track status of all reported issues
  - View complaint history and resolution timeline
  - Receive notifications on status updates
  - Rate and provide feedback on resolutions

---

## 🔄 Workflow Process

1. **Complaint Filing**: Citizen reports issue → Status: `pending`
2. **Review Phase**: Admin/Volunteer reviews → Status: `under_review`  
3. **Assignment**: Worker assigned → Status: `in_progress`
4. **Resolution**: Issue resolved → Status: `resolved`
5. **Closure**: Feedback collected → Case closed

---

## 🎮 Demo Guide for Hackathon Judges

### 🚀 Landing Page Features
- **Role Showcase**: Three distinct cards for Citizen, Volunteer, and Admin portals
- **Live Statistics**: Real-time data showing active users and resolved complaints
- **Interactive Navigation**: Smooth scrolling to feature sections
- **Mobile Responsive**: Optimized for all device sizes

### 🏘️ Citizen Journey Exploration
1. **Signup Flow**: Visit `/signup` → Complete profile → OTP verification
2. **Complaint Filing**: Navigate to `/complaints/new` → Upload photos/videos → GPS location
3. **Dashboard**: Visit `/dashboard` → View personal complaint history → Track status updates
4. **Notifications**: Real-time status changes and resolution alerts

### 🤝 Volunteer Portal Testing
1. **Apply as Volunteer**: During signup, select "Volunteer" role
2. **Field Operations**: Visit `/volunteer` → Toggle "On Duty" → Browse open complaints
3. **Task Assignment**: Self-assign complaints → Navigate via GPS → Update status
4. **Performance Tracking**: View personal metrics → Resolution history

### 🛡️ Admin Dashboard Deep Dive
1. **Admin Access**: Visit `/admin/login` → Use admin credentials
2. **Complaint Management**: Browse `/admin/complaints` → Filter by status/priority
3. **Worker Management**: View volunteer list → Assign tasks manually or auto-distribute
4. **Analytics**: Explore metrics dashboard → Resolution rates → Performance insights
5. **System Settings**: Manage user roles → Configure system parameters

### 🤖 AI Chatbot Experience
- **Context-Aware**: Chatbot adapts based on current page and user role
- **Multi-Language**: Natural language processing for easy interaction
- **Guided Tours**: Ask "How do I file a complaint?" for step-by-step help
- **Smart Suggestions**: Contextual recommendations based on user activity

### 📱 Mobile Experience
- **Responsive Design**: Test on mobile devices for optimal experience
- **Touch-Friendly**: Large buttons and intuitive navigation
- **Offline Support**: Progressive Web App capabilities
- **Push Notifications**: Real-time updates on mobile devices

### 🔗 Key Demo Routes to Explore
```
/                    # Landing page with role showcase
/login               # User authentication flow  
/signup              # Multi-role registration
/complaints/new       # Complaint filing with media upload
/dashboard            # Citizen complaint tracking
/volunteer           # Field agent portal
/admin/login          # Admin authentication
/admin                # Admin dashboard
/admin/complaints     # Complaint management
```

---

## 📜 License

NagarSeva is built by **Sumit Pujari (SumitPujari30)**. All rights reserved. 🏙️