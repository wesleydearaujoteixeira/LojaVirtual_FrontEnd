'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/app/components/Header'
import { ToastContainer, toast } from 'react-toastify'
import { apiBack } from '@/lib/utils'

const CadastrarProduto = () => {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [price, setPrice] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const api = apiBack();
  

  useEffect(() => {
    if (!imagem) return
    const objectUrl = URL.createObjectURL(imagem)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imagem])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagem(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const usuarioId = localStorage.getItem('id-usuario')
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('usuarioId', String(usuarioId))
    formData.append('nome', nome)
    formData.append('descricao', descricao)
    formData.append('price', price)
    if (imagem) formData.append('imagem', imagem)

    try {
      const response = await fetch(`${api}/produtos/cadastrar_produto`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      await response.json()

      toast.success('Produto cadastrado com successo')


      setNome('')
      setDescricao('')
      setPrice('')
      setImagem(null)
      setPreview(null)
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      toast.error('Erro ao cadastrar produto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header/>
      <ToastContainer position="top-right" autoClose={3000} />

    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Cadastrar Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label className="block text-gray-700 font-medium">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Preço (R$)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default CadastrarProduto
