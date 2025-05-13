const SqlConnection

document.getElementById("SignInButton").addEventListener("click", () => {
    const username = document.getElementById("SignIn").value;
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;

    if (password !== passwordRepeat) {
        alert("Passwords do not match.");
        return;
    }

    const data = {
        username: username,
        password: password
    };
});