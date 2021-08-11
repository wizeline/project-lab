import { Link, Image, BlitzPage, Routes, Router } from "blitz"
import styled from "@emotion/styled"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"

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

const Wrapper = styled.div`
  width: 100%;
  max-width: 997px;
  border-radius: 7px;
  background-color: #ffffff;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  h1 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
    padding-top: 158px;
    max-width: 307px;
    margin-left: auto;
    margin-right: auto;
  }
  h2 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
  }
  .wrapper__options {
    display: flex;
    justify-content: space-between;
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    padding-top: 74px;
    padding-bottom: 74px;
  }
  button {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    background-color: #ff6f18;
    color: #ffffff;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 29px;
    text-align: center;
    border: none;
    width: 160px;
    height: 44px;
    margin-top: 42px;
    cursor: pointer;
  }
`

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create New Project"}>{page}</Layout>

export default NewProjectPage
