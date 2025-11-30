import React, { useState } from 'react'

interface Props { token: string }

const FileUpload: React.FC<Props> = ({ token }) => {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const data = await res.json()
    alert(data.success ? 'Nahráno!' : data.error || 'Chyba')
  }

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Nahrát</button>
    </div>
  )
}

export default FileUpload
