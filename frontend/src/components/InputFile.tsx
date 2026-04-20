import { useEffect, useRef, useState } from "react";

interface InputFileProps {
	id: string;
}

interface SelectedFile {
	id: string;
	data: File;
	preview: string;
}

export default function InputFile({ id }: InputFileProps) {
	const [files, setFiles] = useState<SelectedFile[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			const dataTransfer = new DataTransfer();
			for (const file of files) {
				dataTransfer.items.add(file.data);
			}
			inputRef.current.files = dataTransfer.files;
		}
	}, [files]);

	const addFiles = (newFiles: File[]) => {
		setFiles((prev) => {
			for (const f of prev) {
				URL.revokeObjectURL(f.preview);
			}
			return newFiles.slice(0, 1).map((data) => ({
				id: crypto.randomUUID(),
				data,
				preview: URL.createObjectURL(data),
			}));
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		addFiles(Array.from(e.target.files ?? []));
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		addFiles(Array.from(e.dataTransfer.files));
	};

	const removeFile = (fileId: string) => {
		setFiles((prev) => {
			const fileToRemove = prev.find((f) => f.id === fileId);
			if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
			return prev.filter((f) => f.id !== fileId);
		});
	};

	return (
		<div className="col-span-full">
			<section
				aria-label="Zone de dépôt de fichiers"
				className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
			>
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
								ref={inputRef}
								id={id}
								name="image"
								type="file"
								className="sr-only"
								onChange={handleChange}
								accept="image/png, image/jpeg, image/jpg"
							/>
						</label>
						<p className="pl-1">ou glisser et déposer</p>
					</div>
					<p className="text-xs/5 text-gray-600 dark:text-gray-400">
						PNG, JPG, JPEG jusqu'à 10MB
					</p>
				</div>
			</section>
			<ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{files.map((file) => (
					<li
						key={file.id}
						className="relative group aspect-square border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm"
					>
						<img
							src={file.preview}
							alt={file.data.name}
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
							<button
								type="button"
								onClick={() => removeFile(file.id)}
								className="self-end bg-white/20 hover:bg-red-500 text-white rounded-full p-1 leading-none"
							>
								✕
							</button>
							<span className="text-[10px] text-white truncate bg-black/50 px-1 rounded">
								{file.data.name}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
