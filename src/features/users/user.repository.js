import mongoose from "mongoose";
import { UserSchema } from "./user.schema.js";

export default class UserRepository{
    constructor() {
        this.userModel = mongoose.model('users',UserSchema);
    }
    
      // secure paths started here
      async getDetails() {}
    
      async getAllDetails() {}
    
      async updateDetails() {}
    
      async logout() {}
    
      async logoutAllDevices() {}
    
      // secure paths ended here
    
    
      // not secure path started here
      
      async signUp(){
        
      }
    
      async signIn(){
    
      }
      
      // not secure path ended here
}