// Look for Enter
function lookForEnter(){
  var input = document.getElementById("searchInput");
  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function(event) {
    // Number 13 === "Enter" key
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      search(input.value)
    }
  });
}
// Search Redirections
function search(input){
  if(input.indexOf('announced:') >= 0){
    window.location.href = apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+input.slice(input.indexOf('announced:')+10, input.length)
  } else if(input.indexOf('[') >= 0 && input.indexOf(']:') >= 0){
    window.location.href = apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+input;
  } else if(input.indexOf(']') >= 0){
    window.location.href = apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+input+':8123';
  } else if(input.indexOf(':') >= 0){
    window.location.href = apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+input;
  } else {
    window.location.href = apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+input+':8123';
  }
}
