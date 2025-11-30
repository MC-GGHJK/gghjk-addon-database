import React, { useEffect, useState } from 'react'

const FileList: React.FC = () => {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(setFiles)
  }, [])

  return (
    <ul>
      {files.map(f => (
        <li key={f}><a href={`/r2/${f}`} target="_blank">{f}</a></li>
      ))}
    </ul>
  )
}

export default FileList
