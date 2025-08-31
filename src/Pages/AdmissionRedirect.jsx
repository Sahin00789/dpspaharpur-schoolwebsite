import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdmissionRedirect(){
  const [status, setStatus] = useState('Loading admission link...')

  useEffect(()=>{
    const go = async ()=>{
      try{
        const snap = await getDoc(doc(db, 'config', 'links'))
        const url = snap.exists() ? (snap.data().admissionUrl || '') : ''
        if(url){
          setStatus('Redirecting to admission portal...')
          window.location.replace(url)
        }else{
          setStatus('No admission link configured. Contact school admin.')
        }
      }catch(e){
        setStatus('Failed to fetch admission link.')
      }
    }
    go()
  },[])

  return <div className='pt-24 px-6'>{status}</div>
}
