# leobrqz.github.io

A modern, multilingual portfolio website built with Jekyll and deployed on GitHub Pages. Features dynamic GitHub project integration, dark theme design, and support for English and Portuguese languages.

## 🛠️ Tech Stack

- **Jekyll**: Static site generator
- **GitHub API**: Client-side integration for fetching repository data and READMEs
- **SCSS**: Styling with variables and modular structure
- **JavaScript (ES6+)**: Dynamic content loading and language switching
- **Font Awesome**: Icons for skills and UI elements
- **localStorage**: Caching for GitHub API responses to reduce API calls

## 🌟 Features

- **Multilanguage Support**: Full English/Portuguese translation with URL-based routing (`/` for English, `/pt/` for Portuguese)
- **Dynamic Project Display**: Automatically fetches and displays GitHub repositories via GitHub API
- **Expandable README**: Projects page with expandable boxes that fetch and render README content from GitHub
- **Dark Theme**: Modern, minimal dark theme design
- **Responsive Layout**: Fully responsive design that works on all screen sizes
- **Fixed Sidebar Navigation**: Always-visible sidebar with navigation and language switcher
- **Skills Section**: Categorized skills display with icons
- **Resume Page**: Professional CV format with print-friendly styling
- **Table of Contents**: Dynamic TOC sidebar for easy navigation on home and projects pages



## 🌐 Multilanguage Support

The site supports English (default) and Portuguese through URL-based routing:

- English: `/`, `/projects`, `/resume`, `/contact`
- Portuguese: `/pt/`, `/pt/projects`, `/pt/resume`, `/pt/contact`

### Implementation

- Language detection from URL path
- Translation data stored in `_data/i18n/` YAML files
- Language switcher in sidebar with flag icons
- All UI elements, navigation, and content are translatable
- Language preference stored in localStorage

## 📦 GitHub API Integration

The site uses the GitHub API to:

- Fetch repository information (name, description, last updated)
- Get repository languages with percentages
- Fetch and render README content on demand

### Caching

API responses are cached in localStorage for 1 hour to:
- Reduce API calls
- Handle rate limiting gracefully
- Improve page load performance

### Rate Limiting

GitHub API has a rate limit of 60 requests/hour for unauthenticated requests. The caching system helps manage this, and the site will gracefully fall back to cached data if the limit is reached.

## Author

**Leonardo Briquezi**

- GitHub: [@leobrqz](https://github.com/leobrqz)
- LinkedIn: [leonardobri](https://linkedin.com/in/leonardobri)

## Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)
