import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllArticleIds, getArticle } from "@/features/articles/api"
import { sanitizeContent } from "@/shared/lib/sanitize"

type Props = {
	params: Promise<{ id: string }>
}

export async function generateStaticParams() {
	const ids = await getAllArticleIds()
	return ids.map((id) => ({ id: id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	const article = await getArticle(id).catch(() => null)
	if (!article) return {}
	return {
		title: article.title,
		description: article.summary ?? undefined,
		openGraph: {
			title: article.title,
			description: article.summary ?? undefined,
			images: article.coverImage ? [{ url: article.coverImage.url }] : [],
		},
	}
}

export default async function ArticlePage({ params }: Props) {
	const { id } = await params
	const article = await getArticle(id).catch(() => null)
	if (!article) notFound()

	const publishedAt = article.publishedAt
		? new Date(article.publishedAt).toLocaleDateString("ja-JP")
		: null

	return (
		<main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
			<article>
				<header className="mb-8 flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
						{publishedAt && (
							<time dateTime={article.publishedAt}>{publishedAt}</time>
						)}
						{article.category && (
							<Link
								href={`/categories/${article.category.id}`}
								className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
							>
								{article.category.name}
							</Link>
						)}
					</div>
					<h1 className="text-2xl font-bold leading-snug text-zinc-900 dark:text-zinc-50">
						{article.title}
					</h1>
					{article.tags && article.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{article.tags.map((tag) => (
								<Link
									key={tag.id}
									href={`/tags/${tag.id}`}
									className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"
								>
									#{tag.name}
								</Link>
							))}
						</div>
					)}
					{article.coverImage && (
						<div className="relative aspect-video w-full overflow-hidden rounded-xl">
							<Image
								src={article.coverImage.url}
								alt={article.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}
				</header>
				<div
					className="prose prose-zinc dark:prose-invert max-w-none"
					dangerouslySetInnerHTML={{ __html: sanitizeContent(article.body) }}
				/>
			</article>
			<div className="mt-12">
				<Link
					href="/"
					className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
				>
					← 記事一覧に戻る
				</Link>
			</div>
		</main>
	)
}
