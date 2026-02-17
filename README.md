# GoPulse

GoPulse is a social news platform (web + mobile) that helps subscribers discover, read, share and discuss news with a thoughtful community of independent thinkers. The app emphasizes quality discussion and misinformation reduction by requiring users to read articles before sharing, using invite-style "GoCodes" for subscriptions, and providing flagging and private direct-sends.

Repository: https://github.com/tommyd2377/gopulse

## Key features

- Invite / subscription model using "GoCodes"
- Article discovery from external sources (GNews API, RSS feeds)
- Must-read-before-share policy to discourage misinformation
- Flagging articles for biased or misleading content
- Direct-send: privately send articles to specific followers
- Account and subscription management screens
- Authentication (email/password), forgot password flows
- Payment/subscription integration (Stripe listed in dependencies)
- PWA-ready and packaged as a mobile app via Ionic/Capacitor/Cordova

## Tech stack

- Frontend: Angular (~8.x) + Ionic
- Mobile packaging: Capacitor + Cordova
- Backend services / integrations: Firebase (Auth, Database, Storage), GNews API, RSS parsing
- Payments: Stripe (dependency present)
- Libraries: angularfire2, firebase, rss-parser, stripe

## Quick start

Prerequisites
- Node.js (12.x recommended for Angular 8 projects)
- npm or yarn
- Angular CLI (optional): npm install -g @angular/cli
- Ionic CLI (optional, for mobile/PWA development): npm install -g @ionic/cli
- For mobile builds: Android Studio / Xcode (as required), Capacitor or Cordova tooling

Clone the repository
```bash
git clone https://github.com/tommyd2377/gopulse.git
cd gopulse
```

Install dependencies
```bash
npm install
```

Run the app in development (web)
```bash
npm start
# or
ng serve
# or (with Ionic CLI)
ionic serve
```

Build for production (web / PWA)
```bash
npm run build
# outputs to the dist/ folder by default
```

Mobile builds (Capacitor / Cordova)
- Configure Capacitor/Cordova according to your platform
- Example (Capacitor):
  1. npx cap add android
  2. npm run build
  3. npx cap copy android
  4. npx cap open android
- Example (Cordova):
  1. ionic cordova platform add android
  2. ionic cordova build android --prod

(Adjust commands for your local toolchain and target platform/version.)

## Configuration / environment

The app uses environment files in `src/environments/`. Important keys are stored in environment.ts / environment.prod.ts:

- Firebase configuration (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId)
- GNews API endpoints and API key (newsApi)
- Replace these with your own service credentials before deploying.

Important: Do not commit secret keys for production to a public repository. Use environment-specific configuration and secure key storage for production deployments.

Files of interest:
- `src/environments/environment.ts`
- `src/index.html`, `manifest.webmanifest` (PWA config)
- `config.xml`, `ionic.config.json` (Cordova/Ionic configuration)
- `package.json` (scripts & dependencies)

## Running tests & linting

- Unit tests
  ```bash
  npm test
  # or
  ng test
  ```
- Lint
  ```bash
  npm run lint
  ```

## Where to look in the codebase (examples)

- `src/app/welcome/` — app welcome screens
- `src/app/about/` — product description, features and contact text
- `src/app/sign-in/` — sign-in UI
- `src/app/account/` — account / GoCode management UI
- `src/environments/` — environment configuration (Firebase & GNews keys)
- `package.json` — list of dependencies (Angular, Ionic, Firebase, rss-parser, stripe, etc.)

## Security & privacy notes

- The repository currently contains environment files with service keys used for development. Make sure you rotate any keys that were exposed and store production secrets securely.
- Follow best practices for Firebase security rules and Stripe key management.

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement and test changes
4. Submit a pull request with a clear description of your changes

Please add tests for new features where feasible and follow the project's coding style.

## Contact / Support

- Author: Tom DeVito
- Website: [https://gopulse.app](https://gopulse-71176.web.app/)
- Contact email (from repo): contact@gopulse.app / support@gopulse.app

## License

Add a license to this repository (e.g., MIT, Apache-2.0) — there is no license file in the repository by default. Add LICENSE.md with your preferred license.

---

If you want, I can:
- tailor this README to include specific setup scripts for Capacitor/Cordova,
- add code examples and environment variable templates (.env.example),
- or produce a CONTRIBUTING.md and CHANGELOG.md to accompany this README. Which would you like next?
