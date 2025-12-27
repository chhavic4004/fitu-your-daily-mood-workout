import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showBack, backPath, action }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="page-header">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="mt-1 p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
