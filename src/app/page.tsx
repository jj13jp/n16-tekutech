import type { Metadata } from "next"
import { Suspense } from "react"
import { ArticleCard } from "@/components/ArticleCard"
import { Pagination } from "@/components/Pagination"
import { getArticles } from "@/lib/microcms"

export const metadata: Metadata = {
	title: "Tech まとめブログ",
	description: "技術・IT 系の情報をキュレーションするブログです。",
}

type SearchParamsProps = {
	searchParams: Promise<{ page?: string }>
}

async function ArticleListSection({ searchParams }: SearchParamsProps) {
	const { page } = await searchParams
	const currentPage = Number(page) || 1
	const { contents: articles, totalCount } = await getArticles(currentPage)

	return (
		<>
			{articles.length === 0 ? (
				<p className="text-zinc-500">記事がまだありません。</p>
			) : (
				<div className="flex flex-col gap-6">
					{articles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			)}
			<div className="mt-10">
				<Pagination totalCount={totalCount} currentPage={currentPage} basePath="/" />
			</div>
		</>
	)
}

export default function HomePage({ searchParams }: SearchParamsProps) {
	return (
		<main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
			<h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
				最新記事
			</h1>
			<Suspense fallback={<p className="text-zinc-500">読み込み中...</p>}>
				<ArticleListSection searchParams={searchParams} />
			</Suspense>
		</main>
	)
}
