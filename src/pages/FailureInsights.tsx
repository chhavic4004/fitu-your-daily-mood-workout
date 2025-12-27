import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { getFailuresByCategory, getFailureEntries, getUserStats, type FailureEntry } from '@/lib/storage';

const categoryLabels: Record<FailureEntry['category'], string> = {
  time: 'Time constraints',
  motivation: 'Lack of motivation',
  energy: 'Low energy',
  health: 'Health issues',
  schedule: 'Schedule conflicts',
  other: 'Other reasons',
};

const categoryTips: Record<FailureEntry['category'], string> = {
  time: 'Try scheduling shorter workouts or breaking them into smaller sessions throughout the day.',
  motivation: 'Set smaller goals, find a workout buddy, or try new workout types to reignite interest.',
  energy: 'Focus on sleep quality, nutrition, and consider lighter recovery workouts on low-energy days.',
  health: 'Listen to your body. Consult a professional if issues persist, and try gentle movement when possible.',
  schedule: 'Build workouts into your calendar as non-negotiable appointments. Morning sessions often have fewer conflicts.',
  other: 'Reflect on recurring patterns and consider adjusting your routine to address them.',
};

export default function FailureInsights() {
  const [categories, setCategories] = useState<Record<FailureEntry['category'], number>>({
    time: 0,
    motivation: 0,
    energy: 0,
    health: 0,
    schedule: 0,
    other: 0,
  });
  const [topCategory, setTopCategory] = useState<FailureEntry['category'] | null>(null);
  const [totalMissed, setTotalMissed] = useState(0);
  const [stats, setStats] = useState(getUserStats());

  useEffect(() => {
    const categoryData = getFailuresByCategory();
    setCategories(categoryData);
    setStats(getUserStats());

    const entries = getFailureEntries();
    setTotalMissed(entries.length);

    // Find top category
    let maxCount = 0;
    let top: FailureEntry['category'] | null = null;
    Object.entries(categoryData).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        top = cat as FailureEntry['category'];
      }
    });
    setTopCategory(top);
  }, []);

  const sortedCategories = Object.entries(categories)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="page-container">
      <PageHeader
        title="Logged"
        subtitle="Your missed workout has been recorded"
        showBack
        backPath="/dashboard"
      />

      {/* Current Score */}
      <section className="card-base mb-6 text-center">
        <p className="text-xs text-muted-foreground mb-2">Current Discipline Score</p>
        <p className={`text-4xl font-heading ${
          stats.disciplineScore >= 80 ? 'text-score-high' :
          stats.disciplineScore >= 50 ? 'text-score-medium' : 'text-score-low'
        }`}>
          {stats.disciplineScore}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {stats.totalWorkouts} completed / {totalMissed} missed
        </p>
      </section>

      {/* Insights */}
      {topCategory && totalMissed > 0 && (
        <section className="card-base mb-6">
          <h2 className="text-sm font-body font-medium text-foreground mb-3">
            Your Top Challenge
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <span className="tag-primary">{categoryLabels[topCategory]}</span>
            <span className="text-xs text-muted-foreground">
              {categories[topCategory]} times
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {categoryTips[topCategory]}
          </p>
        </section>
      )}

      {/* Breakdown */}
      {sortedCategories.length > 0 && (
        <section className="card-base mb-6">
          <h2 className="text-sm font-body font-medium text-foreground mb-4">
            All Reasons
          </h2>
          <div className="space-y-3">
            {sortedCategories.map(([category, count]) => {
              const percentage = totalMissed > 0 ? (count / totalMissed) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">
                      {categoryLabels[category as FailureEntry['category']]}
                    </span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-olive" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalMissed === 0 && (
        <section className="card-base mb-6 text-center py-8">
          <p className="text-muted-foreground">
            No missed workouts yet. Keep going!
          </p>
        </section>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Link to="/dashboard" className="btn-primary block text-center">
          Back to Home
        </Link>
        <Link to="/mood-analytics" className="btn-secondary block text-center">
          View Mood Analytics
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
