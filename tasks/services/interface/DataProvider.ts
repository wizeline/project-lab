import ProfileWOSDTO from "tasks/types/ProfileWOSDTO"

export interface DataProvider {
  getAllFromCatalog(name: string): Promise<any>
  getProfilesFromWizelineOS(): Promise<ProfileWOSDTO[]>
}
