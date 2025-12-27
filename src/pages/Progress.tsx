import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { DisciplineScore } from '@/components/DisciplineScore';
import { ProgressBar } from '@/components/ProgressBar';
import { 
  getUserStats, 
  getWorkoutSessions, 
  getWeeklyProgress,
  type WorkoutSession 
} from '@/lib/storage';

export default function Progress() {
  const [stats, setStats] = useState(getUserStats());
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [weekProgress, setWeekProgress] = useState(getWeeklyProgress());

  useEffect(() => {
    setStats(getUserStats());
    setSessions(getWorkoutSessions().filter(s => s.completed).slice(-10).reverse());
    setWeekProgress(getWeeklyProgress());
  }, []);

  const weeklyGoal = 5; // Target workouts per week
  const weeklyCompleted = weekProgress.filter(d => d.completed).length;
  const weeklyProgress = (weeklyCompleted / weeklyGoal) * 100;

  // Calculate this month's stats
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthSessions = sessions.filter(s => new Date(s.startTime) >= monthStart);

  return (
    <div className="page-container">
      <PageHeader
        title="Your Progress"
        subtitle="Track your fitness journey"
      />

      {/* Discipline Score */}
      <section className="card-base mb-6 flex items-center gap-4">
        <DisciplineScore score={stats.disciplineScore} size="lg" />
        <div className="flex-1">
          <h2 className="text-sm font-body font-medium text-foreground mb-1">
            Discipline Score
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on your workout completion rate. 
            Stay consistent to improve.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <StatCard 
          value={stats.totalWorkouts} 
          label="Total Workouts" 
        />
        <StatCard 
          value={stats.currentStreak} 
          label="Current Streak" 
        />
        <StatCard 
          value={stats.longestStreak} 
          label="Longest Streak" 
        />
        <StatCard 
          value={`${stats.totalMinutes}`} 
          label="Total Minutes" 
        />
      </section>

      {/* Weekly Goal */}
      <section className="card-base mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-body font-medium text-foreground">
            Weekly Goal
          </h2>
          <span className="text-sm text-primary">
            {weeklyCompleted}/{weeklyGoal}
          </span>
        </div>
        <ProgressBar value={weeklyProgress} />
        <div className="flex justify-between mt-4">
          {weekProgress.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  day.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.day.charAt(0)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* This Month */}
      <section className="card-base mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-body font-medium text-foreground">
            This Month
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-heading text-foreground">
              {monthSessions.length}
            </p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div>
            <p className="text-xl font-heading text-foreground">
              {Math.round((monthSessions.length / (now.getDate())) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Consistency</p>
          </div>
          <div>
            <p className="text-xl font-heading text-foreground">
              {stats.missedWorkouts}
            </p>
            <p className="text-xs text-muted-foreground">Missed</p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="space-y-3">
        <Link 
          to="/mood-analytics" 
          className="card-interactive flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-olive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">
              Mood Analytics
            </p>
            <p className="text-xs text-muted-foreground">
              See how mood affects your workouts
            </p>
          </div>
        </Link>

        <Link 
          to="/failure-insights" 
          className="card-interactive flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Target className="w-5 h-5 text-olive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">
              Failure Insights
            </p>
            <p className="text-xs text-muted-foreground">
              Understand your obstacles
            </p>
          </div>
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}
