/* ==========================================================================
   ApexCare Health - Interactive JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('apexcare_theme', theme);
        if (theme === 'dark') {
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light Mode';
        } else {
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark Mode';
        }
    }

    const savedTheme = localStorage.getItem('apexcare_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- 2. Mobile Navigation Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });

        // Close menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 3. Interactive Department Tabs ---
    const deptTabBtns = document.querySelectorAll('.dept-tab-btn');
    const deptPanels = document.querySelectorAll('.dept-content-panel');

    deptTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDept = btn.getAttribute('data-dept');

            deptTabBtns.forEach(b => b.classList.remove('active'));
            deptPanels.forEach(p => p.classList.remove('active'));

            btn.classList.active = true;
            btn.classList.add('active');

            const targetPanel = document.getElementById(`dept-${targetDept}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // --- 4. Doctor Search & Category Filter ---
    const doctorSearchInput = document.getElementById('doctorSearch');
    const filterChips = document.querySelectorAll('.chip');
    const doctorCards = document.querySelectorAll('.doctor-card');

    let activeCategory = 'all';

    function filterDoctors() {
        const query = doctorSearchInput ? doctorSearchInput.value.toLowerCase().trim() : '';

        doctorCards.forEach(card => {
            const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
            const dept = card.dataset.dept ? card.dataset.dept.toLowerCase() : '';
            const specialty = card.dataset.specialty ? card.dataset.specialty.toLowerCase() : '';

            const matchesCategory = (activeCategory === 'all' || dept === activeCategory);
            const matchesQuery = !query || name.includes(query) || dept.includes(query) || specialty.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (doctorSearchInput) {
        doctorSearchInput.addEventListener('input', filterDoctors);
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.getAttribute('data-category');
            filterDoctors();
        });
    });

    // --- 5. Appointment Modal & Slot Picker ---
    const appointmentModal = document.getElementById('appointmentModal');
    const openModalBtns = document.querySelectorAll('.js-open-appointment');
    const closeModalBtns = document.querySelectorAll('.js-close-modal');
    const slotBtns = document.querySelectorAll('.slot-btn');
    const appointmentForm = document.getElementById('appointmentForm');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preferredDoctor = btn.getAttribute('data-doctor');
            const doctorSelect = document.getElementById('modalDoctor');
            if (preferredDoctor && doctorSelect) {
                doctorSelect.value = preferredDoctor;
            }
            if (appointmentModal) {
                appointmentModal.classList.add('active');
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    slotBtns.forEach(slot => {
        slot.addEventListener('click', () => {
            slotBtns.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
    });

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modalName').value;
            const doctor = document.getElementById('modalDoctor').value;
            const date = document.getElementById('modalDate').value;
            
            let selectedSlot = '10:00 AM';
            const selectedSlotBtn = document.querySelector('.slot-btn.selected');
            if (selectedSlotBtn) selectedSlot = selectedSlotBtn.textContent;

            appointmentModal.classList.remove('active');
            showToast(`Appointment Confirmed! Thank you ${name}, your booking with ${doctor} for ${date} at ${selectedSlot} is locked in.`, 'success');
            appointmentForm.reset();
        });
    }

    // --- 6. Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent! Our medical desk will respond within 15 minutes.', 'success');
            contactForm.reset();
        });
    }

    // --- 7. Floating AI Health Assistant Widget ---
    const aiWidgetBtn = document.getElementById('aiWidgetBtn');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const closeAiChat = document.getElementById('closeAiChat');
    const aiChatInput = document.getElementById('aiChatInput');
    const sendAiBtn = document.getElementById('sendAiBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiChipBtns = document.querySelectorAll('.ai-chip-btn');

    if (aiWidgetBtn && aiChatWindow) {
        aiWidgetBtn.addEventListener('click', () => {
            aiChatWindow.classList.toggle('active');
        });

        if (closeAiChat) {
            closeAiChat.addEventListener('click', () => {
                aiChatWindow.classList.remove('active');
            });
        }
    }

    function appendMessage(text, sender = 'ai') {
        if (!aiChatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble chat-bubble-${sender}`;
        msgDiv.textContent = text;
        aiChatMessages.appendChild(msgDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function processUserMessage(userMsg) {
        appendMessage(userMsg, 'user');

        setTimeout(() => {
            const lower = userMsg.toLowerCase();
            let aiReply = "I am ApexCare's AI Triage Assistant. If you have severe emergency symptoms (chest pain, severe breathlessness), please press the Emergency hotline button immediately.";

            if (lower.includes('headache') || lower.includes('fever')) {
                aiReply = "For headache and mild fever: Rest, stay hydrated, and monitor temperature. If symptoms persist over 48h or exceed 102°F, we recommend seeing a General Practitioner.";
            } else if (lower.includes('appointment') || lower.includes('book')) {
                aiReply = "You can book an instant appointment with any specialist right now by clicking 'Book Appointment' or selecting your doctor below!";
            } else if (lower.includes('emergency') || lower.includes('urgent')) {
                aiReply = "🚨 Call Emergency Hotline: 1-800-273-9227 immediately. Our Trauma Unit is ready 24/7.";
            } else if (lower.includes('hours') || lower.includes('location')) {
                aiReply = "Our Emergency & Urgent Care is open 24/7. Outpatient clinics operate Mon-Sat from 7:00 AM to 8:00 PM at 450 Health Innovation Way.";
            }

            appendMessage(aiReply, 'ai');
        }, 600);
    }

    if (sendAiBtn && aiChatInput) {
        sendAiBtn.addEventListener('click', () => {
            const text = aiChatInput.value.trim();
            if (text) {
                processUserMessage(text);
                aiChatInput.value = '';
            }
        });

        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = aiChatInput.value.trim();
                if (text) {
                    processUserMessage(text);
                    aiChatInput.value = '';
                }
            }
        });
    }

    aiChipBtns.forEach(chip => {
        chip.addEventListener('click', () => {
            processUserMessage(chip.textContent);
        });
    });

    // --- 8. Toast Notification Utility ---
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
