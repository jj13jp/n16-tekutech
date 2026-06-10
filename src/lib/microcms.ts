import { createClient } from "microcms-js-sdk"
import { cacheLife } from "next/cache"
import type { Article, Category, Tag } from "@/types/microcms"

const client = createClient({
	serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? "",
	apiKey: process.env.MICROCMS_API_KEY ?? "",
})

export const PER_PAGE = 10

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

export async function getCategories() {
	"use cache"
	cacheLife({ revalidate: 3600, stale: 1800 })
	return client.getList<Category>({
		endpoint: "categories",
		queries: { limit: 100 },
	})
}

export async function getTags() {
	"use cache"
	cacheLife({ revalidate: 3600, stale: 1800 })
	return client.getList<Tag>({
		endpoint: "tags",
		queries: { limit: 100 },
	})
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
