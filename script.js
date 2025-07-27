// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced card hover effects
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
        });
    });

    // Thread voting functionality
    const voteButtons = document.querySelectorAll('[data-vote]');
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const voteType = this.dataset.vote;
            const countElement = this.querySelector('span');
            let currentCount = parseInt(countElement.textContent);
            
            // Toggle vote state
            if (this.classList.contains('voted')) {
                this.classList.remove('voted');
                currentCount--;
            } else {
                this.classList.add('voted');
                currentCount++;
            }
            
            countElement.textContent = currentCount;
            
            // Visual feedback
            if (voteType === 'up') {
                this.classList.toggle('text-blue-600');
            } else {
                this.classList.toggle('text-red-600');
            }
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.searchable-item');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Remove error styling after user starts typing
                    field.addEventListener('input', function() {
                        this.classList.remove('border-red-500');
                    });
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        });
    });

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        switch(type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Make showNotification globally available
    window.showNotification = showNotification;

    // Tag functionality for forms with tags
    function initializeTagInput(inputId, containerId) {
        const input = document.getElementById(inputId);
        const container = document.getElementById(containerId);
        
        if (!input || !container) return;
        
        const tags = [];
        
        function addTag(tagText) {
            if (tagText.trim() && !tags.includes(tagText.trim())) {
                tags.push(tagText.trim());
                renderTags();
                input.value = '';
            }
        }
        
        function removeTag(tagText) {
            const index = tags.indexOf(tagText);
            if (index > -1) {
                tags.splice(index, 1);
                renderTags();
            }
        }
        
        function renderTags() {
            const existingTags = container.querySelectorAll('.tag-item');
            existingTags.forEach(tag => tag.remove());
            
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag-item';
                tagElement.innerHTML = `
                    ${tag}
                    <span class="tag-remove" onclick="removeTag('${tag}')">&times;</span>
                `;
                container.insertBefore(tagElement, input);
            });
        }
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(input.value);
            } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
                removeTag(tags[tags.length - 1]);
            }
        });
        
        // Make functions globally available
        window.addTag = addTag;
        window.removeTag = removeTag;
    }

    // Thread interaction functionality
    const replyButtons = document.querySelectorAll('[data-action="reply"]');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.dataset.commentId;
            const replyForm = document.getElementById(`reply-form-${commentId}`);
            if (replyForm) {
                replyForm.classList.toggle('hidden');
            }
        });
    });

    // Load more functionality
    const loadMoreButtons = document.querySelectorAll('[data-action="load-more"]');
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const loader = this.querySelector('.loader');
            const text = this.querySelector('.text');
            
            if (loader) loader.classList.remove('hidden');
            if (text) text.textContent = 'Loading...';
            
            // Simulate loading
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                if (text) text.textContent = 'Load More';
                showNotification('More content loaded successfully', 'success');
            }, 1500);
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            const items = document.querySelectorAll('[data-category]');
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-600');
            });
            this.classList.add('bg-blue-600', 'text-white');
            this.classList.remove('bg-gray-100', 'text-gray-600');
            
            // Filter items
            items.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('[data-action="bookmark"]');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isBookmarked = this.classList.contains('bookmarked');
            
            if (isBookmarked) {
                this.classList.remove('bookmarked');
                icon.setAttribute('data-lucide', 'bookmark');
                showNotification('Removed from bookmarks', 'info');
            } else {
                this.classList.add('bookmarked');
                icon.setAttribute('data-lucide', 'bookmark-check');
                showNotification('Added to bookmarks', 'success');
            }
            
            // Refresh Lucide icons
            lucide.createIcons();
        });
    });

    // Copy link functionality
    const shareButtons = document.querySelectorAll('[data-action="share"]');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard', 'success');
            }).catch(() => {
                showNotification('Failed to copy link', 'error');
            });
        });
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Press '/' to focus search
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Press 'Escape' to close modals or mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // Theme toggle functionality (if implemented)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    // Auto-save functionality for forms
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        const saveKey = `form_${input.name || input.id}_${window.location.pathname}`;
        
        // Load saved value
        const savedValue = localStorage.getItem(saveKey);
        if (savedValue && input.type !== 'password') {
            input.value = savedValue;
        }
        
        // Save on change
        input.addEventListener('input', function() {
            if (this.type !== 'password') {
                localStorage.setItem(saveKey, this.value);
            }
        });
    });

    // Clear saved form data on successful submission
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const saveKey = `form_${input.name || input.id}_${window.location.pathname}`;
                localStorage.removeItem(saveKey);
            });
        });
    });

    console.log('LearnHub Forum initialized successfully!');
});
