//@ts-check
import { createDomElement } from './dom-utils.js';

export default class ChatBox {

  constructor({
    deliverMessage = (message, nickname) => console.error('ChatBox.deliverMessage wasn\'t set. Send failed')
  }) {

    /*
      Reference of dom nodes required
    */
    const rootElement = window.document.getElementById('chat-box');
   
    const [messageInput, nickInput, sendButton] = ['.message-input', '.nick-input', '.send-button'].map(
      selector => rootElement.querySelector(selector)
    );

    this.messageList = rootElement.querySelector('.message-list');

    const attemptDelivery = (nick, message) => {
      //exit if the message is empty
      if (message.trim() === '') return; 

      //append message list, apply appropriate settings
      ((element) => {
        element.className = 'sent pending';
        setTimeout(this.deliveryFailed.bind(this, element), 30000);
      })( this.appendMessageList(message, nick) )

      try {
        deliverMessage(nick, message);
      } catch(error) {
        console.log(`Delivery of message "${message}" failed:\n`, error);
        //execution can continue if delivery fails
      }

      messageInput.value = '';
      messageInput.focus();
    }

    /*
      Attempt to deliver message on 'Send' button click 
    */
    sendButton.addEventListener('click', (event) => {
      attemptDelivery(nickInput.value, messageInput.value);
    })

    /*
      Attempt to deliver message on enter 
    */
    messageInput.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) { 
        attemptDelivery(nickInput.value, messageInput.value);
        return false;
      }
    }) 

    /*
      Set focus to the message input, when the call stack is empty 
    */
    setTimeout(() => {
      messageInput.focus()
    }, 0);
  }

  /*
    Mark message as failed, after 30sec without echo
    Triggered in constructor()::attemptDelivery() 
  */
  deliveryFailed(element) {
    if (element.classList.contains('pending')) {
      element.classList.add('failed');
      element.classList.remove('pending');
    }
  }

  /*
    Append list with message, and scroll down
  */
  appendMessageList(message, from) {
    const messageElement = createDomElement({
      tagName: 'li',
      attribs: {
        nickname: from
      }
    });
    messageElement.textContent = message;
    this.messageList.appendChild(messageElement);
    this.messageList.scrollTo(0, this.messageList.scrollHeight);
    return messageElement;
  }

  /*
    Clear the pending state, if the appropriate echo was received
    Triggered externally
    Param: object received by socket.io on 'message' event
  */
  confirmMessage({ message }) {    
    let feedback;
    for (const Node of this.messageList.querySelectorAll('.sent.pending')) {
      feedback = `${Node.getAttribute('nickname')} sent a message with content: ${Node.textContent}`; 
      if (message === feedback) return Node.classList.remove('pending');
    }
  }
  
  /*
    Append list with message received 
    Triggerd externally
    Param: object received by socket.io on 'message' event
  */
  receiveMessage({user, message}) {
    this.appendMessageList(message, user).className = 'received';
  }
}