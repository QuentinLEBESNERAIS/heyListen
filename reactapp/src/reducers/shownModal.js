export default function(shownModal = false, action) {
    if(action.type == 'modalState') {
      var shownModalCopy = action.shownModal;
      return shownModalCopy;
    } else {
      return shownModal;
    }
  }