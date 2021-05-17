export default function(email='', action) {
  if(action.type == 'saveEmail') {
    console.log('action.email', action.email)
      var emailCopy = action.email;
      return emailCopy;
     } else {
      return email;
    }
}