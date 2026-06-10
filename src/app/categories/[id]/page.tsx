import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getArticlesByCategory } from "@/features/articles/api"
import { ArticleCard } from "@/features/articles/components/ArticleCard"
import { getCategories } from "@/features/categories/api"
import { Pagination } from "@/shared/components/Pagination"

type Props = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
	const { contents } = await getCategories()
	return contents.map((category) => ({ id: category.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id: slug } = await params
	const { contents } = await getCategories()
	const category = contents.find((c) => c.slug === slug)
	if (!category) return {}
	return { title: `${category.name} の記事一覧` }
}

async function CategoryArticleSection({
	categoryId,
	slug,
	searchParams,
}: {
	categoryId: string
	slug: string
	searchParams: Promise<{ page?: string }>
}) {
	const { page } = await searchParams
	const currentPage = Number(page) || 1
	const { contents: articles, totalCount } = await getArticlesByCategory(
		categoryId,
		currentPage,
	)

	return (
		<>
			{articles.length === 0 ? (
				<p className="text-zinc-500">このカテゴリの記事はまだありません。</p>
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
					basePath={`/categories/${slug}`}
				/>
			</div>
		</>
	)
}

export default async function CategoryPage({ params, searchParams }: Props) {
	const { id: slug } = await params
	const { contents: categories } = await getCategories()
	const category = categories.find((c) => c.slug === slug)
	if (!category) notFound()

	return (
		<main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
			<h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
				カテゴリ: {category.name}
			</h1>
			<Suspense fallback={<p className="text-zinc-500">読み込み中...</p>}>
				<CategoryArticleSection
					categoryId={category.id}
					slug={slug}
					searchParams={searchParams}
				/>
			</Suspense>
		</main>
	)
}
