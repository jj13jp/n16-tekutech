import { cacheLife } from "next/cache"
import type { Article } from "@/features/articles/types"
import { client, PER_PAGE } from "@/shared/lib/microcms"

export async function getArticles(page = 1, queries?: Record<string, unknown>) {
	"use cache"
	cacheLife({ revalidate: 60, stale: 30 })
	return client.getList<Article>({
		endpoint: "articles",
		queries: {
			limit: PER_PAGE,
			offset: (page - 1) * PER_PAGE,
			orders: "-publishedAt",
			depth: 2,
			...queries,
		},
	})
}

export async function getArticle(contentId: string) {
	"use cache"
	cacheLife({ revalidate: 60, stale: 30 })
	return client.getListDetail<Article>({
		endpoint: "articles",
		contentId,
		queries: { depth: 2 },
	})
}

export async function getAllArticleIds() {
	"use cache"
	cacheLife({ revalidate: 60, stale: 30 })
	return client.getAllContentIds({ endpoint: "articles" })
}

export async function searchArticles(q: string, page = 1) {
	"use cache"
	cacheLife({ revalidate: 60, stale: 0 })
	return getArticles(page, { q })
}

export async function getArticlesByCategory(categoryId: string, page = 1) {
	"use cache"
	cacheLife({ revalidate: 60, stale: 30 })
	return getArticles(page, { filters: `category[equals]${categoryId}` })
}

export async function getArticlesByTag(tagId: string, page = 1) {
	"use cache"
	cacheLife({ revalidate: 60, stale: 30 })
	return getArticles(page, { filters: `tags[contains]${tagId}` })
}
