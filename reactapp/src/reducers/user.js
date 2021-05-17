export default function(user=null, action) {
    if(action.type == 'logUser') {
      console.log("action.user", action.user)
        var userCopy = action.user;
        return userCopy;
    }else if(action.type=="logOut"){
      return ""
    } else {
        return user;
      }
  }