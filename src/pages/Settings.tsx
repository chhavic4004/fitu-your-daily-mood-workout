import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { getUser, setUser, type User } from '@/lib/storage';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUserState] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadedUser = getUser();
    if (!loadedUser) {
      navigate('/login');
      return;
    }
    setUserState(loadedUser);
    setName(loadedUser.name);
    setEmail(loadedUser.email);
  }, [navigate]);

  const handleSave = () => {
    if (!user || !name.trim() || !email.trim()) return;

    const updatedUser: User = {
      ...user,
      name: name.trim(),
      email: email.trim(),
    };

    setUser(updatedUser);
    setUserState(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (confirm('This will clear all your workout history, mood logs, and progress. This cannot be undone. Are you sure?')) {
      localStorage.clear();
      if (user) {
        setUser(user);
      }
      alert('Data cleared successfully');
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        showBack
        backPath="/profile"
      />

      {/* Profile Settings */}
      <section className="card-base mb-6">
        <h2 className="text-sm font-body font-medium text-foreground mb-4">
          Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="label-text">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="email" className="label-text">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <button 
            onClick={handleSave}
            className="btn-primary"
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </section>

      {/* App Settings */}
      <section className="card-base mb-6">
        <h2 className="text-sm font-body font-medium text-foreground mb-4">
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Weekly Goal</p>
              <p className="text-xs text-muted-foreground">Target workouts per week</p>
            </div>
            <span className="text-sm font-medium text-primary">5 days</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Workout reminders</p>
            </div>
            <span className="text-sm text-muted-foreground">Coming soon</span>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card-base border-destructive/30">
        <h2 className="text-sm font-body font-medium text-destructive mb-4">
          Data
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-foreground mb-1">Clear All Data</p>
            <p className="text-xs text-muted-foreground mb-3">
              Remove all workout history, mood logs, and progress data
            </p>
            <button 
              onClick={handleClearData}
              className="btn-outline border-destructive text-destructive hover:bg-destructive/10"
            >
              Clear Data
            </button>
          </div>
        </div>
      </section>

      {/* Version */}
      <div className="text-center mt-8 mb-4">
        <p className="text-xs text-muted-foreground">fitu v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
