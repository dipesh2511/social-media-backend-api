export class UserPayloadClass {
  constructor(username, email, user_id) {
    this.username = username;
    this.email = email;
    this.user_id = user_id;
  }

  static createUserPayload(username, email, user_id) {
    let userpayload = new UserPayloadClass(username, email, user_id);
    return userpayload;
  }
}
