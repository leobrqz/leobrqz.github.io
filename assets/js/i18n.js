// Detect current language from URL
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path === '/en' || path.startsWith('/en/')) {
        return 'en';
    }
    return 'pt';
}

// Get language preference from localStorage
function getLanguagePreference() {
    return localStorage.getItem('preferred_language') || 'pt';
}

// Set language preference in localStorage
function setLanguagePreference(lang) {
    localStorage.setItem('preferred_language', lang);
}

// Get translation data
function getTranslations(lang) {
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
            return key;
        }
    }
    
    return value || key;
}

function switchLanguage(lang) {
    const currentPath = window.location.pathname;
    
    setLanguagePreference(lang);
    
    let newPath;
    
    if (lang === 'en') {
        if (currentPath === '/' || currentPath === '') {
            newPath = '/en';
        } else if (currentPath.startsWith('/en')) {
            newPath = currentPath;
        } else {
            newPath = '/en' + currentPath;
        }
    } else {
        if (currentPath === '/en' || currentPath === '/en/') {
            newPath = '/';
        } else if (currentPath.startsWith('/en/')) {
            newPath = currentPath.replace('/en', '') || '/';
        } else {
            newPath = currentPath;
        }
    }
    
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCurrentLanguage, t, switchLanguage };
}
