import React from 'react'

function InputBox({label,what,value,onChange,type = 'text'}) {
  return (
    <div >
        <h3 className='text-white p-2 '>{label}</h3>
        <input 
        type={type}
        placeholder={what}
        value={value}
        onChange={onChange}
        className='bg-transparent mb-6 text-white p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
       ></input>
    </div>
  )
}

export default InputBox