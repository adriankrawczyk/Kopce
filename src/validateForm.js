function validateForm() {
  var email = document.getElementById("email");
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let isValid = true;
  if (!email.value.match(emailPattern)) {
    showError(email);
    isValid = false;
  }
  return isValid;
}
function showError(element) {
  element.style.color = "red";
  element.style.border = "3px solid red";
}
