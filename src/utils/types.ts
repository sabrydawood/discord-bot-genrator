export type Action = "new" | "gen"
export type CLIArguments = [option: Action, data: string]
export type Language = "typescript" | "javascript"
export type PackageManagerType = "npm" | "yarn"
export type FileExtension = "js" | "ts"
export type StructureType = "command" | "event" | "database"
export type Credentials = {
 token: string
 prefix: string
 mongo_uri: string
}
export type CommandAnswer = {
 name: string
 category: string
}
export type GenratorConfig = {
 name: string
 language: Language
 manager: PackageManagerType
 token: string
 prefix: string
 mongo_uri: string
}
