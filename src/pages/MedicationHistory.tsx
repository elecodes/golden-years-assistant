import React, { useMemo } from 'react';
import { History, CheckCircle2, SkipForward, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

interface GroupedLog {
  date: string;
  dateLabel: string;
  logs: Array<{
    id: string;
    medicationName: string;
    dosage: string;
    status: 'Taken' | 'Missed' | 'Skipped';
    scheduledTime?: string;
    timestamp: number;
  }>;
}

const DAY_LABELS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MedicationHistory: React.FC = () => {
  const { logs, medications } = useStore();

  const groupedLogs = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const cutoffTime = sevenDaysAgo.getTime();

    // Filter logs to last 7 days
    const recentLogs = logs
      .filter(log => log.timestamp >= cutoffTime)
      .sort((a, b) => b.timestamp - a.timestamp);

    // Create a map of medication IDs to names
    const medMap = new Map(medications.map(m => [m.id, m]));

    // Group by date
    const groups: Map<string, GroupedLog> = new Map();

    recentLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      
      if (!groups.has(dateKey)) {
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
        
        let dateLabel: string;
        if (isToday) {
          dateLabel = 'Today';
        } else if (isYesterday) {
          dateLabel = 'Yesterday';
        } else {
          dateLabel = `${DAY_LABELS[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
        }

        groups.set(dateKey, {
          date: dateKey,
          dateLabel,
          logs: [],
        });
      }

      const med = medMap.get(log.medId);
      groups.get(dateKey)!.logs.push({
        id: log.id,
        medicationName: med?.name ?? 'Unknown Medication',
        dosage: med?.dosage ?? '',
        status: log.status,
        scheduledTime: log.scheduledTime,
        timestamp: log.timestamp,
      });
    });

    return Array.from(groups.values());
  }, [logs, medications]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const totalTaken = logs.filter(l => l.status === 'Taken').length;
  const totalSkipped = logs.filter(l => l.status === 'Skipped').length;
  const totalMissed = logs.filter(l => l.status === 'Missed').length;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="py-8 px-4">
        <div className="flex items-center gap-3 text-slate-800 mb-2">
          <History className="w-9 h-9" />
          <h1 className="text-3xl font-semibold tracking-tight">Medication History</h1>
        </div>
        <p className="text-lg text-slate-500">Last 7 days</p>
      </header>

      {/* Summary Stats */}
      {logs.length > 0 && (
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center py-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-slate-800">{totalTaken}</p>
              <p className="text-sm text-slate-500">Taken</p>
            </div>
            <div className="card text-center py-4">
              <SkipForward className="w-7 h-7 text-amber-500 mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-slate-800">{totalSkipped}</p>
              <p className="text-sm text-slate-500">Skipped</p>
            </div>
            <div className="card text-center py-4">
              <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-slate-800">{totalMissed}</p>
              <p className="text-sm text-slate-500">Missed</p>
            </div>
          </div>
        </div>
      )}

      {/* History Groups */}
      {groupedLogs.length === 0 ? (
        <div className="px-4">
          <div className="card text-center py-16">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-slate-400" aria-hidden="true" />
            </div>
            <h2 
              className="text-2xl font-semibold text-slate-700 mb-3"
              style={{ fontSize: '22px' }}
            >
              No history yet
            </h2>
            <p 
              className="text-lg text-slate-500 max-w-md mx-auto"
              style={{ fontSize: '18px' }}
            >
              Your medication history will appear here after you take or skip medications
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {groupedLogs.map(group => (
            <section key={group.date} aria-labelledby={`date-${group.date}`}>
              <h2 
                id={`date-${group.date}`}
                className="text-lg font-semibold text-slate-600 mb-3 pb-2 border-b border-slate-200"
                style={{ fontSize: '18px' }}
              >
                {group.dateLabel}
              </h2>
              
              <div className="space-y-3">
                {group.logs.map(log => (
                  <article
                    key={log.id}
                    className={cn(
                      "card flex items-center gap-4",
                      log.status === 'Taken' && "border-l-4 border-l-emerald-500",
                      log.status === 'Skipped' && "border-l-4 border-l-amber-400",
                      log.status === 'Missed' && "border-l-4 border-l-red-400"
                    )}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {log.status === 'Taken' && (
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                      )}
                      {log.status === 'Skipped' && (
                        <SkipForward className="w-8 h-8 text-amber-500" aria-hidden="true" />
                      )}
                      {log.status === 'Missed' && (
                        <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-lg font-semibold text-slate-800 truncate"
                        style={{ fontSize: '18px' }}
                      >
                        {log.medicationName}
                      </h3>
                      {log.dosage && (
                        <p className="text-sm text-slate-500">{log.dosage}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="text-right flex-shrink-0">
                      <p 
                        className={cn(
                          "font-medium",
                          log.status === 'Taken' && "text-emerald-600",
                          log.status === 'Skipped' && "text-amber-600",
                          log.status === 'Missed' && "text-red-600"
                        )}
                        style={{ fontSize: '16px' }}
                      >
                        {log.status}
                      </p>
                      <p className="text-sm text-slate-400">
                        {formatTime(log.timestamp)}
                        {log.scheduledTime && ` (scheduled: ${log.scheduledTime})`}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
