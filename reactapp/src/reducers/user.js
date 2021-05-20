export default function(user={}, action) {
  if(action.type == 'logUser') {
    var userCopy = {...user}
    userCopy = action.user;
    console.log('userCopy', userCopy)
    return userCopy;
  } else if(action.type=="logOut") {
    return ""
  } else {
    return user;
  }
}