import React from 'react'

const Badge = ({variant, value}: {variant: string, value: string}) => {
  return (
    <span className={`${variant === "red" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} rounded-md font-[600] whitespace-nowrap text-[12px] py-[2px] px-[10px] hover:bg-slate-100 transition-all`}>
      {value}
    </span>
  )
}

export default Badge
