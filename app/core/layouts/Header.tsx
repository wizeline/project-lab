import React from "react"
import { Head, Image, Router, Routes, useMutation } from "blitz"
import styled from "@emotion/styled"
import logout from "app/auth/mutations/logout"

import { useCurrentUser } from "../hooks/useCurrentUser"
import DropDownButton from "../components/DropDownButton"
import Search from "../components/Search"

interface IProps {
  title: String
}
export interface MenuItemArgs {
  permissions: boolean | undefined
  text: string
  testId?: string
  onClick: (props: unknown) => void
}

const Header = ({ title }: IProps) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  const goHome = () => {
    Router.push(Routes.Home())
  }

  const options: MenuItemArgs[] = [
    {
      permissions: true,
      onClick: async () => {
        await logoutMutation()
      },
      text: "Sign out",
      testId: "sign-out-button",
    },
  ]

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Wrapper>
        <header>
          <div className="content">
            <div className="logo" onClick={goHome}>
              <div className="logo--img">
                <Image src="/wizeline.png" alt="wizeline" height={70} width={103} />
              </div>
              <div className="logo--text">Project Lab</div>
            </div>
            <div className="actions">
              {/* Commented this for other realse <div className="actions--search" /> */}
              <DropDownButton options={options}>
                <div className="actions__user">
                  <span className="actions__user--name">{currentUser?.email}</span>
                </div>
              </DropDownButton>
            </div>
          </div>
        </header>
        <Search />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
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
  .actions .actions__user {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .actions .actions__user .actions__user--name {
    color: #000000;
    font-size: 11px;
    letter-spacing: 0;
    line-height: 17px;
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
`

export default Header
