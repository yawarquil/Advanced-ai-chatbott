// Simple mood analysis utility for theme switching
export type Mood = 'positive' | 'negative' | 'neutral' | 'creative';

export function analyzeMood(text: string): Mood {
  const lower = text.toLowerCase();
  if (/\b(happy|great|awesome|fantastic|love|amazing|wonderful|cool|excited|yay|success|enjoy)\b/.test(lower)) {
    return 'positive';
  }
  if (/\b(sad|angry|hate|bad|terrible|awful|fail|problem|issue|annoy|frustrat|disappoint)\b/.test(lower)) {
    return 'negative';
  }
  if (/\b(imagine|create|draw|write|story|art|design|invent|dream|picture|fantasy|novel|poem|paint)\b/.test(lower)) {
    return 'creative';
  }
  return 'neutral';
} 