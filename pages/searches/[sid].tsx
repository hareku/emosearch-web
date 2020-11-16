import React, { useCallback, useState } from "react"
import TweetList from "~/components/TweetList"
import {
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
} from "@material-ui/core"
import { stringifyUrl, StringifiableRecord } from "query-string"
import { useRouter } from "next/router"
import { Tweet } from "~/types/tweet"
import useFetch from "use-http"
const LABELS = Object.freeze(["ALL", "POSITIVE", "NEGATIVE"])
interface TweetsData {
  HasMore: boolean
  Tweets: Tweet[]
}

export default function SearchPage() {
  const router = useRouter()
  const searchID = router.query.sid as string
  const [label, setLabel] = useState<string>("ALL")

  const { get, loading } = useFetch("", { cache: "no-cache" })
  const [tweetsData, setTweetsData] = useState<TweetsData>({
    HasMore: true,
    Tweets: [],
  })
  const loadTweets = useCallback<
    (arg: { reset: boolean; sentimentLabel: string }) => void
  >(
    ({ reset, sentimentLabel }) => {
      const params: StringifiableRecord = {
        limit: 50,
        until_id: undefined,
        sentiment_label: sentimentLabel === "ALL" ? undefined : sentimentLabel,
      }
      const tweets = tweetsData.Tweets
      if (!reset && tweets.length > 0) {
        params.until_id = tweets[tweets.length - 1].TweetID
      }
      const url = stringifyUrl({
        url: `/searches/${searchID}/tweets`,
        query: params,
      })

      get(url)
        .then((data: TweetsData) => {
          setTweetsData({
            HasMore: data.HasMore,
            Tweets: reset
              ? data.Tweets
              : [...tweetsData.Tweets, ...data.Tweets],
          })
        })
        .catch()
    },
    [get, searchID, tweetsData.Tweets]
  )

  const handleLabelChange = useCallback<
    React.EventHandler<
      React.ChangeEvent<{ name?: string | undefined; value: unknown }>
    >
  >(
    (event) => {
      if (typeof event.target.value !== "string") {
        throw new Error("label value should be string")
      }
      setLabel(event.target.value)
      loadTweets({ sentimentLabel: event.target.value, reset: true })
    },
    [loadTweets]
  )

  const handleLoadTweets = useCallback(() => {
    loadTweets({ reset: false, sentimentLabel: label })
  }, [label, loadTweets])

  const { del: deleteRequest } = useFetch(`/searches/${searchID}`)
  const handleDelete = React.useCallback(() => {
    if (!window.confirm("delete?")) return
    deleteRequest()
      .then(() => {
        router.replace("/")
      })
      .catch(() => {
        window.alert("failed to delete")
      })
  }, [deleteRequest, router])

  return (
    <React.Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={3}
      >
        <Box maxWidth={120}>
          <FormControl fullWidth>
            <InputLabel htmlFor="sentiment_label">Filter</InputLabel>
            <Select
              id="sentiment_label"
              value={label}
              onChange={handleLabelChange}
            >
              {LABELS.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Button onClick={handleDelete} size="small">
            Delete
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box textAlign="center" mb={2}>
          <CircularProgress />
        </Box>
      ) : null}

      <TweetList
        data={tweetsData}
        onLoadTweets={handleLoadTweets}
        loading={loading}
      />
    </React.Fragment>
  )
}
