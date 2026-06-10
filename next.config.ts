import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.microcms-assets.io",
			},
		],
	},
}

export default nextConfig
