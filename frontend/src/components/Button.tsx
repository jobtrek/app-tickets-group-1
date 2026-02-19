interface ButtonProps {
  title: string;
}

export default function Button({ title }: ButtonProps) {
  return (
    <>
      <button className='w-full text-2xl p-4 text-white bg-blue-400 rounded-xl'>
        {title}
      </button>
    </>
  );
}
