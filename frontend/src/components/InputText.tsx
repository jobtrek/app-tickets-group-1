interface InputTextProps {
  placeholder: string;
  id: string;
}

export default function InputText({ id, placeholder }: InputTextProps) {
  return (
    <>
      <input
        type='text'
        id={id}
        name={id}
        placeholder={placeholder}
        className='w-full border-gray-400 border border-solid rounded-xl p-4 placeholder:text-gray-400'
      ></input>
    </>
  );
}
