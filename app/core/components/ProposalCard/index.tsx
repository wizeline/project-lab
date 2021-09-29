import React from "react"
import { Link, Routes } from "blitz"
import { CardActionArea, CardContent, Card } from "@material-ui/core"
import EllipsisText from "app/core/components/EllipsisText"
import { Draft } from "../../utils/constants"

import { ProposalCardWrap } from "./ProposalCard.styles"

interface IProps {
  id: string | number
  title: string
  date: string
  description: string
  status: string
  color: any
  votesCount?: number | null
}

export const ProposalCard = (props: IProps) => {
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
export default ProposalCard
