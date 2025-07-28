'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categorias = [
  { nome: 'aliExpress', img: '/AliExpress.webp' },
  { nome: 'casa', img: '/Doméstico.webp' },
  { nome: 'automotivos', img: '/ferramentas.webp' },
  { nome: 'Eletroportáteis', img: '/eletroportateis.webp' },
  { nome: 'brinquedos', img: '/brinquedos.webp' },
  { nome: 'ofertas', img: '/ofertas.webp' },
  { nome: 'ferramentas', img: '/ferramenta.webp' },
  { nome: 'moveis', img: '/sofa.webp' }
];

const slugify = (texto: string) =>
  texto
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-'); 

const Categorias = () => {
  const router = useRouter();

  const handleClick = (nome: string) => {
    const slug = slugify(nome);
    router.push(`/categoria/${slug}`);
  };

  return (
    <section className="bg-white shadow-md rounded-xl p-4 max-w-6xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Categorias</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6 text-center">
        {categorias.map((categoria, index) => (
          <div
            key={index}
            onClick={() => handleClick(categoria.nome)}
            className="flex flex-col items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 shadow-sm mb-2">
              <Image
                src={categoria.img}
                alt={categoria.nome}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-sm text-gray-700 font-medium text-center leading-tight">
              {categoria.nome}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categorias;
