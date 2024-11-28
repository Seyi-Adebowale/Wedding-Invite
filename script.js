document.addEventListener("DOMContentLoaded", () => {
    // Initialize Email.js with your user ID
    emailjs.init("6eNgKWpaKhACrc40u");  

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
        guest1: "",
        guest2: "",
    };

    const stages = [
        ` 
        <p>Please confirm if you will attend</p>
        <div class="attend-btns">
            <button id="yes-btn" class="btn">Yes</button>
            <button id="no-btn" class="btn">No</button>
        </div>
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
        <p>Add Guests (Maximum of 2)</p>
        <form id="stage-form">
            <div class="stage-form-inputs">
                <input id="guest1" type="text" placeholder="Guest 1 Full Name">
                <input id="guest2" type="text" placeholder="Guest 2 Full Name">
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
        `
        <p>You have already completed this process.</p>
      `
    ];

    // Check if the user has already completed the process
    function hasCompletedRSVP() {
        return getCookie("rsvpCompleted") === "true";
    }

    // Set a cookie to mark the form as completed
    function setRSVPCompleted() {
        setCookie("rsvpCompleted", "true", 7); // Cookie expires in 7 days
    }

    // Set a cookie with a specified name and value
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiry in days
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Get a cookie value by its name
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Update modal content
    function updateModal() {
        if (hasCompletedRSVP()) {
            // If user has already completed the process, show "You have already completed this process"
            stageContainer.innerHTML = stages[stages.length - 1]; // Show the last stage (completed message)
            prevBtn.style.display = "none"; // Hide "Previous" button on this stage
        } else {
            // Show the appropriate stage
            stageContainer.innerHTML = stages[currentStage];

            // Hide Previous button on first and last stages
            prevBtn.style.display = currentStage === 0 || currentStage === stages.length - 2 ? "none" : "inline-block";

            // Handle button clicks for "Yes" and "No" in Stage 1
            if (currentStage === 0) {
                const yesBtn = document.getElementById("yes-btn");
                const noBtn = document.getElementById("no-btn");

                yesBtn.addEventListener("click", () => {
                    // Proceed to next stage (Stage 2)
                    currentStage++;
                    updateModal();
                });

                noBtn.addEventListener("click", () => {
                    // Close the modal if "No" is clicked
                    modal.style.display = "none";
                });
            }

            // Add functionality for the "Continue" button in other stages
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
                        formData.guest1 = document.getElementById("guest1").value;
                        formData.guest2 = document.getElementById("guest2").value;
                    } else if (currentStage === 3) {
                        formData.whatsappNumber = document.getElementById("whatsapp-number").value;
                    }

                    // If it's the final stage, send the email
                    if (currentStage === 3) {
                        sendEmail();
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
                document.getElementById("guest1").value = formData.guest1;
                document.getElementById("guest2").value = formData.guest2;
            } else if (currentStage === 3) {
                document.getElementById("whatsapp-number").value = formData.whatsappNumber;
            }
        }
    }

    // Open modal
    rsvpBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        currentStage = 0; // Reset to the first stage whenever the modal is opened
        updateModal();
    });

    // Close modal and clear saved data
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        // Clear form data when the modal is closed
        formData.firstName = "";
        formData.lastName = "";
        formData.whatsappNumber = "";
        formData.guest1 = "";
        formData.guest2 = "";
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
            // Clear form data when the modal is closed
            formData.firstName = "";
            formData.lastName = "";
            formData.whatsappNumber = "";
            formData.guest1 = "";
            formData.guest2 = "";
        }
    });

    // Function to send email using Email.js
    function sendEmail() {
        // Prepare email data
        const emailData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            whatsapp_number: formData.whatsappNumber,
            guest1: formData.guest1 || "None", 
            guest2: formData.guest2 || "None", 
        };

        // Send the email
        emailjs.send("service_8liafng", "template_awplail", emailData)
            .then((response) => {
                // console.log("RSVP email sent successfully:", response);
                setRSVPCompleted(); // Mark as completed
                // Show the confirmation message after sending the email
                stageContainer.innerHTML = stages[4];
            })
            .catch((error) => {
                console.error("Error sending RSVP email:", error);
            });
    }
});
