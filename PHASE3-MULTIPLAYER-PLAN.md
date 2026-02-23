# Phase 3: Multi-Device Multiplayer Implementation Plan

## Overview

Add Kahoot-style multi-device multiplayer to the Yahtzee Score Card app. A host creates a game session and receives a 6-character join code + QR code. Other players join from their own devices by entering the code or scanning the QR code. All scorecards sync in real-time across all connected devices.

**References:**
- PRD Section 5.1.4: Multi-Device Session requirements
- PRD Section 4.2 Flow 2: Multi-Device Session user flows
- PRD Screens 2B (Host Setup), 2C (Join), 3B (Multi-Device Game Board)
- PRD Phase 1 Week 5: Multi-Device Mode tasks

---

## Architecture Decision: Firebase Realtime Database

**Why Firebase:**
- Recommended in the PRD (`yahtzee-tracker-prd.md` lines 723, 739)
- Generous free tier: 1GB storage, 10GB/month transfer, 100 simultaneous connections
- Built-in real-time listeners (no WebSocket server management)
- Works perfectly with Vercel static deployment (no server needed)
- Presence detection built-in via `.info/connected`
- Auto-cleanup via TTL rules or Cloud Functions
- Mature SDK with offline support

**Data Model:**
```
sessions/
  {sessionCode}/
    hostId: string              // UID of the host device
    status: "lobby" | "playing" | "finished"
    createdAt: timestamp
    lastActivity: timestamp
    settings: {                 // Game rules from host's settings
      upperBonusThreshold: number
      bonusPoints: number
    }
    players/
      {playerId}/
        name: string
        color: string
        isHost: boolean
        isConnected: boolean
        joinedAt: timestamp
        scorecard: {
          ones: number | null
          twos: number | null
          ... (all 13 categories)
        }
    gameState/
      currentPlayerIndex: number
      completedTurns: number
      round: number
```

---

## Implementation Steps

### Step 1: Firebase Setup & Configuration
**New files:**
- `src/services/firebase.js` — Firebase app initialization, database reference
- `.env` / `.env.example` — Firebase config environment variables

**Tasks:**
- [ ] Install `firebase` npm package
- [ ] Create Firebase project (or use env vars for config)
- [ ] Initialize Firebase app with Realtime Database
- [ ] Export database reference and utility functions
- [ ] Add `.env.example` with placeholder Firebase config keys
- [ ] Add Firebase config to Vite's env variable system (`VITE_FIREBASE_*`)

---

### Step 2: Session Service Layer
**New file:** `src/services/sessionService.js`

**Core Functions:**
- [ ] `generateSessionCode()` — Generate unique 6-character alphanumeric code (uppercase, no ambiguous chars like 0/O, 1/I/L)
- [ ] `createSession(hostName, hostColor, settings)` — Create a new session in Firebase, return session code
- [ ] `joinSession(sessionCode, playerName, playerColor)` — Join an existing session, return player ID
- [ ] `getSession(sessionCode)` — Check if a session exists and return its data
- [ ] `subscribeToSession(sessionCode, callback)` — Listen for real-time changes to session data
- [ ] `subscribeToPlayers(sessionCode, callback)` — Listen for player join/leave/updates
- [ ] `updateScore(sessionCode, playerId, category, score)` — Update a player's score for a category
- [ ] `advanceTurn(sessionCode, nextPlayerIndex)` — Move to the next player's turn
- [ ] `startGame(sessionCode)` — Host starts the game (status: lobby → playing)
- [ ] `endGame(sessionCode)` — Mark game as finished
- [ ] `leaveSession(sessionCode, playerId)` — Player disconnects/leaves
- [ ] `setupPresence(sessionCode, playerId)` — Use Firebase presence system to track connection status
- [ ] `deleteSession(sessionCode)` — Clean up session data

**Session Code Validation:**
- Codes are 6 chars: `[A-Z2-9]` (excludes 0, 1, O, I, L to avoid confusion)
- Check for uniqueness before creating
- Case-insensitive input (auto-uppercase)

---

### Step 3: Session Context (State Management)
**New file:** `src/context/SessionContext.jsx`

**State:**
```javascript
{
  sessionCode: string | null,
  playerId: string | null,
  isHost: boolean,
  sessionStatus: "lobby" | "playing" | "finished" | null,
  players: Player[],
  currentPlayerIndex: number,
  isConnected: boolean,
  error: string | null,
}
```

**Actions/Methods:**
- [ ] `hostGame(playerName, playerColor, settings)` — Create session, set as host
- [ ] `joinGame(sessionCode, playerName, playerColor)` — Join existing session
- [ ] `startGame()` — Host-only: begin the game
- [ ] `submitScore(category, score)` — Submit score for current player
- [ ] `leaveGame()` — Disconnect and clean up
- [ ] Real-time sync via Firebase listeners (auto-update state on remote changes)
- [ ] Connection status monitoring
- [ ] Error handling (session not found, session full, disconnected)

---

### Step 4: Host Setup Page
**New file:** `src/pages/MultiDeviceHost.jsx`

**UI (per PRD Screen 2B):**
- [ ] Bold color background (matches app design system)
- [ ] Title: "SESSION CODE" in Instrument Serif
- [ ] Giant 6-character code display (large, monospace, easy to read across a room)
- [ ] QR code that encodes a URL like `https://{domain}?join={sessionCode}`
  - Use `qrcode` npm package (lightweight, no server needed)
- [ ] Host enters their own name and picks a color
- [ ] List of joined players (updates in real-time as players join)
  - Each player shows name + color dot + connection status
- [ ] "START GAME" button (disabled until >= 2 players joined)
- [ ] "COPY CODE" button for easy sharing
- [ ] Back button to cancel and return home

**QR Code Implementation:**
- Install `qrcode` package for generating QR codes as data URLs
- QR encodes: `{window.location.origin}?join={sessionCode}`
- When the app loads with `?join=` param, auto-navigate to join screen with code pre-filled

---

### Step 5: Join Game Page
**New file:** `src/pages/MultiDeviceJoin.jsx`

**UI (per PRD Screen 2C):**
- [ ] Bold color background
- [ ] Title: "JOIN GAME" in Instrument Serif
- [ ] 6-character code input (large, monospace, one character per box like OTP inputs)
  - Auto-uppercase input
  - Auto-advance between character boxes
  - Paste support (paste full code)
- [ ] Player name input field
- [ ] Player color picker (same as SingleDeviceSetup, but only pick your own color)
  - Show which colors are already taken by other players
- [ ] "JOIN" button
- [ ] Error states: "Session not found", "Session already in progress", "Session full"
- [ ] On success: transition to lobby/waiting screen

**Waiting/Lobby View (after joining):**
- [ ] "Waiting for host to start..." message
- [ ] List of all joined players
- [ ] Your player highlighted
- [ ] Connection status indicator
- [ ] Leave button

---

### Step 6: Multi-Device Game Board
**Modify:** `src/pages/GameBoard.jsx` (extend existing, don't duplicate)

**Changes needed:**
- [ ] Accept a `multiDevice` prop or detect from SessionContext
- [ ] **Host view:** Shows all players' scorecards (similar to current single-device view)
  - Can see everyone's scores
  - Prominent "whose turn" indicator
  - No score entry — each player enters their own scores on their device
- [ ] **Player view:** Shows your own scorecard prominently
  - "YOUR TURN" or "{NAME}'S TURN" banner at top
  - Can only enter scores when it's your turn
  - "SCORES" button to see all players' standings in an overlay/modal
  - Disabled score entry when it's not your turn (visual indication)
- [ ] **Real-time sync:**
  - Listen for score updates from Firebase
  - Listen for turn advancement
  - Update UI immediately when remote changes arrive
  - Optimistic updates for your own score entry
- [ ] **Connection handling:**
  - Show disconnection warning banner
  - Auto-reconnect via Firebase SDK
  - Show which players are currently connected/disconnected
- [ ] **Turn management:**
  - After a player submits a score, auto-advance turn in Firebase
  - Skip disconnected players option (configurable by host)
  - Host can manually advance turn if a player is stuck

---

### Step 7: App.jsx Integration
**Modify:** `src/App.jsx`

- [ ] Wrap app with `SessionProvider` (from SessionContext)
- [ ] Add new screens: `'multi-host'`, `'multi-join'`, `'multi-lobby'`, `'multi-game'`
- [ ] Update `handleSelectMode('multi')` to navigate to a mode selection (Host vs Join)
- [ ] Handle URL query params: if `?join={code}` present, auto-navigate to join screen
- [ ] Add transition animations for new screens (consistent with existing pattern)
- [ ] Update game state persistence for multi-device mode
- [ ] Handle disconnection/reconnection (restore session from localStorage + Firebase)

---

### Step 8: QR Code URL Handling
**Modify:** `src/App.jsx` (initialization)

- [ ] On app load, check `window.location.search` for `?join=` parameter
- [ ] If present, auto-set screen to join with pre-filled code
- [ ] After extracting the param, clean the URL using `history.replaceState`
- [ ] Works for both QR code scans and shared links

---

### Step 9: Winner Screen for Multi-Device
**Modify:** `src/pages/Winner.jsx`

- [ ] Works the same for multi-device — all players see the winner announcement
- [ ] "Play Again" re-creates a session with the same players (host only)
- [ ] "Go Home" disconnects from session and returns to home

---

### Step 10: Polish & Edge Cases

**Connection resilience:**
- [ ] Firebase Realtime DB handles reconnection automatically
- [ ] On reconnect, state syncs from server (source of truth)
- [ ] Show "Reconnecting..." banner during disconnection
- [ ] If host disconnects, show warning to all players
- [ ] If host is gone for > 2 minutes, optionally promote another player to host

**Session cleanup:**
- [ ] Firebase security rules to auto-expire sessions after 2 hours of inactivity
- [ ] Host leaving triggers session end notification to all players
- [ ] `onDisconnect()` handler in Firebase to mark player as disconnected

**Error handling:**
- [ ] Session not found (code expired or invalid)
- [ ] Session full (6 players max)
- [ ] Session already in progress (can't join mid-game)
- [ ] Network errors with retry logic
- [ ] Duplicate names in same session (warn, don't block)

**Accessibility:**
- [ ] QR code has alt text with the session code
- [ ] Code input works with screen readers
- [ ] Connection status announced to screen readers
- [ ] All new UI follows existing design guidelines (AGENTS.md)

---

## New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `firebase` | Realtime Database, Auth (anonymous) | ~200KB gzipped (tree-shakeable) |
| `qrcode` | Generate QR codes as canvas/data URL | ~30KB |

---

## File Summary

### New Files (8)
| File | Purpose |
|------|---------|
| `src/services/firebase.js` | Firebase app init & database utilities |
| `src/services/sessionService.js` | All session CRUD & real-time operations |
| `src/context/SessionContext.jsx` | Multi-device state management & provider |
| `src/pages/MultiDeviceHost.jsx` | Host setup screen with code + QR + lobby |
| `src/pages/MultiDeviceJoin.jsx` | Join screen with code input + waiting |
| `src/pages/MultiDeviceLobby.jsx` | Shared lobby view (host controls + player list) |
| `src/components/QRCode.jsx` | QR code display component |
| `src/components/ConnectionStatus.jsx` | Connection indicator component |

### Modified Files (4)
| File | Changes |
|------|---------|
| `src/App.jsx` | Add SessionProvider, new screens, URL param handling |
| `src/pages/GameBoard.jsx` | Multi-device mode support (host view vs player view) |
| `src/pages/Winner.jsx` | Multi-device session cleanup on game end |
| `src/pages/Home.jsx` | Update multi-device button to navigate instead of alert |

### Config Files (2)
| File | Changes |
|------|---------|
| `package.json` | Add firebase, qrcode dependencies |
| `.env.example` | Firebase configuration template |

---

## Execution Order

```
Step 1:  Firebase Setup & Config           ← Foundation
Step 2:  Session Service Layer             ← Core logic
Step 3:  Session Context                   ← State management
Step 4:  Host Setup Page                   ← Host flow UI
Step 5:  Join Game Page                    ← Player flow UI
Step 6:  Multi-Device Game Board           ← Gameplay
Step 7:  App.jsx Integration              ← Wire everything together
Step 8:  QR Code URL Handling             ← Deep linking
Step 9:  Winner Screen Updates            ← Game completion
Step 10: Polish & Edge Cases              ← Production readiness
```

Steps 1-3 are sequential (each depends on the previous).
Steps 4-5 can be developed in parallel after Step 3.
Steps 6-7 depend on Steps 4-5.
Steps 8-10 can happen after Step 7.

---

## Firebase Security Rules (Recommended)

```json
{
  "rules": {
    "sessions": {
      "$sessionCode": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['hostId', 'status', 'createdAt'])",
        "players": {
          "$playerId": {
            ".validate": "newData.hasChildren(['name', 'color'])",
            "scorecard": {
              "$category": {
                ".validate": "newData.isNumber() || newData.val() === null"
              }
            }
          }
        },
        "gameState": {
          "currentPlayerIndex": {
            ".validate": "newData.isNumber()"
          }
        }
      }
    }
  }
}
```

> Note: For production, tighten rules so only the host can change `status` and `gameState`, and players can only modify their own scorecard. Anonymous auth can be used to enforce player identity.

---

## Testing Strategy

1. **Local testing:** Open multiple browser tabs/windows to simulate multiple devices
2. **Cross-device testing:** Use phone + laptop on same network
3. **Network resilience:** Test with Chrome DevTools network throttling / offline mode
4. **Edge cases:** Host disconnects, player disconnects mid-turn, session expires
5. **Load testing:** Verify Firebase free tier handles expected usage (50-100 concurrent games)
