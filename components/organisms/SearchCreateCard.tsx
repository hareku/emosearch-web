import React from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import Link from "~/components/atoms/Link"
import TextField from "@material-ui/core/TextField"
import { useInput } from "~/lib/hooks/form"
import useFetch from "use-http"

function SearchCreateCard({ onCreate }: { onCreate: () => void }) {
  const [keyword, setKeyword, handleKeywordChange] = useInput("")
  const { post, loading, error } = useFetch("/searches")
  const handleSubmit = React.useCallback<
    React.EventHandler<React.FormEvent<HTMLFormElement>>
  >(
    (event) => {
      event.preventDefault()
      post({
        Query: keyword,
      }).then(() => {
        setKeyword("")
        onCreate()
      })
    },
    [post, keyword, onCreate]
  )

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div>
            You can build a query from{" "}
            <Link href="https://twitter.com/search-advanced" target="_blank">
              Twitter Search Advanced
            </Link>
            .
          </div>
          <Box mt={3}>
            <TextField
              required
              label="query"
              fullWidth
              placeholder="e.g. MyName"
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button type="submit">Create</Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default SearchCreateCard
