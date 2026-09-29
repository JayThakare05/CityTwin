import { LoaderCircle, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { cityService } from '../services/cityService'

export default function SimulationModal({ close }) {
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [model, setModel] = useState('waterlogging')
  const [hours, setHours] = useState(6)
  const run = async () => {
    setState('loading'); setError('')
    try { const { data } = await cityService.runSimulation({ model, forecastHours: Number(hours) }); setResult(data); setState('done') }
    catch { setError('The prediction service is unavailable or has not returned a prediction yet.'); setState('idle') }
  }
  return <div className="fixed inset-0 z-[1000] grid place-items-center bg-[#252733]/20 p-4"><div className="w-full max-w-md rounded-[25px] bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><p className="flex items-center gap-2 text-sm font-semibold text-[#397b76]"><Sparkles size={17}/> AI SIMULATION</p><h2 className="mt-1 text-xl font-bold">Run a forecast</h2></div><button onClick={close} className="rounded-lg p-1 text-[#737783] hover:bg-[#f4f8f8]"><X/></button></div>{state === 'done' ? <div className="rounded-2xl bg-[#f2f9f8] p-5"><p className="text-sm text-[#5e6a6c]">Simulation complete</p><p className="mt-1 text-2xl font-bold text-[#bd6f68]">{result.riskLevel || result.risk_level || 'Unknown'} risk</p><p className="mt-3 text-sm text-[#5e6a6c]">{result.modelUsed || result.model_name || 'Model result received'}</p><button onClick={close} className="mt-5 w-full rounded-xl bg-[#6FC4BC] py-3 text-sm font-semibold text-white">Close</button></div> : <><label className="block text-sm font-medium">Model<select value={model} onChange={(event) => setModel(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dce9e8] bg-[#fbfefe] px-3 py-3 text-sm text-[#58616c]"><option value="waterlogging">Waterlogging prediction</option><option value="aqi">AQI prediction</option></select></label><label className="mt-4 block text-sm font-medium">Forecast<select value={hours} onChange={(event) => setHours(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dce9e8] bg-[#fbfefe] px-3 py-3 text-sm text-[#58616c]"><option value="6">6 hours</option><option value="12">12 hours</option><option value="24">24 hours</option></select></label>{error && <p className="mt-4 rounded-xl bg-[#fff1f0] p-3 text-sm text-[#a84d48]">{error}</p>}<button onClick={run} disabled={state === 'loading'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#397b76] py-3 text-sm font-semibold text-white disabled:opacity-75">{state === 'loading' && <LoaderCircle className="animate-spin" size={17}/>}RUN SIMULATION</button><p className="mt-3 text-center text-xs text-[#858c95]">Forecasts are decision support, not certainty.</p></>}</div></div>
}
