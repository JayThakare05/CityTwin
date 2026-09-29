import { ArrowRight, LockKeyhole, MapPinned, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cityService } from '../services/cityService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const { data } = await cityService.login(form.get('email'), form.get('password'))
      sessionStorage.setItem('citytwin_token', data.access_token)
      sessionStorage.setItem('citytwin_admin', JSON.stringify(data.admin))
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="relative min-h-screen overflow-hidden bg-[#eaf7f8] p-5 text-[#252733] sm:p-10"><div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#c8bde8]/35 blur-3xl"/><div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-[#8fd3cb]/40 blur-3xl"/><div className="relative mx-auto grid min-h-[calc(100vh-40px)] max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-white/55 shadow-[0_20px_60px_rgba(61,112,116,.12)] lg:grid-cols-2"><section className="hidden flex-col justify-between bg-[#6fc4bc]/20 p-12 lg:flex"><div className="flex items-center gap-3 font-bold"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6fc4bc] text-xl text-white">C</span>CityTwin</div><div><div className="relative mb-8 grid h-64 place-items-center overflow-hidden rounded-[30px] border border-white/70 bg-white/40"><div className="absolute h-44 w-72 rounded-[50%] border-[14px] border-[#8fd3cb]/55"/><div className="absolute h-24 w-48 rounded-[50%] border-[12px] border-[#c8bde8]/55"/><MapPinned className="relative text-[#397b76]" size={52} strokeWidth={1.3}/><span className="absolute bottom-7 rounded-full bg-white px-4 py-2 text-xs font-medium text-[#397b76]">Connected city intelligence</span></div><p className="max-w-sm text-3xl font-semibold leading-tight">A calmer, clearer way to run your city.</p></div><p className="text-sm text-[#5d7778]">Environmental signals · Emergency readiness · AI-assisted foresight</p></section><section className="flex items-center justify-center p-7 sm:p-12"><form onSubmit={submit} className="w-full max-w-sm"><div className="mb-12 lg:hidden"><div className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#6fc4bc] text-white">C</span>CityTwin</div></div><div className="mb-8"><p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[.18em] text-[#397b76]"><ShieldCheck size={15}/> SECURE ADMIN ACCESS</p><h1 className="text-3xl font-bold tracking-tight">Central Command Center</h1><p className="mt-3 text-sm leading-6 text-[#737783]">Sign in to view your city’s real-time operational picture.</p></div><label className="mb-4 block text-sm font-medium">Admin email<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-[#8aa0a0]" size={18}/><input name="email" required type="email" placeholder="admin@citytwin.io" className="w-full rounded-xl border border-[#dce9e8] bg-white px-10 py-3 outline-none transition placeholder:text-[#a4abad] focus:border-[#6fc4bc] focus:ring-4 focus:ring-[#8fd3cb]/20"/></div></label><label className="block text-sm font-medium">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-[#8aa0a0]" size={18}/><input name="password" required type="password" placeholder="••••••••" className="w-full rounded-xl border border-[#dce9e8] bg-white px-10 py-3 outline-none transition placeholder:text-[#a4abad] focus:border-[#6fc4bc] focus:ring-4 focus:ring-[#8fd3cb]/20"/></div></label>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fff1f0] px-3 py-2 text-sm text-[#a84d48]">{error}</p>}<button disabled={loading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#397b76] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6fc4bc]/25 transition hover:bg-[#326b67] disabled:opacity-75">{loading ? 'Signing in…' : <>Login <ArrowRight size={17}/></>}</button><p className="mt-5 text-center text-xs text-[#858c95]">Access is pre-provisioned by a CityTwin super administrator.</p></form></section></div></main>
}
