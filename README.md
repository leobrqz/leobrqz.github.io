# leobrqz.github.io

My personal portfolio. Features dynamic GitHub project integration and support for English or Portuguese.

- **Live site**: Available at [leonardobriquezi.me](https://leonardobriquezi.me) and [leobrqz.github.io](https://leobrqz.github.io)


## 🛠️ Tech Stack

- **Jekyll**: Static site generator
- **JavaScript**: Dynamic content loading and language switching
- **GitHub API**: Client-side integration for fetching repository data and READMEs

## Features
- **Multilanguage Support**: Full English/Portuguese translation with URL-based routing (`/` for English, `/pt` for Portuguese)
- **Dynamic Project Display**: Automatically fetches and displays GitHub repositories via GitHub API
- **Expandable README**: Projects page with expandable boxes that fetch and render README content from GitHub
- **Sidebar Navigation**: Responsive sidebar: drawer with hamburger menu on small viewports, fixed toggleable sidebar on larger ones, language selector
- **Table of Contents**: Dynamic TOC sidebar for easy navigation on home and projects pages
- **Resume Page**: Professional CV format with a download button for the PDF curriculum



## 🌐 Multilanguage Support

The site supports English (default) and Portuguese through URL-based routing:

- English: `/`, `/projects`, `/resume`, `/contact`
- Portuguese: `/pt`, `/pt/projects`, `/pt/resume`, `/pt/contact`

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

GitHub API responses are cached in localStorage. **ETag** and **Last-Modified** are used for conditional revalidation:

- Sends stored ETag/Last-Modified on subsequent requests; 304 → reuse cache, 200 → store new response and metadata
- 1-hour expiry
- Reduces API calls and mitigates rate limiting


## Author

**Leonardo Briquezi**

- GitHub: [leobrqz](https://github.com/leobrqz)
- LinkedIn: [leonardobri](https://linkedin.com/in/leonardobri)


### Credits

Skill and brand logos are used from the following sources:

- [Font Awesome](https://fontawesome.com/)
- [Simple Icons](https://simpleicons.org/)
- [Wikimedia Commons](https://commons.wikimedia.org/)
- [SVG Repo](https://www.svgrepo.com/)
- [Python Software Foundation](https://www.python.org/community/logos/)
