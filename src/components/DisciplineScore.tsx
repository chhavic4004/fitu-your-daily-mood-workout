import { cn } from '@/lib/utils';

interface DisciplineScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function DisciplineScore({ score, size = 'md', showLabel = true }: DisciplineScoreProps) {
  const getScoreClass = () => {
    if (score >= 80) return 'discipline-high';
    if (score >= 50) return 'discipline-medium';
    return 'discipline-low';
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('discipline-score font-heading', getScoreClass(), sizeClasses[size])}>
        {score}
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">Discipline</span>
      )}
    </div>
  );
}
