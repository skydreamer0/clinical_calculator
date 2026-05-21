import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FIB4Calculator from './FIB4Calculator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FIB4Calculator />
  </StrictMode>,
)
