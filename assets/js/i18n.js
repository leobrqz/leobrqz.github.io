// i18n.js - Language detection and switching

// Detect current language from URL
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.startsWith('/pt/') || path === '/pt') {
        return 'pt';
    }
    return 'en';
}

// Get language preference from localStorage
function getLanguagePreference() {
    return localStorage.getItem('preferred_language') || 'en';
}

// Set language preference in localStorage
function setLanguagePreference(lang) {
    localStorage.setItem('preferred_language', lang);
}

// Get translation data
function getTranslations(lang) {
    // Translations will be embedded in the page via a script tag
    const scriptTag = document.getElementById('i18n-data');
    if (scriptTag) {
        try {
            const data = JSON.parse(scriptTag.textContent);
            return data[lang] || data['en'] || {};
        } catch (e) {
            console.error('Error parsing i18n data:', e);
        }
    }
    return {};
}

// Get a translated string
function t(key, lang) {
    lang = lang || getCurrentLanguage();
    const translations = getTranslations(lang);
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value || key;
}

// Switch language by redirecting to appropriate URL
function switchLanguage(lang) {
    const currentPath = window.location.pathname;
    const currentLang = getCurrentLanguage();
    
    setLanguagePreference(lang);
    
    let newPath;
    
    if (lang === 'en') {
        // Remove /pt/ prefix
        if (currentPath.startsWith('/pt/')) {
            newPath = currentPath.replace('/pt/', '/');
            // Handle root case
            if (newPath === '') {
                newPath = '/';
            }
        } else if (currentPath === '/pt' || currentPath === '/pt/') {
            newPath = '/';
        } else {
            newPath = currentPath;
        }
    } else {
        // Add /pt/ prefix
        if (currentPath === '/' || currentPath === '') {
            newPath = '/pt/';
        } else if (currentPath.startsWith('/pt/') || currentPath.startsWith('/pt')) {
            newPath = currentPath; // Already in Portuguese
        } else {
            // Add /pt prefix before the path
            newPath = '/pt' + currentPath;
        }
    }
    
    // Preserve query string and hash
    const query = window.location.search;
    const hash = window.location.hash;
    window.location.href = newPath + query + hash;
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    const langOptions = document.querySelectorAll('.lang-option');
    
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            if (lang) {
                switchLanguage(lang);
            }
        });
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCurrentLanguage, t, switchLanguage };
}
