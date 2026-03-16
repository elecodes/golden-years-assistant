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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-100">
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-2 flex justify-around items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => {
            setView('user')
            speak("Switching to your dashboard.")
          }}
          className={`flex-1 flex flex-col items-center py-4 rounded-xl transition-all ${
            view === 'user' ? 'bg-blue-50 text-blue-800' : 'text-slate-400'
          }`}
        >
          <User className="w-8 h-8" />
          <span className="text-lg font-bold">Assistant</span>
        </button>
        <button
          onClick={() => {
            setView('caregiver')
            speak("Caregiver mode activated.")
          }}
          className={`flex-1 flex flex-col items-center py-4 rounded-xl transition-all ${
            view === 'caregiver' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-8 h-8" />
          <span className="text-lg font-bold">Caregiver</span>
        </button>
      </nav>

      <EmergencyButton />

      <main className="pt-24 min-h-screen">
        {view === 'user' ? <Dashboard /> : <CaregiverDashboard />}
      </main>

      <footer className="h-24 bg-transparent" />
    </div>
  )
}

export default App
