import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { MoodCard } from '@/components/MoodCard';
import { addMoodEntry, setCurrentMood, type MoodEntry } from '@/lib/storage';

const moods: MoodEntry['mood'][] = ['energized', 'calm', 'tired', 'stressed', 'motivated'];

export default function Mood() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [intensity, setIntensity] = useState(3);

  const handleContinue = () => {
    if (!selectedMood) return;

    const moodEntry = addMoodEntry({
      mood: selectedMood,
      intensity,
    });

    setCurrentMood(moodEntry);
    navigate('/workout-select');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="How are you feeling?"
        subtitle="Select your current mood"
        showBack
        backPath="/dashboard"
      />

      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <MoodCard
              key={mood}
              mood={mood}
              selected={selectedMood === mood}
              onClick={() => setSelectedMood(mood)}
            />
          ))}
        </div>
      </section>

      {selectedMood && (
        <section className="mb-8 animate-fade-in">
          <h2 className="text-sm font-body font-medium text-foreground mb-4">
            How intense is this feeling?
          </h2>
          <div className="card-base">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Mild</span>
              <span className="text-xs text-muted-foreground">Intense</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`flex-1 h-10 rounded-md border transition-all ${
                    intensity === level
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-foreground hover:border-primary/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <button
          onClick={handleContinue}
          disabled={!selectedMood}
          className={`btn-primary ${!selectedMood && 'opacity-50 cursor-not-allowed'}`}
        >
          Continue to Workouts
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
