import React from 'react'

const Spinner = () => {
  return (
        <div className="flex justify-center items-center h-64">
        <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25 stroke-blue-300"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
            stroke="currentColor"
            ></circle>
            <path
            className="opacity-75 stroke-blue-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
        </div>
  )
}

export default Spinner
