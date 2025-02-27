document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const form = new FormData(e.target)
    const password = document.getElementById("password").ariaValueMax;
    const confirmPassword = document.getElementById("confirmPassword");

    if (password !== confirmPassword) {
        alert("Passwords entered do not match!");
        return;
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get("fullname"),
            email: form.get("email"),
            password: password
        })
    }

    const response = await fetch("", options);
    const data = await response.json()

    if (response.status == 201) {
        window.location.assign("./loginPage/login.html");
    } else {
        alert(data.error);
    }
})