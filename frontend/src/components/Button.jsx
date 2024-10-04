import React from 'react'

function Button({label}) {
  return (
    <div className='flex justify-center'>
        <button
        className='text-white text-center
        bg-blue-500 px-12 py-3 ml-5  rounded-md mt-2'
        >
          {label}
        </button>
    </div>
  )
}

export default Button