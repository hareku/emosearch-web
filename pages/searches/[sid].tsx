import React, { useCallback, useState } from "react"
import TweetList from "~/components/organisms/TweetList"
import {
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@material-ui/core"
import { useRouter } from "next/router"
import { LABELS, queryToLabel, labelToQuery } from "~/lib/sentiment"

export default function TweetsPage() {
  const router = useRouter()
  const [label, setLabel] = useState(queryToLabel(router.query.sentiment_label))

  const handleSelectChange = useCallback<
    React.EventHandler<
      React.ChangeEvent<{ name?: string | undefined; value: unknown }>
    >
  >(
    (event) => {
      if (typeof event.target.value !== "string") return
      setLabel(event.target.value)
      const newLabel = labelToQuery(event.target.value)
      if (newLabel) {
        router.push(`/searches/${router.query.sid}?sentiment_label=${newLabel}`)
      } else {
        router.push(`/searches/${router.query.sid}`)
      }
    },
    [router]
  )

  return (
    <React.Fragment>
      <Box mb={3} maxWidth={120}>
        <FormControl fullWidth>
          <InputLabel htmlFor="sentiment_label">Filter</InputLabel>
          <Select
            id="sentiment_label"
            value={label}
            onChange={handleSelectChange}
          >
            {LABELS.map((label) => (
              <MenuItem key={label.Value} value={label.Value}>
                {label.Value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TweetList key={label} />
    </React.Fragment>
  )
}
