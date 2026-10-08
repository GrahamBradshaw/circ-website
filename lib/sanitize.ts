import sanitizeHtml from "sanitize-html"

const allowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "span",
  "code",
  "pre",
  "hr",
]

const allowedAttributes = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title"],
  span: ["class"],
  p: ["class"],
  h1: ["class"],
  h2: ["class"],
  h3: ["class"],
  code: ["class"],
  pre: ["class"],
}

export function sanitizeRichText(input: string): string {
  if (!input || typeof input !== "string") return ""

  return sanitizeHtml(input, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer nofollow",
          target: attribs.target || "_blank",
        },
      }),
    },
    allowedStyles: {},
    parser: {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    },
  })
}
