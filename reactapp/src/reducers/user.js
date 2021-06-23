export default function(user={}, action) {
  if(action.type == 'logUser') {
    var userCopy = {...user}
    userCopy = action.user;
    return userCopy;
  } else if(action.type=="logOut") {
    return ""
  } else {
    return user;
  }
}