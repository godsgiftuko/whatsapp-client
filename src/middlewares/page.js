const WHATSAPP_INIT = require("../whatsApp-api/app");
const utils = require("../utils/utils");
const fs = require("fs");
const { dirname } = require("path");
const QRCode = require("qrcode");


const appDir = dirname(require.main.filename);

// const Chats = require('../database/mongo/chats.schema');
const { Storage } = require("../utils/storage.handler");
const storage = Storage();



const landing = async (req, res) => {  
  try {
    const [isAuthenicated] = await storage.get({ table: 'sessions', order: false })
    // console.log(Object.keys(isAuthenicated));
    WHATSAPP_INIT();
  
    // res.render("home2")
    // const issession = await exists(); 
    if (!isAuthenicated) {
      res.render("home2", {
        title: "Message Client - Scan QR",
      })
      return
    }
    res.redirect("/messages");
    // !(await exists())
  } catch (error) {
    console.log(error);
    
  }
};

const messages = async (req, res) => {
  
  try {
    const [isAuthenicated] = await storage.get({ table: 'sessions', order: false })
    if (!isAuthenicated) {
      res.redirect("/");
      return
    }
    res.render("messages");
    
  } catch (error) {
    console.log(error);
    
  }
};

const getMessages = async (req, res) => {
  const [isAuthenicated] = await storage.get({ table: 'sessions', order: false })

  const getChats = await storage.get({ table:  'chats', delimiter: 'timestamp' });
  isAuthenicated ? res.json(getChats) : res.redirect("/");
};

const qrCode = async function (req, res) {
  try {
    if (req.xhr) {
      const src = "./public/images/generatedQR.png";
      const exists = await utils.fileExists(src);

      if (!exists) {
        WHATSAPP_INIT();
      } else {
        res.json({ url: src.split("./public")[1] });
      }
    }
  } catch (err) {
    res.json(err);
  }
};

const endSession = async function (req, res) {
  try {
    const isDeleted = await storage.delete({ table: 'sessions', col: 'sessionId', id: 0 })
    // fs.unlinkSync(sessionFile);
       WHATSAPP_INIT();

    if (isDeleted) {
      res.redirect("/");
    }

  } catch (err) {
    console.error(err);
  }
};

const deleteMsg = async function (req, res) {
  try {
    let status = 'Deleted'
    const deletechat = await storage.delete({ table: 'chats', col: 'msgId', id: req.params.ref });

    deletechat ?  status: status = 'Oops! Something went wrong. Try Again';
    res.send(status);
  } catch (error) {
      console.log(error)
  }
};

module.exports = {
  landing,
  qrCode,
  messages,
  getMessages,
  endSession,
  deleteMsg,
};
