document.addEventListener("DOMContentLoaded", () => {
    // Image flipping
    const flipCard = document.getElementById("flip-card");
    flipCard.addEventListener("click", () => {
        flipCard.classList.toggle("flipped");
    });

    // Modal functionality
    const modal = document.getElementById("modal");
    const rsvpBtn = document.getElementById("rsvp-btn");
    const closeModal = document.getElementById("close");
    const stageContainer = document.getElementById("stage-container");
    const prevBtn = document.getElementById("prev-btn");

    let currentStage = 0;
    const formData = {
        firstName: "",
        lastName: "",
        whatsappNumber: "",
    };

    const stages = [
        `
        <p>Please continue to confirm your attendance or to decline:</p>
        <button id="continue-btn" class="btn">Continue</button>
      `,
        `
        <p>Please enter your first and last name:</p>
        <form id="stage-form">
            <div class="stage-form-inputs">
                <input id="first-name" type="text" placeholder="First Name" required>
                <input id="last-name" type="text" placeholder="Last Name" required>
            </div>
            <button id="continue-btn" class="btn" type="submit">Continue</button>
        </form>
      `,
        `
        <p>Please enter your WhatsApp number:</p>
        <form id="stage-form">
            <input id="whatsapp-number" type="tel" placeholder="WhatsApp Number" required>
            <button id="continue-btn" class="btn" type="submit">Continue</button>
        </form>
      `,
        `
        <p>Thank you for your RSVP submission! An invite will be sent to you shortly.</p>
      `,
    ];

    // Update modal content
    function updateModal() {
        stageContainer.innerHTML = stages[currentStage];

        // Hide Previous button on first and last stages
        prevBtn.style.display = currentStage === 0 || currentStage === stages.length - 1 ? "none" : "inline-block";

        // Add functionality for the "Continue" button
        const form = document.getElementById("stage-form");
        const continueBtn = document.getElementById("continue-btn");

        if (form) {
            // Handle form submissions for stages with input
            form.addEventListener("submit", (event) => {
                event.preventDefault(); // Prevent form submission to allow stage progression

                // Store form data
                if (currentStage === 1) {
                    formData.firstName = document.getElementById("first-name").value;
                    formData.lastName = document.getElementById("last-name").value;
                } else if (currentStage === 2) {
                    formData.whatsappNumber = document.getElementById("whatsapp-number").value;
                }

                // Proceed to next stage
                currentStage++;
                updateModal();
            });
        } else if (continueBtn) {
            continueBtn.addEventListener("click", () => {
                // Handle continue button click for stages without form
                currentStage++;
                updateModal();
            });
        }

        // Populate fields with saved data when navigating back
        if (currentStage === 1) {
            document.getElementById("first-name").value = formData.firstName;
            document.getElementById("last-name").value = formData.lastName;
        } else if (currentStage === 2) {
            document.getElementById("whatsapp-number").value = formData.whatsappNumber;
        }
    }

    // Open modal
    rsvpBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        currentStage = 0; // Reset to the first stage whenever the modal is opened
        updateModal();
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Navigate back
    prevBtn.addEventListener("click", () => {
        if (currentStage > 0) {
            currentStage--;
            updateModal();
        }
    });

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
