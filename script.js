// Page Navigation
        document.addEventListener('DOMContentLoaded', function() {
            const homePage = document.getElementById('home-page');
            const donationFormPage = document.getElementById('donation-form-page');
            const donateFoodBtn = document.getElementById('donate-food-btn');
            const homepageLogo = document.getElementById('homepageLogo');
            const homeLink = document.getElementById('footerHomeLink');
            const returnHomeBtn = document.getElementById('returnHomeBtn');
            
            // Show donation form when "Donate Food" is clicked
            donateFoodBtn.addEventListener('click', function(e) {
                e.preventDefault();
                homePage.classList.add('hidden');
                donationFormPage.classList.remove('hidden');
                window.scrollTo(0, 0);
            });
            
            // Return to home page
            function showHomePage() {
                homePage.classList.remove('hidden');
                donationFormPage.classList.add('hidden');
                window.scrollTo(0, 0);
            }
            
            homepageLogo.addEventListener('click', function(e) {
                e.preventDefault();
                showHomePage();
            });
            
            homeLink.addEventListener('click', function(e) {
                e.preventDefault();
                showHomePage();
            });
            
            returnHomeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showHomePage();
                resetForm();
            });
            
            // Mobile menu toggle
            document.querySelector('.menu-toggle').addEventListener('click', function() {
                this.classList.toggle('active');
                document.querySelector('.nav-links').classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    document.querySelector('.menu-toggle').classList.remove('active');
                    document.querySelector('.nav-links').classList.remove('active');
                    
                    // If it's a home page link, show home page
                    if (link.getAttribute('data-page') === 'home') {
                        showHomePage();
                    }
                });
            });

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if(targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Add active class to nav links based on scroll position
            window.addEventListener('scroll', () => {
                let current = '';
                const sections = document.querySelectorAll('section');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if(scrollY >= (sectionTop - 100)) {
                        current = section.getAttribute('id');
                    }
                });
                
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });

            // Animation on scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.animate').forEach(el => {
                observer.observe(el);
            });

            // Header background on scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    document.querySelector('header').style.background = 'rgba(255, 255, 255, 0.95)';
                    document.querySelector('header').style.backdropFilter = 'blur(10px)';
                } else {
                    document.querySelector('header').style.background = 'white';
                    document.querySelector('header').style.backdropFilter = 'none';
                }
            });

            // Donation Form Functionality
            const form = document.getElementById('donationForm');
            const steps = document.querySelectorAll('.form-section');
            const progressSteps = document.querySelectorAll('.progress-step');
            const nextButtons = document.querySelectorAll('.next-step');
            const prevButtons = document.querySelectorAll('.prev-step');
            const editButtons = document.querySelectorAll('.edit-btn');
            const pickupOptions = document.querySelectorAll('.pickup-option');
            const newDonationBtn = document.getElementById('newDonationBtn');
            const submitDonationBtn = document.getElementById('submitDonationBtn');
            let currentStep = 0;
            
            // Initialize form
            showStep(currentStep);
            updateProgressBar();
            
            // Next button click handler
            nextButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (validateStep(currentStep)) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgressBar();
                        updateSummary();
                    }
                });
            });
            
            // Previous button click handler
            prevButtons.forEach(button => {
                button.addEventListener('click', function() {
                    currentStep--;
                    showStep(currentStep);
                    updateProgressBar();
                });
            });
            
            // Edit button click handler
            editButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const stepToEdit = this.getAttribute('data-step');
                    const stepIndex = Array.from(steps).findIndex(step => step.id === stepToEdit);
                    if (stepIndex !== -1) {
                        currentStep = stepIndex;
                        showStep(currentStep);
                        updateProgressBar();
                    }
                });
            });
            
            // Pickup option selection
            pickupOptions.forEach(option => {
                option.addEventListener('click', function() {
                    pickupOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate the current step (step 4)
                if (validateStep(currentStep)) {
                    // Show loading state
                    submitDonationBtn.innerHTML = '<div class="loading"></div> Submitting...';
                    submitDonationBtn.disabled = true;
                    
                    // Simulate API call with timeout
                    setTimeout(function() {
                        // Show confirmation
                        document.getElementById('confirmation').classList.add('active');
                        steps[currentStep].classList.remove('active');
                        
                        // Update progress bar to complete
                        progressSteps.forEach(step => {
                            step.classList.add('step-complete');
                            step.classList.remove('step-active');
                        });
                        
                        // Update progress bar to 100%
                        document.getElementById('progressBar').style.setProperty('--progress-width', '100%');
                        
                        // Reset button state
                        submitDonationBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Donation';
                        submitDonationBtn.disabled = false;
                    }, 2000); // 2 second delay to simulate API call
                }
            });
            
            // New donation button
            newDonationBtn.addEventListener('click', function() {
                resetForm();
            });
            
            // Reset form function
            function resetForm() {
                form.reset();
                currentStep = 0;
                showStep(currentStep);
                updateProgressBar();
                
                // Reset progress steps
                progressSteps.forEach((step, index) => {
                    step.classList.remove('step-complete');
                    if (index === 0) {
                        step.classList.add('step-active');
                    } else {
                        step.classList.remove('step-active');
                    }
                });
                
                // Reset pickup options
                pickupOptions.forEach(opt => opt.classList.remove('selected'));
                document.querySelector('.pickup-option.urgency-medium').classList.add('selected');
                
                // Reset progress bar width
                document.getElementById('progressBar').style.setProperty('--progress-width', '0%');
                
                // Clear any error states
                document.querySelectorAll('.error').forEach(el => {
                    el.classList.remove('error');
                });
            }
            
            // Show the current step
            function showStep(stepIndex) {
                steps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });
            }
            
            // Update progress bar
            function updateProgressBar() {
                const progressWidth = (currentStep / (steps.length - 2)) * 100;
                document.getElementById('progressBar').style.setProperty('--progress-width', `${progressWidth}%`);
                
                progressSteps.forEach((step, index) => {
                    if (index < currentStep) {
                        step.classList.add('step-complete');
                        step.classList.remove('step-active');
                    } else if (index === currentStep) {
                        step.classList.add('step-active');
                        step.classList.remove('step-complete');
                    } else {
                        step.classList.remove('step-active', 'step-complete');
                    }
                });
            }
            
            // Validate current step
            function validateStep(stepIndex) {
                const currentStepElement = steps[stepIndex];
                const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;
                
                // Clear previous errors
                currentStepElement.querySelectorAll('.error').forEach(el => {
                    el.classList.remove('error');
                });
                
                inputs.forEach(input => {
                    let fieldValid = true;
                    
                    // Special handling for checkboxes
                    if (input.type === 'checkbox') {
                        if (!input.checked) {
                            fieldValid = false;
                        }
                    } 
                    // Special handling for select elements
                    else if (input.tagName === 'SELECT') {
                        if (!input.value) {
                            fieldValid = false;
                        }
                    }
                    // For other input types
                    else {
                        if (!input.value.trim()) {
                            fieldValid = false;
                        }
                    }
                    
                    if (!fieldValid) {
                        isValid = false;
                        input.classList.add('error');
                    }
                });
                
                // Special validation for step 3 (pickup urgency)
                if (stepIndex === 2) {
                    const selectedUrgency = document.querySelector('.pickup-option.selected');
                    if (!selectedUrgency) {
                        isValid = false;
                        document.querySelector('.pickup-options').classList.add('error');
                    }
                }
                
                if (!isValid) {
                    alert('Please fill in all required fields before proceeding.');
                }
                
                return isValid;
            }
            
            // Update summary in the last step
            function updateSummary() {
                if (currentStep === 3) { // Step 4 is the review step
                    document.getElementById('summary-restaurant').textContent = 
                        document.getElementById('restaurantName').value;
                    
                    document.getElementById('summary-contact').textContent = 
                        document.getElementById('contactName').value;
                    
                    document.getElementById('summary-contact-details').textContent = 
                        document.getElementById('email').value + ' | ' + 
                        document.getElementById('phone').value;
                    
                    document.getElementById('summary-category').textContent = 
                        document.getElementById('foodCategory').options[document.getElementById('foodCategory').selectedIndex].text;
                    
                    document.getElementById('summary-quantity').textContent = 
                        document.getElementById('quantity').value + ' (' + 
                        document.getElementById('servings').value + ' servings)';
                    
                    const prepTime = new Date(document.getElementById('preparationTime').value);
                    document.getElementById('summary-prep-time').textContent = 
                        prepTime.toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    
                    const selectedPriority = document.querySelector('.pickup-option.selected');
                    document.getElementById('summary-priority').textContent = 
                        selectedPriority.querySelector('h4').textContent;
                    
                    const date = new Date(document.getElementById('preferredDate').value);
                    document.getElementById('summary-date').textContent = 
                        date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    
                    document.getElementById('summary-time').textContent = 
                        document.getElementById('preferredTime').value;
                }
            }
            
            // Add some sample data for demo purposes
            document.getElementById('restaurantName').value = "Urban Bistro";
            document.getElementById('contactName').value = "Michael Rodriguez";
            document.getElementById('contactPosition').value = "Manager";
            document.getElementById('email').value = "m.rodriguez@urbanbistro.com";
            document.getElementById('phone').value = "(555) 123-4567";
            document.getElementById('address').value = "123 Main Street, Downtown, City, State 12345";
            
            // Set a future date for pickup
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = tomorrow.toISOString().split('T')[0];
            document.getElementById('preferredDate').value = formattedDate;
            
            // Set a time (3:00 PM)
            document.getElementById('preferredTime').value = "15:00";
            
            // Set preparation time to current time
            const now = new Date();
            const formattedNow = now.toISOString().slice(0, 16);
            document.getElementById('preparationTime').value = formattedNow;
            
            // Set checkboxes to checked for demo
            document.getElementById('freshlyPrepared').checked = true;
            document.getElementById('agreeTerms').checked = true;
            document.getElementById('confirmAccuracy').checked = true;
        });