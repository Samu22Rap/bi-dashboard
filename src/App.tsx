import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Executivo from '@/pages/Executivo'
import Marketing from '@/pages/Marketing'
import Produtos from '@/pages/Produtos'
import Clientes from '@/pages/Clientes'
import Diagnostico from '@/pages/Diagnostico'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Executivo />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
