import BaseModel from "@/machine/core/BaseModel";

// interface for UserModel
interface IUserModel {
  
}

class UserModel extends BaseModel implements IUserModel {

  state() {
    return {
      userStatus: '',
    }
  }

  // 
  login() {

  }

  logout() {

  }

}

export default UserModel;