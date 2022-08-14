require("dotenv").config();
const { connectMysql } = require("./src/database/mysql/mysql");
const whatsAPP = require("./src/whatsApp-api/app");
const { self } = require("./app");
const SYS_SPY = require("./watcher");

const { app, server, io } = self;

module.exports = new Promise((resolve, reject) => {
  const startApp = () => {
    return new Promise((resolve) => {
        server.listen(app.get("PORT"), () => {
          console.log(`Server running @${app.get("ENV")}`);
          return resolve(true);
        });
    });
  }

  const startDataBase = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const dataBase = await connectMysql;
  
        if (dataBase) {
          io.emit("status", {
            status: {
              db: dataBase ? true : false,
            },
          });
          return resolve(dataBase);
        }
        io.emit("disconnected", { msg: "disconnected" });
      } catch (error) {
        console.log(
          "Unable to create a database handshake. Please check configuration files."
        );
        return reject(false);
      }
    });
  }

  const startWhatsapp = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const service = await whatsAPP();
        return resolve(service);
      } catch (error) {
        console.log(
          "Unable to start whatsapp service. Please check whatsapp app file."
         , error );
        return reject(false);
      }
    })
  }

  Promise.all([startDataBase(), startWhatsapp()])
    .then((services) => {
      const [dataBase, whatsapp ] = services
      const newAuth = 'hadSession' in whatsapp;

      SYS_SPY({ server, io, dataBase, newAuth});
      startApp();

      io.emit('ISSESSION', { state: newAuth })
      return resolve(services);
    })
    .catch((err) => {
      console.log(err, 'Unable to start services...');
      return  reject(err);
    });
});
