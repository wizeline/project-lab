import React from "react"
import { Link, Routes } from "blitz"
import styled from "@emotion/styled"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import EllipsisText from "app/core/components/EllipsisText"
import { CardActionArea } from "@material-ui/core"
import { Draft } from "../utils/constants"

interface IProps {
  id: string | number
  title: string
  date: string
  description: string
  status: string
  color: any
  votesCount?: number | null
}

function ProposalCard(props: IProps) {
  return (
    <>
      <Card sx={{ minWidth: 180, maxWidth: 280, borderRadius: 5 }}>
        <CardActionArea style={{ height: "100%" }}>
          <Link href={Routes.ShowProjectPage({ projectId: props.id })}>
            <CardContent style={{ backgroundColor: "#e7f2fb", height: "100%" }}>
              <ProposalCardWrap>
                <div className="ProposalCard__head">
                  <div className="ProposalCard__head__icon">AB</div>
                  <div className="ProposalCard__head__description">
                    <div className="ProposalCard__head__description--title">{props.title}</div>
                    <div className="ProposalCard__head__description--date">{props.date}</div>
                  </div>
                </div>
                <div className="ProposalCard--description">
                  <EllipsisText text={props.description || ""} length={65} />
                </div>
                <div className="ProposalCard--status" style={{ backgroundColor: props.color }}>
                  {props.status === Draft ? props.votesCount : props.status}
                </div>
              </ProposalCardWrap>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </>
  )
}

const ProposalCardWrap = styled.div`
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
    color: #727e8c;
    font-family: Poppins;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 21px;
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
`

export default ProposalCard
