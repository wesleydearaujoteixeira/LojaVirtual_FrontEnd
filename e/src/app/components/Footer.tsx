'use client';

import Image from 'next/image';
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
         
        <div>
            <Image src="/logo1.png" height={120} width={120} alt="logo" priority />
        </div>

          <p className="text-sm text-gray-400">
            Qualidade, confiança e tecnologia ao seu alcance.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Início</a></li>
            <li><a href="#" className="hover:underline">Produtos</a></li>
            <li><a href="#" className="hover:underline">Contato</a></li>
            <li><a href="#" className="hover:underline">Sobre Nós</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Suporte</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Central de Ajuda</a></li>
            <li><a href="#" className="hover:underline">Termos de Serviço</a></li>
            <li><a href="#" className="hover:underline">Política de Privacidade</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Nos siga</h2>
          <div className="flex space-x-4">
            <a href="#"><FaFacebook className="hover:text-blue-500" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="#"><FaTwitter className="hover:text-sky-400" /></a>
            <a href="#"><FaGithub className="hover:text-gray-400" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} site_beta Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
