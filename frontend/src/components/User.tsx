export default function User() {
  return (
    <div className='flex gap-4 items-center'>
      <span className='w-20 h-20 rounded-full bg-black'></span>
      <div className='flex flex-col'>
        <p>John Doe</p>
        <p className='text-gray-400'>Informaticien</p>
      </div>
    </div>
  );
}
