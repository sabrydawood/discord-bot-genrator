import { execSync } from "child_process"
import { Initializer, GenratorConfig } from "./utils/index"

export class PackageManager implements Initializer {
 private static instance: PackageManager
 private config: GenratorConfig | undefined
 private prefix: string | undefined
 private filePath: string | undefined

 async initialize(config: GenratorConfig, filePath: string): Promise<void> {
  this.config = config
  this.filePath = filePath
  this.prefix = this.config.manager === "npm" ? "npm i" : "yarn add"
 }

 async setup() {
  if (!this.config) throw new Error("Config Not Initialized.")
  return this.config.manager === "npm" ? this.initializeNPM() : this.initializeYarn()
 }

 public initializeNPM() {
  execSync(`${this.config?.manager} init -y`, { cwd: this.filePath })
  return this.installDependencies()
 }

 public initializeYarn() {
  execSync(`${this.config?.manager} init -y`, { cwd: this.filePath })
  return this.installDependencies()
 }

 public createTsconfig() {
  return execSync(`${this.config?.manager} run tsc --init --resolveJsonModule --target es6`, { cwd: this.filePath })
 }

 public installDependencies() {
  this.installDiscordJS()
  this.installNodemon()
  this.installMongo()
  this.installMongo()
  this.installCache()
  if (this.config?.language === "typescript") {
   this.installTypes()
   return this.createTsconfig()
  }
 }

 public installTypes() {
  this.installTypescript()
  this.installNodeTypes()
 }

 public installTypescript() {
  return execSync(`${this.prefix} -D typescript`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }

 public installNodeTypes() {
  return execSync(`${this.prefix} -D @types/node`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }

 public installDiscordJS() {
  return execSync(`${this.prefix} discord.js@latest`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }
 public installMongo() {
  return execSync(`${this.prefix} mongoose@6.5.0`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }
 public installCache() {
  return execSync(`${this.prefix} fixedsize-map@1.0.1`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }

 public installNodemon() {
  return execSync(`${this.prefix} -D nodemon`, {
   cwd: this.filePath,
   stdio: "ignore",
  })
 }

 static getPackageManager(): PackageManager {
  if (!PackageManager.instance) {
   PackageManager.instance = new PackageManager()
  }
  return PackageManager.instance
 }
}
