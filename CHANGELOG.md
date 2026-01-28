# Changelog

All notable changes to the **9M2PJU Amateur Radio Simulated Emergency Test Dashboard** will be documented in this file.

## [4.4.0] - 2026-01-28
### Added
- **Repeater Support**: Dedicated repeater station icon and type support.
- **Advanced Filtering**: New filter UI in Station List to filter by **Type** (Repeater, User, etc.), **Power Source** (Main/Battery), and **Status** (Active/Emergency).
- **Popup Icons**: Station type icons are now visible directly in the map popup header.

### Fixed
- **Toast Notifications**: Resurrected "New Station" toasts which were failing due to missing timestamp data.
- **Toast Positioning**: Centered toasts at the bottom of the screen (bottom-10) for better visibility on all devices.
- **Build System**: Resolved Typescript strictness errors regarding property mapping during production build.
- **Deployment Paths**: Fixed missing icon images when deployed to subdirectories (e.g., GitHub Pages) by using relative paths.

## [4.3.1] - 2026-01-28
### Fixed
- **Real-Time Sync**: Enabled live Supabase subscriptions to instantly reflect station additions/updates from other users without refreshing.
- **PDF Export**: Fixed filename format to include time (YYYY-MM-DD_HH-mm) and removed redundant "SITREP REPORT" phrasing.

## [4.3.0] - 2026-01-28
### Added
- **Manual Mode Entry**: Support for free-text mode entry alongside standard presets (FM, SSB, etc.).
- **Smart Notifications**: "New Station" alerts that track user visits and notify only on fresh activity.
- **Donation Workflow**: Periodic reminders and a synchronized "Support" popup flow.
- **New Strategic Icons**: Added specialized marker icons for **Civil Defense**, **Red Cross**, and **Military** units.
- **Brand Identity**: Complete asset refresh with high-definition Logo and Favicon.

### Changed
- **Notification Logic**: "New Station" alerts now wait for login/donation interactions to prevent UI clutter.
- **Mobile Experience**: Improved header layout and modal responsiveness (Login & Donation screens) for small screens.
- **Loading State**: Updated synchronization status text for better clarity ("Private Cloud").

### Fixed
- **Data Integrity**: Resolved camelCase/snake_case schema mismatch preventing station updates.
- **Mobile Overflow**: Fixed header text truncation and icon spacing on mobile devices.
- **Toast Access**: Notification visibility now strictly adheres to authentication scope.

## [4.2.0] - 2026-01-28
### Added
- **PWA Support**: Full PWA integration with service worker and **"Install App"** prompt in-UI.
- **Offline Map Caching**: OSMap tile caching for offline use and faster loading.
- **Brand Logo Support**: Integrated project logo in UI and PDF exports.
- **Supabase Authentication**: Secure login gate for all users.
- **Mobile UI Repair**: Comprehensive overhaul for small screens, including scrollable modals and balanced header.
- **Advanced PDF Export**: Professional report generation with branding and summarized telemetry data.

### Changed
- **Branding**: Updated all instances to "9M2PJU Amateur Radio Simulated Emergency Test Dashboard".
- **Map Theme**: Reverted to Light Theme (OSM) for all views to ensure maximum clarity on all devices.
- **Auth Flow**: Added loading states to prevent login page "flash" for authenticated users.
- **Header Design**: Refined responsive layout with better spacing and dynamic icon scaling.

### Fixed
- **Super Admin Visibility**: Optimized Super Admin controls for mobile (visible below header title).
- **Header Clipping**: Resolved off-screen icon clipping on small mobile devices.
- **Scroll Hijacking**: Prevented map zoom when scrolling the Station List sidebar on hover.
- **Donation Logic**: Fixed popup reset on logout and improved trigger timing (500ms).
- **Admin Layout**: Resolved off-screen clipping for settings and donation modals on mobile.

## [1.0.0] - 2026-01-15
### Initial Release
- Core tactical map functionality.
- Basic station management (CRUD).
- JSON Import/Export.
- Live clock and weather widgets.
