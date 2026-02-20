import { X } from 'lucide-react';
import React from 'react'

type LabelProps = {
    content:string;
    id:number;
    onDelete: (id: number) => void;
}

export default function Label({content, id, onDelete}:LabelProps) {
  return (
    <div className='relative bg-[#ab76f5] text-sm  p-1 rounded-md cursor-pointer mt-1'>
      {content}
      <X className='absolute -top-1.25 -right-1.25 w-3 h-3 bg-red-400 rounded-2xl flex justify-center items-center'
      onClick={()=>onDelete(id)}/>
    </div>
  )
}
