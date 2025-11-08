# 🐾 CampusPaws — Product & Developer Doc v2

CampusPaws is a compassionate, tech-enabled initiative built by IIT Roorkee students to manage, support, and care for campus dogs. This document provides a warm yet structured technical roadmap for developers and collaborators building the CampusPaws web platform.

---

## 🌟 Vision & Core Goals

To create a structured and efficient system that ensures the well-being of campus dogs through transparency, empathy, and technology.

### Goals:
- Simplify volunteer coordination and feeding schedules.
- Enable donation transparency with integrated payment solutions.
- Use data-driven insights (AI/ML) for dog health tracking.
- Build awareness and compassion among students and staff.

---

## 💻 Frontend Stack

- **Framework:** React + Next.js  
- **Styling:** TailwindCSS  
- **UI Libraries:** shadcn/ui, Aceternity UI, HeroUI  
- **Icons:** Lucide Icons, HeroIcons  
- **Animations:** Framer Motion  
- **UX Philosophy:** Warm, minimal, and emotionally engaging.

### UX Examples:
- Landing Page → HeroUI + Aceternity animations  
- Volunteer Dashboard → shadcn/ui  
- Dog Profiles → shadcn/ui + HeroUI modals  

---

## 🧠 Backend Stack

- **Platform:** Appwrite (hosted on AWS)  
- **ML Services:** Flask-based microservices  
- **Database:** Appwrite Collections  
- **Storage:** AWS S3  
- **Integrations:** Razorpay, Donate3, Instagram API, Leaflet.js  
- **Optional:** Plane for internal ops & task management  

---

## 🧩 Open Source Tools & Inspirations

- PetSOS  
- Animal Shelter Manager (ASM)  
- OpenCage Geocoding + Leaflet  
- Plane (for volunteer task coordination)

---

## 🏗️ System Architecture Overview

- **Frontend (Next.js + Tailwind)** → UI + dashboards  
- **Backend (Appwrite + Flask)** → Data, auth, ML  
- **Storage (S3)** → Dog images & documents  
- **Integrations:** Razorpay, Donate3, Plane, Leaflet  

Communication flows via REST APIs secured with Appwrite Auth.

---

## 🔌 API Examples

### Dogs API
```
POST /api/dogs  
GET /api/dogs  
PUT /api/dogs/:id  
DELETE /api/dogs/:id  
```

### Volunteer API
```
POST /api/volunteers  
GET /api/volunteers/tasks  
PUT /api/volunteers/status  
```

### Donation API
```
POST /api/donate  
GET /api/donations  
```

---

## 🪜 Development Steps

1. Setup Appwrite backend  
2. Build UI with shadcn/ui, HeroUI  
3. Integrate APIs & ML services  
4. Add map heatmaps using Leaflet  
5. Implement task system (+optional Plane integration)  
6. Deploy via AWS  
7. Launch awareness-driven frontend  

---

## ❤️ Closing Note

CampusPaws isn’t just software. It’s empathy engineered into action.  
Together, we make every paw count.  
🐕‍🦺  
