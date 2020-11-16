interface SentimentScore {
  Negative: number
  Neutral: number
  Positive: number
}

// Entities represents Twitter Entities.
export interface Entities {
  HashTags: HashTag[]
  Mentions: Mention[]
  URLs: URL[]
  Media: Medium[]
}

// HashTag represents Twitter HashTag.
interface HashTag {
  Start: number
  End: number
  Tag: string
}

// Mention represents Twitter Mention.
interface Mention {
  Start: number
  End: number
  Tag: string
}

// URL represents Twitter URL.
interface URL {
  Start: number
  End: number
  URL: string
  ExpandedURL: string
  DisplayURL: string
}

// Medium represents Twitter Medium.
interface Medium {
  Start: number
  End: number
  URL: string
  Type: string
  MediaURL: string
  VideoInfo: VideoInfo | null
}

interface VideoInfo {
  AspectRatio: [number, number]
  DurationMillis: number
  Variants: VideoVariant[]
}

interface VideoVariant {
  ContentType: string
  Bitrate: number
  URL: string
}

export interface Tweet {
  SearchID: string
  AuthorID: number
  TweetID: number
  Text: string
  TweetCreatedAt: string
  SentimentScore: SentimentScore | null
  SentimentLabel: string
  Entities: Entities | null
  User: {
    ID: string
    Name: string
    ProfileImageURL: string
    ScreenName: string
  }
}
