# Calendar App - Modern Minimalist Calendar for Android

A beautiful, minimalist calendar app built with React Native and Expo.

## 🎯 Features

- **Calendar View** - Month view with swipe navigation
- **Holidays** - Automatic holiday display
- **Notes** - Add notes to any date
- **Reminders** - Set reminders with local notifications
- **Dark Mode** - Automatic light/dark theme support
- **Offline First** - All data stored locally with AsyncStorage

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 📱 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript (strict mode)
- **State Management:** Redux Toolkit
- **Styling:** NativeWind (Tailwind CSS)
- **Calendar:** react-native-calendars
- **Notifications:** expo-notifications
- **Storage:** AsyncStorage
- **Navigation:** React Navigation (Bottom Tabs)
- **Date Utils:** date-fns
- **UI Components:** @gorhom/bottom-sheet, react-native-modal

## 📂 Project Structure

```
src/
├── api/              # API client, services, mock data
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Main app screens
├── slices/           # Redux slices
├── store/            # Redux store configuration
├── theme/            # Theme colors, spacing, typography
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## 🎨 Design System

- **Primary Color:** #6366F1 (Indigo)
- **Secondary Color:** #8B5CF6 (Purple)
- **Accent Color:** #EC4899 (Pink)
- **Holiday Indicator:** Orange
- **Note Indicator:** Blue
- **Reminder Indicator:** Pink

## 📋 Implementation Status

**Phase 1-2: Setup & Configuration** ✅ **COMPLETE**
- [x] Expo project initialized
- [x] All dependencies installed (858 packages)
- [x] Folder structure created
- [x] NativeWind configured
- [x] TypeScript configured with path aliases
- [x] App.json configured with permissions

**Phase 3-14: Implementation** 🚧 **IN PROGRESS**
- [ ] Type definitions & theme files
- [ ] Utility helpers
- [ ] Redux architecture
- [ ] API layer & mock data
- [ ] Navigation setup
- [ ] Components & screens
- [ ] Custom hooks
- [ ] Integration & polish

**Current Progress:** ~15%

## 📖 Documentation

- **Full Implementation Plan:** See `IMPLEMENTATION_PLAN.md`
- **Original Design Doc:** See `C:\Users\jowel\.claude\plans\hashed-juggling-gizmo.md`

## 🔄 Continuing Development

To continue development in a new session:

1. Navigate to the project:
   ```bash
   cd C:\Users\jowel\Documents\PERSONAL\PROJECT\ReactNative\Calendar\claude\frontend\app
   ```

2. Read the implementation plan:
   ```bash
   cat IMPLEMENTATION_PLAN.md
   ```

3. Continue from **Phase 3** (Type Definitions & Theme)

**Claude Resume Prompt:**
> "I'm continuing the Calendar App project. Please read IMPLEMENTATION_PLAN.md to understand the current state and continue from Phase 3."

## 🛠 Development Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Clear Expo cache
npx expo start -c

# Update dependencies
npm update
```

## ⚠️ Known Issues

1. **Node Version:** Using Node 18.20.2, some packages expect Node 20+
   - Non-blocking, works fine
   - Consider upgrading to Node 20.19.4+ for production

2. **Deprecated Warnings:** Some dependency warnings
   - Will be resolved when Expo/React Native updates
   - Non-critical

## 📝 Next Steps

**Priority Order:**
1. Create type definitions (5 files)
2. Create theme files (3 files)
3. Build utility helpers (4 files)
4. Implement Redux architecture (7 files) ⭐ **CRITICAL**
5. Build API layer with mock data (7 files)
6. Continue with components and screens...

See `IMPLEMENTATION_PLAN.md` for detailed breakdown.

## 🎯 Project Goals

- **User Experience:** Smooth, intuitive, minimalist
- **Performance:** Fast, responsive, optimized
- **Reliability:** Offline-first, data persistence
- **Maintainability:** Clean code, TypeScript, documented
- **Extensibility:** Ready for backend integration

## 📱 Target Platform

- **Primary:** Android
- **Future:** iOS support included

## 🤝 Contributing

This is a personal project. For questions or suggestions, see the implementation plan.

## 📄 License

Private project - All rights reserved

---

**Started:** 2026-01-03
**Status:** Active Development
**Last Updated:** 2026-01-03
