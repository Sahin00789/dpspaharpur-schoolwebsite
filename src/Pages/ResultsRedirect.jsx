import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function ResultsRedirect(){
  const [status, setStatus] = useState('Loading result link...')

  useEffect(()=>{
    const go = async ()=>{
      try{
        const snap = await getDoc(doc(db, 'config', 'links'))
        const url = snap.exists() ? (snap.data().resultUrl || '') : ''
        if(url){
          setStatus('Redirecting to result portal...')
          window.location.replace(url)
        }else{
          setStatus('No result link configured. Contact school admin.')
        }
      }catch(e){
        setStatus('Failed to fetch result link.')
      }
    }
    go()
  },[])

  return <div className='pt-24 px-6'>{status}</div>
}
