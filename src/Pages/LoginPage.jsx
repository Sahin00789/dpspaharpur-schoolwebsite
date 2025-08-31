import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/admin-dashboard', { replace: true })
    }catch(err){
      setError(err.message || 'Login failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[70vh] pt-24 px-6 md:px-16 bg-gradient-to-br from-white to-slate-100">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        {error && <div className='text-red-600 mb-2'>{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="border p-2 rounded w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <input className="border p-2 rounded w-full" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-60">{loading? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </section>
  )
}
