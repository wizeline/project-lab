import React from "react"
import { ProjectStatus, STATUS } from "../utils/constants"

interface IProps {
  title: String
  date: String
  description: String
  status: String
  votes?: Number | null
}

function ProposalCard(props: IProps) {
  const findConfig: any = STATUS.find((e) => e.name === props.status)

  return (
    <>
      <div className="ProposalCard">
        <div className="ProposalCard__head">
          <div className="ProposalCard__head__icon">AB</div>
          <div className="ProposalCard__head__description">
            <div className="ProposalCard__head__description--title">{props.title}</div>
            <div className="ProposalCard__head__description--date">{props.date}</div>
          </div>
        </div>
        <div className="ProposalCard--description">{props.description}</div>
        <div className="ProposalCard--status" style={{ backgroundColor: findConfig.color }}>
          {props.status === ProjectStatus.Draft ? props.votes : findConfig.name}
        </div>
      </div>
      <style jsx>{`
        .ProposalCard {
          background-color: #e7f2fb;
          padding: 10px 20px;
          border-radius: 25px;
          position: relative;
          max-width: 280px;
          margin: 0 auto;
        }
        .ProposalCard__head {
          display: flex;
          align-items: center;
        }
        .ProposalCard__head__icon {
          width: 60px;
          height: 60px;
          border: 2px solid #234cad;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          color: #234cad;
          font-size: 16px;
        }
        .ProposalCard__head__description {
          margin-left: 20px;
          width: calc(100% - 60px - 20px);
        }
        .ProposalCard__head__description--title {
          color: #234cad;
          font-weight: 700;
          font-size: 18px;
          line-height: 18px;
        }
        .ProposalCard__head__description--date {
          color: #234cad;
          font-weight: 700;
          font-size: 12px;
        }
        .ProposalCard--description {
          font-size: 14px;
          color: #6b6b6b;
          margin-top: 10px;
          margin-bottom: 30px;
        }
        .ProposalCard--status {
          width: 75px;
          height: 25px;
          border-radius: 4px;
          position: absolute;
          bottom: 10px;
          right: 20px;
          color: #fff;
          text-align: center;
          font-size: 12px;
          line-height: 25px;
        }
      `}</style>
    </>
  )
}

export default ProposalCard
