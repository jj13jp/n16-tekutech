import type { MicroCMSListContent } from "microcms-js-sdk"

export type Category = MicroCMSListContent & {
	name: string
	slug: string
}
