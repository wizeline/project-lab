import React from "react"
import { Link, Routes } from "blitz"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { CardActionArea } from "@material-ui/core"
import { Draft } from "../utils/constants"

interface IProps {
  id: string | number
  title: String
  date: String
  description: String
  status: String
  color: any
  votesCount?: Number | null
}

function ProposalCard(props: IProps) {
  return (
    <>
      <Card sx={{ minWidth: 180, maxWidth: 280, borderRadius: 5 }}>
        <CardActionArea>
          <Link href={Routes.ShowProjectPage({ projectId: props.id })}>
            <CardContent style={{ backgroundColor: "#e7f2fb" }}>
              <div className="ProposalCard__head">
                <div className="ProposalCard__head__icon">AB</div>
                <div className="ProposalCard__head__description">
                  <div className="ProposalCard__head__description--title">{props.title}</div>
                  <div className="ProposalCard__head__description--date">{props.date}</div>
                </div>
              </div>
              <div className="ProposalCard--description">{props.description}</div>
              <div className="ProposalCard--status" style={{ backgroundColor: props.color }}>
                {props.status === Draft ? props.votesCount : props.status}
              </div>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
      <style jsx>{`
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
