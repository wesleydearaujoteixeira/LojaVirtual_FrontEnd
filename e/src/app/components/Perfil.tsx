'use client'

import React, { useState } from 'react'
import Header from '../components/Header'
import Image from 'next/image'
import { apiBack } from '@/lib/utils'
import { ToastContainer, toast } from 'react-toastify'

const Perfil = () => {

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const idUser = localStorage.getItem("id-usuario");
  const token = localStorage.getItem("token");

  if (!idUser || !token) {
    toast.error('Usuário não autenticado')
    setLoading(false)
    return;
  }

  const formData = new FormData()

  formData.append('usuarioId', idUser)
  formData.append('nome', nome)
  formData.append('cpf', cpf)
  formData.append('endereco', endereco)
  const api = apiBack();
  


  if (imagem) formData.append('imagem', imagem)

    console.log("Token é esse " + token);

  try {
    const response = await fetch(`${api}/produtos/create/cliente`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Sucesso:', data);
    location.reload();

    toast.success('Cliente cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    alert(`Erro ao cadastrar cliente. ${error}`);
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Perfil do Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block font-medium"> CPF </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium"> Endereço </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium"> Imagem </label>
            
            <div className="flex">
                
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                />
            
            {preview && (
              <div className="mt-2">
                <Image src={preview} alt="Preview" width={100} height={100} className="rounded-full" />
              </div>
            )}


            </div>
            
          
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-800 transition cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Salvar Cliente'}
          </button>
        </form>


      </div>
    </div>
  )
}

export default Perfil
