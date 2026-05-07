import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingState } from '@/components/shared/LoadingState'

const Executivo   = lazy(() => import('@/pages/Executivo'))
const Marketing   = lazy(() => import('@/pages/Marketing'))
const Produtos    = lazy(() => import('@/pages/Produtos'))
const Clientes    = lazy(() => import('@/pages/Clientes'))
const Diagnostico = lazy(() => import('@/pages/Diagnostico'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={
            <Suspense fallback={<LoadingState />}><Executivo /></Suspense>
          } />
          <Route path="/marketing" element={
            <Suspense fallback={<LoadingState />}><Marketing /></Suspense>
          } />
          <Route path="/produtos" element={
            <Suspense fallback={<LoadingState />}><Produtos /></Suspense>
          } />
          <Route path="/clientes" element={
            <Suspense fallback={<LoadingState />}><Clientes /></Suspense>
          } />
          <Route path="/diagnostico" element={
            <Suspense fallback={<LoadingState />}><Diagnostico /></Suspense>
          } />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
