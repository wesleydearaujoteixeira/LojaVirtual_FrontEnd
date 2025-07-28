'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import Image from 'next/image'
import Header from '../components/Header'
import Link from 'next/link'
import { apiBack } from '@/lib/utils'

interface Produto {
  id: number
  nome: string
  price: number
  descricao: string
  produtoFoto: string
}

const MAX_DESC_LENGTH = 100

const SearchPage = () => {
  
  const searchParams = useSearchParams()
  const termo = searchParams.get('q') || ''
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [descricaoExpandida, setDescricaoExpandida] = useState<{ [key: number]: boolean }>({})
  const api = apiBack();


  useEffect(() => {
    if (!termo) return

    const fetchProdutos = async () => {
      const tk = localStorage.getItem("token")

      setLoading(true)
      try {
        const response = await fetch(`${api}/produtos/search/${termo}`, {
          headers: {
            Authorization: `Bearer ${tk}`
          }
        })

        const data = await response.json()
        setProdutos(data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [termo])

  const toggleDescricao = (id: number) => {
    setDescricaoExpandida((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Suspense fallback={<div className="p-4 text-center">Carregando busca...</div>}>
    <div>
      <Header />
      <h1 className="text-2xl font-bold text-center mt-6 mb-4">
            Resultados para: <strong>{termo}</strong>
      </h1>

      {loading && <p className="px-4">Carregando...</p>}
      {!loading && produtos.length === 0 && (
        <p className="px-4">Não há produtos com o nome <strong>{termo}</strong></p>
      )}

  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-6">
  {produtos.map((produto) => {
    const isExpanded = descricaoExpandida[produto.id]
    const mostrarVerMais = produto.descricao.length > MAX_DESC_LENGTH
    const descricaoExibida = isExpanded
      ? produto.descricao
      : produto.descricao.slice(0, MAX_DESC_LENGTH) + (mostrarVerMais ? '...' : '')

    return (
      <div key={produto.id} className="flex flex-col border rounded-xl p-4 shadow-md bg-white transition hover:shadow-green-100">
        <Image
          src={produto.produtoFoto}
          alt={produto.nome}
          width={400}
          height={400}
          className="w-full h-48 object-cover rounded-md"
          priority
          quality={100}
        />
        <h2 className="text-lg font-bold mt-3">{produto.nome}</h2>

        <p className="text-gray-600 text-sm mt-2">
          {descricaoExibida}
          {mostrarVerMais && (
            <button
              onClick={() => toggleDescricao(produto.id)}
              className="ml-1 text-blue-600 hover:underline text-sm"
            >
              {isExpanded ? 'ver menos' : 'ver mais'}
            </button>
          )}
        </p>

        <p className="text-green-600 font-semibold text-base mt-2 mb-4">
          R$ {produto.price.toFixed(2)}
        </p>

        <Link href={`/produto/${produto.id}`} className="mt-auto">
          <button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white uppercase font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
            Comprar
          </button>
        </Link>
      </div>
    )
  })}
</div>

    </div>
    </Suspense>
  )
}

export default SearchPage
