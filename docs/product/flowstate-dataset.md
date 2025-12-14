Test Subject : 6
Accountant, Uni Student X 3, C suite executive, Music Producer, Athlete

Raw Scores Input From Hardware 
{
  "flow_score": 0–100,
  "flow_stability": 0–1,
  "attention_span": 0–1,
  "context_switch_rate": 0–1,
  "mental_fatigue": 0–1,
  "cognitive_load": 0–1,
  "novelty_signal": 0–1,
  "recovery_need": 0–1
}

Interpreted State From The Hardware
0–39   -> low_flow
40–64 -> emerging_flow
65–84  -> strong_flow
85–100 -> peak_flow

Brain State
if novelty_signal high & cognitive_load low → creative
if cognitive_load high & context_switch low → analytical
if mental_fatigue high or recovery_need high → recovery

Direction Sub State Examples
Creative:
- idea_generation
- creative_execution

Analytical:
- planning
- decision_making
- problem_solving

Recovery:
- cognitive_reset
- passive_recovery

[Opening based on flow band]
[Meaning based on brain state + direction]
[Optional fatigue modifier]
Best use of this time:
[Do recommendation]
Suggested next step:
[Concrete task]

Next Step To work on : give longitudinal insights, “you do your best creative work at 9 PM”


 {
    "flow_score": 88,
    "flow_session": {
      "session_duration_min": 52,
      "flow_stability": "high",
      "interruptions": 1
    },
    "focus_decoding": {
      "attention_span": "long",
      "context_switching": "low",
      "mental_fatigue": "low"
    },
    "dominant_brain_state": "analytical",
    "brain_state_direction": "problem-solving",
    "brain_state_insight": "Your brain is optimized for logic, sequencing, and decision-making.",
    "how_to_use_this_state": [
      "Work on tasks with clear inputs and outputs",
      "Make decisions that require comparison or evaluation",
      "Finish partially completed analytical tasks"
    ],
    "what_to_avoid": [
      "Open-ended brainstorming",
      "Emotional or ambiguous conversations"
    ],
    "suggested_next_task": "Finalize financial review or debug a system issue"
  },

  {
    "flow_score": 76,
    "flow_session": {
      "session_duration_min": 41,
      "flow_stability": "medium",
      "interruptions": 2
    },
    "focus_decoding": {
      "attention_span": "medium",
      "context_switching": "medium",
      "mental_fatigue": "low"
    },
    "dominant_brain_state": "creative",
    "brain_state_direction": "idea generation",
    "brain_state_insight": "Your brain is forming novel connections and exploring possibilities.",
    "how_to_use_this_state": [
      "Generate ideas without judging them",
      "Explore new directions or concepts",
      "Write freely without editing"
    ],
    "what_to_avoid": [
      "Editing or refining",
      "Highly structured tasks"
    ],
    "suggested_next_task": "Brainstorm ideas for a new feature or draft a LinkedIn post"
  },

  {
    "flow_score": 55,
    "flow_session": {
      "session_duration_min": 28,
      "flow_stability": "low",
      "interruptions": 4
    },
    "focus_decoding": {
      "attention_span": "short",
      "context_switching": "high",
      "mental_fatigue": "medium"
    },
    "dominant_brain_state": "recovery",
    "brain_state_direction": "cognitive reset",
    "brain_state_insight": "Your brain needs reduced load to restore focus and energy.",
    "how_to_use_this_state": [
      "Do low-effort or routine tasks",
      "Allow mental space with light movement",
      "Prepare your environment for the next focus block"
    ],
    "what_to_avoid": [
      "Deep work",
      "Decision-heavy tasks"
    ],
    "suggested_next_task": "Organize workspace or take a short walk"
  },

  {
    "flow_score": 93,
    "flow_session": {
      "session_duration_min": 67,
      "flow_stability": "very_high",
      "interruptions": 0
    },
    "focus_decoding": {
      "attention_span": "very_long",
      "context_switching": "very_low",
      "mental_fatigue": "very_low"
    },
    "dominant_brain_state": "creative",
    "brain_state_direction": "creative execution",
    "brain_state_insight": "Your brain is not just generating ideas but actively building them.",
    "how_to_use_this_state": [
      "Create or design something end-to-end",
      "Write long-form content",
      "Build core product or strategy elements"
    ],
    "what_to_avoid": [
      "Interruptions",
      "Switching tasks"
    ],
    "suggested_next_task": "Create a product spec or write a long-form article"
  },

  {
    "flow_score": 69,
    "flow_session": {
      "session_duration_min": 36,
      "flow_stability": "medium",
      "interruptions": 2
    },
    "focus_decoding": {
      "attention_span": "medium",
      "context_switching": "low",
      "mental_fatigue": "medium"
    },
    "dominant_brain_state": "analytical",
    "brain_state_direction": "planning",
    "brain_state_insight": "Your brain is well-suited for structuring and prioritization.",
    "how_to_use_this_state": [
      "Break projects into steps",
      "Plan timelines or workflows",
      "Review and prioritize tasks"
    ],
    "what_to_avoid": [
      "Creative exploration",
      "High-pressure execution"
    ],
    "suggested_next_task": "Plan the next sprint or outline a document"
  }
]

{
  "brain_state": "analytical",
  "brain_state_direction": "decision-making",
  "flow_score": 87,
  "flow_stability": "high",
  "attention_span": "long",
  "context_switching": "low",
  "mental_fatigue": "low"
}

{
  "brain_state": "creative",
  "brain_state_direction": "idea generation",
  "flow_score": 74,
  "novelty_seeking": "high",
  "cognitive_flexibility": "high",
  "mental_fatigue": "low"
}

{
  "brain_state": "recovery",
  "brain_state_direction": "cognitive restoration",
  "flow_score": 46,
  "mental_fatigue": "high",
  "attention_drift": "high",
  "flow_stability": "low"
}

structure for every copilot messages / nudges
1. Acknowledge current state (human)
2. Explain what it’s good for (meaning)
3. Give one actionable suggestion (direction)
