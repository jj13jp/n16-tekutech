import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getArticlesByTag } from "@/features/articles/api"
import { ArticleCard } from "@/features/articles/components/ArticleCard"
import { getTags } from "@/features/tags/api"
import { Pagination } from "@/shared/components/Pagination"

type Props = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
	const { contents } = await getTags()
	return contents.map((tag) => ({ id: tag.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	const { contents } = await getTags()
	const tag = contents.find((t) => t.id === id)
	if (!tag) return {}
	return { title: `#${tag.name} の記事一覧` }
}

async function TagArticleSection({
	id,
	searchParams,
}: {
	id: string
	searchParams: Promise<{ page?: string }>
}) {
	const { page } = await searchParams
	const currentPage = Number(page) || 1
	const { contents: articles, totalCount } = await getArticlesByTag(
		id,
		currentPage,
	)

	return (
		<>
			{articles.length === 0 ? (
				<p className="text-zinc-500">このタグの記事はまだありません。</p>
			) : (
				<div className="flex flex-col gap-6">
					{articles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			)}
			<div className="mt-10">
				<Pagination
					totalCount={totalCount}
					currentPage={currentPage}
					basePath={`/tags/${id}`}
				/>
			</div>
		</>
	)
}

export default async function TagPage({ params, searchParams }: Props) {
	const { id } = await params
	const { contents: tags } = await getTags()
	const tag = tags.find((t) => t.id === id)
	if (!tag) notFound()

	return (
		<main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
			<h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
				#{tag.name}
			</h1>
			<Suspense fallback={<p className="text-zinc-500">読み込み中...</p>}>
				<TagArticleSection id={id} searchParams={searchParams} />
			</Suspense>
		</main>
	)
}
