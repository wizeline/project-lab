export interface IAuthor {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
}

export interface IComment {
  id: string
  body: string
  updatedAt?: Date
  author?: IAuthor
  authorId?: string
  projectId: string
  parentId?: string | null
  children?: IComment[]
}
