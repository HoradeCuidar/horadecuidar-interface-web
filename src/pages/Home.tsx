import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-semibold text-text">
        Hdc
      </h1>

      <Link
        to="/login"
        className="mt-4 inline-block text-brand-600 hover:text-brand-700 font-medium"
      >
        Ir para Login 
      </Link>
    </div>
  )
}
