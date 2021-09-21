import { Image, BlitzPage, Routes, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"

import { Wrapper } from "./new.styles"

const NewProjectPage: BlitzPage = () => {
  const createQuickProposal = () => {
    Router.push(Routes.QuickProjectPage())
  }

  const createDetailedProposal = () => {
    Router.push(Routes.FullProjectPage())
  }

  return (
    <>
      <Header title="Projects" />
      <Wrapper>
        <h1>What type of proposal you want to submit?</h1>
        <div className="wrapper__options">
          <div className="wrapper__options--item">
            <Image src="/easy.png" alt="Quick Proposal" width={300} height={231} />
            <h2>Quick proposal</h2>
            <button onClick={createQuickProposal}>Create</button>
          </div>
          <div className="wrapper__options--item">
            <Image src="/full.png" alt="Detailed Proposal" width={300} height={231} />
            <h2>Detailed proposal</h2>
            <button onClick={createDetailedProposal}>Create</button>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create New Project"}>{page}</Layout>

export default NewProjectPage
