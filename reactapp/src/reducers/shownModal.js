export default function(shownModal = false, action) {
    if(action.type == 'modalState') {
      var shownModalCopy = true;
      return shownModalCopy;
    } else {
      return shownModal;
    }
  }