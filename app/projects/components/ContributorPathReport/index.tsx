import React from "react"
import { useQuery } from "blitz"
import getProjectMembers from "app/projects/queries/getProjectMembers"
import CheckSharpIcon from "@mui/icons-material/CheckSharp"
import ClearSharpIcon from "@mui/icons-material/ClearSharp"

interface IProps {
  project: any
  projectId: string
}

import styled from "@emotion/styled"

export const CompleteIcon = styled.span`
  svg path {
    fill: green;
  }
`

export const CompleteDate = styled.span`
  background-color: #f8f8f8;
  padding: 5px;
  border: solid 1px #999;
  display: inline-flex;
  border-radius: 8px;
  font-size: 12px;
`

export const IncompleteIcon = styled.span`
  svg path {
    fill: red;
  }
`

export const ContributorPathReport = ({ project, projectId }: IProps) => {
  const [projectMembers] = useQuery(getProjectMembers, { id: projectId })

  return (
    <>
      <big>Contributors</big>
      <table width="100%" className="table-project-members">
        <thead>
          <tr>
            <th>Active</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            {project.stages?.map((stage, i) => (
              <th key={i}>{stage.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectMembers.map((member, m) => {
            const contributorPath: any = member.contributorPath.map((cp) => {
              return cp.projectTaskId
            })

            let contributorTaskDate = {}
            member.contributorPath.map((cp) => {
              contributorTaskDate[cp.projectTaskId] = cp.createdAt.toDateString()
            })
            return (
              <tr key={m}>
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
                <td>{member.profile?.email}</td>
                <td>{member.profile?.department}</td>
                {project.stages?.map((stage, s) => (
                  <td key={s}>
                    <ul>
                      {stage.projectTasks.map((task, t) => {
                        const isComplete = contributorPath.indexOf(task.id) != -1
                        return (
                          <li key={t}>
                            <>
                              {isComplete ? (
                                <>
                                  <CompleteIcon>
                                    <CheckSharpIcon />
                                  </CompleteIcon>{" "}
                                </>
                              ) : (
                                <>
                                  <IncompleteIcon>
                                    <ClearSharpIcon />
                                  </IncompleteIcon>{" "}
                                </>
                              )}
                              {task.description}
                              {isComplete ? (
                                <>
                                  <br />
                                  <CompleteDate>{contributorTaskDate[task.id]}</CompleteDate>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          </li>
                        )
                      })}
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
