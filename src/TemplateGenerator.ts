import path from "path"
import { FileSys } from "./FileSys"
import { FileExtension, getCommandName, Initializer, Language, getEventName, getDbName } from "./utils/index"
import {
 getBaseCommand,
 getBaseCommandTS,
 getBaseEvent,
 getBaseEventTS,
 getCommandTemplate,
 getCommandTemplateTS,
 getMessageEvent,
 getMessageEventTS,
 getReadyEvent,
 getReadyEventTS,
 getRegistryFile,
 getRegistryFileTS,
 getTestCommand,
 getTestCommandTS,
 getTypescriptBotFile,
 getDatabase,
 getDatabaseTS,
 getGuildDb,
 getGuildDbTS,
 getUserDb,
 getUserDbTS,
} from "./templates/templates"
import { SimpleLogger } from "./Logger"
import { Logger, ProjectTemplateGenerator } from "./utils/interfaces"
import eventTemplates from "./templates/events"
import eventTemplatesTS from "./templates/tsevents"
import databaseTemplates from "./templates/database"
import databaseTemplatesTS from "./templates/tsdatabase"

const eventsJS: any = eventTemplates
const eventsTS: any = eventTemplatesTS
const databaseJS: any = databaseTemplates
const databaseTS: any = databaseTemplatesTS

export class TemplateGenerator implements ProjectTemplateGenerator, Initializer {
 private static instance: TemplateGenerator

 private fileSys: FileSys = FileSys.getFileSystem()

 private logger: SimpleLogger = SimpleLogger.getSimpleLogger()

 private language: Language | undefined

 async initialize(language?: Language) {
  this.language = language
 }

 async generateUtilities(srcPath: string) {
  const { utils, structures, test, ready, message, client, database, schemas } = this.getPaths(srcPath)
  await this.generateDirectories(srcPath)
  await this.generateRegistry(utils)
  if (this.language === "typescript") await this.generateClient(client)
  await this.generateBaseCommand(structures)
  await this.generateBaseEvent(structures)
  await this.generateTestCommand(test)
  await this.generateReadyEvent(ready)
  await this.generateMessageEvent(message)
  await this.genrateDatabases(database)
  await this.generateGuildDb(schemas)
  await this.generateUserDb(schemas)
 }

 getPaths(srcPath: string) {
  const utils = path.join(srcPath, "utils")
  const structures = path.join(utils, "structures")
  const commands = path.join(srcPath, "commands")
  const events = path.join(srcPath, "events")
  const database = path.join(srcPath, "database")
  const client = path.join(srcPath, "client")
  const test = path.join(commands, "test")
  const ready = path.join(events, "ready")
  const message = path.join(events, "message")
  const schemas = path.join(database, "schemas")
  return {
   commands,
   utils,
   structures,
   test,
   ready,
   message,
   events,
   client,
   database,
   schemas,
  }
 }

 async generateClient(filePath: string) {
  const template = getTypescriptBotFile()
  const file = path.join(filePath, "client.ts")
  await this.fileSys.createFile(file, template)
 }

 async generateDirectories(basePath: string) {
  const { utils, structures, commands, events, test, ready, client, message, database, schemas } =
   this.getPaths(basePath)
  this.logger.info("Generating Directories...")
  await this.fileSys.createDirectory(utils)
  this.logger.success("Created Utilities Directory")
  await this.fileSys.createDirectory(structures)
  this.logger.success("Created Structures Directory")
  if (this.language === "typescript") {
   await this.fileSys.createDirectory(client)
   this.logger.success("Created Client Directory")
  }
  await this.fileSys.createDirectory(commands)
  this.logger.success("Created Commands Directory")
  await this.fileSys.createDirectory(events)
  this.logger.success("Created Events Directory")
  await this.fileSys.createDirectory(test)
  this.logger.success("Created TestCommand Directory")
  await this.fileSys.createDirectory(ready)
  this.logger.success("Created ReadyEvent Directory")
  await this.fileSys.createDirectory(message)
  this.logger.success("Created MessageEvent Directory")
  await this.fileSys.createDirectory(database)
  this.logger.success("Created Database Directory")
  await this.fileSys.createDirectory(schemas)
  this.logger.success("Created Schemas Directory")
 }

 async generateRegistry(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getRegistryFile() : getRegistryFileTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `registry.${extension}`)
  return this.fileSys.createFile(file, template)
 }

 async generateBaseCommand(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getBaseCommand() : getBaseCommandTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `BaseCommand.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateBaseEvent(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getBaseEvent() : getBaseEventTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `BaseEvent.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateTestCommand(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getTestCommand() : getTestCommandTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `TestCommand.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateReadyEvent(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getReadyEvent() : getReadyEventTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `ReadyEvent.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async genrateDatabases(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getDatabase() : getDatabaseTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `Mongoose.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateGuildDb(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getGuildDb() : getGuildDbTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `GuildDb.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateUserDb(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getUserDb() : getUserDbTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `UserDb.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateMessageEvent(filePath: string) {
  const isJs = this.language === "javascript"
  const template = isJs ? getMessageEvent() : getMessageEventTS()
  const extension: FileExtension = isJs ? "js" : "ts"
  const file = path.join(filePath, `MessageEvent.${extension}`)
  await this.fileSys.createFile(file, template)
 }

 async generateCommand(categoryPath: string, name: string, category: string) {
  if (!this.language) throw new Error("Language was not set")
  const fileName = getCommandName(name, this.language)
  const filePath = path.join(categoryPath, fileName)
  const exists = await this.fileSys.exists(filePath)
  if (!exists) {
   const isJs = this.language === "javascript"
   const template = isJs ? getCommandTemplate(name, category) : getCommandTemplateTS(name, category)
   return this.fileSys.createFile(filePath, template)
  }
  throw new Error(`${filePath} already exists.`)
 }

 async generateEvents(events: any[], eventsDir: string) {
  if (!this.language) throw new Error("Language was not set")
  for (const event of events) {
   const fileName = getEventName(event, this.language)
   const filePath = path.join(eventsDir, fileName)
   const exists = await this.fileSys.exists(filePath)
   const template = this.getTemplate(event)
   if (!exists) {
    await this.fileSys.createFile(filePath, template)
   }
  }
 }

 async generateDatabase(data: any[], dataDir: string) {
  if (!this.language) throw new Error("Language was not set")
  for (const db of data) {
   const fileName = getDbName(db, this.language)
   const filePath = path.join(dataDir, fileName)
   const exists = await this.fileSys.exists(filePath)
   const template = this.getDbTemplate(db)
   if (!exists) {
    await this.fileSys.createFile(filePath, template)
   }
  }
 }
 getTemplate(event: string) {
  return this.language === "javascript" ? eventsJS[event] : eventsTS[event]
 }

 getDbTemplate(db: string) {
  return this.language === "javascript" ? databaseJS[db] : databaseTS[db]
 }

 static getTemplateGenerator(): TemplateGenerator {
  if (!TemplateGenerator.instance) {
   TemplateGenerator.instance = new TemplateGenerator()
  }
  return TemplateGenerator.instance
 }

 public getfileSys(): FileSys {
  return this.fileSys
 }

 public getLogger(): Logger {
  return this.logger
 }

 public getLanguage(): Language | undefined {
  return this.language
 }
}
