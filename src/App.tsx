import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { CaregiverDashboard } from './pages/CaregiverDashboard'
import { EmergencyButton } from './components/EmergencyButton'
import { speak } from './utils/voice'
import { User, ShieldCheck, Volume2 } from 'lucide-react'
import { initSentry } from './monitoring/sentry'

initSentry()

function App() {
  const [view, setView] = useState<'user' | 'caregiver'>('user')
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const handleEnableVoice = () => {
    setVoiceEnabled(true)
    speak("Welcome to GoldenYears Assistant. Voice enabled. I am here to help you today.")
  }

  const handleViewChange = (newView: 'user' | 'caregiver') => {
    setView(newView);
    if (voiceEnabled) {
      const message = newView === 'user' ? "Switching to your dashboard." : "Caregiver mode activated.";
      speak(message);
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
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center z-40 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <button
          onClick={() => handleViewChange('user')}
          className={`focus-ring flex-1 flex flex-col items-center py-4 rounded-xl transition-all duration-200 min-h-[80px] ${
            view === 'user' ? 'bg-sky-50 text-cta border border-cta' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
          }`}
          aria-pressed={view === 'user'}
          aria-label="Open Assistant Dashboard"
        >
          <User className="w-9 h-9" aria-hidden="true" />
          <span className="text-base font-semibold mt-2">Assistant</span>
        </button>
        <button
          onClick={() => handleViewChange('caregiver')}
          className={`focus-ring flex-1 flex flex-col items-center py-4 rounded-xl transition-all duration-200 min-h-[80px] ${
            view === 'caregiver' ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'text-slate-400 hover:bg-slate-50 border border-transparent'
          }`}
          aria-pressed={view === 'caregiver'}
          aria-label="Open Caregiver Dashboard"
        >
          <ShieldCheck className="w-9 h-9" aria-hidden="true" />
          <span className="text-base font-semibold mt-2">Caregiver</span>
        </button>
      </nav>

      <EmergencyButton />

      <main className="pt-20 min-h-screen" role="main">
        {view === 'user' ? <Dashboard /> : <CaregiverDashboard />}
      </main>

      <footer className="h-24 bg-transparent" aria-hidden="true" />
    </div>
  )
}

export default App
