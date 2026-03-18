import { useState, useEffect } from 'react'
import { Dashboard } from './pages/Dashboard'
import { CaregiverDashboard } from './pages/CaregiverDashboard'
import { EmergencyButton } from './components/EmergencyButton'
import { speak } from './utils/voice'
import { User, ShieldCheck } from 'lucide-react'

function App() {
  const [view, setView] = useState<'user' | 'caregiver'>('user')

  useEffect(() => {
    speak("Welcome to GoldenYears Assistant. I am here to help you today.")
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-slate-200 p-2 flex justify-around items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]" role="navigation" aria-label="Main navigation">
        <button
          onClick={() => {
            setView('user')
            speak("Switching to your dashboard.")
          }}
          className={`focus-ring flex-1 flex flex-col items-center py-4 rounded-xl transition-all duration-200 min-h-[80px] ${
            view === 'user' ? 'bg-blue-100 text-primary-blue border-2 border-primary-blue' : 'text-slate-400 hover:bg-slate-50'
          }`}
          aria-pressed={view === 'user'}
          aria-label="Open Assistant Dashboard"
        >
          <User className="w-10 h-10" aria-hidden="true" />
          <span className="text-lg font-bold mt-2">Assistant</span>
        </button>
        <button
          onClick={() => {
            setView('caregiver')
            speak("Caregiver mode activated.")
          }}
          className={`focus-ring flex-1 flex flex-col items-center py-4 rounded-xl transition-all duration-200 min-h-[80px] ${
            view === 'caregiver' ? 'bg-slate-100 text-slate-900 border-2 border-slate-400' : 'text-slate-400 hover:bg-slate-50'
          }`}
          aria-pressed={view === 'caregiver'}
          aria-label="Open Caregiver Dashboard"
        >
          <ShieldCheck className="w-10 h-10" aria-hidden="true" />
          <span className="text-lg font-bold mt-2">Caregiver</span>
        </button>
      </nav>

      <EmergencyButton />

      <main className="pt-24 min-h-screen" role="main">
        {view === 'user' ? <Dashboard /> : <CaregiverDashboard />}
      </main>

      <footer className="h-24 bg-transparent" aria-hidden="true" />
    </div>
  )
}

export default App
