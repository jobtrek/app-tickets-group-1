export function NavbarButton( { text }: {text: string}) {
  return (
    <div> 
      <button className="px-5 py-2.5 font-medium text-white bg-zinc-900 rounded-lg border border-zinc-700 w-[10em]">
      {text}
      </button>
    </div>
  );
}