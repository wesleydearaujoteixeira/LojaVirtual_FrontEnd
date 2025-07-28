'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Produto } from '../types/Types'
import Spinner from './Spinner'
import Link from 'next/link'
import Carrossel from './Carrosel'
import Categorias from './Categoria'
import { apiBack } from '@/lib/utils'

const Main = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const api = apiBack();
  

  const fetchProdutos = async (token: string, idUser: string) => {
    try {
      const response = await fetch(`${api}/produtos/av1/${idUser}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id-usuario');

    if (!token || !id) {
      setLoading(false)
      return
    }
    fetchProdutos(token, id);
  }, [])

  const verMais = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + 8)
      setIsLoadingMore(false)
    }, 1000)
  }

  if (loading) return <Spinner />

  if (!localStorage.getItem('token')) {
    return (
      <div className="text-center text-red-600 mt-10">
        Token não encontrado. Por favor, faça login.
      </div>
    )
  }

  return (
    <main className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 bg-gray-50 min-h-screen">
      <div className="hidden lg:block">
        <Carrossel />
      </div>

      <div>
        <Categorias />
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-orange-500 mt-8 tracking-tight drop-shadow-sm">
        Ofertas de Produtos
      </h2>

      {produtos.length === 0 ? (
        <div className="text-center text-gray-600">Nenhum produto disponível.</div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 justify-center">
            {produtos.slice(0, visibleCount).map((produto) => (
              <div
                key={produto.id}
                className="border rounded-xl p-3 shadow-sm bg-white hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <Image
                  src={produto.produtoFoto}
                  alt={produto.nome}
                  width={400}
                  height={300}
                  className="object-cover w-full h-44 rounded-md"
                />
                <div className="mt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{produto.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{produto.descricao}</p>
                  </div>
                  <p className="text-green-700 font-bold text-lg mt-3">
                    R$ {produto.price?.toFixed(2)}
                  </p>
                </div>

                <Link href={`/produto/${produto.id}`}>
                  <button className="mt-4 w-full py-2 bg-gradient-to-r cursor-pointer from-orange-400 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    Comprar
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {visibleCount < produtos.length && (
            <div className="mt-8 flex justify-center">
              {isLoadingMore ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (

                <button
                  onClick={verMais}
                  className="px-8 py-3 bg-gradient-to-r cursor-pointer from-orange-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:from-orange-500 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                 Ver mais
              </button>

              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Main
