import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '@/lib/storage';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - in production, this would validate against a backend
    const user = {
      id: 'user-1',
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    setUser(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading text-primary mb-2">fitu</h1>
          <p className="text-muted-foreground">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New to fitu?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
