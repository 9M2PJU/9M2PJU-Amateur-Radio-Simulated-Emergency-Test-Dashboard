# Changelog

All notable changes to the **9M2PJU Amateur Radio Simulated Emergency Test Dashboard** will be documented in this file.

## [4.2.0] - 2026-01-28
### Added
- **PWA Support**: Full Progressive Web App integration with service worker.
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
- **Scroll Hijacking**: Prevented map zoom when scrolling the Station List sidebar on hover.
- **Donation Logic**: Fixed popup reset on logout and improved trigger timing (500ms).
- **Admin Layout**: Resolved off-screen clipping for settings and donation modals on mobile.

## [1.0.0] - 2026-01-15
### Initial Release
- Core tactical map functionality.
- Basic station management (CRUD).
- JSON Import/Export.
- Live clock and weather widgets.
