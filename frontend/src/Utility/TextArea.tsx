import React from 'react'
import type { Constraint } from '../types';


type InputProp = {
    id:string;
    labelText: string;
    onChange: (e:React.ChangeEvent<HTMLTextAreaElement>)=>void;
    inputValue:string;
    allConstraintsGood:boolean;
    constraints:Constraint[];

}

export default function TextArea({ id, labelText, onChange, inputValue, allConstraintsGood, constraints}:InputProp) {
  return (
    <div className="flex flex-col text-gray-300 min-w-[80%]">
        <label htmlFor={id} className="text-[12px]">
          {labelText}
        </label>
        <textarea
          className="bg-[#1a1a1a] text-sm px-2 py-1 rounded focus:outline-none focus:border focus:border-[#ab76f5]"
          id={id}
          value={inputValue}
          onChange={(e) => onChange(e)}
        />
        {!allConstraintsGood && (
          <ul className="mt-1 text-sm list-disc pl-4">
            {constraints.map((constraint) => (
              <li
                key={constraint.id}
                className={`${constraint.valid ? "text-green-300" : "text-red-400"} text-[10px]`}
              >
                {constraint.message}
              </li>
            ))}
          </ul>
        )}
        <textarea/>
      </div>
  )
}
