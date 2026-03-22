import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { CaregiverDashboard } from './pages/CaregiverDashboard'
import { EmergencyButton } from './components/EmergencyButton'
import { speak } from './utils/voice'
import { User, ShieldCheck, Volume2, Bell, Plus, History } from 'lucide-react'
import { initSentry } from './monitoring/sentry'
import { RemindersDashboard } from './pages/RemindersDashboard'
import { AddMedication } from './pages/AddMedication'
import { MedicationHistory } from './pages/MedicationHistory'
import { useNotificationScheduler } from './hooks/useNotificationScheduler'

initSentry()

// View types for the app
type MainView = 'user' | 'caregiver';
type UserView = 'dashboard' | 'reminders' | 'add-medication' | 'history';

function App() {
  const [view, setView] = useState<MainView>('user')
  const [userView, setUserView] = useState<UserView>('dashboard')
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  // Initialize notification scheduler
  useNotificationScheduler();

  const handleEnableVoice = () => {
    setVoiceEnabled(true)
    speak("Welcome to GoldenYears Assistant. Voice enabled. I am here to help you today.")
  }

  const handleViewChange = (newView: MainView) => {
    setView(newView);
    setUserView('dashboard'); // Reset to dashboard when switching modes
    if (voiceEnabled) {
      const message = newView === 'user' ? "Switching to your dashboard." : "Caregiver mode activated.";
      speak(message);
    }
  }

  const handleUserViewChange = (newUserView: UserView) => {
    setUserView(newUserView);
    if (voiceEnabled) {
      const messages: Record<UserView, string> = {
        dashboard: "Opening your dashboard.",
        reminders: "Opening medication reminders.",
        'add-medication': "Opening add medication form.",
        history: "Opening medication history.",
      };
      speak(messages[newUserView]);
    }
  }

  // Render user view content
  const renderUserContent = () => {
    switch (userView) {
      case 'reminders':
        return <RemindersDashboard onNavigate={handleUserViewChange} />;
      case 'add-medication':
        return <AddMedication onNavigate={handleUserViewChange} />;
      case 'history':
        return <MedicationHistory />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleUserViewChange} />;
    }
  }

  if (!voiceEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-8">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-3xl font-semibold mb-6">GoldenYears Assistant</h1>
          <p className="text-slate-600 mb-8">Click below to enable voice assistant. Voice requires user interaction to work.</p>
          <button
            onClick={handleEnableVoice}
            className="btn-primary focus-ring w-full py-6 min-h-[70px] text-xl flex items-center justify-center gap-3"
          >
            <Volume2 className="w-7 h-7" />
            Enable Voice Assistant
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-100">
      {view === 'user' ? (
        <>
        {/* User Mode Navigation */}
        <nav 
          className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-2 flex justify-around items-center z-40 shadow-[0_1px_10px_rgba(0,0,0,0.05)]" 
          role="navigation" 
          aria-label="User navigation"
        >
          <button
            onClick={() => handleUserViewChange('dashboard')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              userView === 'dashboard' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={userView === 'dashboard'}
            aria-label="Open Dashboard"
          >
            <User className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">Dashboard</span>
          </button>
          <button
            onClick={() => handleUserViewChange('reminders')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              userView === 'reminders' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={userView === 'reminders'}
            aria-label="Open Reminders"
          >
            <Bell className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">Reminders</span>
          </button>
          <button
            onClick={() => handleUserViewChange('add-medication')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              userView === 'add-medication' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={userView === 'add-medication'}
            aria-label="Add Medication"
          >
            <Plus className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">Add Med</span>
          </button>
          <button
            onClick={() => handleUserViewChange('history')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              userView === 'history' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={userView === 'history'}
            aria-label="View History"
          >
            <History className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">History</span>
          </button>
        </nav>

        <EmergencyButton />

        <main className="pt-20 min-h-screen" role="main">
          {renderUserContent()}
        </main>

        <footer className="h-24 bg-transparent" aria-hidden="true" />
        </>
      ) : (
        <>
        {/* Caregiver Mode */}
        <nav 
          className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-2 flex justify-around items-center z-40 shadow-[0_1px_10px_rgba(0,0,0,0.05)]" 
          role="navigation" 
          aria-label="Caregiver navigation"
        >
          <button
            onClick={() => handleViewChange('user')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              (view as string) === 'user' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={(view as string) === 'user'}
            aria-label="Switch to User Mode"
          >
            <User className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">User</span>
          </button>
          <button
            onClick={() => handleViewChange('caregiver')}
            className={`focus-ring flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 min-h-[70px] ${
              (view as string) === 'caregiver' ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
            }`}
            aria-pressed={(view as string) === 'caregiver'}
            aria-label="Caregiver Dashboard"
          >
            <ShieldCheck className="w-7 h-7" aria-hidden="true" />
            <span className="text-sm font-semibold mt-1.5">Caregiver</span>
          </button>
        </nav>

        <EmergencyButton />

        <main className="pt-20 min-h-screen" role="main">
          <CaregiverDashboard />
        </main>

        <footer className="h-24 bg-transparent" aria-hidden="true" />
        </>
      )}
    </div>
  )
}

export default App
