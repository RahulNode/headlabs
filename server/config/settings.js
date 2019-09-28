const Settings = {};

Settings.mongoUrl = process.env.MONGODB_URL;
Settings.secret = process.env.SECRET;

module.exports = Settings;