import Link from "next/link"
import { PER_PAGE } from "@/shared/lib/microcms"

type Props = {
	totalCount: number
	currentPage: number
	basePath: string
}

export function Pagination({ totalCount, currentPage, basePath }: Props) {
	const totalPages = Math.ceil(totalCount / PER_PAGE)
	if (totalPages <= 1) return null

	return (
		<nav aria-label="ページネーション" className="flex justify-center gap-1">
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
				const sep = basePath.includes("?") ? "&" : "?"
				const href = page === 1 ? basePath : `${basePath}${sep}page=${page}`
				const isCurrent = page === currentPage
				return (
					<Link
						key={page}
						href={href}
						aria-current={isCurrent ? "page" : undefined}
						className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
							isCurrent
								? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
								: "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
						}`}
					>
						{page}
					</Link>
				)
			})}
		</nav>
	)
}
