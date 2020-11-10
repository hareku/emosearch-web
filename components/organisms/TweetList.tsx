import React from "react"
import { formatDistanceToNow } from "date-fns"
import { Box, Avatar, CircularProgress, Typography } from "@material-ui/core"
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
    <Box pt={1} pb={3} px={2} display="flex">
      <Box mr={2}>
        <Avatar alt={tweet.User.Name} src={tweet.User.ProfileImageURL} />
      </Box>
      <Box>
        <Box>
          <Link
            href={`http://twitter.com/${tweet.User.ScreenName}`}
            target="_blank"
            title={tweet.User.Name}
            style={{ marginRight: 5 }}
          >
            <Typography
              color="textSecondary"
              variant="caption"
              component="span"
            >
              {tweet.User.Name}
            </Typography>
          </Link>
          <Link
            href={`http://twitter.com/${tweet.User.ScreenName}/status/${tweet.TweetID}`}
            target="_blank"
            title={tweet.TweetCreatedAt}
          >
            <Typography color="textSecondary" variant="caption">
              ({formatDistanceToNow(Date.parse(tweet.TweetCreatedAt))})
            </Typography>
          </Link>
        </Box>
        <Box mt={1}>
          <Typography>{tweet.Text}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
