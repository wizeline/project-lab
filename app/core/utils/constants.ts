export const defaultStatus = "Draft"
export const defaultCategory = "Experiment"
export const contributorPath = [
  {
    name: "Intro",
    criteria: "You received an intro session.",
    mission: "To run the project.",
    tasks: [
      {
        name: "Join Slack Channel",
      },
    ],
  },
  {
    name: "Setup",
    criteria: "You are able to run the project.",
    mission: "A quick win.",
    tasks: [
      {
        name: "Clone Git Repo",
      },
    ],
  },
  {
    name: "Quick Winner",
    criteria: "You completed at least one quick win.",
    mission: "A major contribution.",
    tasks: [
      {
        name: "Assign yourself a task from Github Kanban board",
      },
    ],
  },
  {
    name: "Major Contributor",
    criteria: "You did a major contribution.",
    mission: "To lead the development process and influence the project direction.",
    tasks: [
      {
        name: "Participate in the code reviews and help keep track of the code sanity.",
      },
    ],
  },
]
