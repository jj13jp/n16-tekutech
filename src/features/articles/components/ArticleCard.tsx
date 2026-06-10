import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/features/articles/types"

type Props = {
	article: Article
}

export function ArticleCard({ article }: Props) {
	const publishedAt = article.publishedAt
		? new Date(article.publishedAt).toLocaleDateString("ja-JP")
		: null

	return (
		<article className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
			{article.coverImage && (
				<div className="relative aspect-video w-full overflow-hidden rounded-lg">
					<Image
						src={article.coverImage.url}
						alt={article.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				</div>
			)}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2 text-xs text-zinc-500">
					{publishedAt && (
						<time dateTime={article.publishedAt}>{publishedAt}</time>
					)}
					{article.category && (
						<Link
							href={`/categories/${article.category.id}`}
							className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
						>
							{article.category.name}
						</Link>
					)}
				</div>
				<h2 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
					<Link href={`/articles/${article.id}`} className="hover:underline">
						{article.title}
					</Link>
				</h2>
				{article.summary && (
					<p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
						{article.summary}
					</p>
				)}
			</div>
			{article.tags && article.tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{article.tags.map((tag) => (
						<Link
							key={tag.id}
							href={`/tags/${tag.id}`}
							className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
						>
							#{tag.name}
						</Link>
					))}
				</div>
			)}
		</article>
	)
}
