'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Image from 'next/image'
import { Cliente } from '../types/Types'
import { apiBack } from '@/lib/utils'

const EditarPerfil = () => {
  const [user, setUser] = useState<Cliente>()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const api = apiBack();
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioId = localStorage.getItem('id-usuario')

    if (token && usuarioId) {
      fetchUser(token, usuarioId)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setNome(user.nome)
      setCpf(user.cpf)
      setEndereco(user.endereco)
    }
  }, [user])

  useEffect(() => {
    if (!imagem) return

    const objectUrl = URL.createObjectURL(imagem)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [imagem])

  // 📦 Buscar dados do cliente pelo ID do usuário
  const fetchUser = async (token: string, usuarioId: string) => {
    try {
      const response = await fetch(`${api}/produtos/encontrar/cliente/${usuarioId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 404) {
        console.log('Você não possui um perfil ainda!')
        return
      }

      const data = await response.json()
      console.log('Usuário encontrado:', data)
      setUser(data)
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
    }
  }

  // 📤 Enviar dados atualizados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const idUsuario = localStorage.getItem('id-usuario')
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('usuarioId', String(idUsuario))
    formData.append('nome', nome)
    formData.append('cpf', cpf)
    formData.append('endereco', endereco)
    if (imagem) formData.append('imagem', imagem)

    try {
      const response = await fetch(`${api}/produtos/atualizar/cliente`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ${response.status}: ${errorText}`)
      }

      alert('Cliente atualizado com sucesso!')
      location.reload()
    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro ao atualizar cliente: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagem(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Editar Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block font-medium">Nome</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">CPF</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Endereço</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Imagem</label>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-800 transition cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Alterar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarPerfil
