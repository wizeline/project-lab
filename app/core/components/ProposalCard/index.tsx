import React from "react"
import { Link, Routes } from "blitz"
import { CardActionArea, CardContent, Card } from "@mui/material"
import EllipsisText from "app/core/components/EllipsisText"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import Image from "next/image"

import { ProposalCardWrap } from "./ProposalCard.styles"

interface IProps {
  id: string | number
  title: string
  picture: string
  initials: string
  date: string
  description: string
  status: string
  color: any
  votesCount?: number | null
  skills?: { name: string }[]
}

export const ProposalCard = (props: IProps) => {
  return (
    <>
      <Card
        sx={{
          width: 270,
          borderRadius: 5,
          "@media (max-width: 480px)": {
            width: "80vw",
          },
        }}
      >
        <CardActionArea style={{ height: "100%" }}>
          <Link href={Routes.ShowProjectPage({ projectId: props.id })}>
            <CardContent style={{ backgroundColor: "#FFF", height: "100%" }}>
              <ProposalCardWrap>
                <div className="ProposalCard__head">
                  <div className="ProposalCard__head__icon">
                    {props.picture ? (
                      <Image src={props.picture} width="60" height="60" alt="Project" />
                    ) : (
                      <span>{props.initials}</span>
                    )}
                  </div>
                  <div className="ProposalCard__head__description">
                    <div className="ProposalCard__head__description--title">{props.title}</div>
                    <div className="ProposalCard__head__description--date">{props.date}</div>
                  </div>
                </div>
                <div className="ProposalCard--description">
                  <EllipsisText text={props.description || ""} length={65} />
                </div>
                <div className="ProposalCard__skills">
                  {props.skills &&
                    props.skills.map((skill) => (
                      <p key={skill.name} className="ProposalCard__skills--title">
                        {skill.name}
                      </p>
                    ))}
                </div>
                <div className="ProposalCard__status">
                  <hr />

                  <div>
                    <p className="ProposalCard__status--display">{props.status}</p>
                    <div className="ProposalCard__status--like">
                      <p>{props.votesCount} </p>
                      <span>
                        <ThumbUpIcon sx={{ color: "#AF2E33", fontSize: 15 }} />
                      </span>
                    </div>
                  </div>
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
