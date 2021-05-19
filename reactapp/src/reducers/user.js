export default function(user=null, action) {
  if(action.type == 'logUser') {
    var userCopy = action.user;
    return userCopy;
  } else if(action.type=="logOut") {
    return ""
  } else {
    return user;
  }
}