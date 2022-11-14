const databaseTemplatesTS = {
 Guild: `
	 import {Schema, model} from "mongoose";
import FixedSizeMap from "fixedsize-map";
import { getUser } from "./UserDb";

const cache = new FixedSizeMap(100);

const schema = new Schema({
  _id: String,
  data: {
    name: String,
    region: String,
    owner: { type: String, ref: "users" },
    joinedAt: Date,
    leftAt: Date,
    bots: { type: Number, default: 0 },
  },
  prefix: { type: String, default: "!" },
});

const Model = model("guild", schema);

module.exports = {
  /**
   * @param {import('discord.js').Guild} guild
   */
  getSettings: async (guild) => {
    if (!guild) throw new Error("Guild is undefined");
    if (!guild.id) throw new Error("Guild Id is undefined");

    const cached = cache.get(guild.id);
    if (cached) return cached;

    let guildData = await Model.findById(guild.id);
    if (!guildData) {
      // save owner details
      guild
        .fetchOwner()
        .then(async (owner) => {
          const userDb = await getUser(owner);
          await userDb.save();
        })
        .catch((ex) => {});

      // create a new guild model
      guildData = new Model({
        _id: guild.id,
        data: {
          name: guild.name,
          region: guild.preferredLocale,
          owner: guild.ownerId,
          joinedAt: guild.joinedAt,
        },
      });

      await guildData.save();
    }
    cache.add(guild.id, guildData);
    return guildData;
  },
};
	`,
 User: `
	 import {Schema, model} from "mongoose";
import FixedSizeMap from "fixedsize-map";

const cache = new FixedSizeMap(10000);

const schema = new Schema(
  {
    _id: String,
    username: String,
    discriminator: String,
    logged: Boolean,
		}
);

const Model = model("user", schema);

module.exports = {
  /**
   * @param {import('discord.js').User} user
   */
  getUser: async (user) => {
    if (!user) throw new Error("User is required.");
    if (!user.id) throw new Error("User Id is required.");

    const cached = cache.get(user.id);
    if (cached) return cached;

    let userDb = await Model.findById(user.id);
    if (!userDb) {
      userDb = new Model({
        _id: user.id,
        username: user.username,
        discriminator: user.discriminator,
      });
    }

    // Update username and discriminator in previous DB
    else if (!userDb.username || !userDb.discriminator) {
      userDb.username = user.username;
      userDb.discriminator = user.discriminator;
    }

    cache.add(user.id, userDb);
    return userDb;
  },
};
	`,
}

export default databaseTemplatesTS
