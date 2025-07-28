'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Input from './Input'
import { CiLogout } from 'react-icons/ci'
import Image from 'next/image'
import { TiShoppingCart } from 'react-icons/ti'
import { useRouter } from 'next/navigation'
import { Carrinho, Cliente } from '../types/Types'
import { ShoppingCart } from 'lucide-react'
import { apiBack } from '@/lib/utils'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<Cliente | null>(null)
  const navigation = useRouter();
  const api = apiBack();
  


  const [carrinho, setCarrinho] = useState<Carrinho[]>([]);


  const fetchUser = async (token: string, idCliente: string) => {

    if(idCliente){
      
      const response = await fetch(`${api}/produtos/encontrar/cliente/${idCliente}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const data = await response.json()

      if(response.status == 404){
        console.log(" Você não possui um perfil ainda! ");
      }

     
      setUser(data)


    }
  }

  const fetchCart = async (token: string,  idUser: string) => {

    if(idUser){
      
      const response = await fetch(`${api}/produtos/carrinho/${idUser}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json()
      setCarrinho(data);

      if(response.status == 404){
        console.log(" Seu carrinho esta vázio! ");
      }


    }


  }


  
  useEffect(() => {

    const token = localStorage.getItem('token')
    const idUser = localStorage.getItem('id-usuario');


    if (!token) {
      navigation.push('/login')
      return
    }

    if (idUser) {
      fetchUser(token, idUser)
      fetchCart(token, idUser)
    }
  }, [navigation])

  // Logout
  const LogOut = () => {
    const confirmation = confirm('Deseja encerrar a sessão?')

    if (confirmation) {
      localStorage.removeItem('id-usuario')
      localStorage.removeItem('token')
      localStorage.removeItem('id-cliente')
      navigation.push('/login')
    }
  }

  return (
    <header className="bg-blue-800 text-white w-full">
      <div className="px-2 sm:px-9 h-auto py-2 flex flex-wrap justify-between items-center gap-4">
        <div>
          <Link href="/">
            <Image src="/logo1.png" height={120} width={120} alt="logo" priority />
          </Link>
        </div>

           <div className="hidden md:block w-full max-w-md">
            <Input />
          </div>
            
            
            

          <div className="flex items-center gap-4 md:hidden order-2">
            <Link href="/carrinho" className="relative inline-block hover:text-orange-400 text-xl">
              <TiShoppingCart size={30} />
              {carrinho && carrinho.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </Link>

            {/* Botão hamburguer */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1 cursor-pointer">
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </button>
          </div>

        <nav className="flex items-center hidden md:flex gap-6 order-4">


             <Link
              href="/meus_pedidos"
              className="hover:text-orange-400 text-xl font-medium transition cursor-pointer"
            >
              📦 Pedidos
            </Link>
    
          <Link href={"/carrinho"} className="relative inline-block hover:text-orange-400 text-xl cursor-pointer">
            <TiShoppingCart size={30} />

          
            {carrinho && carrinho.length <= 0 ? <span> </span> : (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {carrinho.length}
                </span>
            )}
            
          </Link>
          <div className="relative group text-xl">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:text-orange-400 focus:outline-none cursor-pointer"
            >
              <Image
                src={
                  user?.fotoUrl && user.fotoUrl.trim() !== ''
                    ? user.fotoUrl
                    : '/fotoas.jpg'
                }
                width={50}
                height={50}
                alt="Foto do usuário"
                priority
                className="rounded-full object-cover"
              />
            </button>

            {menuOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white text-gray-900 rounded-xl shadow-2xl z-50 origin-top-right animate-dropdown ring-1 ring-blue-300 ring-opacity-30 overflow-hidden">
            <div className="flex flex-col py-2 text-base font-medium">
            {!user && (
              <Link
                href="/perfil"
                className="px-5 py-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200"
              >
                👤 Meu Perfil
              </Link>
            )}

                            
              <Link 
                href="/meus_produtos"
                className="flex items-center gap-2 px-5 py-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                Meus produtos
              </Link>

              

            <Link
              href="/editar"
              className="px-5 py-2 hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:text-orange-700 transition-all duration-200"
            >
              ✏️ Editar Perfil
            </Link>

            <Link
              href="/cadastrar/produto"
              className="px-5 py-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200 hover:text-purple-700 transition-all duration-200"
            >
              📦 Cadastrar Item
            </Link>

           

            <div className="border-t border-gray-200 my-2 mx-3" />

            <button
              onClick={LogOut}
              className="text-left w-full px-5 py-2 text-red-500 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-700 transition-all duration-200 flex cursor-pointer items-center gap-2"
            >
              <CiLogout size={20} />
              Sair
            </button>
          </div>
        </div>
        )}

          </div>
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 py-6 px-6 bg-orange-500 shadow-md rounded-b-2xl transition-all duration-300">
        
        <div className="bg-white rounded-md p-2 shadow-sm">
          <Input />
        </div>
         

        <Link
          href="/editar"
          className="bg-white text-orange-600 hover:bg-orange-100 text-center py-2 rounded-md shadow font-bold transition"
        >
          ✏️ Editar Perfil
        </Link>

        <Link
          href="/cadastrar/produto"
          className="bg-white text-orange-600 hover:bg-orange-100 text-center py-2 rounded-md shadow font-bold transition"
        >
          ➕ Cadastrar Item
        </Link>

        {!user && (
          <Link
            href="/perfil"
            className="bg-white text-orange-600 hover:bg-orange-100 text-center py-2 rounded-md shadow font-bold transition"
          >
            🙍 Meu Perfil
          </Link>
        )}
         <Link
            href="/meus_pedidos"
            className="bg-white text-orange-600 hover:bg-orange-100 text-center py-2 rounded-md shadow font-bold transition"
            >
            📦 Meus Pedidos
          </Link>

        <button
          onClick={LogOut}
          className="bg-red-500 text-white hover:bg-red-600 text-center py-2 rounded-md shadow font-bold transition cursor-pointer"
        >
          🚪 Sair
        </button>
          </nav>
        )}

    </header>
  )
}

export default Header
