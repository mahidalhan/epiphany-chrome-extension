# Broswer Tech Stack

Extension Tech Stack

1. PRODUCT OVERVIEW

The Epiphany Browser Extension (and optional new-tab experience) transforms the web into a flow-optimized workspace by integrating three pillars:

1. Your Brain → live state data from the Epiphany device
2. Your Work → browser activity + focus context
3. Your Assistant → Flow AI that tracks, summarizes, and adjusts your cognitive mode

The extension delivers:

- Flow Score
- Headphone connection + battery/haptics control
- Flow AI summaries + reminders
- Flowprints: real-time neural visualizations
- Brain State Selector (Creative, Analytical, Recovery)
- Flow Tracking Timeline & Session Breakdown

2.1 FLOW SCORE MODULE

Purpose

Quantify daily cognitive performance using a blended metric from:

- EEG markers (engagement, workload, alpha/theta ratios)
- Time in chosen flow mode
- Distraction events (tab switching, idle time)
- Task completion signals provided by user

User Interface

- Circular glowing meter (0–100 pts)
- “Share your score” button → social copy + image export
- Tooltip explaining what contributed to today’s score

Technical Requirements

Inputs needed:

- Realtime EEG-derived metrics (coming via BLE device → cloud or local)
- Browser activity logs (tab switches, typing, URL categories)
- Time-in-flow-mode tracking

Outputs:

- A composite score updated every 5–10 seconds
- Local caching so score persists when browser reopens

2.2 DEVICE CONNECTION MODULE

Purpose

Allow seamless pairing with Epiphany Headphones inside the browser.

UI Elements

- Device card showing:
    - Connection status
    - Battery %
    - Stimulation mode currently active

Technical Requirements

- BLE/WebBluetooth integration
- Poll for device telemetry every 3–5 seconds
- Error handling (connection drop, low battery)
- Ability to trigger:
    - Start/stop stimulation
    - Switch Brain State (Creative / Analytical / Recovery)

2.3 FLOW AI SUMMARY

Purpose

Provide users with a concise narrative of their focus state, what they accomplished, and actionable recommendations.

Example Text (from mockups)

“You are in flow state since 4 hours and 22 minutes today.

You worked on [presentation] for 2 hours without distraction.”

Tech Requirements

Inputs:

- EEG changes indicating transitions between focus levels
- Browser activity classification (e.g., Notion = work, YouTube = leisure, Gmail = comms)
- Distraction events (idle, tab hopping)

AI Behavior:

- LLM builds hourly or real-time summaries
- Should operate locally or via Epiphany’s cloud
- Memory of ongoing user tasks (title inferred from active tab)

Output:

- Short natural-language summary
- Reminder engine (user can set reminder + timer)
- Distraction timer (“You were distracted for 2 hours”)

2.4 FLOWPRINTS (Live Neural Visualization)

Purpose

Provide a unique, aesthetic, calming visualization of brain activity.

UI Behavior

- Animated 3D or pseudo-3D blob
- Color changes based on:
    - Engagement
    - Creativity score
    - Analytical load
- Tooltip describing the current state (“Left Brain Engaged: analytical circuits active…”)

Technical Requirements

Inputs:

- EEG frequency band ratios:
    - Alpha/theta → creativity
    - Beta → analytical load
    - Delta changes → fatigue

Rendering:

- WebGL or Canvas-based shader
- ~10–15 FPS smoothing
- Color palette mapped to cognitive state:
    - Purple → creativity
    - Blue → focus
    - Yellow → high analytical load

Must accommodate:

- Low-power mode with reduced framerate

2.5 BRAIN STATE CONTROLLER

States:

1. Creative Flow
2. Analytical / Deep Focus
3. Active Recovery

Purpose

Allow user to manually select or accept AI-suggested modes.

UI Behavior

- Button group or pill selector below Flowprints
- Tooltip with explanation (“Great for writing / ideation / problem solving…”)
- Suggestions appear when EEG shows fatigue or switching needs

Tech Requirements

When user selects a mode, extension sends command to the headset:

{ mode: "creative", intensity: X, duration: Y }

- 
- Mode-specific EEG pattern detection to confirm effectiveness
- Fallback when device is disconnected

2.6 FLOW SESSION TIMELINE

Purpose

Track the user’s cognitive states throughout the day + highlight key events.

UI Elements

- Graph (banded line chart) from 9:00 → current time
- Labels for:
    - Flow onset
    - Creative spike
    - Deep focus drop-off
    - Break intervals

Example Events (based on mockup):

- “Creative Flow: High creativity spike detected — breakthrough moment”
- “Deep Focus: Entered deep focus for 2.5 hours”
- “Active Recovery: Recovering energy after work session”

Tech Requirements

Inputs:

- EEG time series
- Mode transitions
- Browser behavior
- Session boundaries (user starts/stops flow mode)

Outputs:

- Timeline objects pushed into a daily log
- Stored locally + synced to cloud profile

3. SYSTEM ARCHITECTURE

3.1 General Flow

Epiphany Device (EEG + stim)

↓ BLE

Browser Extension

↓ Local processors (state detection, scoring)

Flow AI Layer (local or cloud)

↓

UI Rendering (Dashboard + New Tab Experience)

3.2 Data Handling Requirements

- Real-time EEG bandwidth: small (<30Hz per channel)
- Local preprocessing (FFT or embeddings provided by device firmware)
- Cached historical logs for 30 days
- No PII stored without explicit consent
- All neural data encrypted in transit and at rest

4. USER JOURNEYS

4.1 Opening a New Tab (Default Mode)

1. User opens tab
2. Sees minimal search bar + Epiphany logo
3. Option: “Go to Dashboard”
4. If Flow Mode is ON → subtle glow + quick state indicator

4.2 Dashboard Flow

1. User clicks dashboard
2. Flow Score animates
3. Device status loads
4. Flowprints render
5. Flow AI shows summary
6. Timeline shows detected state transitions