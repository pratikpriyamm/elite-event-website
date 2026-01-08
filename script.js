// 1. Initialize Animations (AOS)
AOS.init({
    duration: 1200, // Animation lasts 1.2 seconds
    once: false,    // CHANGE: 'false' means it animates EVERY time you scroll to it
    mirror: true    // CHANGE: This makes elements animate out when you scroll past them
});

// 2. Scroll to Contact Section
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 3. Handle Form Submission
// 3. Handle Contact Form Submission (Connects to Email)
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Stop page from refreshing
    
    const submitButton = this.querySelector('button');
    const originalText = submitButton.innerText;

    // 1. Change button text to show loading
    submitButton.innerText = "Sending...";
    submitButton.disabled = true;

    // 2. Collect the form data
    const formData = new FormData(this);

    try {
        // 3. Send data to FormSubmit (Your Email Service)
        const response = await fetch("https://formsubmit.co/ajax/cricketx718@gmail.com", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            // Success!
            alert("Thank you! Your message has been sent successfully.");
            this.reset(); // Clear the form
        } else {
            // Something went wrong
            alert("Oops! Something went wrong. Please try again.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Network error. Please check your connection.");
    } finally {
        // 4. Reset button text
        submitButton.innerText = originalText;
        submitButton.disabled = false;
    }
});
/* --- GALLERY DATA & LOGIC --- */

// 1. Define your photo albums here
// Replace these placeholder URLs with your actual image paths later (e.g., 'images/wedding1.jpg')
const albums = {
    wedding: [
        "https://source.unsplash.com/random/800x600/?wedding,bride",
        "https://source.unsplash.com/random/800x600/?wedding,groom",
        "https://source.unsplash.com/random/800x600/?wedding,cake",
        "https://source.unsplash.com/random/800x600/?wedding,flowers"
    ],
    corporate: [
        "https://source.unsplash.com/random/800x600/?conference",
        "https://source.unsplash.com/random/800x600/?office,meeting",
        "https://source.unsplash.com/random/800x600/?speech",
        "https://source.unsplash.com/random/800x600/?handshake"
    ],
    party: [
        "https://source.unsplash.com/random/800x600/?concert",
        "https://source.unsplash.com/random/800x600/?club,lights",
        "https://source.unsplash.com/random/800x600/?dj",
        "https://source.unsplash.com/random/800x600/?drinks"
    ]
};

let currentAlbum = [];
let currentIndex = 0;

// 2. Function to Open Gallery
async function openGallery(category) {
    const modal = document.getElementById("galleryModal");
    const imgElement = document.getElementById("galleryImage");
    const caption = document.getElementById("caption");

    caption.innerHTML = "Loading...";
    modal.style.display = "block";

    try {
        // Ask Python for the list
        const response = await fetch(`/api/photos/${category}`);
        const fileNames = await response.json();

        if (fileNames.length === 0) {
            alert("No images found in the " + category + " folder!");
            modal.style.display = "none";
            return;
        }

        // BUILD THE PATH: 
        // Before it was 'public/images', now it is just 'images/'
        currentAlbum = fileNames.map(fileName => `images/${category}/${fileName}`);
        
        currentIndex = 0; 
        imgElement.src = currentAlbum[currentIndex];
        caption.innerHTML = category.toUpperCase() + " GALLERY";

    } catch (error) {
        console.error("Error:", error);
        modal.style.display = "none";
    }
}

// 3. Function to Close Gallery
function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
}

// 4. Function to Change Image (Next/Prev)
function changeImage(direction) {
    currentIndex += direction;

    // Loop back to start if at the end
    if (currentIndex >= currentAlbum.length) {
        currentIndex = 0;
    }
    // Loop to end if at the start
    if (currentIndex < 0) {
        currentIndex = currentAlbum.length - 1;
    }

    // Update the image
    document.getElementById("galleryImage").src = currentAlbum[currentIndex];
    document.getElementById("caption").innerHTML = " GALLERY - Image " + (currentIndex + 1);
}

// 5. Close Modal if user clicks outside the image
window.onclick = function(event) {
    const modal = document.getElementById("galleryModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
/* --- LIVE COVER SLIDESHOW LOGIC --- */

// The list of categories to animate
const categories = ['wedding', 'corporate', 'party', 'fabrication', 'sports'];

// Function to start rotating images for a specific category
async function startCategorySlideshow(category) {
    try {
        // 1. Get the list of images from Python
        const response = await fetch(`/api/photos/${category}`);
        const files = await response.json();

        // If there are less than 2 images, don't bother rotating
        if (files.length < 2) return;

        // 2. Find the HTML image tag
        const imgElement = document.getElementById(`cover-${category}`);
        if (!imgElement) return;

        let i = 0;

        // 3. Start the Timer (Every 3000ms = 3 seconds)
        setInterval(() => {
            i++; 
            // Loop back to 0 if we reach the end
            if (i >= files.length) {
                i = 0;
            }
            
            // Update the image source
            // Note: We use the Python file list directly
            imgElement.src = `images/${category}/${files[i]}`;
            
        }, 3000);

    } catch (error) {
        console.error(`Could not start slideshow for ${category}`, error);
    }
}

// Run this loop for every category when page loads
categories.forEach(cat => startCategorySlideshow(cat));
