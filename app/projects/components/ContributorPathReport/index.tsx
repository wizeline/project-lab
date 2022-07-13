import React from "react"
import CheckSharpIcon from "@mui/icons-material/CheckSharp"
import ClearSharpIcon from "@mui/icons-material/ClearSharp"
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp"
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp"
import AlternateEmailSharpIcon from "@mui/icons-material/AlternateEmailSharp"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import styled from "@emotion/styled"

interface IProps {
  project: any
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#000",
    maxWidth: 320,
    fontSize: "16px",
    border: "1px solid #dadde9",
  },
}))

export const EmailAt = styled.span`
  cursor: pointer;

  svg path {
    fill: #e94d44;
  }
`

export const TipBubble = styled.span`
  background-color: #fff;
  text-align: center;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin: 0 2px;
  color: #e94d44;
  border-radius: 100%;
  font-size: 12px;
  cursor: pointer;
`

export const CompleteDate = styled.span`
  background-color: #f8f8f8;
  padding: 5px;
  border: solid 1px #999;
  display: inline-flex;
  border-radius: 8px;
  font-size: 12px;
`

export const CompleteIcon = styled.span`
  svg path {
    fill: #e94d44;
  }
`

export const IncompleteIcon = styled.span`
  svg path {
    fill: #999;
  }
`

export const ContributorPathReport = ({ project }: IProps) => {
  return (
    <>
      <big>Contributors</big>
      <table width="100%" className="table-project-members">
        <thead>
          <tr>
            <th>Active</th>
            <th>Name</th>
            <th align="center">Email</th>
            <th>Role(s)</th>
            <th>
              H.P.W.
              <br />
              <HtmlTooltip title="Hours per Week">
                <TipBubble>?</TipBubble>
              </HtmlTooltip>
            </th>
            {project.stages?.map((stage, i) => (
              <th key={i}>
                {stage.name}
                <br />
                {stage.projectTasks.map((task, taskIndex) => (
                  <HtmlTooltip key={taskIndex} title={task.description}>
                    <TipBubble>{taskIndex + 1}</TipBubble>
                  </HtmlTooltip>
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {project.projectMembers.map((member, memberIndex) => {
            const projectTaskIds: any = member.contributorPath.map((cp) => cp.projectTaskId)

            return (
              <tr key={memberIndex}>
                <td align="center">
                  {member.active ? (
                    <CompleteIcon>
                      <CheckSharpIcon />
                    </CompleteIcon>
                  ) : (
                    <IncompleteIcon>
                      <ClearSharpIcon />
                    </IncompleteIcon>
                  )}
                </td>
                <td>
                  {member.profile?.firstName} {member.profile?.lastName}
                </td>
                <td align="center">
                  <HtmlTooltip
                    key={memberIndex}
                    title={<React.Fragment>{member.profile?.email}</React.Fragment>}
                  >
                    <EmailAt>
                      <AlternateEmailSharpIcon />
                    </EmailAt>
                  </HtmlTooltip>
                </td>
                <td>
                  {member.role.reduce(
                    (acc, r, idx) => (idx === 0 ? r.name : acc + `, ${r.name}`),
                    ""
                  )}
                </td>
                <td align="center">{member.hoursPerWeek}</td>
                {project.stages?.map((stage, s) => (
                  <td key={s}>
                    <ul>
                      {stage.projectTasks.map((task, taskIndex) => (
                        <li key={taskIndex}>
                          {projectTaskIds.includes(task.id) ? (
                            <CompleteIcon>
                              <CheckBoxSharpIcon />
                            </CompleteIcon>
                          ) : (
                            <>
                              <IncompleteIcon>
                                <CheckBoxOutlineBlankSharpIcon />
                              </IncompleteIcon>{" "}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ContributorPathReport
