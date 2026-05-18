import { Route, Routes } from 'react-router'
import { AboutPage } from './pages/AboutPage'
import { SimulatorPage } from './pages/SimulatorPage'

function App() {
  return (
    <main className="min-h-screen bg-[#f7f3e8] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<SimulatorPage />} />
          <Route path="about" element={<AboutPage />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
