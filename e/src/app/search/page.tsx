import { Suspense } from 'react'
import Search from './Search'

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando busca...</div>}>
      <Search/>
    </Suspense>
  )
}
