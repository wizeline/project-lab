import db from "../index"

const seedDisciplines = async () => {
  await db.disciplines.upsert({
    where: { name: "Backend" },
    update: {},
    create: { name: "Backend" },
  })
  await db.disciplines.upsert({
    where: { name: "Frontend" },
    update: {},
    create: { name: "Frontend" },
  })
  await db.disciplines.upsert({
    where: { name: "Fullstack" },
    update: {},
    create: { name: "Fullstack" },
  })
  await db.disciplines.upsert({
    where: { name: "Evolution Engineer" },
    update: {},
    create: { name: "Evolution Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "iOS Engineer" },
    update: {},
    create: { name: "iOS Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Android Engineer" },
    update: {},
    create: { name: "Android Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "React Native Engineer" },
    update: {},
    create: { name: "React Native Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Tech Lead" },
    update: {},
    create: { name: "Tech Lead" },
  })
  await db.disciplines.upsert({
    where: { name: "Manual QA" },
    update: {},
    create: { name: "Manual QA" },
  })
  await db.disciplines.upsert({
    where: { name: "Automation QA" },
    update: {},
    create: { name: "Automation QA" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Scientist" },
    update: {},
    create: { name: "Data Scientist" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Engineer" },
    update: {},
    create: { name: "Data Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Analyst" },
    update: {},
    create: { name: "Data Analyst" },
  })
  await db.disciplines.upsert({
    where: { name: "Site Reliability Engineer" },
    update: {},
    create: { name: "Site Reliability Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Technical Writer" },
    update: {},
    create: { name: "Technical Writer" },
  })
  await db.disciplines.upsert({
    where: { name: "UX Designer" },
    update: {},
    create: { name: "UX Designer" },
  })
  await db.disciplines.upsert({
    where: { name: "Visual Designer (UI)" },
    update: {},
    create: { name: "Visual Designer (UI)" },
  })
  await db.disciplines.upsert({
    where: { name: "Project Manager" },
    update: {},
    create: { name: "Project Manager" },
  })
  await db.disciplines.upsert({
    where: { name: "Product Manager" },
    update: {},
    create: { name: "Product Manager" },
  })
}

export default seedDisciplines
