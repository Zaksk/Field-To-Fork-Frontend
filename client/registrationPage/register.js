document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    
    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: form.get("fullname"),
            username: form.get("username"),
            email: form.get("email"),
            postcode: form.get("postcode"),
            password_hash: form.get("password")
        })
    };

    const response = await fetch("https://field-to-fork-backend.onrender.com/users/register", options);
    const data = await response.json();
    
    if (response.ok) {
        window.location.assign("../loginPage/login.html");

    } else {
        alert(data.error);
    }



    
});