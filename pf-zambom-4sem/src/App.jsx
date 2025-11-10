import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FilmesApp from './Filme'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <FilmesApp></FilmesApp>
      </div>
    </>
  )
}

export default App
