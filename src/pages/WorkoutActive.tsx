import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { 
  getWorkoutById, 
  addWorkoutSession, 
  getCurrentMood,
  type Workout, 
  type Exercise 
} from '@/lib/storage';

export default function WorkoutActive() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    if (!workoutId) {
      navigate('/workout-select');
      return;
    }

    const loadedWorkout = getWorkoutById(workoutId);
    if (!loadedWorkout) {
      navigate('/workout-select');
      return;
    }

    setWorkout(loadedWorkout);
    
    // Start session
    const moodBefore = getCurrentMood() || undefined;
    const session = addWorkoutSession({
      workoutId,
      startTime: new Date().toISOString(),
      completed: false,
      moodBefore,
      exercisesCompleted: [],
    });
    setSessionId(session.id);

    // Initialize first exercise timer
    const firstExercise = loadedWorkout.exercises[0];
    setTimeRemaining(firstExercise.duration || 30);
  }, [workoutId, navigate]);

  const currentExercise: Exercise | undefined = workout?.exercises[currentExerciseIndex];
  const progress = workout 
    ? ((currentExerciseIndex) / workout.exercises.length) * 100 
    : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = useCallback(() => {
    if (!workout || !currentExercise) return;

    if (isResting) {
      // Move to next exercise after rest
      setIsResting(false);
      const nextIndex = currentExerciseIndex + 1;
      
      if (nextIndex >= workout.exercises.length) {
        // Workout complete
        navigate(`/workout-summary/${workoutId}`);
        return;
      }

      setCurrentExerciseIndex(nextIndex);
      const nextExercise = workout.exercises[nextIndex];
      setTimeRemaining(nextExercise.duration || 30);
    } else {
      // Complete current exercise, start rest
      setCompletedExercises(prev => [...prev, currentExercise.id]);
      
      if (currentExercise.restTime > 0) {
        setIsResting(true);
        setTimeRemaining(currentExercise.restTime);
      } else {
        // No rest, move to next
        const nextIndex = currentExerciseIndex + 1;
        
        if (nextIndex >= workout.exercises.length) {
          navigate(`/workout-summary/${workoutId}`);
          return;
        }

        setCurrentExerciseIndex(nextIndex);
        const nextExercise = workout.exercises[nextIndex];
        setTimeRemaining(nextExercise.duration || 30);
      }
    }
  }, [workout, currentExercise, isResting, currentExerciseIndex, workoutId, navigate]);

  // Timer logic
  useEffect(() => {
    if (isPaused || !currentExercise) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, currentExercise, handleNext]);

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit this workout?')) {
      navigate('/dashboard');
    }
  };

  if (!workout || !currentExercise) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-muted-foreground">Loading workout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleQuit}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">
            {currentExerciseIndex + 1} / {workout.exercises.length}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {isResting ? (
          <>
            <span className="tag-olive mb-4">Rest</span>
            <h2 className="text-xl font-heading text-foreground mb-2">
              Take a breather
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Next: {workout.exercises[currentExerciseIndex + 1]?.name || 'Finish'}
            </p>
          </>
        ) : (
          <>
            <span className="tag-primary mb-4">
              {currentExercise.sets 
                ? `${currentExercise.sets} x ${currentExercise.reps}` 
                : 'Timed'}
            </span>
            <h2 className="text-2xl font-heading text-foreground mb-2">
              {currentExercise.name}
            </h2>
            {currentExercise.duration && (
              <p className="text-sm text-muted-foreground mb-8">
                Hold for {currentExercise.duration} seconds
              </p>
            )}
          </>
        )}

        {/* Timer */}
        <div className="workout-timer mb-8">
          {formatTime(timeRemaining)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform active:scale-95"
          >
            {isPaused ? (
              <Play className="w-6 h-6 ml-1" />
            ) : (
              <Pause className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center transition-transform active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exercise Queue */}
      <div className="px-4 pb-8">
        <div className="card-base">
          <p className="text-xs text-muted-foreground mb-2">Coming up</p>
          <div className="space-y-2">
            {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((exercise) => (
              <div key={exercise.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{exercise.name}</span>
                <span className="text-muted-foreground">
                  {exercise.duration ? `${exercise.duration}s` : `${exercise.sets}x${exercise.reps}`}
                </span>
              </div>
            ))}
            {currentExerciseIndex + 1 >= workout.exercises.length && (
              <p className="text-sm text-muted-foreground">Almost done!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
