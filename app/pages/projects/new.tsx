import { Link, Image, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"

const NewProjectPage: BlitzPage = () => {
  return (
    <div>
      <h1>What type of proposal you want to submit?</h1>
      <h2>
        <Link href={Routes.QuickProjectPage()}>
          <Image src="/easy.png" alt="Quick Proposal" width={540} height={405} />
        </Link>
      </h2>
      <h2>
        <Link href={Routes.QuickProjectPage()}>
          <a>Quick proposal</a>
        </Link>
      </h2>
      <h2>
        <Link href={Routes.FullProjectPage()}>
          <Image src="/full.png" alt="Detailed Proposal" width={540} height={405} />
        </Link>
      </h2>
      <h2>
        <Link href={Routes.FullProjectPage()}>
          <a>Detailed proposal</a>
        </Link>
      </h2>
    </div>
  )
}

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create New Project"}>{page}</Layout>

export default NewProjectPage
