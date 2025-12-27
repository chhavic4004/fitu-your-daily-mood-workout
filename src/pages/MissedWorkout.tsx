import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader } from '@/components/PageHeader';

const missedReasons = [
  { id: 'time', label: 'Not enough time' },
  { id: 'motivation', label: 'Lack of motivation' },
  { id: 'energy', label: 'Too tired' },
  { id: 'health', label: 'Health issues' },
  { id: 'schedule', label: 'Schedule conflict' },
  { id: 'other', label: 'Other reason' },
] as const;

export default function MissedWorkout() {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedReason) return;
    navigate(`/failure-reason/${selectedReason}`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Missed a workout?"
        subtitle="It happens. Let's understand why."
        showBack
        backPath="/dashboard"
      />

      <section className="mb-8">
        <p className="text-sm text-muted-foreground mb-4">
          Select the main reason you missed your workout today:
        </p>
        <div className="space-y-3">
          {missedReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => setSelectedReason(reason.id)}
              className={`card-interactive w-full text-left ${
                selectedReason === reason.id ? 'border-primary bg-sage-light/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedReason === reason.id 
                      ? 'border-primary bg-primary' 
                      : 'border-border'
                  }`}
                >
                  {selectedReason === reason.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-foreground">{reason.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <button
          onClick={handleContinue}
          disabled={!selectedReason}
          className={`btn-primary ${!selectedReason && 'opacity-50 cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
