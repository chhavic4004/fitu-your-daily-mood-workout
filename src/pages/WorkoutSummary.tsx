import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Clock, Flame, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { DisciplineScore } from '@/components/DisciplineScore';
import { 
  getWorkoutById, 
  updateWorkoutSession, 
  getWorkoutSessions,
  getUserStats,
  type Workout 
} from '@/lib/storage';

export default function WorkoutSummary() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [stats, setStats] = useState(getUserStats());

  useEffect(() => {
    if (!workoutId) {
      navigate('/dashboard');
      return;
    }

    const loadedWorkout = getWorkoutById(workoutId);
    if (!loadedWorkout) {
      navigate('/dashboard');
      return;
    }

    setWorkout(loadedWorkout);

    // Complete the current session
    const sessions = getWorkoutSessions();
    const currentSession = sessions.find(s => s.workoutId === workoutId && !s.completed);
    if (currentSession) {
      updateWorkoutSession(currentSession.id, {
        completed: true,
        endTime: new Date().toISOString(),
        exercisesCompleted: loadedWorkout.exercises.map(e => e.id),
      });
    }

    // Refresh stats after completing workout
    setStats(getUserStats());
  }, [workoutId, navigate]);

  if (!workout) {
    return null;
  }

  return (
    <div className="page-container">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
          <Check className="w-10 h-10 text-primary" strokeWidth={2.5} />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading text-foreground mb-2">
          Workout Complete
        </h1>
        <p className="text-muted-foreground">
          Great job finishing {workout.name}
        </p>
      </div>

      {/* Session Stats */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="stat-card">
          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="stat-value text-xl">{workout.duration}</div>
          <div className="stat-label">Minutes</div>
        </div>
        <div className="stat-card">
          <Flame className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="stat-value text-xl">{workout.exercises.length}</div>
          <div className="stat-label">Exercises</div>
        </div>
        <div className="stat-card">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="stat-value text-xl">{stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </section>

      {/* Discipline Score */}
      <section className="card-base mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-body font-medium text-foreground mb-1">
            Discipline Score
          </h2>
          <p className="text-xs text-muted-foreground">
            Keep it up to maintain your score
          </p>
        </div>
        <DisciplineScore score={stats.disciplineScore} size="md" showLabel={false} />
      </section>

      {/* Exercises Completed */}
      <section className="card-base mb-8">
        <h2 className="text-sm font-body font-medium text-foreground mb-4">
          Exercises Completed
        </h2>
        <div className="space-y-0">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="exercise-item">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{exercise.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {exercise.duration 
                  ? `${exercise.duration}s` 
                  : `${exercise.sets}x${exercise.reps}`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3">
        <Link to="/dashboard" className="btn-primary block text-center">
          Back to Home
        </Link>
        <Link to="/progress" className="btn-secondary block text-center">
          View Progress
        </Link>
      </div>
    </div>
  );
}
