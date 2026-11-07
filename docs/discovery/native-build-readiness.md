# Native build readiness — 2026-11-07

Latest scope: iOS, web and Android launch together. Mac access is through web. Internal development/test increments can proceed independently, but a web preview alone is not a completed release.

## Local evidence

| Check | Observed result | Implication |
|---|---|---|
| `sw_vers` | macOS 13.7.8 | Does not meet the documented macOS requirement for Xcode 26 |
| `xcode-select -p` | `/Library/Developer/CommandLineTools` | Command Line Tools selected, not a full Xcode installation |
| `xcodebuild -version` | Requires Xcode; active developer directory is a Command Line Tools instance | Native iOS build was not run |
| `xcrun simctl list devices available` | Unable to find `simctl` | No usable iOS simulator through the selected toolchain |
| `java -version` | Unable to locate a Java Runtime | No runnable JDK found through the current environment |
| PATH / standard install paths | No adb/gradle command, Android Studio app or `~/Library/Android/sdk` found at checked paths | Android build/emulator setup not established; not a whole-disk search |
| Node / npm | v24.14.0 / 11.9.0 | Meets the documented Capacitor 8 Node floor |

No software, SDK, account, signing credential, cloud builder, OS upgrade or paid service was installed/created. No native binary, emulator/device test or store submission is claimed.

## Supported architecture candidate and setup

The proposed shared-web-UI architecture uses Capacitor packages for iOS and Android, with native recording/persistence/file export only where the validated implementation needs it. Official documentation supports all three targets. Capacitor 8 requires Node 22+, Xcode 26+ for iOS, and Android Studio 2025.2.1+ plus Android SDK for Android; the Studio installation can supply the appropriate JDK. Exact pinned versions/plugin compatibility should be resolved in the first native slice, not guessed or forced to an obsolete runtime to fit this Mac. [Capacitor environment setup](https://capacitorjs.com/docs/getting-started/environment-setup), [iOS](https://capacitorjs.com/docs/ios), [Android](https://capacitorjs.com/docs/android).

Apple lists Xcode 26 as requiring macOS Sequoia 15.6 or a supported newer version. This machine's macOS 13.7.8 therefore cannot host that toolchain as currently configured. Use a supported Mac/build host; investigate existing CI or another authorised host before recommending a system/hardware change. No cloud-build fee/free entitlement is assumed. [Apple Xcode system requirements](https://developer.apple.com/support/xcode/).

## Work that can continue and release gates

After scope/file-trail agreement, implement the shared creative/data/offline work and its browser tests in small Orca branches while native setup is resolved. Create/review native project configuration and CI definitions with actual version compatibility checks; do not call them built until native toolchains execute them.

Before declaring the all-platform private release ready:
- Suitable iOS and Android toolchains execute reproducible builds from reviewed source.
- Appropriate signing/private distribution is set up through Daniel's authorised accounts. Credentials never enter source/chat/artifacts.
- Actual iPhone and Android routes pass capture/loop/stem/mix/save/reopen/export/offline/interrupt/upgrade tests. Simulators/desktop Chromium cannot attest to audio routing.
- Original browser data transfers through a verified backup into each native container while the original copy remains intact. Containers do not automatically share the browser database.

Public release additionally waits for store metadata/privacy/billing policy review, both store approvals and the agreed commercial backup/account/customer gates. Coordinate availability after readiness; no promise of simultaneous review completion.
