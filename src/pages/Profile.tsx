import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, ChevronRight, TrendingUp, Target, Calendar } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { DisciplineScore } from '@/components/DisciplineScore';
import { getUser, getUserStats, clearUser, type User } from '@/lib/storage';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUserState] = useState<User | null>(null);
  const [stats, setStats] = useState(getUserStats());

  useEffect(() => {
    const loadedUser = getUser();
    if (!loadedUser) {
      navigate('/login');
      return;
    }
    setUserState(loadedUser);
    setStats(getUserStats());
  }, [navigate]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      clearUser();
      navigate('/');
    }
  };

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page-container">
      <PageHeader
        title="Profile"
        action={
          <Link to="/settings" className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Link>
        }
      />

      {/* User Info */}
      <section className="card-base mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-2xl font-heading text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-heading text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
        </div>
      </section>

      {/* Discipline Score */}
      <section className="card-base mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-body font-medium text-foreground mb-1">
              Discipline Score
            </h3>
            <p className="text-xs text-muted-foreground">
              {stats.totalWorkouts} workouts completed
            </p>
          </div>
          <DisciplineScore score={stats.disciplineScore} size="md" showLabel={false} />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-base text-center">
          <p className="text-xl font-heading text-primary">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="card-base text-center">
          <p className="text-xl font-heading text-primary">{stats.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="card-base text-center">
          <p className="text-xl font-heading text-primary">{stats.totalMinutes}</p>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
      </section>

      {/* Links */}
      <section className="space-y-2 mb-6">
        <Link to="/progress" className="card-interactive flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">Progress</p>
            <p className="text-xs text-muted-foreground">View your workout history</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        <Link to="/mood-analytics" className="card-interactive flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">Mood Analytics</p>
            <p className="text-xs text-muted-foreground">Understand your patterns</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        <Link to="/failure-insights" className="card-interactive flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-foreground">Failure Insights</p>
            <p className="text-xs text-muted-foreground">Learn from missed days</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="card-interactive w-full flex items-center gap-3 text-destructive"
      >
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="text-sm font-body font-medium">Log Out</span>
      </button>

      <BottomNav />
    </div>
  );
}
