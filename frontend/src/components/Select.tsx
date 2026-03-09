interface SelectProps {
  id: string;
  options: { value: string; label: string }[];
}

export default function Select({ id, options }: SelectProps) {
  return (
    <>
      <select
        name={id}
        id={id}
        className='w-full border-gray-400 border border-solid rounded-xl p-4 placeholder:text-gray-400'
      >
        {options.map((o, index) => (
          <option key={index} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </>
  );
}
