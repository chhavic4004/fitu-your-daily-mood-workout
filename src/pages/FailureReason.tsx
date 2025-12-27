import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';
import { addFailureEntry, type FailureEntry } from '@/lib/storage';

const reasonTitles: Record<string, string> = {
  time: 'Time constraints',
  motivation: 'Motivation',
  energy: 'Energy levels',
  health: 'Health',
  schedule: 'Schedule',
  other: 'Other',
};

const reasonQuestions: Record<string, string> = {
  time: 'What took up your time instead?',
  motivation: 'What made it hard to get started?',
  energy: 'What drained your energy?',
  health: 'What health concern held you back?',
  schedule: 'What conflicted with your workout?',
  other: 'What happened?',
};

export default function FailureReason() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!category) return;

    addFailureEntry({
      date: new Date().toISOString(),
      reason: reasonTitles[category] || 'Unknown',
      category: category as FailureEntry['category'],
      notes: notes.trim() || undefined,
    });

    navigate('/failure-insights');
  };

  if (!category || !reasonTitles[category]) {
    navigate('/missed-workout');
    return null;
  }

  return (
    <div className="page-container">
      <PageHeader
        title={reasonTitles[category]}
        subtitle="Help us understand better"
        showBack
        backPath="/missed-workout"
      />

      <section className="mb-8">
        <label className="label-text" htmlFor="notes">
          {reasonQuestions[category]}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field min-h-[150px] resize-none"
          placeholder="Share a bit more about what happened (optional)"
        />
      </section>

      <section className="card-base mb-8">
        <p className="text-sm text-foreground mb-2">
          Why track this?
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Understanding patterns in missed workouts helps identify obstacles. 
          Over time, you will see insights about when and why workouts get skipped, 
          helping you build more sustainable habits.
        </p>
      </section>

      <div className="space-y-3">
        <button onClick={handleSubmit} className="btn-primary">
          Log This Day
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-outline"
        >
          Skip for Now
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
