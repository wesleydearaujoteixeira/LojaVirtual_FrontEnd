'use client';

import Header from '@/app/components/Header';
import { apiBack } from '@/lib/utils';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const categorias = [
  { nome: 'AliExpress', img: '/AliExpress.webp' },
  { nome: 'Casa', img: '/Doméstico.webp' },
  { nome: 'Automotivos', img: '/ferramentas.webp' },
  { nome: 'Eletroportáteis', img: '/eletroportateis.webp' },
  { nome: 'Brinquedos', img: '/brinquedos.webp' },
  { nome: 'Ofertas', img: '/ofertas.webp' },
  { nome: 'Ferramentas', img: '/ferramenta.webp' },
  { nome: 'Moveis', img: '/sofa.webp' }
];

const AdicionarCategoria = () => {
  
  const { id } = useParams();
  const api = apiBack();
  
  const [nome, setNome] = useState<string>(categorias[0].nome); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const tk = localStorage.getItem("token");

    await fetch(`${api}/system/category/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome })
    });

 
    toast.success("Produto cadastrado a categoria")
    
  }catch (error) {
      toast.error(" Erro ao cadastrar uma categoria." + error)
  }


  }

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Cadastrar uma Categoria
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Escolha uma Categoria</label>
              <select
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              >
                {categorias.map((categoria) => (
                  <option key={categoria.nome} value={categoria.nome}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Cadastrar Categoria
            </button>
          </form>
        </div>
      </div>
    </div>
  );

}

export default AdicionarCategoria