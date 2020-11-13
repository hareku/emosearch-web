import React from "react"
import Link from "~/components/atoms/Link"
import useFetch, { CachePolicies } from "use-http"
import { Search } from "~/types/search"
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Box,
  CircularProgress,
  Button,
} from "@material-ui/core"
import SearchCreateCard from "~/components/organisms/SearchCreateCard"

export default function SearchList() {
  const { get: reload, loading, error, data: searches = [] } = useFetch<
    Search[]
  >("/searches", { cachePolicy: CachePolicies.NO_CACHE }, [])
  const handleReload = React.useCallback(() => {
    reload()
  }, [reload])

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
        <SearchCreateCard onCreate={handleReload} />
      </Box>
    </React.Fragment>
  )
}

function SearchCard({ search }: { search: Search }) {
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
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  )
}
