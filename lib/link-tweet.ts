import { Entities } from "~/types/tweet"
import escape from "lodash/escape"
import sortBy from "lodash/sortBy"
import { PermDeviceInformationOutlined } from "@material-ui/icons"

interface URL {
  start: number
  end: number
  text: string
  href: string
  displayUrl: string
  delete?: boolean
}

export function linkTweet(
  rawText: string,
  entities: Entities | null,
  linkClass?: string
): string {
  if (!entities) {
    return escape(rawText)
  }

  let result = ""
  let beginIndex = 0
  const urls = convertEntitiesToURLs(entities)

  urls.forEach((url) => {
    const urlBeginIndex = rawText.indexOf(url.text, beginIndex)
    result += escape(rawText.substring(beginIndex, urlBeginIndex))
    if (!url.delete) {
      result += `<a${linkClass ? `class="${linkClass}"` : ""} href="${
        url.href
      }" target="_blank" rel="nofollow noopener noreferrer">${
        url.displayUrl
      }</a>`
    }
    beginIndex = urlBeginIndex + url.text.length
  })

  result += escape(rawText.substring(beginIndex, rawText.length))

  return result
}

function convertEntitiesToURLs(entities: Entities): URL[] {
  const urls: URL[] = []
  entities.URLs.forEach((url) => {
    urls.push({
      start: url.Start,
      end: url.End,
      text: url.URL,
      href: url.ExpandedURL,
      displayUrl: url.DisplayURL,
    })
  })
  entities.Mentions.forEach((mention) => {
    urls.push({
      start: mention.Start,
      end: mention.End,
      text: `@${mention.Tag}`,
      href: `https://twitter.com/${encodeURIComponent(mention.Tag)}`,
      displayUrl: `@${mention.Tag}`,
    })
  })
  entities.HashTags.forEach((hashTag) => {
    urls.push({
      start: hashTag.Start,
      end: hashTag.End,
      text: `#${hashTag.Tag}`,
      href: `https://twitter.com/search?q=${encodeURIComponent(
        `#${hashTag.Tag}`
      )}`,
      displayUrl: `#${hashTag.Tag}`,
    })
  })
  entities.Media.forEach((medium) => {
    urls.push({
      start: medium.Start,
      end: medium.End,
      text: medium.URL,
      href: "",
      displayUrl: "",
      delete: true,
    })
  })
  return sortBy(urls, "start")
}
