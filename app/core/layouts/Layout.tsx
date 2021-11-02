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
            width: 130px;
            height: 44px;
            cursor: pointer;
          }
          button.primary.like {
            background-image: url(/thumbs-up.png);
            background-repeat: no-repeat;
            background-position-x: 80%;
            background-position-y: 12px;
            background-size: 18px;
            float: left;
          }

          button.primary.unlike {
            background-image: url(/thumbs-down.png);
            background-repeat: no-repeat;
            background-position-x: 85%;
            background-position-y: 15px;
            background-size: 18px;
            float: left;
          }

          button.primary.warning {
            background-color: red;
          }

          .like-bubble {
            min-width: 20px;
            padding-left: 15px;
            padding-right: 15px;
            height: 22px;
            background: #fff;
            color: #000;
            font-family: "Poppins";
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            margin-left: 5px;
            float: left;
            line-height: 22px;
            text-align: center;
            box-shadow: 2px 2px 4px 0px rgb(0 0 0 / 14%);
          }

          button.primary.search {
            height: 56px;
            margin-left: 5px;
          }

          button.primary.default {
            background-color: #f1f1f1;
            color: #444;
          }
        `}</style>
      </Head>

      {children}
    </>
  )
}

export default Layout
