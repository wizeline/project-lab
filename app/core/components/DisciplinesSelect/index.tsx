import { useState } from "react"
import { useQuery } from "blitz"
import getDisciplines from "app/disciplines/queries/getDisciplines"
import { GenericSelect, SelectProps } from "../GenericSelect"

export const DisciplinesSelect = (props: SelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [data, { isLoading }] = useQuery(
    getDisciplines,
    {
      where: { name: { contains: searchTerm } },
      orderBy: { id: "asc" },
    },
    { suspense: false }
  )

  const { disciplines } = data || { disciplines: [] }

  return (
    <GenericSelect
      {...props}
      options={disciplines}
      isLoading={isLoading}
      setSearchTerm={setSearchTerm}
    />
  )
}

export default DisciplinesSelect
