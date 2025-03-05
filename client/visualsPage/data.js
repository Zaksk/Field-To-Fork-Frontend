const dataBtn = document.getElementById("dataBtn");

dataBtn.addEventListener("click", () => {
    window.location.assign("../shopPage/shop.html");
})

// Visuals API
const visualsApi =
  "http://ec2-13-41-205-113.eu-west-2.compute.amazonaws.com:5000/";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("visualsId").setAttribute("src", visualsApi);
});