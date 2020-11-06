import React from "react"
import SearchCreateCard from "~/components/organisms/SearchCreateCard"
import SearchList from "~/components/organisms/SearchList"
import Box from "@material-ui/core/Box"

export default function Index() {
  return (
    <React.Fragment>
      <SearchCreateCard />

      <Box mt={3}>
        <SearchList />
      </Box>
    </React.Fragment>
  )
}
