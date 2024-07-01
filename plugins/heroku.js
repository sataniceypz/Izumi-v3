const got = require("got");
const Heroku = require("heroku-client");
const { izumi, secondsToDHMS } = require("../lib/");
const Config = require("../config");
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const baseURI = "/apps/" + Config.HEROKU_APP_NAME;
const simpleGit = require("simple-git");
const git = simpleGit();
const exec = require("child_process").exec;
const fs = require("fs");

izumi(
  {
    pattern: "restart$",
    fromMe: true,
    desc: "Restart Dyno",
    type: "heroku",
  },
  async (message) => {
    await message.reply(`_Restarting_`);
    await heroku.delete(baseURI + "/dynos").catch(async (error) => {
      await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

izumi(
  {
    pattern: "shutdown$",
    fromMe: true,
    desc: "Dyno off",
    type: "heroku",
  },
  async (message) => {
    await heroku
      .get(baseURI + "/formation")
      .then(async (formation) => {
        await message.reply(`_Shutting down._`);
        await heroku.patch(baseURI + "/formation/" + formation[0].id, {
          body: {
            quantity: 0,
          },
        });
      })
      .catch(async (error) => {
        await message.reply(`HEROKU : ${error.body.message}`);
      });
  }
);

izumi(
  {
    pattern: "dyno$",
    fromMe: true,
    desc: "Show Quota info",
    type: "heroku",
  },
  async (message) => {
    if (Config.TERMUX) {
      return;
    }
    try {
      heroku
        .get("/account")
        .then(async (account) => {
          const url = `https://api.heroku.com/accounts/${account.id}/actions/get-quota`;
          const headers = {
            "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
            Authorization: "Bearer " + Config.HEROKU_API_KEY,
            Accept: "application/vnd.heroku+json; version=3.account-quotas",
          };
          const res = await got(url, { headers });
          const resp = JSON.parse(res.body);
          const total_quota = Math.floor(resp.account_quota);
          const quota_used = Math.floor(resp.quota_used);
          const remaining = total_quota - quota_used;
          const quota = `Total Quota : ${secondsToDHMS(total_quota)}
Used  Quota : ${secondsToDHMS(quota_used)}
Remaning    : ${secondsToDHMS(remaining)}`;
          await message.reply("```" + quota + "```");
        })
        .catch(async (error) => {
          return await message.reply(`HEROKU : ${error.body.message}`);
        });
    } catch (error) {
      await message.reply(error);
    }
  }
);

izumi(
  {
    pattern: "setvar ?(.*)",
    fromMe: true,
    desc: "Set heroku env",
    type: "heroku",
  },
  async (message, text) => {
    if (Config.HEROKU) {
      if (text === '') return await message.send('```Either Key or Value is missing```');
      if ((varKey = text.split(':')[0]) && (varValue = text.replace(text.split(':')[0] + ":", ""))) {
        await heroku.patch(baseURI + '/config-vars', {
          body: {
            [varKey.toUpperCase()]: varValue
          }
        }).then(async () => {
          await message.send('Successfully Set ' + '```' + varKey + '➜' + varValue + '```');
        }).catch(async (error) => {
          await message.send(`HEROKU : ${error.body.message}`);
        });
      }
    } else if (Config.TERMUX) {
      if (!text.match(/^[^=:]+[=:]/)) {
        return await message.send('*Invalid match format.*\n_Please use the format *KEY:VALUE* or *KEY=VALUE*_');
      }

      let parts = text.split(/[=:]/);
      let key = parts[0].trim();
      let value = parts.slice(1).join('').trim();

      if (!value) {
        return await message.send('Please specify a new value');
      }

      let data = await fs.readFileSync('config.env', 'utf8');
      let lines = data.split('\n');
      let obj = {};

      lines.forEach(line => {
        let parts = line.split(/[=:]/);
        let k = parts[0].trim();
        let v = parts.slice(1).join('').trim();
        obj[k] = v;
      });

      obj[key] = value;
      let updatedData = Object.entries(obj).map(([k, v]) => `${k} = ${v}`).join('\n');

      await fs.writeFileSync('config.env', updatedData, 'utf8');
      await require('dotenv').config({ path: './config.env', override: true });

      await message.send(`_Updated *${key}* with value *${value}* in config.env file_`);
      await message.reply("_bot restarting wait for 30 seconds_");
      return require('pm2').restart('index.js');
    }
  }
);

izumi(
  {
    pattern: "delvar ?(.*)",
    fromMe: true,
    desc: "Delete Heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (!match) return await message.reply(`_Example: delvar sudo_`);

    if (Config.HEROKU) {
      heroku
        .get(baseURI + "/config-vars")
        .then(async (vars) => {
          const key = match.trim().toUpperCase();
          if (vars[key]) {
            await heroku.patch(baseURI + "/config-vars", {
              body: {
                [key]: null,
              },
            });
            return await message.reply(`_Deleted ${key}_`);
          }
          await message.reply(`_${key} not found_`);
        })
        .catch(async (error) => {
          await message.reply(`HEROKU : ${error.body.message}`);
        });
    } else if (Config.TERMUX) {
      let data = await fs.readFileSync('config.env', 'utf8');
      let lines = data.split('\n');
      let key = match.trim().toUpperCase();
      let newLines = lines.filter(line => !line.startsWith(key + '=') && !line.startsWith(key + ':'));

      if (newLines.length === lines.length) {
        return await message.send(`_Key *${key}* not found in config.env file_`);
      }

      await fs.writeFileSync('config.env', newLines.join('\n'), 'utf8');
      await require('dotenv').config({ path: './config.env', override: true });

      await message.send(`_Deleted *${key}* from config.env file_`);
      await message.reply("_bot restarting wait for 30 seconds_");
      return require('pm2').restart('index.js');
    }
  }
);
izumi(
  {
    pattern: "getvar ?(.*)",
    fromMe: true,
    desc: "Show heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (Config.HEROKU) {
      if (!match) return await message.reply(`_Example: getvar sudo_`);
      const key = match.trim().toUpperCase();
      heroku
        .get(baseURI + "/config-vars")
        .then(async (vars) => {
          if (vars[key]) {
            return await message.send(
              "_{} : {}_".replace("{}", key).replace("{}", vars[key])
            );
          }
          await message.reply(`${key} not found`);
        })
        .catch(async (error) => {
          await message.send(`HEROKU : ${error.body.message}`);
        });
    } else if (Config.TERMUX) {
      if (!match) {
        return await message.send('*Please specify a key*');
      }

      let data = await fs.readFileSync('config.env', 'utf8');
      let lines = data.split('\n');
      let obj = {};

      lines.forEach(line => {
        let parts = line.split(/[=:]/);
        let k = parts[0].trim();
        let v = parts.slice(1).join('').trim();
        obj[k] = v;
      });

      match = match.toUpperCase();
      let value = obj[match];

      if (!value) {
        return await message.send(`_Key *${match}* not found in config.env file_`);
      }

      return await message.send(`_${match}:${value}_`);
    }
  }
);

izumi(
  {
    pattern: "allvar$",
    fromMe: true,
    desc: "Heroku all env",
    type: "heroku",
  },
  async (message) => {
    if (Config.HEROKU) {
      let msg = "```Here your all Heroku vars\n\n\n";
      heroku
        .get(baseURI + "/config-vars")
        .then(async (keys) => {
          for (const key in keys) {
            msg += `${key} : ${keys[key]}\n\n`;
          }
          return await message.reply(msg + "```");
        })
        .catch(async (error) => {
          await message.reply(`HEROKU : ${error.body.message}`);
        });
    } else if (Config.TERMUX) {
      let data = await fs.readFileSync('config.env', 'utf8');
      let lines = data.split('\n');
      let obj = {};

      lines.forEach(line => {
        let parts = line.split(/[=:]/);
        let k = parts[0].trim();
        let v = parts.slice(1).join('').trim();
        obj[k] = v;
      });

      let str = Object.entries(obj).map(([k, v]) => `${k} = ${v}`).join('\n');
      return await message.send(`*All config vars:*\n${str}`);
    }
  }
);


izumi(
  {
    pattern: "update$",
    fromMe: true,
    desc: "Checks for update.",
  },
  async (message) => {
    await git.fetch();
    var commits = await git.log([Config.BRANCH + "..origin/" + Config.BRANCH]);
    if (commits.total === 0) {
      await message.reply("_Already on latest version_");
    } else {
      var updates = "* Update Available\n\n\n Changes:\n```";
      commits["all"].map((commit) => {
        updates +=
          "🔹 [" +
          commit.date.substring(0, 10) +
          "]: " +
          commit.message +
          " <" +
          commit.author_name +
          ">\n";
      });

      await message.reply(updates + "```");
    }
  }
);
izumi(
  {
    pattern: "update now$",
    fromMe: true,
    dontAddCommandList: true,
    desc: "Updates the izumi",
  },
  async (message) => {
    await git.fetch();
    var commits = await git.log([Config.BRANCH + "..origin/" + Config.BRANCH]);
    if (commits.total === 0) {
      return await message.reply("_Already on latest version_");
    } else {
      await message.reply("_Updating_");
      if (Config.HEROKU) {
        try {
          var app = await heroku.get("/apps/" + Config.HEROKU_APP_NAME);
        } catch {
          await message.reply("_Invalid Heroku Details_");
          await new Promise((r) => setTimeout(r, 1000));
        }

        git.fetch("upstream", Config.BRANCH);
        git.reset("hard", ["FETCH_HEAD"]);

        var git_url = app.git_url.replace(
          "https://",
          "https://api:" + Config.HEROKU_API_KEY + "@"
        );

        try {
          await git.addRemote("heroku", git_url);
        } catch {
          console.log("heroku remote error");
        }
        await git.push("heroku", Config.BRANCH);

        await message.reply("*_UPDATED_*");
        await message.reply("_bot restarting wait for 30 seconds_");
      } else {
        git.pull(async (err, update) => {
          if (update && update.summary.changes) {
            await message.reply("*_UPDATED_*");
            await message.reply("_bot restarting wait for some time_");
            exec("npm install").stderr.pipe(process.stderr);
            return require('pm2').restart('index.js');
          } else if (err) {
            await message.reply(
              "*❌ Update failed!*\n*Error:* ```" + err + "```"
            );
          }
        });
      }
    }
  }
);