import prompts from "prompts"
import { CLIArguments, CommandAnswer, Credentials, Language, PackageManagerType, ProjectPrompter } from "./utils/index"
import {
 eventGenerate,
 databaseGenerate,
 getCredentials,
 languageSelect,
 packageManager,
 getCommandPrompt,
 questions,
} from "./utils/questions"

export class Prompter implements ProjectPrompter {
 private static instance: Prompter

 async language(): Promise<Language> {
  const { language: answer } = await prompts(languageSelect)
  return <Language>(<unknown>answer)
 }

 async packageManager(): Promise<PackageManagerType> {
  const { packageManager: answer } = await prompts(packageManager)
  return <PackageManagerType>(<unknown>answer)
 }

 async command(): Promise<CommandAnswer> {
  const { name, category } = await prompts(getCommandPrompt)
  return { name, category }
 }

 async event(): Promise<any[]> {
  const { events } = await prompts(eventGenerate)
  return events
 }
 async database(): Promise<any[]> {
  const { db } = await prompts(databaseGenerate)
  return db
 }

 async credentials(): Promise<Credentials> {
  const { token, prefix, mongo_uri } = await prompts(getCredentials)
  return { token, prefix, mongo_uri }
 }

 async getChoice(): Promise<CLIArguments> {
  const { option, data } = await prompts(questions)
  return [option, data]
 }

 static getPrompter(): Prompter {
  if (!Prompter.instance) {
   Prompter.instance = new Prompter()
  }
  return Prompter.instance
 }
}
