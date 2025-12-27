import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { DisciplineScore } from '@/components/DisciplineScore';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { 
  getUser, 
  getUserStats, 
  getWorkouts, 
  getCurrentMood,
  getWeeklyProgress,
  initializeStorage,
  type Workout,
  type MoodEntry
} from '@/lib/storage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUserState] = useState(getUser());
  const [stats, setStats] = useState(getUserStats());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentMood, setCurrentMood] = useState<MoodEntry | null>(null);
  const [weekProgress, setWeekProgress] = useState(getWeeklyProgress());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    initializeStorage();
    setStats(getUserStats());
    setWorkouts(getWorkouts().slice(0, 3));
    setCurrentMood(getCurrentMood());
    setWeekProgress(getWeeklyProgress());
  }, [user, navigate]);

  if (!user) return null;

  const handleStartWorkout = (workout: Workout) => {
    if (!currentMood) {
      navigate('/mood');
    } else {
      navigate(`/workout-active/${workout.id}`);
    }
  };

  const todayCompleted = weekProgress[new Date().getDay()]?.completed;

  return (
    <div className="page-container">
      <PageHeader
        title={`Hello, ${user.name}`}
        subtitle={todayCompleted ? "Great job today" : "Ready for your workout?"}
        action={<DisciplineScore score={stats.disciplineScore} size="sm" />}
      />

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        <StatCard value={stats.totalWorkouts} label="Workouts" />
        <StatCard value={stats.currentStreak} label="Streak" />
        <StatCard value={`${stats.totalMinutes}`} label="Minutes" />
      </section>

      {/* Week Progress */}
      <section className="card-base mb-6">
        <h2 className="text-sm font-body font-medium text-foreground mb-4">This Week</h2>
        <div className="flex justify-between">
          {weekProgress.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  day.completed
                    ? 'bg-primary text-primary-foreground'
                    : index === new Date().getDay()
                    ? 'bg-accent text-accent-foreground border border-primary/30'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.day.charAt(0)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Status */}
      {!currentMood && (
        <Link to="/mood" className="card-interactive mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-olive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">
              How are you feeling?
            </p>
            <p className="text-xs text-muted-foreground">
              Log your mood for personalized workouts
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      )}

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/mood" className="btn-primary text-center text-sm py-3">
          Start Workout
        </Link>
        <Link to="/missed-workout" className="btn-secondary text-center text-sm py-3">
          Log Missed Day
        </Link>
      </section>

      {/* Suggested Workouts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-body font-medium text-foreground">
            Suggested Workouts
          </h2>
          <Link 
            to="/workout-select" 
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => handleStartWorkout(workout)}
              recommended={currentMood && workout.recommendedMoods.includes(currentMood.mood)}
            />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
