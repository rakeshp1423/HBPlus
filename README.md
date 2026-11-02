# HB Plus Portal: React Native + Web, Google login restricted to one domain

One Expo / React Native codebase that runs on **Android, iOS and the browser** (React Native for Web).
Only Google accounts ending in `@hbplus.fit` can sign in. Everyone else sees:
> Access restricted. Please login using your official domain email.

## Features
- Google OAuth 2.0 sign-in (Firebase Auth), loading state, error handling
- Domain validation (client) **plus** Firestore security rules (server-side enforcement)
- Protected Dashboard, logout, session persistence
- Role-based access (Admin / User); admins see an "All users" list
- User profiles stored in Firestore (`users/{uid}`)

## Folder structure
```
App.js
firestore.rules              # server-side domain + role enforcement
src/
  config/env.js              # env vars, allowed domain, error text
  context/AuthContext.js     # auth state, domain gate, profile sync
  navigation/RootNavigator.js# conditional (protected) routes + web URLs
  screens/LoginScreen.js, DashboardScreen.js
  components/                # GoogleButton, ErrorBanner, Loader
  services/
    firebase.web.js / .native.js        # platform-specific Firebase init
    googleSignIn.web.js / .native.js    # popup (web) vs expo-auth-session (native)
    userService.js                      # Firestore user profile + admin list
  utils/domain.js, errors.js
```

## Setup

### 1. Install
```bash
npm install
npx expo install --fix     # aligns package versions with your Expo SDK
cp .env.example .env       # then fill in values (step 2-3)
```

### 2. Firebase
1. Create a project at https://console.firebase.google.com
2. **Authentication → Sign-in method → enable Google.**
3. **Authentication → Settings → Authorized domains:** add `localhost` and your production domain.
4. **Project settings → Your apps → add a Web app**; copy the config into `.env` (`EXPO_PUBLIC_FIREBASE_*`).
5. **Firestore Database → Create database**, then publish `firestore.rules`
   (paste in the Rules tab, or `firebase deploy --only firestore:rules`).
   If you change the domain, change it in the rules too (`hbplus[.]fit`).

### 3. Google OAuth client IDs (needed for Android / iOS)
Google Cloud Console → APIs & Services → Credentials (same project as Firebase):
- **Web client ID**: already created by Firebase ("Web client (auto created by Google Service)"). Put it in `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- **Android client ID**: type Android, package `fit.hbplus.portal`, plus your SHA-1.
- **iOS client ID**: type iOS, bundle ID `fit.hbplus.portal`.

Web-only testing needs just the Firebase config.

### 4. Run
```bash
npx expo start --web        # browser  -> http://localhost:8081
npx expo start --android    # Android emulator
npx expo start --ios        # iOS simulator (macOS)
```
Google sign-in on native does not work inside Expo Go. Use a development build:
`npx expo run:android` / `npx expo run:ios` (or EAS Build).

### 5. Make someone an Admin
New users are always created as `user`. Firestore rules stop clients from changing their own role.
In the Firebase console open **Firestore → users → {their doc}** and set `role` to `admin`.

### 6. Deploy web
```bash
npm run build:web           # outputs ./dist; host on Vercel / Netlify / Firebase Hosting
```
Configure the host to serve `index.html` for all routes (SPA fallback), and add the domain to Firebase Authorized domains.

## Security notes
- **Domain check happens in 3 places:** the Google `hd` hint (UX only), `AuthContext` (signs out wrong-domain or unverified accounts before any protected screen renders), and **Firestore rules** (the real enforcement; client code can be tampered with).
- **Protected routes:** the Dashboard screen is only registered when a validated user exists. Visiting `/dashboard` while logged out renders Login.
- **Tokens:** Firebase Auth owns the ID and refresh tokens (IndexedDB on web, AsyncStorage on native). The app never reads, copies or logs them.
- **Roles:** stored server-side in Firestore, writable only from the console/admin SDK. If you later add a backend API, verify the Firebase ID token and check the domain/role there too.
- Keep `.env` out of git (already in `.gitignore`). Firebase web config values are not secrets, but rules are what protect the data.

## Testing the flow
| Account | Result |
|---|---|
| `someone@hbplus.fit` | Dashboard |
| `someone@gmail.com` | Signed out, error banner shown |
| Open `/dashboard` while logged out | Login page |
