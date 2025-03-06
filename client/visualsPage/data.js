const dataBtn = document.getElementById("dataBtn");

dataBtn.addEventListener("click", () => {
    window.location.assign("../shopPage/shop.html");
})

// Visuals API
const visualsApi = `https://${baseAddress}:667/`;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("visualsId").setAttribute("src", visualsApi);
});