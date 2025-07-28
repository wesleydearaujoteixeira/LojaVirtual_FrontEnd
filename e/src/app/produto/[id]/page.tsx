'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Header from '../../components/Header'
import { toast, ToastContainer } from 'react-toastify';
import { apiBack } from '@/lib/utils'


interface Produto {
  id: number
  nome: string
  price: number
  descricao: string
  produtoFoto: string
}

const MAX_DESC_LENGTH = 150

const UnicoProdutoPage = () => {
  
  const [produto, setProduto] = useState<Produto>()
  const [quantidade, setQuantidade] = useState<number>(1)
  const [descricaoExpandida, setDescricaoExpandida] = useState(false)
  const [show403Modal, setShow403Modal] = useState(false)

  const api = apiBack();

  const params = useParams()
  const id = params?.id

  const fetchProduto = async () => {
    const tk = localStorage.getItem('token')

    

    try {
      const response = await fetch(`${api}/produtos/produto/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      })

      const data = await response.json()
      setProduto(data)
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduto()
    }
  }, [id])

  const aumentar = () => setQuantidade((q) => q + 1)
  const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1))

  const toggleDescricao = () => {
    setDescricaoExpandida((prev) => !prev)
  }

  const descricaoExibida = produto?.descricao
    ? descricaoExpandida || produto.descricao.length <= MAX_DESC_LENGTH
      ? produto.descricao
      : produto.descricao.slice(0, MAX_DESC_LENGTH) + '...'
    : ''





  const handleAdicionarAoCarrinho = async () => {

  const tk = localStorage.getItem('token')
  const userId = localStorage.getItem('id-usuario') 

  if (!produto || !userId) return

  try {
    const response = await fetch(`${api}/produtos/${produto.id}/${quantidade}/${userId}/adicionar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    });


    if (response.status === 403) {
      setShow403Modal(true)
      return
    }


    if (response.ok) {
        toast.success("Produto adicionado com sucesso!");


        setTimeout(() => {
          location.reload();
        }, 1500)


      await response.json();

    } else {
      const error = await response.text()
      console.error('Erro ao adicionar produto:', error)
      toast.error('Erro ao adicionar ao carrinho.')
    }
  } catch (error) {
    console.error('Erro:', error)
    toast.error('Erro de conexão.')
  }
}


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      <Header />

      {show403Modal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full relative">
      <button
        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl"
        onClick={() => setShow403Modal(false)}
      >
        ×
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center"> Atenção </h2>
      <p className="text-gray-700 text-center mb-4">
        Você não pode comprar o seu próprio produto.
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => setShow403Modal(false)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
)}


      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition hover:shadow-green-200 duration-300">
          <div className="md:w-1/2 w-full h-80 md:h-auto">
            {produto && (
              <Image
                src={produto.produtoFoto}
                alt={produto.nome}
                width={800}
                height={600}
                className="object-cover w-full h-full transition duration-300 hover:scale-105 cursor-pointer"
              />
            )}
          </div>

          <div className="md:w-1/2 w-full p-6 md:p-10 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{produto?.nome}</h1>

            <p className="text-gray-600 text-base md:text-lg mb-2 leading-relaxed">
              {descricaoExibida}
              {produto?.descricao && produto.descricao.length > MAX_DESC_LENGTH && (
                <button
                  onClick={toggleDescricao}
                  className="ml-2 text-blue-600 hover:underline text-sm cursor-pointer"
                >
                  {descricaoExpandida ? 'ver menos' : 'ver mais'}
                </button>
              )}
            </p>

            <p className="text-2xl md:text-3xl font-semibold text-green-600 mb-6">
              R$ {produto?.price.toFixed(2)}
            </p>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-base md:text-lg font-medium text-gray-700"> Quantidade: </span>
              <div className="flex items-center border border-gray-300 rounded-xl px-2 py-1">
                <button
                  onClick={diminuir}
                  className="text-xl text-gray-700 px-2 hover:text-red-500 transition cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 text-lg">{quantidade}</span>
                <button
                  onClick={aumentar}
                  className="text-xl text-gray-700 px-2 hover:text-green-500 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdicionarAoCarrinho}
              className="bg-gradient-to-r cursor-pointer from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white uppercase font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 text-center"
            >
              Adicionar {quantidade} ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnicoProdutoPage
