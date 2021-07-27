import React from "react"

interface IProps {
  children: React.ReactNode
  title: String
}

function CardBox({ children, title }: IProps) {
  return (
    <>
      <div className="CardBox">
        <div className="CardBox--title">{title}</div>
        <div className="CardBox--content">{children}</div>
      </div>
      <style jsx>{`
        .CardBox {
          background-color: #fff;
          padding: 30px;
          border-radius: 4px;
          height: 100%;
        }
        .CardBox--title {
          color: #252a2f;
          font-size: 22px;
          font-weight: 700;
        }
        .CardBox--content {
          margin-top: 20px;
        }
      `}</style>
    </>
  )
}

export default CardBox
