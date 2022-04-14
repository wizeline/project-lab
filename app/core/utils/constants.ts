export const defaultStatus = "Idea Submitted"
export const defaultCategory = "Experimenter"
export const adminRoleName = "ADMIN"
export const contributorPath = [
  {
    name: "Intro",
    criteria: "You received an intro session.",
    mission: "Introduce yourself to the team.",
    tasks: [
      {
        name: "Join the slack channel `team-channel`",
        position: 1,
      },
      {
        name: "Introduce yourself",
        position: 2,
      },
    ],
  },
  {
    name: "Setup",
    criteria: "You are able to run the project.",
    mission: "Understand the project tech stack, purpose, and goals.",
    tasks: [
      {
        name: "Ask if you need any special permissions (github, auth0) or onboarding",
        position: 1,
      },
      {
        name: "Locate and clone the git repo",
        position: 2,
      },
      {
        name: "Follow the README and get the project running",
        position: 3,
      },
    ],
  },
  {
    name: "Quick Win",
    criteria: "You completed at least one quick win.",
    mission: "Get a feel of the work that needs to be done.",
    tasks: [
      {
        name: "Assign yourself a task from the project board, notify the team",
        position: 1,
      },
      {
        name: "Review a pull request or clarify a ticket that seems vague",
        position: 2,
      },
    ],
  },
  {
    name: "Major Contributor",
    criteria: "You did your first contribution.",
    mission: "To lead the development process and influence the project direction.",
    tasks: [
      {
        name: "Participate in the project ceremonies and help keep track of the code sanity",
        position: 1,
      },
      {
        name: "Get your contribution deployed",
        position: 2,
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
