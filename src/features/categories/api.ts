import { cacheLife } from "next/cache"
import type { Category } from "@/features/categories/types"
import { client } from "@/shared/lib/microcms"

export async function getCategories() {
	"use cache"
	cacheLife({ revalidate: 3600, stale: 1800 })
	return client.getList<Category>({
		endpoint: "categories",
		queries: { limit: 100 },
	})
}
