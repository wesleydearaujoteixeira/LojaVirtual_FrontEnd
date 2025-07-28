'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Categoria, Produto } from '@/app/types/Types';
import Header from '@/app/components/Header';
import Link from 'next/link';
import { apiBack } from '@/lib/utils';

const MAX_DESCRIPTION_LENGTH = 100; // limite de caracteres antes do "ver mais"

const Page = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [descricaoExpandida, setDescricaoExpandida] = useState<{ [key: number]: boolean }>({}); // controla descrição expandida por id
  const params = useParams();
  const slug = params?.slug as string;
  const api = apiBack();
  

  const fetchCategoriesFiltered = async (token: string) => {
    try {
      const response = await fetch(`${api}/system/category/busca/${slug}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Categoria[] = await response.json();
      const produtosExtraidos = data.flatMap((cat) => cat.produtos);
      setProdutos(produtosExtraidos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && slug) {
      fetchCategoriesFiltered(token);
    }
  }, [slug]);

  const toggleDescricao = (id: number) => {
    setDescricaoExpandida((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };



  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 capitalize"> Categoria selecionada </h1>

        {produtos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtos.map((produto) => {
              const isExpanded = descricaoExpandida[produto.id];
              const mostrarVerMais = produto.descricao.length > MAX_DESCRIPTION_LENGTH;
              const descricaoExibida = isExpanded
                ? produto.descricao
                : produto.descricao.slice(0, MAX_DESCRIPTION_LENGTH) + (mostrarVerMais ? "..." : "");

              return (
                <div key={produto.id} className="border rounded-lg p-4 shadow flex flex-col">
                  <Image
                    src={produto.produtoFoto}
                    alt={produto.nome}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded"
                  />

                  <h2 className="text-lg font-semibold mt-2">{produto.nome}</h2>

                  <p className="text-sm text-gray-600 flex-grow">
                    {descricaoExibida}
                    {mostrarVerMais && (
                      <button
                        onClick={() => toggleDescricao(produto.id)}
                        className="text-blue-600 hover:underline ml-1 cursor-pointer"
                        aria-label={isExpanded ? "Ver menos descrição" : "Ver mais descrição"}
                      >
                        {isExpanded ? "ver menos" : "ver mais"}
                      </button>
                    )}
                  </p>

                  <p className="text-green-600 font-bold mt-2">R$ {produto.price.toFixed(2)}</p>
            


                <button
                    className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white uppercase cursor-pointer font-semibold py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition duration-300"
                    >
                    <Link href={`/produto/${produto.id}`}>
                        Comprar
                    </Link>
                </button>
         
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
