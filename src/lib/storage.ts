// Storage utility functions for localStorage operations

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: 'energized' | 'calm' | 'tired' | 'stressed' | 'motivated';
  intensity: number; // 1-5
  timestamp: string;
  workoutId?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'recovery';
  duration: number; // minutes
  exercises: Exercise[];
  moodBased: boolean;
  recommendedMoods: MoodEntry['mood'][];
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restTime: number; // seconds
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  moodBefore?: MoodEntry;
  moodAfter?: MoodEntry;
  exercisesCompleted: string[];
}

export interface FailureEntry {
  id: string;
  date: string;
  reason: string;
  category: 'time' | 'motivation' | 'energy' | 'health' | 'schedule' | 'other';
  notes?: string;
  scheduledWorkoutId?: string;
}

export interface UserStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  disciplineScore: number;
  totalMinutes: number;
  missedWorkouts: number;
}

const STORAGE_KEYS = {
  USER: 'fitu_user',
  MOOD_ENTRIES: 'fitu_mood_entries',
  WORKOUTS: 'fitu_workouts',
  WORKOUT_SESSIONS: 'fitu_workout_sessions',
  FAILURE_ENTRIES: 'fitu_failure_entries',
  USER_STATS: 'fitu_user_stats',
  CURRENT_MOOD: 'fitu_current_mood',
  SCHEDULED_WORKOUTS: 'fitu_scheduled_workouts',
} as const;

// Generic storage functions
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
}

// User functions
export function getUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.USER, null);
}

export function setUser(user: User): void {
  setItem(STORAGE_KEYS.USER, user);
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Mood functions
export function getMoodEntries(): MoodEntry[] {
  return getItem<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
}

export function addMoodEntry(mood: Omit<MoodEntry, 'id' | 'timestamp'>): MoodEntry {
  const entries = getMoodEntries();
  const newEntry: MoodEntry = {
    ...mood,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  entries.push(newEntry);
  setItem(STORAGE_KEYS.MOOD_ENTRIES, entries);
  return newEntry;
}

export function getCurrentMood(): MoodEntry | null {
  return getItem<MoodEntry | null>(STORAGE_KEYS.CURRENT_MOOD, null);
}

export function setCurrentMood(mood: MoodEntry): void {
  setItem(STORAGE_KEYS.CURRENT_MOOD, mood);
}

// Workout functions
export function getWorkouts(): Workout[] {
  return getItem<Workout[]>(STORAGE_KEYS.WORKOUTS, getDefaultWorkouts());
}

export function getWorkoutById(id: string): Workout | undefined {
  return getWorkouts().find(w => w.id === id);
}

export function getWorkoutsByMood(mood: MoodEntry['mood']): Workout[] {
  return getWorkouts().filter(w => w.recommendedMoods.includes(mood));
}

// Workout session functions
export function getWorkoutSessions(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS, []);
}

export function addWorkoutSession(session: Omit<WorkoutSession, 'id'>): WorkoutSession {
  const sessions = getWorkoutSessions();
  const newSession: WorkoutSession = {
    ...session,
    id: generateId(),
  };
  sessions.push(newSession);
  setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
  updateStatsAfterWorkout(newSession);
  return newSession;
}

export function updateWorkoutSession(id: string, updates: Partial<WorkoutSession>): void {
  const sessions = getWorkoutSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
  }
}

export function getCurrentSession(): WorkoutSession | null {
  const sessions = getWorkoutSessions();
  return sessions.find(s => !s.completed && !s.endTime) || null;
}

// Failure entry functions
export function getFailureEntries(): FailureEntry[] {
  return getItem<FailureEntry[]>(STORAGE_KEYS.FAILURE_ENTRIES, []);
}

export function addFailureEntry(entry: Omit<FailureEntry, 'id'>): FailureEntry {
  const entries = getFailureEntries();
  const newEntry: FailureEntry = {
    ...entry,
    id: generateId(),
  };
  entries.push(newEntry);
  setItem(STORAGE_KEYS.FAILURE_ENTRIES, entries);
  updateStatsAfterFailure();
  return newEntry;
}

export function getFailuresByCategory(): Record<FailureEntry['category'], number> {
  const entries = getFailureEntries();
  const categories: Record<FailureEntry['category'], number> = {
    time: 0,
    motivation: 0,
    energy: 0,
    health: 0,
    schedule: 0,
    other: 0,
  };
  entries.forEach(entry => {
    categories[entry.category]++;
  });
  return categories;
}

// Stats functions
export function getUserStats(): UserStats {
  return getItem<UserStats>(STORAGE_KEYS.USER_STATS, {
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    disciplineScore: 100,
    totalMinutes: 0,
    missedWorkouts: 0,
  });
}

export function updateUserStats(updates: Partial<UserStats>): void {
  const stats = getUserStats();
  setItem(STORAGE_KEYS.USER_STATS, { ...stats, ...updates });
}

function updateStatsAfterWorkout(session: WorkoutSession): void {
  const stats = getUserStats();
  const workout = getWorkoutById(session.workoutId);
  
  stats.totalWorkouts++;
  stats.currentStreak++;
  stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  stats.totalMinutes += workout?.duration || 0;
  
  // Recalculate discipline score
  const total = stats.totalWorkouts + stats.missedWorkouts;
  stats.disciplineScore = total > 0 ? Math.round((stats.totalWorkouts / total) * 100) : 100;
  
  setItem(STORAGE_KEYS.USER_STATS, stats);
}

function updateStatsAfterFailure(): void {
  const stats = getUserStats();
  stats.missedWorkouts++;
  stats.currentStreak = 0;
  
  // Recalculate discipline score
  const total = stats.totalWorkouts + stats.missedWorkouts;
  stats.disciplineScore = total > 0 ? Math.round((stats.totalWorkouts / total) * 100) : 100;
  
  setItem(STORAGE_KEYS.USER_STATS, stats);
}

// Utility functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultWorkouts(): Workout[] {
  return [
    {
      id: 'w1',
      name: 'Morning Energy Boost',
      type: 'hiit',
      duration: 20,
      moodBased: true,
      recommendedMoods: ['energized', 'motivated'],
      exercises: [
        { id: 'e1', name: 'Jumping Jacks', duration: 45, restTime: 15 },
        { id: 'e2', name: 'High Knees', duration: 45, restTime: 15 },
        { id: 'e3', name: 'Burpees', sets: 3, reps: 10, restTime: 30 },
        { id: 'e4', name: 'Mountain Climbers', duration: 45, restTime: 15 },
        { id: 'e5', name: 'Squat Jumps', sets: 3, reps: 12, restTime: 30 },
      ],
    },
    {
      id: 'w2',
      name: 'Gentle Recovery Flow',
      type: 'recovery',
      duration: 25,
      moodBased: true,
      recommendedMoods: ['tired', 'stressed'],
      exercises: [
        { id: 'e6', name: 'Cat-Cow Stretch', duration: 60, restTime: 10 },
        { id: 'e7', name: 'Child Pose', duration: 90, restTime: 10 },
        { id: 'e8', name: 'Gentle Twist', duration: 60, restTime: 10 },
        { id: 'e9', name: 'Hip Opener', duration: 90, restTime: 10 },
        { id: 'e10', name: 'Savasana', duration: 180, restTime: 0 },
      ],
    },
    {
      id: 'w3',
      name: 'Strength Foundation',
      type: 'strength',
      duration: 35,
      moodBased: true,
      recommendedMoods: ['motivated', 'energized', 'calm'],
      exercises: [
        { id: 'e11', name: 'Push-ups', sets: 3, reps: 12, restTime: 45 },
        { id: 'e12', name: 'Bodyweight Squats', sets: 3, reps: 15, restTime: 45 },
        { id: 'e13', name: 'Plank Hold', duration: 45, restTime: 30 },
        { id: 'e14', name: 'Lunges', sets: 3, reps: 10, restTime: 45 },
        { id: 'e15', name: 'Glute Bridges', sets: 3, reps: 15, restTime: 30 },
      ],
    },
    {
      id: 'w4',
      name: 'Mindful Movement',
      type: 'flexibility',
      duration: 30,
      moodBased: true,
      recommendedMoods: ['calm', 'stressed', 'tired'],
      exercises: [
        { id: 'e16', name: 'Deep Breathing', duration: 120, restTime: 10 },
        { id: 'e17', name: 'Standing Forward Fold', duration: 60, restTime: 10 },
        { id: 'e18', name: 'Warrior Sequence', duration: 180, restTime: 20 },
        { id: 'e19', name: 'Pigeon Pose', duration: 90, restTime: 10 },
        { id: 'e20', name: 'Seated Meditation', duration: 180, restTime: 0 },
      ],
    },
    {
      id: 'w5',
      name: 'Cardio Burn',
      type: 'cardio',
      duration: 25,
      moodBased: true,
      recommendedMoods: ['energized', 'motivated'],
      exercises: [
        { id: 'e21', name: 'Warm-up Jog in Place', duration: 120, restTime: 20 },
        { id: 'e22', name: 'Speed Skaters', duration: 45, restTime: 15 },
        { id: 'e23', name: 'Box Steps', duration: 60, restTime: 20 },
        { id: 'e24', name: 'Lateral Shuffles', duration: 45, restTime: 15 },
        { id: 'e25', name: 'Cool Down Walk', duration: 120, restTime: 0 },
      ],
    },
  ];
}

// Initialize default data if needed
export function initializeStorage(): void {
  if (!getItem(STORAGE_KEYS.WORKOUTS, null)) {
    setItem(STORAGE_KEYS.WORKOUTS, getDefaultWorkouts());
  }
}

// Analytics helpers
export function getMoodAnalytics() {
  const entries = getMoodEntries();
  const sessions = getWorkoutSessions();
  
  const moodCounts: Record<MoodEntry['mood'], number> = {
    energized: 0,
    calm: 0,
    tired: 0,
    stressed: 0,
    motivated: 0,
  };
  
  const moodPerformance: Record<MoodEntry['mood'], { completed: number; total: number }> = {
    energized: { completed: 0, total: 0 },
    calm: { completed: 0, total: 0 },
    tired: { completed: 0, total: 0 },
    stressed: { completed: 0, total: 0 },
    motivated: { completed: 0, total: 0 },
  };
  
  entries.forEach(entry => {
    moodCounts[entry.mood]++;
    if (entry.workoutId) {
      const session = sessions.find(s => s.workoutId === entry.workoutId);
      moodPerformance[entry.mood].total++;
      if (session?.completed) {
        moodPerformance[entry.mood].completed++;
      }
    }
  });
  
  return { moodCounts, moodPerformance };
}

export function getWeeklyProgress() {
  const sessions = getWorkoutSessions();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const progress = weekDays.map((day, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= dayStart && sessionDate < dayEnd && s.completed;
    });
    
    return {
      day,
      completed: daySessions.length > 0,
      count: daySessions.length,
    };
  });
  
  return progress;
}
