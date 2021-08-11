import { ReactNode } from "react"
import { Head } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "proposalHunt"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
      <style jsx global>{`
        * {
          margin: 0px;
          padding: 0px;
        }
        body {
          font-family: "Poppins", sans-serif;
          background-color: #f2f4f4;
        }
        h1 {
          color: #252a2f;
          font-family: Poppins;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 30px;
        }
        h2 {
          color: #252a2f;
          font-family: Poppins;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 26px;
        }
        .wrapper {
          margin: 35px auto;
          max-width: 997px;
          border-radius: 7px;
          background-color: #ffffff;
          padding: 20px 23px;
        }
        .wrapper + .wrapper {
          margin-top: -10px;
        }
        button.primary {
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
          cursor: pointer;
        }
        button.primary.warning {
          background-color: red;
        }
      `}</style>
    </>
  )
}

export default Layout
