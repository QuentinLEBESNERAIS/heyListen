export default function(email='', action) {
  if(action.type == 'saveEmail') {
    var emailCopy = action.email;
    console.log('email from reduceur-----', emailCopy)
    return emailCopy;
  } else if(action.type=="logOut") {
    return ""
  }else {
    return email;
  }
}