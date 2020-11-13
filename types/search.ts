export interface Search {
  SearchID: string
  UserID: string
  Title: string
  Query: string
  LastSearchUpdatedAt: string | null
  NextSearchUpdateAt: string
}
