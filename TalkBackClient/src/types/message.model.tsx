export default class MessageModel {
  constructor(
    sender: string,
    content: string,
    timestamp: Date,
    messageId: string
  ) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
    this.messageId = messageId;
    this.isSent = false;
    this.isError = false;
  }
  messageId: string;
  sender: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean = false;
  isSent: boolean;
  isError: boolean;
}
