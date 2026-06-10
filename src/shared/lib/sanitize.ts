import sanitizeHtml from "sanitize-html"

const ALLOWED_TAGS = [
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"p",
	"br",
	"hr",
	"ul",
	"ol",
	"li",
	"strong",
	"em",
	"s",
	"u",
	"code",
	"pre",
	"blockquote",
	"a",
	"img",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td",
	"div",
	"span",
]

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
	a: ["href", "target", "rel"],
	img: ["src", "alt", "width", "height"],
	"*": ["class"],
}

export function sanitizeContent(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTRIBUTES,
		allowedSchemes: ["https", "http"],
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					rel: "noopener noreferrer",
					...(attribs.href?.startsWith("http") ? { target: "_blank" } : {}),
				},
			}),
		},
	})
}
