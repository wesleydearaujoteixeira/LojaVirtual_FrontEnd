'use client';

import React, { useEffect, useState } from 'react';
import { Carrinho } from '../types/Types';
import Image from 'next/image';
import Header from '../components/Header';
import { FiTrash } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { apiBack, delay } from '@/lib/utils';
const api = apiBack();


const Carrinhos = () => {
  const [carrinho, setCarrinho] = useState<Carrinho[]>([]);
  
  const total = carrinho.reduce((acc, item) => acc + item.produto.price * item.quantidade, 0);

  const fetchCart = async (token: string, idUser: string) => {
    const response = await fetch(`${api}/system/carrinhoList/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setCarrinho(data);
  };

  const removerItem = async (itemId: number) => {
    const exc = confirm(" Deseja realmente deletar esse item ?");
    if (exc) {
      const idUser = localStorage.getItem("id-usuario") || '';
      const tk = localStorage.getItem("token");

      try {
        const response = await fetch(`${api}/system/${idUser}/remover-item/${itemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${tk}` }
        });
        
        
        console.log(response.status);
        toast.success("item deletado");
        delay(1200)

      } catch (error) {
        console.error("Erro na requisição de remoção:", error);
      }
    }
  };

  const zerarCarrinho = async () => {
    const idUser = localStorage.getItem("id-usuario");
    const token = localStorage.getItem("token");

    if (!idUser || !token) {
      alert("Usuário ou token não encontrado.");
      return;
    }

    try {
      const response = await fetch(`${api}/system/zerar/${idUser}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setCarrinho([]);
        console.log("Carrinho zerado com sucesso.");
        location.reload();
      } else {
        alert("Erro ao finalizar pedido.");
      }
    } catch (error) {
      console.log("Erro inesperado ao finalizar pedido.", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUser = localStorage.getItem("id-usuario");
    if (token && idUser) fetchCart(token, idUser);
  }, []);


const FazerPedido = async () => {
  
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("id-usuario");

  if (!token || !idUser) {
    console.log(" N tem token e nem usuário! ");
  }

  const itensParaApi = carrinho.map(item => ({
    produtoId: item.produto.id,
    quantidade: item.quantidade
  }));

  try {
    const res = await fetch(`${api}/pedidos/${idUser}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itensParaApi) // Enviando array como no Insomnia
    });

    if (res.ok) {
      
      toast.success("Pedido criado com sucesso");
      const data = await res.json();
      console.log("Pedido feito: ");
      console.log(data);

    } else {
      console.log("Erro ao criar pedido");
    }
  } catch (error) {
    console.error("Erro na criação do pedido:", error);
  }
};


  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col items-center px-4 py-10 min-h-screen bg-gradient-to-br from-gray-100 to-white">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🛒 Meu Carrinho</h2>

          <div className="flex flex-col gap-6">
            {carrinho.length === 0 && <div> Você não possui carrinho</div>}

            {carrinho.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row gap-6 items-center border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="min-w-[120px]">
                  <Image
                    src={item.produto.produtoFoto}
                    alt={item.produto.nome}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.produto.nome}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-3">{item.produto.descricao}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="text-sm text-gray-600"> Qtd: <strong>{item.quantidade}</strong></span>
                    <span className="text-sm text-gray-600">Preço: <strong>R$ {item.produto.price.toFixed(2)}</strong></span>
                    <span className="text-sm text-green-700 font-semibold">Subtotal: R$ {(item.produto.price * item.quantidade).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    title="Remover item"
                    onClick={() => removerItem(item.produto.id)}
                    className="p-2 rounded-full hover:bg-red-100 transition duration-300 group cursor-pointer"
                  >
                    <FiTrash className="text-red-500 group-hover:text-red-700 text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right">
            <div className="text-xl font-bold text-gray-800">Total: R$ {total.toFixed(2)}</div>

            <button
              onClick={zerarCarrinho}
              className="mt-4 bg-red-600 mr-5 hover:bg-orange-600 text-white font-medium px-6 py-3 cursor-pointer rounded-lg shadow-md transition-all duration-300 ease-in-out w-full md:w-auto"
            >
              Limpar
            </button>

            <button
              onClick={() => FazerPedido()}
              className="mt-4 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 cursor-pointer rounded-lg shadow-md transition-all duration-300 ease-in-out w-full md:w-auto"
            >
              Fazer Pedido
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Carrinhos;
