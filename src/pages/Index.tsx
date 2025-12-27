import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, initializeStorage } from '@/lib/storage';

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    initializeStorage();
    const user = getUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-5xl font-heading text-primary mb-4">fitu</h1>
            <p className="text-lg text-foreground font-heading leading-relaxed">
              Fitness that adapts to how you feel
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-primary rounded-full mt-1" />
              <div>
                <h2 className="text-base font-heading text-foreground mb-1">
                  Mood-Based Workouts
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Workouts tailored to your energy and mental state
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-olive rounded-full mt-1" />
              <div>
                <h2 className="text-base font-heading text-foreground mb-1">
                  Failure Tracking
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Understand what holds you back and overcome it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-sage rounded-full mt-1" />
              <div>
                <h2 className="text-base font-heading text-foreground mb-1">
                  Discipline Score
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track consistency and build lasting habits
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link to="/register" className="btn-primary block text-center">
              Get Started
            </Link>
            <Link to="/login" className="btn-outline block text-center">
              I have an account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Built for those who keep showing up
        </p>
      </footer>
    </div>
  );
}
