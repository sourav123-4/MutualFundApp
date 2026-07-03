# Fundly - Mutual Fund Browser

A React Native app for browsing Indian mutual fund schemes and their NAV
history. It uses the public [MFapi.in](https://www.mfapi.in/) API and runs on
Android and iOS.

## Features

- Demo login with field validation and a token stored in the native Keychain /
  Android Keystore
- Persistent login across app restarts
- Searchable mutual fund scheme list with pull-to-refresh
- NAV history for each scheme
- Loading, empty, timeout, and network error states with retry actions
- Simulated investment flow with a bottom sheet and minimum amount validation

## Login

Authentication is intentionally local for this assignment. Enter any valid
email address and any non-empty password. After validation, a dummy token is
written to secure native storage and restored when the app restarts.

## Run locally

### Prerequisites

- Node.js 22.11 or newer
- React Native Android/iOS development environment
- Xcode and CocoaPods for iOS, or Android Studio/JDK for Android

### Install

```bash
npm install
```

For iOS:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

For Android, start an emulator or connect a device, then:

```bash
npm run android
```

Run checks:

```bash
npm run lint
npm test
npx tsc --noEmit
```

## APK

A standalone Android assignment build is available at
`output/apk/Fundly-MutualFund.apk`. It is signed with the starter project's
debug key for evaluator installation only; a production release should use a
private release keystore.

## Project structure

```text
src/
  components/common/  Reusable inputs, buttons, states, and bottom sheet
  context/            Authentication state and startup token restoration
  navigation/         Authenticated/public stack navigation
  screens/
    public/auth/       Login
    protected/         Scheme list and scheme details
  services/           MF API client and secure token storage
  themes/             Shared colour and spacing tokens
  types/              API and navigation types
  utils/              Form validation
```

## Assumptions

- Any valid email and non-empty password can log in because no authentication
  API was requested.
- MFapi.in is the source of truth for scheme and NAV data.
- The investment action is a local simulation: it validates a whole-rupee
  amount of at least Rs. 100 and does not persist or process a payment.
- Search is case-insensitive and filters the fetched list by scheme name.
