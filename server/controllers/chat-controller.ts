const Chat = require('../datasets/chat');

export class ChatController {
  io;

  constructor(io) {
    this.io = io;
  }


  getChat(req, res) {
    const chat = req.body.arrayChat;
    Chat.findOne({participant: {$in: chat}}).exec((err, chat) => {
      chat.getMoreUserInfo(chat, function (user) {

      });
    });
  }

  postMessage(req, res) {
    const chatId = req.body.chatId;
    Chat.findById(chatId).exec((err, chat) => {

    });
  }

  deleteMessage(req, res) {
    const chatId = req.body.chatId, messageId = req.body.messageId;
    Chat.findById(chatId).exec((err, chat) => {
      if (err) {
        res.json(400).send(err);
      }
      chat.message.id(messageId).remove();
      chat.save(ok => {
        res.json(200).send('delete message ' + messageId);
      });

    });
  }

  updateMessage(req, res) {
    const chatId = req.body.arrayChat, messageId = req.body.message;
    Chat.findById(chatId).exec((err, chat) => {
      const msg = chat.message.id(messageId);
    });
  }

}
