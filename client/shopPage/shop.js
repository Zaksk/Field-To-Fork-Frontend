const productCard = document.getElementById("productCard");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDescription");

// Display the card when clicked
document.addEventListener("DOMContentLoaded", function () {
    // Use event delegation to handle clicks on product cards
    document.getElementById("productContainer").addEventListener("click", function (event) {
        // Check if the clicked element or its parent is a product card
        const productCard = event.target.closest(".product-card");
        if (productCard) {
            let productTitle, productDescription, productImage;

            // Get data from the clicked product card
            productTitle = productCard.querySelector(".product-title").textContent;
            productDescription = productCard.querySelector(".product-description").textContent;
            productImage = productCard.querySelector(".product-image").src || "../client/assets/default-product.jpg;
            // Update modal content
            document.getElementById("modalProductTitle").textContent = productTitle;
            document.getElementById("modalProductDescription").textContent = productDescription;
            document.getElementById("modalProductImage").src = productImage;

            // Show modal
            const productModal = new bootstrap.Modal(document.getElementById("productModal"));
            productModal.show();
        }
    });
});

// jQuery for filtering with radio buttons
$(document).ready(function() {
    // Function to filter products based on the selected category
    function filterSelection(category) {
        if (category === 'all') {
            $('.product-card').show(); // Show all products
        } else {
            $('.product-card').hide(); // Hide all products
            $('.product-card[data-category="' + category + '"]').show(); // Show products of the selected category
        }
    }

    // Event listener for radio button change
    $('input[type="radio"][name="product"]').change(function() {
        var selectedCategory = $(this).val(); // Get the value of the selected radio button
        filterSelection(selectedCategory); // Filter products
    });

    // Initial filter to show all products
    filterSelection('all');
});

// Add search functionality
$(document).ready(function() {
    // Function to filter products based on search input
    function filterProducts(searchTerm) {
        searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive comparison

        $('.product-card').each(function() {
            var productTitle = $(this).find('.product-title').text().toLowerCase(); // Get the product title

            // Show or hide the product card based on whether the title matches the search term
            if (productTitle.includes(searchTerm)) {
                $(this).show(); // Show the card if the title matches
            } else {
                $(this).hide(); // Hide the card if the title does not match
            }
        });
    }

    // Event listener for the search box input
    $('#searchBox').on('input', function(event) {
        event.preventDefault(); // Prevent form submission
        var searchTerm = $(this).val(); // Get the value of the search box
        filterProducts(searchTerm); // Filter products based on the search term
    });
});




//C-- Add Product form
document.addEventListener("DOMContentLoaded", function () {
    const addProductBtn = document.querySelector(".add-product-btn");
    const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));

    addProductBtn.addEventListener("click", function () {
        addProductModal.show();
    });
});

// C-- Upload image to Add Product form
document.addEventListener("DOMContentLoaded", function () {
    const productImageInput = document.getElementById("product-Image");
    const imagePreview = document.getElementById("imagePreview");

    productImageInput.addEventListener("change", function (event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result; // Set preview image source
                imagePreview.classList.remove("d-none"); // Show preview
            };

            reader.readAsDataURL(file); // Convert file to Data URL for preview
        }
    });
});
