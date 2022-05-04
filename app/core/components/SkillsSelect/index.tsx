import { useState } from "react"
import { useQuery } from "blitz"
import getSkills from "app/skills/queries/getSkills"
import { GenericSelect, SelectProps } from "../GenericSelect"

export const SkillsSelect = (props: SelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [data, { isLoading }] = useQuery(
    getSkills,
    {
      where: { name: { contains: searchTerm } },
      orderBy: { id: "asc" },
    },
    { suspense: false }
  )

  const { skills } = data || { skills: [] }

  return (
    <GenericSelect
      {...props}
      options={skills}
      isLoading={isLoading}
      setSearchTerm={setSearchTerm}
    />
  )
}

export default SkillsSelect
