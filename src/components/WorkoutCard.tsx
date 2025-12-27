import { Clock, Dumbbell, Heart, Flame, Wind, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workout } from '@/lib/storage';

interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
  recommended?: boolean;
}

const typeIcons: Record<Workout['type'], typeof Dumbbell> = {
  strength: Dumbbell,
  cardio: Flame,
  flexibility: Wind,
  hiit: Sparkles,
  recovery: Heart,
};

const typeLabels: Record<Workout['type'], string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  flexibility: 'Flexibility',
  hiit: 'HIIT',
  recovery: 'Recovery',
};

export function WorkoutCard({ workout, onClick, recommended }: WorkoutCardProps) {
  const Icon = typeIcons[workout.type];

  return (
    <button
      onClick={onClick}
      className={cn(
        'card-interactive w-full text-left',
        recommended && 'border-primary/40 bg-sage-light/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base text-foreground truncate">
              {workout.name}
            </h3>
            {recommended && (
              <span className="tag-primary text-[10px]">Recommended</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="tag">{typeLabels[workout.type]}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {workout.duration} min
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
