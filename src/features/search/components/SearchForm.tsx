"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function SearchForm() {
	const router = useRouter()
	const searchParams = useSearchParams()

	function action(formData: FormData) {
		const q = (formData.get("q") as string)?.trim()
		if (q) {
			router.push(`/search?q=${encodeURIComponent(q)}`)
		}
	}

	return (
		<form action={action} className="flex gap-2">
			<input
				type="search"
				name="q"
				defaultValue={searchParams.get("q") ?? ""}
				placeholder="キーワードで検索..."
				className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
			/>
			<button
				type="submit"
				className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
			>
				検索
			</button>
		</form>
	)
}
