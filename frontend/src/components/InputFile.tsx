interface InputFileProps {
	id: string;
}

export default function InputFile({ id }: InputFileProps) {
	return (
		<div className="col-span-full">
			<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10">
				<div className="text-center">
					<svg
						className="mx-auto size-12 text-gray-300 dark:text-gray-600"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
							clipRule="evenodd"
						/>
					</svg>
					<div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
						<label
							htmlFor={id}
							className="relative cursor-pointer rounded-md font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
						>
							<span>Ajouter un fichier</span>
							<input
								id={id}
								name="file-upload"
								type="file"
								multiple
								className="sr-only"
								onChange={(e) =>
									Array.from(e.target.files ?? []).forEach((f) => {
										const li = document.createElement("li");
										li.textContent = f.name;
										li.className =
											"text-sm p-2 flex place-content-between border border-gray-300 shadow-sm rounded-lg";
										li.innerHTML = `<span>${f.name}</span><button type="button" onclick="this.closest('li').remove()" class="text-slate-400 hover:text-red-500">✕</button>`;

										e.target
											.closest(".col-span-full")!
											.querySelector("ul")!
											.appendChild(li);
									})
								}
							/>
						</label>
						<p className="pl-1">ou glisser et déposer</p>
					</div>
					<p className="text-xs/5 text-gray-600 dark:text-gray-400">
						PNG, JPG, GIF jusqu'à 10MB
					</p>
				</div>
			</div>
			<ul className="mt-3 space-y-2" />
		</div>
	);
}
