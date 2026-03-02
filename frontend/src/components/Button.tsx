import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps {
  title: string;
  type: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export default function Button({ title, type }: ButtonProps) {
  return (
    <>
      <button
        type={type}
        className='w-full text-2xl p-4 text-white bg-blue-400 rounded-xl'
      >
        {title}
      </button>
    </>
  );
}
