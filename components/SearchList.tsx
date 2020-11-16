import React from "react"
import Link from "~/components/Link"
import useFetch, { CachePolicies } from "use-http"
import { Search } from "~/types/search"
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  CircularProgress,
} from "@material-ui/core"
import SearchListCreateCard from "./SearchListCreateCard"

export default function SearchList() {
  const { get: reload, loading, error, data: searches = [] } = useFetch<
    Search[]
  >("/searches", { cachePolicy: CachePolicies.NO_CACHE }, [])

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>
  }

  return (
    <React.Fragment>
      {searches.map((search) => (
        <Box key={search.SearchID} mb={1}>
          <SearchCard search={search} />
        </Box>
      ))}

      <Box mt={3}>
        <SearchListCreateCard onCreate={reload} />
      </Box>
    </React.Fragment>
  )
}

function SearchCard({ search }: { search: Search }) {
  const updatedAtText = React.useMemo<string | null>(() => {
    if (!search.LastSearchUpdatedAt) return null
    const date = new Date(Date.parse(search.LastSearchUpdatedAt))
    return date.toLocaleString()
  }, [search.LastSearchUpdatedAt])

  return (
    <Card>
      <CardActionArea>
        <Link
          href={`/searches/${search.SearchID}`}
          style={{ textDecoration: "none" }}
        >
          <CardContent>
            <Typography color="textPrimary" variant="h6">
              {search.Query}
            </Typography>
            <Typography color="textSecondary">
              {search.LastSearchUpdatedAt
                ? `Updated: ${updatedAtText}`
                : "Please wait a minute for the update."}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  )
}
