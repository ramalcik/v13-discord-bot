const allah = require("./config.json");

module.exports = {

  apps: [
    {
      name: `${allah.ServerName} Moderation`,
      namespace: `papaz#1000`,
      script: "papaz.js",
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Papaz-Bots/Papaz-Main",
    },
    {
      name: `${allah.ServerName} Guard`,
      namespace: `papaz#1000`,
      script: "papaz.js",
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Papaz-Bots/Papaz-Guard/Papaz-Guard-I",
    },
    {
      name: `${allah.ServerName} Guard2`,
      namespace: `papaz#1000`,
      script: "papaz.js",
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Papaz-Bots/Papaz-Guard/Papaz-Guard-II",
    },
    {
      name: `${allah.ServerName} Guard3`,
      namespace: `papaz#1000`,
      script: "papaz.js",
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Papaz-Bots/Papaz-Guard/Papaz-Guard-III",
    },
    {
      name: `${allah.ServerName} Register`,
      namespace: `papaz#1000`,
      script: "papaz.js",
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Papaz-Bots/Papaz-Register",
    },
  {
    name: `${allah.ServerName} Stat`,
    namespace: `papaz#1000`,
    script: "papaz.js",
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Papaz-Bots/Papaz-Statistics",
  },
  ]
};