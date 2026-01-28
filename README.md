# 📡 9M2PJU Amateur Radio SET Dashboard
> **Premium Tactical Command Center for Amateur Radio Simulated Emergency Tests**

<div align="center">

![Version](https://img.shields.io/badge/version-4.4.0-blue.svg?style=for-the-badge&logo=github)
![Status](https://img.shields.io/badge/status-STABLE_RELEASE-emerald?style=for-the-badge&logo=statuspage)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=github)
![PWA](https://img.shields.io/badge/PWA-READY-ff69b4?style=for-the-badge&logo=pwa)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

</div>

---

## 🌟 Overview

The **9M2PJU Amateur Radio Simulated Emergency Test (SET) Dashboard** is a state-of-the-art, real-time command center designed for coordinating amateur radio emergency communication exercises. It provides a mission-critical interface for Net Control Stations (NCS) to track field units, verify signal coverage, and manage emergency telemetry.

### 🚀 Mission-Critical Features
- **🗺️ Interactive Tactical Map**: High-performance mapping with OSM integration and offline tile caching.
- **⚡ PWA & Offline Ready**: Install as a native app on Desktop/Mobile with Service Worker support for field use.
- **☁️ Real-time Cloud Sync**: Powered by Supabase for instantaneous data updates across all stations.
- **🔐 Secure Access Control**: Integrated Auth Gate ensures data integrity and user accountability.
- **📱 Responsive Excellence**: Perfectly balanced UI for both wide-screen monitors and field-duty mobile devices.
- **📄 Pro SITREP Generation**: One-click PDF export with integrated branding for official reporting.
- **📍 Precise Navigation**: Live coordinates, 6-digit Maidenhead Grid Squares, and "Fly To" station locating.
- **📰 Tactical Awareness**: Live UTC/Local clock, local weather radar, and a real-time news ticker.

---

## 🛠️ System Architecture

```mermaid
graph TD
    A[Field Operator] -->|Auth| B(Supabase Auth)
    B -->|Verified| C[9M2PJU Dashboard]
    C -->|Real-time Sync| D[(Supabase Cloud)]
    
    subgraph Dashboard Ecosystem
        F[Tactical Header]
        G[Interactive Map]
        H[Station Directory]
        I[Admin Controls]
        K[PWA Service Worker]
    end
    
    C --> F
    C --> G
    C --> H
    C --> K
    
    I -->|Export/Import| J[JSON Scenario]
    I -->|Report| L[PDF SITREP]
    
    style C fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style G fill:#1e293b,stroke:#06b6d4,color:#fff
    style D fill:#059669,stroke:#10b981,color:#fff
```

---

## 🖥️ Operational Guide

### 🛡️ Authentication
Users must sign in via the **Auth Gate** to access the dashboard. Registration is available for new operators to manage their own station data within the cloud synchronization layer.

### 📡 Managing Stations
- **Deploy**: Use the floating **(+)** button or tap long on the map to place a station.
- **Intelligence**: Click any station on the map or in the directory to view detailed operator info, radio frequency, and power status.
- **Tactical**: Use the **"Locate"** feature (LocateFixed icon) in the directory to instantly focus the map on a specific unit.

### 📋 Reporting (SITREP)
Generate official **Emergency Situation Reports (PDF)** from the Settings menu. Reports include full telemetry logs, operator details, and project branding.

### 💾 Offline Use
Designed for field operations. The dashboard uses **PWA Service Workers** to cache map tiles and application assets. Simply click **"Install App"** in the header to use it as a standalone tactical tool.

---

## 📦 Technical Specification

| Layer | Technology | Role |
|-----------|------------|-------------|
| **Core** | React 19 + TypeScript | Application Logic & State |
| **Styling** | Vanilla CSS + Tailwind | Premium Glassmorphic UI |
| **Persistence**| Supabase PostgreSQL | Military-grade Data Store |
| **Map Engine** | Leaflet JS | Tactical Geographic Visualization |
| **Caching** | Vite PWA | Offline Reliability |
| **Exports** | jsPDF + AutoTable | SITREP Generation |

---

## 👨‍💻 Author & Support
Created with ❤️ by **9M2PJU** for the Malaysian Amateur Radio community.

- **Website**: [hamradio.my](https://hamradio.my)
- **Support**: Use the **Heart (❤️)** button in the dashboard to contribute via DuitNow QR.

---
<div align="center">
  <sub>9M2PJU SET DASHBOARD • STABLE RELEASE 4.4.0 • 2026</sub>
</div>
