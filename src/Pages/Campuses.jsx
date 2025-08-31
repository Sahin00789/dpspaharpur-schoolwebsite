import React from 'react'
import { Link } from 'react-router-dom'

const branches = [
  { id: 1, name: 'Paharpur', path: '/campuses/paharpur', address: 'Paharpur, Banshihari, Dakshin Dinajpur' },
  { id: 2, name: 'Mirakuri', path: '/campuses/mirakuri', address: 'Mirakuri, Banshihari, Dakshin Dinajpur' },
  { id: 3, name: 'Madrasha', path: '/campuses/madrasha', address: 'Mirakuri, Banshihari, Dakshin Dinajpur' },
  { id: 4, name: 'Amrulbari', path: '/campuses/amrulbari', address: 'Amrulbari, Tapan, Dakshin Dinajpur' },
]

export default function Campuses() {
  return (
    <section className="min-h-[70vh] pt-24 px-6 md:px-16 bg-gradient-to-br from-white to-slate-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Our Campuses</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.map(b => (
            <Link key={b.id} to={b.path} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5">
              <div className="h-28 bg-orange-50 rounded-xl mb-3" />
              <h2 className="text-xl font-semibold">{b.name}</h2>
              <p className="text-sm text-slate-600">{b.address}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
