import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk"
import type { Category } from "@/features/categories/types"
import type { Tag } from "@/features/tags/types"

export type Article = MicroCMSListContent & {
	title: string
	body: string
	coverImage?: MicroCMSImage
	category: Category
	tags: Tag[]
	summary?: string
}
