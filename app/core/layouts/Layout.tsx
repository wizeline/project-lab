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
        body {
          font-family: "Poppins", sans-serif;
          background-color: #f2f4f4;
        }
      `}</style>
    </>
  )
}

export default Layout
