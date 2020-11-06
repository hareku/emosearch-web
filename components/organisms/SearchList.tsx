import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Box from "@material-ui/core/Box"
import Link from "~/components/atoms/Link"
import useFetch from "use-http"
import { Search } from "~/types/search"

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
        <Box mb={1}>
          <SearchCard search={search} />
        </Box>
      ))}
    </React.Fragment>
  )
}

function SearchCard({ search }: { search: Search }) {
  return (
    <Link href={`/searches/${search.SearchID}`}>
      <Card>
        <CardContent>
          <div>{search.Query}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
