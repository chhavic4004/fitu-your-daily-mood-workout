import { cn } from '@/lib/utils';
import type { MoodEntry } from '@/lib/storage';

interface MoodCardProps {
  mood: MoodEntry['mood'];
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const moodConfig: Record<MoodEntry['mood'], { label: string; description: string }> = {
  energized: {
    label: 'Energized',
    description: 'Ready to push hard',
  },
  calm: {
    label: 'Calm',
    description: 'Focused and steady',
  },
  tired: {
    label: 'Tired',
    description: 'Low energy today',
  },
  stressed: {
    label: 'Stressed',
    description: 'Need to unwind',
  },
  motivated: {
    label: 'Motivated',
    description: 'Eager to achieve',
  },
};

export function MoodCard({ mood, selected, onClick, disabled }: MoodCardProps) {
  const config = moodConfig[mood];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'mood-card w-full',
        selected && 'selected',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="text-lg font-heading text-foreground">{config.label}</span>
      <span className="text-xs text-muted-foreground mt-1">{config.description}</span>
    </button>
  );
}

export function getMoodLabel(mood: MoodEntry['mood']): string {
  return moodConfig[mood].label;
}
