import React from 'react'

function Button({label}) {
  return (
    <div>
        <button
        className='text-white 
        bg-blue-500 px-12 py-3 ml-5 rounded-md mt-5'
         >
          {label}
        </button>
    </div>
  )
}

export default Button