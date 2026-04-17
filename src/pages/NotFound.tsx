import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center">
        <h1 className="font-serif text-7xl font-bold text-brand-500">404</h1>
        <p className="mt-4 text-xl text-navy-800">Página não encontrada</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">Voltar para a home</Link>
      </div>
    </main>
  )
}
