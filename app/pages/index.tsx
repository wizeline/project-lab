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
        query: { projectStatus: "Active" },
      })
  }, [router])

  return <Loader />
}

export default Home
