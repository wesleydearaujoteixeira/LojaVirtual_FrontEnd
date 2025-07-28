'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Produto, Cliente } from '../types/Types'
import Image from 'next/image'
import Link from 'next/link'
import { MoreVertical } from 'lucide-react'
import { apiBack } from '@/lib/utils'

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [user, setUser] = useState<Cliente>()
  const [showModal, setShowModal] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const api = apiBack();


  const fetchMyProdutos = async (token: string, userId: string | null) => {
    const res = await fetch(`${api}/system/meus_produtos/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setProdutos(data)
  }

  const fetchUser = async (token: string, idCliente: string) => {
    if (idCliente) {
      const response = await fetch(`${api}/produtos/encontrar/cliente/${idCliente}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.status === 404) console.log('Você não possui um perfil ainda!')
      setUser(data)
    }
  }

  useEffect(() => {
    const tk = localStorage.getItem('token')
    const userId = localStorage.getItem('id-usuario')
    if (tk && userId) {
      fetchMyProdutos(tk, userId)
      fetchUser(tk, userId)
    }
  }, [])

  const DeleteAproduct = async (id: number, idUser: number | undefined) => {
    const tk = localStorage.getItem('token')
    const res = await fetch(`${api}/system/deletandoProduto/${id}/${idUser}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tk}` },
    })

    if (res.status === 200) {
      setProdutos(produtos.filter((item) => item.id !== id))
      setShowModal(false)
    }
  }

  const openModal = (produto: Produto) => {
    setSelectedProduto(produto)
    setShowModal(true)
  }



  return (
    <>
      <Header />

      {/* Modal com os botões de ação */}
      {showModal && selectedProduto && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-10 px-2">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            ×
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800"> {selectedProduto.nome} </h2>
          <p className="text-orange-600 font-semibold text-base sm:text-lg mb-6">
            R$ {selectedProduto.price.toFixed(2)}
          </p>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link href={`/atualizarProduto/${selectedProduto.id}`} className="w-full sm:w-auto">
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer">
                Atualizar
              </button>
            </Link>

            <Link href={`category/${selectedProduto.id}`}> 
              <button
              className="w-full sm:w-auto bg-green-600 hover:bg-green-900 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Adicionar Categoria
            </button>
            </Link>
            

            <button
              onClick={() => DeleteAproduct(selectedProduto.id, user?.id)}
              className="w-full sm:w-auto bg-red-400 hover:bg-red-900 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    )}


      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 px-6 py-10 gap-10 justify-center items-start">
        <div className="w-full lg:w-[250px] flex flex-col items-center">
          <div className="rounded-full overflow-hidden border-4 border-orange-500 shadow-lg w-40 h-40 sm:w-48 sm:h-48">
            {user && (
              <Image
                src={user.fotoUrl}
                alt="Imagem de perfil"
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">{user?.nome}</h3>
        </div>

        <div className="flex-1 w-full max-w-4xl">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-orange-500 pb-2 text-center lg:text-left">
            Meus Produtos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {produtos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md border border-gray-300">
                Não há produtos seus!
              </div>
            )}

            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition hover:shadow-xl relative"
              >
                <Image
                  src={produto.produtoFoto}
                  alt={produto.nome}
                  className="w-full aspect-[4/3] object-cover"
                  height={0}
                  width={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="px-4 py-4">
                  <h2 className="text-xl font-bold text-gray-800">{produto.nome}</h2>
                  <p className="text-orange-600 font-semibold mt-2 text-lg">
                    R$ {produto.price.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => openModal(produto)}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow-sm cursor-pointer"
                  title="Ações"
                >
                  <MoreVertical className="text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default MeusProdutos
