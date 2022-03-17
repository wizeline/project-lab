import db from "db"

export default async function getAdminUsers(_ = null) {
  const users = await db.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true },
  })

  return users
}
