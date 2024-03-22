export default class MessageModel {
  constructor(sender: string, content: string, timestamp: Date) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  }
  sender: string;
  content: string;
  timestamp: Date;
}
