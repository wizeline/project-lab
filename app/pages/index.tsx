/* eslint-disable no-unused-expressions */
import { useEffect } from "react"
import { useRouter } from "blitz"
import Loader from "app/core/components/Loader"

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router &&
      router.replace({
        pathname: "/projects/search",
        query: { status: "Idea in Progress" },
      })
  }, [router])

  return <Loader />
}

export default Home
