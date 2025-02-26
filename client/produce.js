const productCard = document.getElementById("productCard");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");


document.addEventListener("DOMContentLoaded", function () {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.addEventListener("click", function () {
            // Fetch product details
            const productTitle = this.querySelector(".card-title").textContent;
            const productDescription = this.querySelector(".card-text").textContent;
            const productImage = this.querySelector(".card-img-top").src;

            // Update modal content
            document.getElementById("modalProductTitle").textContent = productTitle;
            document.getElementById("modalProductDescription").textContent = productDescription;
            document.getElementById("modalProductImage").src = productImage;

            // Show modal
            const productModal = new bootstrap.Modal(document.getElementById("productModal"));
            productModal.show();
        });
    });
});