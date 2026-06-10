"use client"

export default function Error({
	error,
	unstable_retry,
}: {
	error: Error & { digest?: string }
	unstable_retry: () => void
}) {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
			<h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
				エラーが発生しました
			</h1>
			<p className="text-sm text-zinc-500">{error.message}</p>
			<button
				type="button"
				onClick={unstable_retry}
				className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
			>
				再試行
			</button>
		</main>
	)
}
