document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: form.get("email"),
            password_hash: form.get("password")
        })
    };

    const response = await fetch("https://field-to-fork-backend.onrender.com/users/login", options);
    const data = await response.json();
    console.log(data)

    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.assign("../shopPage/shop.html");
    } else {
        alert(data.error);
    }
});
