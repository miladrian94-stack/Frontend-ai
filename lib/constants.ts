export const GENRES = [
  { value: 'POP', label: 'Pop 🎵' },
  { value: 'RAP', label: 'Rap 🎤' },
  { value: 'ROCK', label: 'Rock 🎸' },
  { value: 'EDM', label: 'EDM 🎧' },
  { value: 'ARABIC', label: 'Arabic 🎶' },
  { value: 'KHALEEJI', label: 'Khaleeji 🏜️' },
  { value: 'YEMENI', label: 'Yemeni 🌴' },
  { value: 'LOFI', label: 'LoFi 📻' },
  { value: 'CINEMATIC', label: 'Cinematic 🎬' },
  { value: 'ACOUSTIC', label: 'Acoustic 🎻' },
] as const

export const MOODS = [
  { value: 'HAPPY', label: 'Happy 😊' },
  { value: 'SAD', label: 'Sad 😢' },
  { value: 'EPIC', label: 'Epic ⚡' },
  { value: 'ROMANTIC', label: 'Romantic 💕' },
  { value: 'EMOTIONAL', label: 'Emotional 🎭' },
  { value: 'MOTIVATIONAL', label: 'Motivational 🔥' },
] as const

export const LANGUAGES = [
  { value: 'ENGLISH', label: 'English 🇺🇸' },
  { value: 'ARABIC', label: 'العربية 🇸🇦' },
] as const

export const VOICE_TYPES = [
  { value: 'MALE', label: 'Male 👨' },
  { value: 'FEMALE', label: 'Female 👩' },
] as const

export const DURATIONS = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 180, label: '3 minutes' },
] as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac', 'audio/webm']
