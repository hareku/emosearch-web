import React from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import { useInput } from "~/lib/hooks/form"
import useFetch from "use-http"

function SearchCreateCard() {
  const [keyword, _, handleKeywordChange] = useInput("")
  const { post, loading, error } = useFetch("/searches")
  const handleSubmit = React.useCallback<
    React.EventHandler<React.FormEvent<HTMLFormElement>>
  >(
    (event) => {
      event.preventDefault()
      post({
        title: keyword,
        query: keyword,
      })
    },
    [post, keyword]
  )

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div>Create search from here.</div>
          <Box mt={3}>
            <TextField
              required
              label="Keyword to search"
              fullWidth
              placeholder="e.g. Your name"
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
