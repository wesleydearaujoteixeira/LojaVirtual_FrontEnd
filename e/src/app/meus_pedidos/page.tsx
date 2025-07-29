'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Image from 'next/image';
import { Pedido } from '../types/Types';
import { toast, ToastContainer } from 'react-toastify';
import { PiTruckBold } from 'react-icons/pi';
import 'react-toastify/dist/ReactToastify.css';
import { apiBack, delay } from '@/lib/utils';

const statusEtapas = ['Recebido', 'aguardando pagamento', 'organizando', 'Saiu para entrega', 'Entregue'];

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [total, setTotal] = useState<number | undefined>();
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [idMercadoPagoId, setMercadoPagoId] = useState<number>();
  const api = apiBack();
  

  const fetchPedidos = async (token: string, userId: string) => {
    try {
      const response = await fetch(`${api}/pedidos/cliente/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao buscar o pedido.');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };



  const statusPayment = async (idUser: string, idPedido: string) => {
  try {
    const response = await fetch(`${api}/pedidos/${idPedido}/${idUser}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "PAGAMENTO APROVADO" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na atualização de status:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Pedido atualizado com sucesso:", data);

  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};



 const [hasUpdatedStatus, setHasUpdatedStatus] = useState(false);

const fetchPayment = async (id: number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_MERCADOPAGO}${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setStatus(data.status);

    const id_pedidos = localStorage.getItem("id-pedido");

    if (data.status === "approved" && !hasUpdatedStatus) {
      setHasUpdatedStatus(true);
      await statusPayment(String(userId), String(id_pedidos));
      delay(1500);
    }

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
  }
};

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (idMercadoPagoId && status !== 'approved') {
      interval = setInterval(() => fetchPayment(idMercadoPagoId), 5000);
    }
    return () => clearInterval(interval);
  }, [idMercadoPagoId, status]);

  const criarPagamentoPix = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);

    try {
      const response = await fetch(`${api}/process_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionAmount: 0.01,
          description: 'Pagamento via Pix',
          paymentMethodId: 'pix',
          payer: {
            email: 'cliente@email.com',
            firstName: 'João',
            lastName: 'Silva',
            identification: { type: 'CPF', number: '12345678909' },
          },
        }),
      });
      const data = await response.json();
      setMercadoPagoId(data.id);
      setQrCodeBase64(data.qrCodeBase64);
    } catch (err) {
      console.error('Erro ao criar pagamento Pix:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelarPedido = async (pedidoId: number) => {
    if (!userId || !token) return;
    if (!window.confirm('Deseja realmente cancelar este pedido?')) return;

    try {
      const response = await fetch(`${api}/pedidos/${pedidoId}/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      toast.success('Pedido cancelado com sucesso!');
      
      const data = await response.json(); 
      console.log(data);

      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    } catch {
      toast.error('Erro ao cancelar pedido.');
    }
  };


  const setValueId = (idPedido: string) => {
    localStorage.setItem("id-pedido", idPedido);
  }




  useEffect(() => {
    const id = localStorage.getItem('id-usuario');
    const tk = localStorage.getItem('token');

   const idPedido = localStorage.getItem('id-pedido')


    if (id && tk && idPedido) {
      setUserId(id);
      setToken(tk);
      fetchPedidos(tk, id);
    }
  }, []);

 const getStatusIndex = (status: string) => {
  if (status.toLowerCase() === 'pagamento aprovado') {
    return statusEtapas.findIndex((etapa) => etapa.toLowerCase() === 'organizando');
  }
  return statusEtapas.findIndex((etapa) => etapa.toLowerCase() === status.toLowerCase());
};




  useEffect(() => {

    pedidos.map((item)=> {
      setTotal(item.valorTotal);
    })

  }, [pedidos])

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 text-center flex items-center justify-center gap-2">
          <PiTruckBold size={30} /> Meus Pedidos
        </h2>

        {pedidos.length === 0 ? (
          <p className="text-center text-gray-600 mt-4">Você ainda não possui pedidos.</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-xl shadow p-6 mt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-gray-800">Pedido #{pedido.id}</p>
                  <p className="text-sm text-gray-500">Status: {pedido.status}</p>
                  <p className="text-sm text-gray-500">Data: {new Date(pedido.dataCriacao).toLocaleString()}</p>
                </div>
                <div className="text-end gap-5">
                  <p className="text-lg text-green-600 font-bold">Total: R$ {pedido.valorTotal.toFixed(2)}</p>
                  <button
                    onClick={() => cancelarPedido(pedido.id)}
                    className="text-sm text-red-600 hover:underline m-5 cursor-pointer"
                  >
                    Cancelar pedido

                  </button>
                  {pedido.status.toLowerCase() === 'aguardando pagamento' && (
                    <button
                      onClick={() => {
                        setIsPixModalOpen(true);
                        setTotal(pedido.valorTotal);
                        setValueId(String(pedido.id));
                      }}
                      className="mt-2 bg-orange-400 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded shadow cursor-pointer"
                    >
                      Fazer Pagamento
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium text-sm text-gray-700 mb-2">Progresso da Entrega</p>
                <div className="flex items-center justify-between">
                  {statusEtapas.map((etapa, index) => {
                    const ativa = index <= getStatusIndex(pedido.status);
                    return (
                      <div key={index} className="flex-1 text-center relative">
                        <div className={`w-4 h-4 mx-auto rounded-full ${ativa ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                       <p className={`text-xs mt-1 ${ativa ? 'text-green-600' : 'text-gray-400'}`}>
                        {etapa}
                      </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                    <Image
                      src={item.produto.produtoFoto}
                      alt={item.produto.nome}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.produto.nome}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.produto.descricao}</p>
                      <p className="text-sm mt-1 text-gray-600">Qtd: {item.quantidade}</p>
                      <p className="text-sm font-bold text-green-700">Preço: R$ {item.produto.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

  {isPixModalOpen && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn">
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md relative transform transition-all duration-300 scale-100">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer"
        onClick={() => setIsPixModalOpen(false)}
        aria-label="Fechar modal "
      >
        &times;
      </button>

      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-5">
        Pagamento via Pix
      </h3>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">
          Gerando QR Code...
        </p>
      ) : qrCodeBase64 ? (
        <>
          <p className="text-center text-green-600 font-bold text-2xl mb-4">
            R$ {total?.toFixed(2)}
          </p>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code Pix"
              className="w-52 h-52 rounded-lg border shadow-md"
            />
          </div>
          <p className="text-center mt-4 text-sm text-gray-700 font-medium">
            Status: <span className="font-semibold text-orange">{status}</span>
          </p>
        </>
      ) : (
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          onClick={criarPagamentoPix}
        >
          Gerar QR Code
        </button>
      )}
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Pedidos;
