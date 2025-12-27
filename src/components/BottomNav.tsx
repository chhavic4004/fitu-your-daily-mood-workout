import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart2, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/mood', label: 'Mood', icon: Activity },
  { path: '/progress', label: 'Progress', icon: BarChart2 },
  { path: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || 
            (path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={path}
              to={path}
              className={`nav-item flex-1 ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-body">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
