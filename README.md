# 📡 9M2PJU SET Dashboard
> **Official Dashboard for Amateur Radio Simulated Emergency Tests (SET)**

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=github)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![Amateur Radio](https://img.shields.io/badge/Amateur--Radio-OJ05--Grid-blueviolet?style=for-the-badge&logo=adafruit)
![Status](https://img.shields.io/badge/status-LIVE_EXERCISE-red?style=for-the-badge&logo=statuspage)

---

## 🌟 Overview

The **9M2PJU SET Dashboard** is a premium, real-time command center designed for coordinating Amateur Radio emergency communication exercises. Built with modern web technologies, it offers a glassmorphic interface, offline-first data persistence, and interactive mapping capabilities.

### 🚀 Key Features
- **🗺️ Interactive Tactical Map**: Dark-mode tactical map powered by Leaflet.
- **☁️ Supabase Cloud Persistence**: Real-time data synchronization across all devices.
- **🔐 Secure Authentication**: Integrated login/signup system for data ownership.
- **📱 Native Mobile Experience**: PWA-ready with touch-optimized controls.
- **🔄 Import/Export Scenarios**: Share exercise setups via JSON configuration files.
- **⚡ Real-time Widgets**: Live UTC/Local clock and simulated weather telemetry.
- **📍 Precise Positioning**: Live Latitude/Longitude and **Maidenhead Grid Square** (OJ05) display.
- **📰 News Ticker**: Integrated real-time emergency news and updates ticker.
- **❤️ Donation Support**: Built-in contribution system with Malaysian National QR.

---

## 🛠️ Architecture

```mermaid
graph TD
    A[User] -->|Sign In| B(Supabase Auth)
    B -->|Authenticated| C[SPA Dashboard]
    C -->|Fetch/Sync| D[(Supabase Database)]
    
    subgraph UI Components
        F[Glass Header]
        G[Tactical Map]
        H[Station List Sidebar]
        I[Admin Modals]
    end
    
    C --> F
    C --> G
    C --> H
    
    I -->|CRUD Operations| D
    I -->|Import/Export| J[JSON File]
    
    style C fill:#1e293b,stroke:#3b82f6,color:#fff
    style G fill:#0f172a,stroke:#3b82f6,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff
```

## 🖥️ Usage Guide

### Admin Mode
1. Click the **Settings (⚙️)** icon in the header.
2. Use **Export** to save your current station layout.
3. Use **Import** to load a pre-configured scenario.
4. Use **Clear Data** to reset the dashboard.

### Support the Project
- Click the **Heart (❤️)** icon in the header to view donation options.
- The dashboard supports **Malaysian National QR** (DuitNow) for seamless contributions to keep the service running.

### Managing Stations
- **Add**: Click the floating **(+)** button.
- **Edit/Delete**: Use the controls within the station list or map popups.
- **Locate**: Click any station in the sidebar to fly to its location.
- **Status**: Visual indicators for `Active`, `Inactive`, and `EMERGENCY`.

---

## 📦 Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 19 + TypeScript | Lightning fast UI rendering |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | Secure cloud-based data persistence |
| **Auth** | Supabase Auth | User identity and RLS policies |
| **Hosting** | Vercel | Global edge-network deployment |
| **Map** | React Leaflet | Open-source mobile-friendly maps |

---

<div align="center">
  <sub>Built with ❤️ by 9M2PJU Team</sub>
</div>
