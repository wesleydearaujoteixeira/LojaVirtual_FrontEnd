'use client'

import { apiBack } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const navigate = useRouter()

  const Login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const api = apiBack();

    const response = await fetch(`${api}/produtos/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })

    if (response.status == 200) {
      const data = await response.json()
      toast.success('Sucesso ao logar!')

      localStorage.setItem('token', data.token)
      localStorage.setItem('id-usuario', data.id)

      setTimeout(() => {
          navigate.push('/')
      }, 1200);


    } else {
      toast.error('Erro! email ou senha incorretos! ' + response.status)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Entrar na conta
        </h2>

        <form className="space-y-4" onSubmit={Login}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="seuemail@email.com"
              value={email.trim()}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 pr-10"
                value={senha.trim()}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                onClick={() => setMostrarSenha((prev) => !prev)}
                tabIndex={-1}
              >
                {mostrarSenha ?   <FiEye size={20} />  : <FiEyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-700 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
