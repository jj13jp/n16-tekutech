import { cacheLife } from "next/cache"
import type { Tag } from "@/features/tags/types"
import { client } from "@/shared/lib/microcms"

export async function getTags() {
	"use cache"
	cacheLife({ revalidate: 3600, stale: 1800 })
	return client.getList<Tag>({
		endpoint: "tags",
		queries: { limit: 100 },
	})
}
