const hound = require("hound");
const { dirname, join } = require("path");
const fs = require("fs");
const appDir = dirname(require.main.filename);
const utils = require("./src/utils/utils");

const qrPath = appDir + "/public/images";
const qrCode = qrPath + "/generatedQR.png";
const QR = hound.watch(qrPath);
const ENV = hound.watch(appDir + "/.env");

module.exports = ({ server, io, dataBase, newAuth }) => {
  // (async () => {
  //   try {
  //     if (newAuth) {
  //       const exists = await utils.fileExists("./session.json");
  //       const findQrcode = await utils.fileExists(qrCode);

  //       if (!exists && findQrcode) {
  //         try {
  //           fs.unlinkSync(qrCode);
  //           //file removed
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })();

  QR.on("create", function (file, stats) {
    const bitmap = fs.readFileSync(file);
    const bit = new Buffer.from(bitmap).toString("base64");

    io.emit("qr_Created", { src: file, status: "created" });
  });

  QR.on("change", function (file, stats) {
    const bitmap = fs.readFileSync(file);
    const bit = new Buffer.from(bitmap).toString("base64");

    io.emit("qr_Updated", { src: bit });
  });

  // Environment Variables
  ENV.on("change", function (file, stats) {
    // console.log("Changes occured", process.pid);
    server.close((err) => {
      dataBase.end();
      const boot = require("./boot");

      setTimeout(() => {
        boot
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
      }, 3000);
    });
  });
};
