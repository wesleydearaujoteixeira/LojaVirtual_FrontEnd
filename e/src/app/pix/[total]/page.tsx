'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

const PixPagamento = () => {
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const searchParams = useParams();
  const totalDoValor = searchParams?.total;

    if(typeof totalDoValor as string || null){
        Number(totalDoValor);
        console.log("numero convertido")
    }

    const criarPagamentoPix = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado no localStorage");
        setLoading(false);
        return;
      }

      if (!totalDoValor || isNaN(Number(totalDoValor))) {
        console.error("Valor inválido:", totalDoValor);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/process_payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            transactionAmount: 0.01,
            description: 'Pagamento via Pix',
            paymentMethodId: 'pix',
            payer: {
              email: 'cliente@email.com',
              firstName: 'João',
              lastName: 'Silva',
              identification: {
                type: 'CPF',
                number: '12345678909'
              }
            }
          })
        });

        const data = await response.json();
        console.log("Status HTTP:", response.status);
        console.log("Resposta da API:", data);

        if (!response.ok) {
          console.error("Erro ao criar pagamento:", data);
          setLoading(false);
          return;
        }

        setQrCodeBase64(data.qrCodeBase64);
        setStatus(data.status);
      } catch (err) {
        console.error("Erro ao criar pagamento Pix:", err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Pagamento via Pix</h2>
        <button
        onClick={criarPagamentoPix}
        > pagar </button>

        {loading && <p className="text-gray-600">Gerando QR Code...</p>}

        {!loading && qrCodeBase64 && (
          <>
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code Pix"
              className="mx-auto my-4 w-[200px] h-[200px]"
            />
            <p className="text-gray-700 mb-2">Escaneie o QR Code no seu app bancário.</p>
            <p className="text-green-600 font-semibold">Status: {status}</p>
          </>
        )}

        {!loading && !qrCodeBase64 && (
          <p className="text-red-600">Erro ao gerar o QR Code.</p>
        )}
      </div>
    </div>
  );
};

export default PixPagamento;
