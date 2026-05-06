# CacaoGuard Mobile — React Native / Expo

A separate mobile application that mirrors the CacaoGuard web system, built with React Native and Expo.

## Folder Structure

```
mobile/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── babel.config.js
├── package.json
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.js        # Auth → App flow
│   │   ├── AppNavigator.js         # Bottom Tab Navigator
│   │   └── MoreNavigator.js        # Stack: Reports, Users, Settings
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── MonitoringScreen.js
│   │   ├── FarmsScreen.js
│   │   ├── AlertsScreen.js
│   │   ├── MoreMenuScreen.js
│   │   ├── ReportsScreen.js
│   │   ├── UsersScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── SeverityBadge.js
│   │   ├── FarmHealthCard.js
│   │   ├── StatCard.js
│   │   ├── ConfigCard.js
│   │   ├── DataTable.js
│   │   └── FarmerFeedbackForm.js
│   ├── data/
│   │   └── mockData.js
│   └── theme/
│       └── colors.js
```

## Setup & Run

```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your Android device, or run:

```bash
npx expo run:android
```

## Features

All features mirror the web version:

- **Login** — Mock authentication with demo accounts
- **Dashboard** — Stats, drone status, alerts, recent scans, farm status
- **Monitoring** — UAV scan simulation with progress, farm selection, feedback form, activity log
- **Farms** — Farm list with health cards, register new farm form
- **Alerts** — Filter by severity/status, resolve/reopen toggle
- **Reports** — Filter by severity, summary cards, scan history
- **Users** — User list with role badges, active toggle, edit form
- **Settings** — Disease thresholds (sliders), alert config (switches), scan settings
