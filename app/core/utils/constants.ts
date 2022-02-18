export const defaultStatus = "Idea Submitted"
export const defaultCategory = "Experimenter"
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
export const baseCategories = [
  "Value Creator",
  "Experimenter",
  "Business Enabler",
  "Strategic Differentiator",
  "Community Innovation",
]
export const baseStatuses = [
  { name: "Idea Submitted", color: "#fe6f18" },
  { name: "Need SME Review", color: "#188bff" },
  { name: "Idea in Progress", color: "#7bc96b" },
  { name: "Need Tier Review", color: "#d3d3d4" },
  { name: "Closed", color: "#d3d3d4" },
  { name: "Inactive", color: "#d3d3d4" },
]
