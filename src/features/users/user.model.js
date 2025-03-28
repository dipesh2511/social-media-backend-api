import { profile } from "console";

export default class UserModel {
  constructor(
    username,
    email,
    password,
    firstName,
    lastName,
    profilePicture,
    bio
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profilePicture = profilePicture;
    this.bio = bio;
  }

  // secure paths started here
  static getDetails() {}

  static getAllDetails() {}

  static updateDetails() {}

  static logout() {}

  static logoutAllDevices() {}

  // secure paths ended here

  // not secure path started here

  static signUp(
    username,
    email,
    password,
    firstName = null,
    lastName = null,
    profilePicture = null,
    bio = null
  ) {
    let new_user = new UserModel(
      username,
      email,
      password,
      firstName,
      lastName,
      profilePicture,
      bio
    );

    return new_user;
  }

  static signIn() {}

  // not secure path ended here
}
