import { Head, Image, Router, Routes } from "blitz"
import React from "react"

interface IProps {
  title: String
}

function Header({ title }: IProps) {
  function goHome() {
    Router.push(Routes.ProjectsPage())
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <div className="content">
          <div className="logo" onClick={goHome}>
            <div className="logo--img">
              <Image src="/wizeline.png" alt="wizeline" height={80} width={80} />
            </div>
            <div className="logo--text">Proposal Hunt</div>
          </div>
          <div className="actions">
            <div className="actions--search" />
            <div className="actions__user">
              <div className="actions__user--name">carolina.guzman@wizeline.com</div>
            </div>
          </div>
        </div>
      </header>
      <style jsx>{`
        header {
          height: 70px;
          background-color: #fff;
        }
        .content {
          max-width: 1024px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }
        .logo {
          display: flex;
          align-items: center;
          width: 200px;
          cursor: pointer;
        }
        .logo--img {
          margin-right: 7px;
        }
        .logo--text {
          height: 32px;
          width: 307px;
          color: #252a2f;
          font-family: Poppins;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 30px;
        }
        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .actions--search {
          width: 24px;
          height: 24px;
          background-image: url(/search.png);
          background-repeat: no-repeat;
          background-size: 15px;
          background-position: 50%;
          margin-right: 40px;
          cursor: pointer;
        }
        .actions__user--name {
          color: #475f7b;
          font-size: 11px;
          letter-spacing: 0;
          line-height: 17px;
        }
      `}</style>
    </>
  )
}

export default Header
