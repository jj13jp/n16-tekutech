import type { Metadata } from "next"
import { Suspense } from "react"
import { ArticleCard } from "@/components/ArticleCard"
import { Pagination } from "@/components/Pagination"
import { SearchForm } from "@/components/SearchForm"
import { searchArticles } from "@/lib/microcms"

export const metadata: Metadata = { title: "検索" }

type SearchParamsProps = {
	searchParams: Promise<{ q?: string; page?: string }>
}

async function SearchResultSection({ searchParams }: SearchParamsProps) {
	const { q, page } = await searchParams
	const query = q?.trim() ?? ""
	const currentPage = Number(page) || 1

	const { contents: articles, totalCount } = query
		? await searchArticles(query, currentPage)
		: { contents: [], totalCount: 0 }

	return (
		<>
			{query && (
				<p className="mb-6 text-sm text-zinc-500">
					「{query}」の検索結果: {totalCount} 件
				</p>
			)}
			{articles.length > 0 ? (
				<div className="flex flex-col gap-6">
					{articles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			) : query ? (
				<p className="text-zinc-500">該当する記事が見つかりませんでした。</p>
			) : null}
			<div className="mt-10">
				<Pagination
					totalCount={totalCount}
					currentPage={currentPage}
					basePath={`/search?q=${encodeURIComponent(query)}`}
				/>
			</div>
		</>
	)
}

export default function SearchPage({ searchParams }: SearchParamsProps) {
	return (
		<main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
				検索
			</h1>
			<Suspense fallback={<p className="text-zinc-500">読み込み中...</p>}>
				<SearchForm />
				<SearchResultSection searchParams={searchParams} />
			</Suspense>
		</main>
	)
}
