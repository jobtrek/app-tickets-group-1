interface TextAreaProps {
  placeholder: string;
  id: string;
}

export default function TextArea({ placeholder, id }: TextAreaProps) {
  return (
    <>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        rows={8}
        className='w-full border-gray-400 border border-solid rounded-xl p-4 placeholder:text-gray-400 resize-none'
      ></textarea>
    </>
  );
}
