export interface Tweet {
  SearchID: string
  AuthorID: number
  TweetID: number
  Text: string
  TweetCreatedAt: string
  SentimentScore: {
    Mixed: number
    Negative: number
    Neutral: number
    Positive: number
  }
  User: {
    ID: string
    Name: string
    ProfileImageURL: string
    ScreenName: string
  }
}
