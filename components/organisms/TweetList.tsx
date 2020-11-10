import React from "react"
import { formatDistanceToNow } from "date-fns"
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import useFetch from "use-http"
import Link from "~/components/atoms/Link"
import { Tweet } from "~/types/tweet"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroller"

interface TweetsRes {
  HasMore: boolean
  Tweets: Tweet[]
}

export default function TweetList() {
  const router = useRouter()

  const [untilID, setSinceID] = React.useState<number | null>(null)
  const { data = { HasMore: true, Tweets: [] }, error } = useFetch<TweetsRes>(
    `/searches/${router.query.sid}/tweets?limit=100${
      untilID ? `&until_id=${untilID}` : ""
    }`,
    {
      onNewData: (oldData: TweetsRes, newData: TweetsRes): TweetsRes => {
        return {
          HasMore: newData.HasMore,
          Tweets: [
            ...(oldData ? oldData.Tweets : []),
            ...(newData ? newData.Tweets : []),
          ],
        }
      },
    },
    [untilID]
  )

  const loadTweets = React.useCallback(() => {
    setSinceID(
      data.Tweets.length > 0
        ? data.Tweets[data.Tweets.length - 1].TweetID
        : null
    )
  }, [data.Tweets])

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadTweets}
      hasMore={data.HasMore}
      initialLoad
      loader={<Loader key={0} />}
      threshold={1000}
    >
      <TweetListBody data={data} />
    </InfiniteScroll>
  )
}

function TweetListBody({ data }: { data: TweetsRes }) {
  if (data.Tweets.length === 0) {
    return data.HasMore ? null : <div>No Tweets.</div>
  }

  return (
    <Box border={1} borderColor="grey.100">
      {data.Tweets.map((tweet) => (
        <Box
          key={tweet.TweetID}
          border={1}
          borderTop={0}
          borderLeft={0}
          borderRight={0}
          borderColor="grey.100"
        >
          <TweetCard tweet={tweet} />
        </Box>
      ))}
    </Box>
  )
}

function Loader() {
  return (
    <Box textAlign="center" mt={3}>
      <CircularProgress />
    </Box>
  )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <Box p={2}>
      <div>
        ({tweet.Text.length}) {tweet.Text}
      </div>
      <div style={{ textAlign: "right", marginTop: 5 }}>
        <Link
          href={`http://twitter.com/intent/retweet?tweet_id=${tweet.TweetID}`}
          target="_blank"
          title={tweet.TweetCreatedAt}
        >
          {formatDistanceToNow(Date.parse(tweet.TweetCreatedAt))}
        </Link>
      </div>
    </Box>
  )
}
