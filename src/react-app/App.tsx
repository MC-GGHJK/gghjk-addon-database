import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'

function App() {
  const [token, setToken] = useState('')

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'Beard', password: '1234' }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (data.token) setToken(data.token)
    else alert('Chyba přihlášení')
  }

  return (
    <div className="p-4">
      {!token ? (
        <button onClick={handleLogin}>Přihlásit se</button>
      ) : (
        <>
          <FileUpload token={token} />
          <FileList />
        </>
      )}
    </div>
  )
}

export default App
