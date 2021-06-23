export default function(email='', action) {
  if(action.type == 'saveEmail') {
    var emailCopy = action.email;
    return emailCopy;
  } else if(action.type=="logOut") {
    return ""
  }else {
    return email;
  }
}