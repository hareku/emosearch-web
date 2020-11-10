import React from "react"
import Link from "~/components/atoms/Link"
import useFetch from "use-http"
import { Search } from "~/types/search"
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@material-ui/core"

export default function SearchList() {
  const { get, loading, error, data = [] } = useFetch<Search[]>("/searches")
  React.useEffect(() => {
    get().catch()
  }, [])

  if (loading) {
    return <div>loading searches</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <React.Fragment>
      {data.map((search) => (
        <Box key={search.SearchID} mb={1}>
          <SearchCard search={search} />
        </Box>
      ))}
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
