// Database Integration Functions

// Generate session ID for analytics
function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Get or create session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

// Track analytics events
async function trackEvent(eventType, eventData = {}) {
    try {
        const response = await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: getSessionId(),
                event_type: eventType,
                event_data: {
                    ...eventData,
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href,
                    page_title: document.title
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to track event');
        }

        console.log(`Event tracked: ${eventType}`);
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

// Enhanced form handling with database integration
async function handleContactFormWithDB(form) {
    const submitButton = form.querySelector('.submit-btn');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name') || formData.get('Nome Completo'),
            email: formData.get('email') || formData.get('E-mail'),
            phone: formData.get('phone') || formData.get('WhatsApp'),
            interest_type: formData.get('interest') || formData.get('Interesse'),
            message: formData.get('message') || formData.get('Mensagem') || '',
            source: 'landing_page'
        };

        // Submit to database
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (result.success) {
            // Track successful form submission
            await trackEvent('form_submit', {
                form_type: 'contact',
                lead_id: result.data.id,
                interest_type: contactData.interest_type
            });

            showNotification('Solicitação enviada com sucesso! Nossa equipe entrará em contato em até 30 minutos.', 'success');
            
            // Reset form
            form.reset();
            
            // Show success modal
            showSuccessMessage();
        } else {
            throw new Error(result.error || 'Failed to submit form');
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        
        if (error.message.includes('Email already exists')) {
            showNotification('Este e-mail já está cadastrado. Nossa equipe entrará em contato em breve!', 'info');
        } else {
            showNotification('Erro ao enviar solicitação. Tente novamente ou entre em contato via WhatsApp.', 'error');
        }
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Enhanced favorites system with database
async function toggleFavoriteWithDB(button) {
    const propertyCard = button.closest('.property-card');
    const propertyTitle = propertyCard.querySelector('.property-title').textContent;
    const propertyId = propertyCard.dataset.propertyId || Math.floor(Math.random() * 1000); // Fallback for demo
    const icon = button.querySelector('i');
    
    // Get user email from localStorage or prompt
    let userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
        userEmail = prompt('Digite seu e-mail para salvar favoritos:');
        if (!userEmail) return;
        localStorage.setItem('user_email', userEmail);
    }

    try {
        if (icon.classList.contains('far')) {
            // Add to favorites
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: userEmail,
                    property_id: propertyId
                })
            });

            const result = await response.json();

            if (result.success) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ef4444';
                
                showNotification(`${propertyTitle} adicionado aos favoritos!`, 'success');
                
                // Track event
                await trackEvent('property_favorited', {
                    property_id: propertyId,
                    property_title: propertyTitle,
                    user_email: userEmail
                });
            } else {
                throw new Error(result.error);
            }
        } else {
            // Remove from favorites
            const response = await fetch(`/api/favorites?user_email=${encodeURIComponent(userEmail)}&property_id=${propertyId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                
                showNotification(`${propertyTitle} removido dos favoritos!`, 'info');
                
                // Track event
                await trackEvent('property_unfavorited', {
                    property_id: propertyId,
                    property_title: propertyTitle,
                    user_email: userEmail
                });
            } else {
                throw new Error(result.error);
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showNotification('Erro ao atualizar favoritos. Tente novamente.', 'error');
    }
}

// Load properties from database
async function loadPropertiesFromDB() {
    try {
        const response = await fetch('/api/properties?limit=6&featured=true');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // Update property cards with real data
            const propertyCards = document.querySelectorAll('.property-card');
            
            result.data.forEach((property, index) => {
                if (propertyCards[index]) {
                    const card = propertyCards[index];
                    
                    // Update property data
                    card.dataset.propertyId = property.id;
                    
                    // Update image
                    const img = card.querySelector('.property-image img');
                    if (img && property.images && property.images.length > 0) {
                        img.src = property.images[0];
                        img.alt = property.title;
                    }
                    
                    // Update price
                    const priceElement = card.querySelector('.property-price');
                    if (priceElement) {
                        priceElement.innerHTML = `R$ ${property.price.toLocaleString('pt-BR')}${property.transaction_type === 'aluguel' ? '<span>/mês</span>' : ''}`;
                    }
                    
                    // Update title
                    const titleElement = card.querySelector('.property-title');
                    if (titleElement) {
                        titleElement.textContent = property.title;
                    }
                    
                    // Update description
                    const descElement = card.querySelector('.property-description');
                    if (descElement) {
                        descElement.textContent = property.description;
                    }
                    
                    // Update location
                    const locationElement = card.querySelector('.property-location');
                    if (locationElement) {
                        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.neighborhood}, ${property.city} - ${property.state}`;
                    }
                    
                    // Update features
                    const featuresContainer = card.querySelector('.property-features');
                    if (featuresContainer && property.bedrooms) {
                        featuresContainer.innerHTML = `
                            <div class="feature">
                                <i class="fas fa-bed"></i>
                                <span>${property.bedrooms} Quartos</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-bath"></i>
                                <span>${property.bathrooms} Banheiros</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-car"></i>
                                <span>${property.parking_spaces} Vagas</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${property.area}m²</span>
                            </div>
                        `;
                    }
                    
                    // Update agent info
                    const agentName = card.querySelector('.agent-name');
                    const contactButton = card.querySelector('.contact-agent');
                    if (agentName && property.agent_name) {
                        agentName.textContent = property.agent_name;
                    }
                    if (contactButton && property.agent_whatsapp) {
                        contactButton.onclick = () => contactAgent(property.agent_name, property.title, property.agent_whatsapp);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

// Enhanced tracking for landing page events
function trackLandingPageEventsWithDB() {
    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer
    });

    // Track CTA clicks with more detail
    document.querySelectorAll('.cta-primary, .cta-secondary, .cta-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();
            const section = e.target.closest('section')?.id || 'unknown';
            
            trackEvent('cta_click', {
                button_text: buttonText,
                section: section,
                button_type: e.target.classList.contains('cta-primary') ? 'primary' : 'secondary'
            });
        });
    });

    // Track property interactions
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn') && !e.target.closest('.contact-agent')) {
                const propertyTitle = card.querySelector('.property-title')?.textContent;
                const propertyId = card.dataset.propertyId;
                
                trackEvent('property_view', {
                    property_id: propertyId,
                    property_title: propertyTitle,
                    interaction_type: 'card_click'
                });
            }
        });
    });

    // Track scroll depth with more granular tracking
    let maxScroll = 0;
    let scrollMilestones = [25, 50, 75, 90, 100];
    let trackedMilestones = [];

    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone achievements
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                    trackedMilestones.push(milestone);
                    trackEvent('scroll_depth', {
                        percentage: milestone,
                        max_scroll: maxScroll
                    });
                }
            });
        }
    }, 1000));

    // Track time on page
    const startTime = Date.now();
    let timeTracked = false;
    
    // Track engagement after 30 seconds
    setTimeout(() => {
        if (!timeTracked) {
            trackEvent('engagement', {
                time_on_page: 30,
                type: 'engaged_user'
            });
            timeTracked = true;
        }
    }, 30000);

    // Track exit intent
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('page_exit', {
            time_on_page: timeOnPage,
            max_scroll_reached: maxScroll
        });
    });
}

// Utility functions
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showSuccessMessage() {
    // Create the modal container
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Add the success message
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Sua solicitação foi enviada com sucesso! Nossa equipe entrará em contato em breve.';
    modalContent.appendChild(successMessage);

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    modalContent.appendChild(closeButton);

    // Append the content to the container
    modalContainer.appendChild(modalContent);

    // Append the container to the body
    document.body.appendChild(modalContainer);

    // Show the modal
    setTimeout(() => {
        modalContainer.classList.add('show');
    }, 10);
}

function contactAgent(agentName, propertyTitle, agentWhatsapp) {
    const message = `Olá ${agentName}, tenho interesse em saber mais sobre o imóvel ${propertyTitle}.`;
    const whatsappLink = `https://wa.me/${agentWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
}

// Slider initialization
function initializeSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.style.transform = `translateX(-${index * 100}%)`);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);

    // Optional: Auto slide
    // setInterval(nextSlide, 5000);
}

// Navigation initialization
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('active');
        });
    }
}

// Scroll effects initialization
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        // Example: Add a class to the header on scroll
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 50);
        }
    });
}

// Favorites initialization (dummy)
function initializeFavorites() {
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(button);
        });
    });
}

// Animations initialization (example)
function initializeAnimations() {
    // Example: Fade in elements on scroll
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.classList.add('active');
                    observer.unobserve(element);
                }
            });
        });
        observer.observe(element);
    });
}

// Dummy toggleFavorite function
function toggleFavorite(button) {
    const propertyCard = button.closest('.property-card');
    const propertyTitle = propertyCard.querySelector('.property-title').textContent;
    const icon = button.querySelector('i');

    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#ef4444';
        showNotification(`${propertyTitle} adicionado aos favoritos!`, 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showNotification(`${propertyTitle} removido dos favoritos!`, 'info');
    }
}

// Dummy contact form handler
function handleContactForm(event) {
    event.preventDefault();
    showNotification('Formulário enviado com sucesso! (Demo)', 'success');
}

// Update the initialization to use database functions
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeNavigation();
    initializeScrollEffects();
    initializeFavorites();
    initializeAnimations();
    
    // Load real data from database
    loadPropertiesFromDB();
    
    // Enhanced tracking with database
    trackLandingPageEventsWithDB();
    
    // Replace the original contact form handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.removeEventListener('submit', handleContactForm);
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactFormWithDB(e.target);
        });
    }
    
    // Replace favorite toggle function
    window.toggleFavorite = toggleFavoriteWithDB;
});
