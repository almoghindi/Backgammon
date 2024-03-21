export default class MessageModel {
  constructor(sender: string, content: string, timestamp: string) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  }
  sender: string;
  content: string;
  timestamp: string;
}
