'use client';

import React, { useState } from 'react'
import Link from 'next/link'

const Input = () => {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-1 justify-center order-3 md:order-none">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar um produto"
        className="w-full max-w-md px-4 py-2 bg-blue-100 rounded-md text-black placeholder-gray-600 focus:outline-none"
      />

      <Link
        href={{
          pathname: '/search',
          query: { q: value }, // ?q=camiseta por exemplo
        }}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer "
      >
        Buscar
      </Link>
    </div>
  )
}

export default Input
