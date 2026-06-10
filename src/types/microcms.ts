import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk"

export type Category = MicroCMSListContent & {
	name: string
	slug: string
}

export type Tag = MicroCMSListContent & {
	name: string
	slug: string
}

export type Article = MicroCMSListContent & {
	title: string
	body: string
	coverImage?: MicroCMSImage
	category: Category
	tags: Tag[]
	summary?: string
}
