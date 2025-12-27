import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { getMoodAnalytics, getMoodEntries, type MoodEntry } from '@/lib/storage';

const moodLabels: Record<MoodEntry['mood'], string> = {
  energized: 'Energized',
  calm: 'Calm',
  tired: 'Tired',
  stressed: 'Stressed',
  motivated: 'Motivated',
};

const moodColors: Record<MoodEntry['mood'], string> = {
  energized: 'bg-score-high',
  calm: 'bg-olive',
  tired: 'bg-sand-dark',
  stressed: 'bg-score-low',
  motivated: 'bg-primary',
};

export default function MoodAnalytics() {
  const [analytics, setAnalytics] = useState<ReturnType<typeof getMoodAnalytics> | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    const data = getMoodAnalytics();
    setAnalytics(data);

    const entries = getMoodEntries();
    setRecentMoods(entries.slice(-7).reverse());
    setTotalEntries(entries.length);
  }, []);

  if (!analytics) return null;

  const sortedMoods = Object.entries(analytics.moodCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0);

  const mostCommonMood = sortedMoods[0]?.[0] as MoodEntry['mood'] | undefined;

  // Calculate best performing mood
  let bestMood: MoodEntry['mood'] | null = null;
  let bestRate = 0;
  Object.entries(analytics.moodPerformance).forEach(([mood, data]) => {
    if (data.total > 0) {
      const rate = data.completed / data.total;
      if (rate > bestRate) {
        bestRate = rate;
        bestMood = mood as MoodEntry['mood'];
      }
    }
  });

  return (
    <div className="page-container">
      <PageHeader
        title="Mood Analytics"
        subtitle="Understand your patterns"
        showBack
        backPath="/progress"
      />

      {/* Summary */}
      {totalEntries > 0 && (
        <section className="card-base mb-6">
          <h2 className="text-sm font-body font-medium text-foreground mb-4">
            Key Insights
          </h2>
          <div className="space-y-4">
            {mostCommonMood && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most common mood</span>
                <span className="tag-primary">{moodLabels[mostCommonMood]}</span>
              </div>
            )}
            {bestMood && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best workout mood</span>
                <span className="tag-olive">{moodLabels[bestMood]}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total mood logs</span>
              <span className="text-sm font-medium text-foreground">{totalEntries}</span>
            </div>
          </div>
        </section>
      )}

      {/* Mood Distribution */}
      {sortedMoods.length > 0 && (
        <section className="card-base mb-6">
          <h2 className="text-sm font-body font-medium text-foreground mb-4">
            Mood Distribution
          </h2>
          <div className="space-y-3">
            {sortedMoods.map(([mood, count]) => {
              const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
              return (
                <div key={mood}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">
                      {moodLabels[mood as MoodEntry['mood']]}
                    </span>
                    <span className="text-muted-foreground">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`h-full rounded-full ${moodColors[mood as MoodEntry['mood']]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Workout Completion by Mood */}
      <section className="card-base mb-6">
        <h2 className="text-sm font-body font-medium text-foreground mb-4">
          Workout Completion by Mood
        </h2>
        {Object.entries(analytics.moodPerformance).some(([_, d]) => d.total > 0) ? (
          <div className="space-y-3">
            {Object.entries(analytics.moodPerformance)
              .filter(([_, data]) => data.total > 0)
              .map(([mood, data]) => {
                const rate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      {moodLabels[mood as MoodEntry['mood']]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {data.completed}/{data.total}
                      </span>
                      <span className={`text-sm font-medium ${
                        rate >= 80 ? 'text-score-high' :
                        rate >= 50 ? 'text-score-medium' : 'text-score-low'
                      }`}>
                        {Math.round(rate)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Complete some workouts to see your patterns
          </p>
        )}
      </section>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <section className="card-base mb-6">
          <h2 className="text-sm font-body font-medium text-foreground mb-4">
            Recent Mood Log
          </h2>
          <div className="space-y-2">
            {recentMoods.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${moodColors[entry.mood]}`} />
                  <span className="text-sm text-foreground">
                    {moodLabels[entry.mood]}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalEntries === 0 && (
        <section className="card-base text-center py-8">
          <p className="text-muted-foreground mb-2">No mood data yet</p>
          <p className="text-sm text-muted-foreground">
            Log your mood before workouts to see patterns
          </p>
        </section>
      )}

      <BottomNav />
    </div>
  );
}
