import { Activity, Ambulance, BarChart3, BrainCircuit, Building2, LayoutDashboard, Map, Settings, ShieldAlert, Siren, Users } from 'lucide-react'

const items = [[LayoutDashboard, 'Dashboard'], [Map, 'City Map'], [Siren, 'Alerts'], [Users, 'Citizen Reports'], [BrainCircuit, 'AI Simulations'], [Ambulance, 'Ambulances'], [Building2, 'Hospitals'], [ShieldAlert, 'Pandemic Zones'], [BarChart3, 'Analytics']]
export default function Sidebar({ onSimulation }) {
  return <aside className="hidden w-[78px] shrink-0 flex-col items-center border-r border-[#d8e9e9] bg-white py-6 lg:flex xl:w-[220px] xl:items-stretch xl:px-3">
    <div className="mb-10 flex items-center justify-center gap-2 px-2 xl:justify-start"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6FC4BC] text-xl font-bold text-white">C</span><span className="hidden text-lg font-bold xl:block">CityTwin</span></div>
    <nav className="space-y-1">{items.map(([Icon, label], index) => <button key={label} onClick={label === 'AI Simulations' ? onSimulation : undefined} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${index === 0 ? 'bg-[#e7f6f4] font-semibold text-[#347b75]' : 'text-[#737783] hover:bg-[#f2f8f8] hover:text-[#347b75]'}`} title={label}><Icon size={19} strokeWidth={1.8}/><span className="hidden xl:block">{label}</span></button>)}</nav>
    <button className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#737783] hover:bg-[#f2f8f8]"><Settings size={19}/><span className="hidden xl:block">Settings</span></button>
  </aside>
}
