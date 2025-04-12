
// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

document.documentElement.classList.toggle('dark', currentTheme === 'dark');

themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mobile menu handling
const mobileMenuButton = document.getElementById('mobile-menu');
const mobileNav = document.getElementById('mobile-nav');

mobileMenuButton?.addEventListener('click', () => {
  mobileNav?.classList.toggle('hidden');
});

// Authentication state management
let isAuthenticated = false;

const checkAuth = () => {
  const token = localStorage.getItem('auth_token');
  isAuthenticated = !!token;
  updateAuthUI();
};

const updateAuthUI = () => {
  const authButtons = document.querySelectorAll('[data-auth-required]');
  authButtons.forEach(button => {
    button.style.display = isAuthenticated ? 'block' : 'none';
  });
};

// Form handling
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Form submission failed');
      
      // Clear form
      form.reset();
      
      // Show success message
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
