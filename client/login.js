document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password")
        })
    }

    const response = await fetch("", options);
    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem("token", data.token)
        window.location.assign("products.html")
    } else {
        alert(data.error);
    }
})