<div align="center">

  <img src="../public/favicon.svg" alt="SYNIQ Logo" width="100" height="100" />

# 🐞 SYNIQ — Bug Fix & Verification Log

**Academic Quality Assurance & Defect Resolution Evidence (AC 4.3)**

  <p align="center">
    <img src="https://img.shields.io/badge/EVIDENCE_FOR-AC_4.3_(TESTING_&_DEBUGGING)-0EA5E9?style=for-the-badge&labelColor=0D1117" alt="AC 4.3 Evidence" />
    <img src="https://img.shields.io/badge/STATUS-ALL_FIXED-10B981?style=for-the-badge&labelColor=0D1117" alt="Status All Fixed" />
    <img src="https://img.shields.io/badge/BATCH_COMMIT-415ee69-7C3AED?style=for-the-badge&labelColor=0D1117" alt="Batch Commit" />
    <img src="https://img.shields.io/badge/LOGGED_DEFECTS-11_CRITICAL_ITEMS-F59E0B?style=for-the-badge&labelColor=0D1117" alt="Logged Defects" />
  </p>

  <p align="center">
    <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3987-4801-a50e-c67081e2b58b.gif" width="100%" alt="Header Divider Animation" />
  </p>

</div>

---

## 📜 Academic Context & Metadata

<table align="center" width="100%">
  <thead>
    <tr>
      <th align="center" width="30%">⚜️ Specification Field</th>
      <th align="left" width="70%">🏆 Academic Submission Record</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>👤 Student Name</b></td>
      <td><code>Mopara Pair Ayat</code> &nbsp;&nbsp; 🌟 <i>Primary Developer</i></td>
    </tr>
    <tr>
      <td align="center"><b>👩‍🏫 Course Instructor</b></td>
      <td><code>Ziana Mehnaz Ruhee</code> &nbsp;&nbsp; 🎓 <i>Project Evaluator & Mentor</i></td>
    </tr>
    <tr>
      <td align="center"><b>🏛️ Educational Institute</b></td>
      <td><b>BITHM College Of Professionals</b> &nbsp;&nbsp; 🏫 <i>Affiliated Campus</i></td>
    </tr>
    <tr>
      <td align="center"><b>📜 Qualification Level</b></td>
      <td><code>OTHM Level 5 in IT/CSE</code> &nbsp;&nbsp; 🇬🇧 <i>UK Regulated Framework</i></td>
    </tr>
    <tr>
      <td align="center"><b>📚 Subject & Criterion</b></td>
      <td><code>Software Engineering</code> — <b>AC 4.3</b> (Apply different testing techniques to validate code)</td>
    </tr>
  </tbody>
</table>

<br>

> [!NOTE]
> **About this Log:**
> This log documents the bugs found and fixed during development of Syniq, as evidence for testing and debugging carried out for **AC 4.3 (apply different testing techniques to validate code)**. Most of these were caught by manually playing through the game after each feature was added, a few by TypeScript/ESLint flagging something on save, and a couple by just noticing odd behaviour in the browser console during testing. All of them are still marked inline in the code with a `BUG-XX fix` comment next to the line that changed, and the batch of fixes below were committed together in `415ee69 — "Fixed all Bugs"`.

---

## 📊 Summary Index of Documented Bugs

| Bug ID | Affected Component / File | Issue Description | Detection Method | Status |
| :--- | :--- | :--- | :--- | :---: |
| **[BUG-02](#bug-02--round-popup-showed-the-wrong-score-on-anything-but-easy)** | [`src/components/game/GameContainer.tsx`](file:///d:/Syniq/src/components/game/GameContainer.tsx#L252) | Round popup showed wrong score on anything but Easy | Manual Gameplay Testing | ✅ Fixed |
| **[BUG-03](#bug-03--profile-re-synced-every-time-you-changed-page)** | [`src/layouts/AppLayout.tsx`](file:///d:/Syniq/src/layouts/AppLayout.tsx#L163) | Profile re-synced every time you changed page | Runtime Behaviour Inspection | ✅ Fixed |
| **[BUG-04](#bug-04--tying-your-own-high-score-just-didnt-save)** | [`src/services/LeaderboardService.ts`](file:///d:/Syniq/src/services/LeaderboardService.ts#L164) | Tying your own high score just... didn't save | Manual Edge-Case Testing | ✅ Fixed |
| **[BUG-05](#bug-05--game-over-save-flag-could-get-stuck-if-profile-loading-failed)** | [`src/hooks/useGame.ts`](file:///d:/Syniq/src/hooks/useGame.ts#L270) | Game-over save flag could get stuck if profile loading failed | Error-Path & Logic Inspection | ✅ Fixed |
| **[BUG-08](#bug-08--reset-settings-dialog-wouldnt-close-after-confirming)** | [`src/pages/SettingsPage.tsx`](file:///d:/Syniq/src/pages/SettingsPage.tsx#L110) | Reset Settings dialog wouldn't close after confirming | Click-Through GUI Testing | ✅ Fixed |
| **[BUG-12](#bug-12--score-popup-timers-kept-firing-after-leaving-the-game-screen)** | [`src/components/game/GameContainer.tsx`](file:///d:/Syniq/src/components/game/GameContainer.tsx#L56-L68) | Score popup timers kept firing after leaving game screen | Browser Console Warning | ✅ Fixed |
| **[BUG-13](#bug-13--an-invisible-element-was-eating-clicks)** | [`src/components/ui/PWAInstallBanner.tsx`](file:///d:/Syniq/src/components/ui/PWAInstallBanner.tsx#L25) | An invisible element was eating clicks | Manual UI Click Testing | ✅ Fixed |
| **[BUG-14](#bug-14--same-timer-leak-issue-this-time-in-the-toast-notifications)** | [`src/components/ui/Toast.tsx`](file:///d:/Syniq/src/components/ui/Toast.tsx#L33) | Same timer-leak issue, this time in toast notifications | Code & Lifecycle Inspection | ✅ Fixed |
| **[BUG-15](#bug-15--today--this-week-leaderboard-tabs-werent-really-filtering)** | [`src/components/profile/TopTenTable.tsx`](file:///d:/Syniq/src/components/profile/TopTenTable.tsx#L125) | "Today" / "This week" leaderboard tabs weren't really filtering | Manual Filtering Testing | ✅ Fixed |
| **[BUG-16](#bug-16--reading-localstorage-on-every-re-render)** | [`src/components/profile/TopTenTable.tsx`](file:///d:/Syniq/src/components/profile/TopTenTable.tsx#L61) | Reading localStorage on every re-render | Performance & Code Review | ✅ Fixed |
| **[BUG-18](#bug-18--daily-challenge-streak-wasnt-being-marked-as-completed)** | [`src/hooks/useGame.ts`](file:///d:/Syniq/src/hooks/useGame.ts#L245) | Daily Challenge streak wasn't being marked as completed | Feature Flow Testing | ✅ Fixed |

---

## 🛠️ Detailed Bug Fix Entries

### BUG-02 — Round popup showed the wrong score on anything but Easy

* **Where:** [`src/components/game/GameContainer.tsx`](file:///d:/Syniq/src/components/game/GameContainer.tsx#L252)

> **Description:**  
> The little "+10" popup that pops up when you clear a round was hardcoded to always say +10, no matter what. But the actual score added to your total used the difficulty multiplier (1x on Easy, 1.5x on Medium, 2x on Hard) via `ScoreCalculator`. So on Medium or Hard, your total would jump by more than the popup said — noticed this while testing on Hard difficulty, the numbers just didn't add up.

* **Fix:** Made the popup calculate the score the same way, `round × 10 × difficulty multiplier`, instead of a hardcoded number.

---

### BUG-03 — Profile re-synced every time you changed page

* **Where:** [`src/layouts/AppLayout.tsx`](file:///d:/Syniq/src/layouts/AppLayout.tsx#L163)

> **Description:**  
> The `useEffect` that loads the player's profile had `location.pathname` in its dependency array, so it re-ran the whole sync routine on every single navigation. Didn't break anything outright, but it meant an unnecessary IndexedDB read on every page change, and on a couple of routes it caused the auth modal to flash briefly when it shouldn't have.

* **Fix:** Dropped `location.pathname` from the deps so it only runs once on mount. Profile updates after things like a rename are already handled separately through a `syniq-profile-updated` custom event.

---

### BUG-04 — Tying your own high score just... didn't save

* **Where:** [`src/services/LeaderboardService.ts`](file:///d:/Syniq/src/services/LeaderboardService.ts#L164)

> **Description:**  
> `addScore` was comparing the new score to the existing one with `>`, so if you got exactly the same score again, the new attempt got thrown away completely, including its (newer) timestamp and round-reached value. Found this by deliberately replaying to match a previous score during testing and noticing the leaderboard entry didn't update at all.

* **Fix:** Changed `>` to `>=` so a tie still replaces the old entry with the newer run's data.

---

### BUG-05 — Game-over save flag could get stuck if profile loading failed

* **Where:** [`src/hooks/useGame.ts`](file:///d:/Syniq/src/hooks/useGame.ts#L270)

> **Description:**  
> `hasSavedGameOverRef` and `prevInputLengthRef` were being reset inside the `try` block of `startGame`. If `getOrCreateProfile()` threw an error (for example if IndexedDB wasn't ready yet), those refs never got reset, which meant the *next* game session's game-over logic could misbehave, thinking a save had already happened when it hadn't.

* **Fix:** Moved both ref resets above the `try/catch` so they always run first, regardless of whether loading the profile succeeds or fails.

---

### BUG-08 — Reset Settings dialog wouldn't close after confirming

* **Where:** [`src/pages/SettingsPage.tsx`](file:///d:/Syniq/src/pages/SettingsPage.tsx#L110)

> **Description:**  
> Clicking "Reset" on the confirmation dialog reset the settings correctly, but the dialog itself just stayed open. Small one, caught during a normal click-through test of the Settings page.

* **Fix:** Added `setIsResetOpen(false)` right after `resetSettings()` finishes.

---

### BUG-12 — Score popup timers kept firing after leaving the game screen

* **Where:** [`src/components/game/GameContainer.tsx`](file:///d:/Syniq/src/components/game/GameContainer.tsx#L56-L68)

> **Description:**  
> Each score popup removes itself after 850ms using `setTimeout`. If you navigated away from the game before that timer fired, React would try to update state on a component that no longer existed — showed up as console warnings during testing, and would have been a small memory leak if it happened repeatedly.

* **Fix:** Every popup's timer ID now gets pushed into a ref array, and a cleanup function clears all of them when the component unmounts.

---

### BUG-13 — An invisible element was eating clicks

* **Where:** [`src/components/ui/PWAInstallBanner.tsx`](file:///d:/Syniq/src/components/ui/PWAInstallBanner.tsx#L25)

> **Description:**  
> The wrapper `<div>` around the install banner was being rendered unconditionally, even when there was nothing to show. Because it was `fixed` at the bottom of the screen with `pointer-events-auto`, it sat there invisibly and blocked clicks on whatever was underneath it. Only noticed this because a button near the bottom of one page stopped responding to clicks for no obvious reason.

* **Fix:** Wrapped the div in the same condition already used to gate its visible content, so it only renders — and only blocks clicks — when it's actually supposed to be on screen.

---

### BUG-14 — Same timer-leak issue, this time in the toast notifications

* **Where:** [`src/components/ui/Toast.tsx`](file:///d:/Syniq/src/components/ui/Toast.tsx#L33)

> **Description:**  
> Same root cause as BUG-12: toast dismiss timers weren't tracked anywhere, so they could still fire and try to update state after the provider had already unmounted.

* **Fix:** Track pending timer IDs in a ref, clear them all in a cleanup effect on unmount.

---

### BUG-15 — "Today" / "This week" leaderboard tabs weren't really filtering

* **Where:** [`src/components/profile/TopTenTable.tsx`](file:///d:/Syniq/src/components/profile/TopTenTable.tsx#L125)

> **Description:**  
> The Today and This Week tabs on the leaderboard needed to filter entries by real date ranges, and still show a full table even when there weren't 10 scores yet within that window. The original filtering logic didn't compute the date boundaries correctly, so the tabs weren't reliably showing the right entries.

* **Fix:** Properly computed `startOfToday` and `startOfWeek` and filtered against those, with fallback padding so the table doesn't look broken or half-empty when there isn't much data yet.

---

### BUG-16 — Reading localStorage on every re-render

* **Where:** [`src/components/profile/TopTenTable.tsx`](file:///d:/Syniq/src/components/profile/TopTenTable.tsx#L61)

> **Description:**  
> `localStorage.getItem('syniq-avatar-id')` was being called directly in the component body, which means it ran on every re-render instead of once. Not a crash, just wasteful and a bit fragile if the value changed mid-render-cycle.

* **Fix:** Moved it into a `useState` lazy initializer so it's only ever read once, when the component first mounts.

---

### BUG-18 — Daily Challenge streak wasn't being marked as completed

* **Where:** [`src/hooks/useGame.ts`](file:///d:/Syniq/src/hooks/useGame.ts#L245)

> **Description:**  
> Finishing a Daily Challenge run is supposed to mark that day's streak as done, but `recordPlayToday()` was being called without telling it whether the session was actually a Daily Challenge. So the "completed today" flag for the streak never got set on that mode, meaning you could finish the daily challenge and still see it as "not done" the next time you checked.

* **Fix:** Pass `engine.mode === GameMode.DailyChallenge` into `recordPlayToday()`, so the flag only flips true on an actual Daily Challenge session.

---

## 📌 Note on numbering

> [!NOTE]
> The bug IDs above aren't fully sequential (there's no BUG-01, 06, 07, 09, 10, 11 or 17 in this log). Those were either caught and fixed without needing an inline comment — mostly ESLint or TypeScript errors that got fixed on the spot before they were ever committed — or the fix was small enough (an unused import, a missing key prop) that it didn't seem worth a numbered note. The ones documented here are specifically the ones with real behavioural impact, worth explaining in more than a one-word commit message.

<br>

<div align="center">

  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3987-4801-a50e-c67081e2b58b.gif" width="100%" alt="Footer Divider Animation" />

<sub>SYNIQ Academic Defect & Testing Documentation — Software Engineering (OTHM Level 5)</sub>

</div>
