import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { WorkoutCard } from '@/components/WorkoutCard';
import { getMoodLabel } from '@/components/MoodCard';
import { getWorkouts, getCurrentMood, getWorkoutsByMood, type Workout, type MoodEntry } from '@/lib/storage';

type FilterType = 'all' | 'recommended' | Workout['type'];

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'recommended', label: 'For You' },
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'recovery', label: 'Recovery' },
];

export default function WorkoutSelect() {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<MoodEntry | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  useEffect(() => {
    const mood = getCurrentMood();
    setCurrentMood(mood);

    const allWorkouts = getWorkouts();
    setWorkouts(allWorkouts);

    if (mood) {
      const recommended = getWorkoutsByMood(mood.mood);
      setRecommendedIds(recommended.map((w) => w.id));
      setActiveFilter('recommended');
    }
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recommended') return recommendedIds.includes(workout.id);
    return workout.type === activeFilter;
  });

  const handleSelectWorkout = (workout: Workout) => {
    navigate(`/workout-active/${workout.id}`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Choose a Workout"
        subtitle={currentMood ? `Based on feeling ${getMoodLabel(currentMood.mood).toLowerCase()}` : 'Select your workout'}
        showBack
        backPath="/mood"
      />

      {/* Filters */}
      <section className="mb-6 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`tag whitespace-nowrap transition-colors ${
                activeFilter === filter.value ? 'tag-primary' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Workout List */}
      <section className="space-y-3 pb-4">
        {filteredWorkouts.length === 0 ? (
          <div className="card-base text-center py-8">
            <p className="text-muted-foreground">No workouts match this filter</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => handleSelectWorkout(workout)}
              recommended={recommendedIds.includes(workout.id)}
            />
          ))
        )}
      </section>

      <BottomNav />
    </div>
  );
}
