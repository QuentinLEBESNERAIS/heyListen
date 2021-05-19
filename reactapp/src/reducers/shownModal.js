export default function(shownModal = false, action) {
    if(action.type == 'modalState') {
      var shownModalCopy = true;
      return shownModalCopy;
    } else if(action.type=="logOut") {
      return false
    }else {
      return shownModal;
    }
  }