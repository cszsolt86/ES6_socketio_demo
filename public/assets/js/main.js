
import ChatBox from './chat-box.js';

const chatService = io.connect('185.13.90.140:8081');

const chatBox = new ChatBox({
  deliverMessage: (nickname, message) => {
    chatService.emit('message', {user: nickname, message: message})
  }
});

chatService.on('message', (msg) => {
  (msg.user === 'echoBot2000' ? chatBox.confirmMessage(msg) : chatBox.receiveMessage(msg))
});



