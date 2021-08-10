import db from "./index"
import { execSync } from "child_process"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
  // Dummy skills, use only if you are not running `yarn sync-skills`
  // insert into Skills (id, name) values
  //   ('Go', 'Go'),
  //   ('Javascript', 'Javascript'),
  //   ('Typescript', 'Typescript'),
  //   ('Java', 'Java'),
  //   ('React', 'React'),
  //   ('Python', 'Python'),
  //   ('Scala', 'Scala'),
  //   ('GraphQL', 'GraphQL');

  await db.projectStatus.upsert({
    where: { name: "Draft" },
    update: {},
    create: { name: "Draft", color: "#fe6f18" },
  })
  await db.projectStatus.upsert({
    where: { name: "In Progress" },
    update: {},
    create: { name: "In Progress", color: "#188bff" },
  })
  await db.projectStatus.upsert({
    where: { name: "Archived" },
    update: {},
    create: { name: "Archived", color: "#7bc96b" },
  })
  await db.projectStatus.upsert({
    where: { name: "On Hold" },
    update: {},
    create: { name: "On Hold" },
  })
  await db.projectStatus.upsert({
    where: { name: "Discovery" },
    update: {},
    create: { name: "Discovery" },
  })
  await db.projectStatus.upsert({
    where: { name: "Closed" },
    update: {},
    create: { name: "Closed" },
  })

  await db.category.upsert({
    where: { name: "Experiment" },
    update: {},
    create: { name: "Experiment" },
  })
  await db.category.upsert({
    where: { name: "Value Creator" },
    update: {},
    create: { name: "Value Creator" },
  })
  await db.category.upsert({
    where: { name: "Business Enabler" },
    update: {},
    create: { name: "Business Enabler" },
  })
  await db.category.upsert({
    where: { name: "Strategic Differentiator" },
    update: {},
    create: { name: "Strategic Differentiator" },
  })

  await db.labels.upsert({
    where: { name: "Innovation Camp 2020" },
    update: {},
    create: { name: "Innovation Camp 2020" },
  })
  await db.labels.upsert({
    where: { name: "Innovation Camp 2021" },
    update: {},
    create: { name: "Innovation Camp 2021" },
  })
  await db.profiles.upsert({
    where: { email: "george.wachira@wizeline.com" },
    update: {},
    create: {
      email: "george.wachira@wizeline.com",
      firstName: "George",
      lastName: "Wachira",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "antonio.torres@wizeline.com" },
    update: {},
    create: {
      email: "antonio.torres@wizeline.com",
      firstName: "Antonio",
      lastName: "Torres",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "fernanda.vargas@wizeline.com" },
    update: {},
    create: {
      email: "fernanda.vargas@wizeline.com",
      firstName: "Fernanda",
      lastName: "Vargas",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "miriam.cantero@wizeline.com" },
    update: {},
    create: {
      email: "miriam.cantero@wizeline.com",
      firstName: "Miriam",
      lastName: "Cantero",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "victor.cabrales@wizeline.com" },
    update: {},
    create: {
      email: "victor.cabrales@wizeline.com",
      firstName: "Victor",
      lastName: "Cabrales",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "edgar.vazquez@wizeline.com" },
    update: {},
    create: {
      email: "edgar.vazquez@wizeline.com",
      firstName: "Edgar",
      lastName: "Vazquez",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "damaris.contreras@wizeline.com" },
    update: {},
    create: {
      email: "damaris.contreras@wizeline.com",
      firstName: "Dámaris",
      lastName: "Contreras",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "joaquin.bravo@wizeline.com" },
    update: {},
    create: {
      email: "joaquin.bravo@wizeline.com",
      firstName: "Joaquín",
      lastName: "Bravo Contreras",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "luis.tejeda@wizeline.com" },
    update: {},
    create: {
      email: "luis.tejeda@wizeline.com",
      firstName: "Luis",
      lastName: "Tejeda",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "joaquin.popoca@wizeline.com" },
    update: {},
    create: {
      email: "joaquin.popoca@wizeline.com",
      firstName: "Joaquin",
      lastName: "Popoca",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "ruben.zavala@wizeline.com" },
    update: {},
    create: {
      email: "ruben.zavala@wizeline.com",
      firstName: "Rubén",
      lastName: "Zavala",
      department: "Engineering",
    },
  })
}

export default seed
