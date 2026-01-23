// Projects JavaScript - GitHub API integration

// Configuration - defined at top level for global access
const GITHUB_USERNAME = 'leobrqz';
const API_BASE = 'https://api.github.com';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

// Safe translation helper - always returns default if i18n not available
function safeTranslate(key, defaultValue) {
    // Always return default value - translations are optional
    // This ensures projects display even if i18n.js fails to load
    return defaultValue;
}

document.addEventListener('DOMContentLoaded', function() {
    // Get repository list from config
    const repoList = getRepoList();
    
    console.log('Repository list:', repoList);
    
    if (!repoList || repoList.length === 0) {
        console.warn('No repositories configured in _config.yml. Add repositories to the repositories: list.');
        showEmptyState();
        return;
    }
    
    // Determine which page we're on
    const isProjectsPage = document.getElementById('projects-container') !== null;
    const isHomePage = document.getElementById('projects-grid') !== null;
    
    console.log('Page type - Projects:', isProjectsPage, 'Home:', isHomePage);
    
    if (isProjectsPage) {
        loadProjectsPage(repoList);
    } else if (isHomePage) {
        loadProjectsGrid(repoList);
    }
});

function getRepoList() {
    try {
        const scriptTag = document.getElementById('repo-list');
    if (scriptTag) {
            const textContent = scriptTag.textContent.trim();
            if (!textContent || textContent === 'null' || textContent === 'undefined') {
                console.log('Repository list is empty or null');
                return [];
            }
            const repos = JSON.parse(textContent);
            if (Array.isArray(repos)) {
                return repos.filter(repo => repo && typeof repo === 'string' && repo.length > 0);
            }
            console.warn('Repository list is not an array:', repos);
            return [];
        } else {
            console.warn('Repository list script tag not found');
        }
    } catch (e) {
        console.error('Error parsing repository list:', e);
    }
    return [];
}

async function loadProjectsGrid(repoList) {
    const gridContainer = document.getElementById('projects-grid');
    if (!gridContainer) {
        console.error('Projects grid container not found');
        return;
    }
    
    try {
        console.log('Fetching repositories...');
        const repos = await fetchRepositories(repoList);
        console.log('Fetched repositories:', repos);
        
        if (!repos || repos.length === 0) {
            const msg = safeTranslate('projects.no_repos', 'No repositories found. Please check your repository names in <code>_config.yml</code>.');
            gridContainer.innerHTML = `<p style="color: var(--text-secondary, #b0b0b0); text-align: center; padding: 2rem;">${msg}</p>`;
            return;
        }
        
        console.log('Enriching projects data...');
        const projectsData = await enrichProjectsData(repos);
        console.log('Enriched projects data:', projectsData);
        
        // Sort projects according to repoList order
        const sortedProjects = repoList
            .map(repoName => projectsData.find(project => project.name === repoName))
            .filter(project => project !== undefined);
        
        gridContainer.innerHTML = '';
        
        sortedProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            gridContainer.appendChild(projectCard);
        });
        
        console.log('Projects grid loaded successfully');
    } catch (error) {
        console.error('Error loading projects grid:', error);
        const msg = safeTranslate('projects.error_loading', 'Error loading projects. Please check the console for details.');
        gridContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center; padding: 2rem;">${msg}</p>`;
    }
}

async function loadProjectsPage(repoList) {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.error('Projects container not found');
        return;
    }
    
    try {
        console.log('Fetching repositories for projects page...');
        const repos = await fetchRepositories(repoList);
        console.log('Fetched repositories:', repos);
        
        if (!repos || repos.length === 0) {
            const msg = safeTranslate('projects.no_repos', 'No repositories found. Please check your repository names in <code>_config.yml</code>.');
            container.innerHTML = `<p style="color: var(--text-secondary, #b0b0b0); text-align: center; padding: 2rem;">${msg}</p>`;
            return;
        }
        
        console.log('Enriching projects data...');
        const projectsData = await enrichProjectsData(repos);
        console.log('Enriched projects data:', projectsData);
        
        // Sort projects according to repoList order
        const sortedProjects = repoList
            .map(repoName => projectsData.find(project => project.name === repoName))
            .filter(project => project !== undefined);
        
        container.innerHTML = '';
        
        sortedProjects.forEach(project => {
            const projectBox = createProjectBox(project);
            container.appendChild(projectBox);
        });
        
        // Attach expand/collapse handlers
        attachExpandHandlers();
        
        // Build TOC for projects page
        buildProjectsTOC();
        
        console.log('Projects page loaded successfully');
    } catch (error) {
        console.error('Error loading projects page:', error);
        const msg = safeTranslate('projects.error_loading', 'Error loading projects. Please check the console for details.');
        container.innerHTML = `<p style="color: #ff6b6b; text-align: center; padding: 2rem;">${msg}</p>`;
    }
}

async function fetchRepositories(repoList) {
    const cacheKey = `github_repos_${repoList.join('_')}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        // Sort cached repos according to repoList order
        const sortedCached = repoList
            .map(repoName => cached.find(repo => repo.name === repoName))
            .filter(repo => repo !== undefined);
        return sortedCached.length > 0 ? sortedCached : cached;
    }
    
    try {
        const { value } = await fetchWithConditionalCache(
            `${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`,
            cacheKey,
            {},
            async (response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const allRepos = await response.json();
                const filteredRepos = allRepos.filter(repo => repoList.includes(repo.name));
                return repoList
                    .map(repoName => filteredRepos.find(repo => repo.name === repoName))
                    .filter(repo => repo !== undefined);
            }
        );
        
        return value;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        // Return cached data if available, even if expired
        const expiredCache = getCachedData(cacheKey, true);
        if (expiredCache) {
            return expiredCache;
        }
        throw error;
    }
}

async function enrichProjectsData(repos) {
    const enriched = await Promise.all(repos.map(async repo => {
        const languages = await fetchRepositoryLanguages(repo.name);
        const projectData = getProjectData(repo.name);
        
        return {
            ...repo,
            languages: languages,
            libraries: projectData?.libraries || [],
            tools: projectData?.tools || [],
            default_branch: repo.default_branch || 'main' // Store default branch for image URL fixing
        };
    }));
    
    return enriched;
}

async function fetchRepositoryLanguages(repoName) {
    const cacheKey = `github_languages_${repoName}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    try {
        const { value } = await fetchWithConditionalCache(
            `${API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
            cacheKey,
            {},
            async (response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const languages = await response.json();
                const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
                const languagesWithPercentages = {};
                
                for (const [lang, bytes] of Object.entries(languages)) {
                    languagesWithPercentages[lang] = {
                        bytes: bytes,
                        percentage: Math.round((bytes / total) * 100)
                    };
                }
                
                return languagesWithPercentages;
            }
        );
        
        return value;
    } catch (error) {
        console.error(`Error fetching languages for ${repoName}:`, error);
        const expiredCache = getCachedData(cacheKey, true);
        if (expiredCache) {
            return expiredCache;
        }
        return {};
    }
}

// Fix relative image URLs in README HTML to use GitHub raw content
function fixReadmeImageUrls(html, repoName, defaultBranch = 'main') {
    if (!html || typeof html !== 'string') {
        return html;
    }
    
    // Create a temporary DOM element to parse and fix the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Find all img tags
    const images = tempDiv.querySelectorAll('img');
    
    images.forEach(img => {
        let src = img.getAttribute('src');
        if (!src) return;
        
        // Skip data URIs
        if (src.startsWith('data:')) {
            return;
        }
        
        // Handle absolute URLs
        if (src.startsWith('http://') || src.startsWith('https://')) {
            // Convert GitHub blob URLs to raw URLs
            if (src.includes('github.com') && src.includes('/blob/')) {
                img.src = src.replace('/blob/', '/raw/');
            }
            return;
        }
        
        // Handle relative paths and GitHub-relative URLs
        let imagePath = '';
        let branch = defaultBranch; // Use provided branch or default to 'main'
        
        // Remove query strings and fragments
        src = src.split('?')[0].split('#')[0];
        
        // Handle GitHub-relative URLs like /username/repo/blob/branch/path
        if (src.startsWith('/')) {
            const pathParts = src.split('/').filter(p => p);
            
            // Check if it's a full GitHub path: /username/repo/blob/branch/path
            if (pathParts.length >= 5 && 
                pathParts[0] === GITHUB_USERNAME && 
                pathParts[1] === repoName && 
                pathParts[2] === 'blob') {
                branch = pathParts[3];
                imagePath = pathParts.slice(4).join('/');
            } 
            // Check if it's just /username/repo/path (without blob)
            else if (pathParts.length >= 3 && 
                     pathParts[0] === GITHUB_USERNAME && 
                     pathParts[1] === repoName) {
                imagePath = pathParts.slice(2).join('/');
            }
            // Simple relative path starting with /
            else {
                imagePath = pathParts.join('/');
            }
        } 
        // Handle relative paths like ./images/logo.png or images/logo.png
        else {
            // Remove leading ./ if present
            imagePath = src.replace(/^\.\//, '');
        }
        
        // Construct GitHub raw content URL
        if (imagePath) {
            // Ensure no double slashes
            imagePath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');
            img.src = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${imagePath}`;
        }
    });
    
    return tempDiv.innerHTML;
}

async function fetchReadmeHTML(repoName, defaultBranch = 'main') {
    const cacheKey = `github_readme_${repoName}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        console.log(`Using cached README for ${repoName}`);
        return cached;
    }
    
    try {
        console.log(`Fetching README for ${repoName}...`);
        const { value } = await fetchWithConditionalCache(
            `${API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`,
            cacheKey,
            {
                headers: {
                    'Accept': 'application/vnd.github.html+json'
                }
            },
            async (response) => {
                console.log(`README response status for ${repoName}:`, response.status);
                console.log(`README response content-type:`, response.headers.get('content-type'));
                
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`No README found for ${repoName}`);
                        const noReadmeText = safeTranslate('projects.no_readme', 'No README available');
                        return `<p>${noReadmeText} for this repository.</p>`;
                    }
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const responseText = await response.text();
                console.log(`README response text length for ${repoName}:`, responseText.length);
                
                const contentType = response.headers.get('content-type') || '';
                let html;
                
                if (contentType.includes('application/json')) {
                    try {
                        const readme = JSON.parse(responseText);
                        console.log(`README JSON parsed for ${repoName}:`, readme);
                        const noReadmeText = safeTranslate('projects.no_readme', 'No README available');
                        html = readme.html || readme.content || `<p>${noReadmeText}.</p>`;
                    } catch (parseError) {
                        console.warn(`Failed to parse JSON for ${repoName}, using as HTML:`, parseError);
                        html = responseText;
                    }
                } else if (contentType.includes('text/html')) {
                    html = responseText;
                    console.log(`README HTML fetched directly for ${repoName}`);
                } else {
                    try {
                        const readme = JSON.parse(responseText);
                        html = readme.html || readme.content || responseText;
                        console.log(`README parsed as JSON for ${repoName}`);
                    } catch (parseError) {
                        html = responseText;
                        console.log(`README used as HTML for ${repoName} (JSON parse failed)`);
                    }
                }
                
                if (!html || html.trim() === '') {
                    const noReadmeText = safeTranslate('projects.no_readme', 'No README available');
                    html = `<p>${noReadmeText}.</p>`;
                }
                
                return fixReadmeImageUrls(html, repoName, defaultBranch);
            }
        );
        
        return value;
    } catch (error) {
        console.error(`Error fetching README for ${repoName}:`, error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        const expiredCache = getCachedData(cacheKey, true);
        if (expiredCache) {
            console.log(`Using expired cache for ${repoName}`);
            return expiredCache;
        }
        // Show error only if no cache exists
        const unableToLoadText = safeTranslate('projects.unable_to_load', 'Unable to load README. Please try again later.');
        return `<p>${unableToLoadText}</p>`;
    }
}

function getProjectData(repoName) {
    // This would come from _data/projects.yml, but since it's static,
    // we'll need to pass it via a data attribute or inline script
    // For now, return empty object
    try {
        const scriptTag = document.getElementById('projects-data');
        if (scriptTag && scriptTag.textContent) {
            const projectsData = JSON.parse(scriptTag.textContent);
            return projectsData[repoName] || null;
        }
    } catch (e) {
        // Ignore errors
    }
    return null;
}

// Language icon mapping
function getLanguageIcon(lang) {
    const iconMap = {
        'Python': 'fab fa-python',
        'JavaScript': 'fab fa-js',
        'TypeScript': 'fab fa-js-square',
        'Java': 'fab fa-java',
        'C++': 'fab fa-cuttlefish',
        'C': 'fab fa-cuttlefish',
        'C#': 'fab fa-microsoft',
        'PHP': 'fab fa-php',
        'Ruby': 'fab fa-ruby',
        'Go': 'fab fa-golang',
        'Rust': 'fab fa-rust',
        'Swift': 'fab fa-swift',
        'Kotlin': 'fab fa-android',
        'HTML': 'fab fa-html5',
        'CSS': 'fab fa-css3-alt',
        'Shell': 'fas fa-terminal',
        'Dockerfile': 'fab fa-docker',
        'Vue': 'fab fa-vuejs',
        'React': 'fab fa-react',
        'Angular': 'fab fa-angular',
        'Node': 'fab fa-node-js',
        'Solidity': 'fab fa-ethereum'
    };
    
    // Try exact match first
    if (iconMap[lang]) {
        return iconMap[lang];
    }
    
    // Try case-insensitive match
    const langLower = lang.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (key.toLowerCase() === langLower) {
            return icon;
        }
    }
    
    // Default icon
    return 'fas fa-code';
}

function createProjectCard(project) {
    // Container for both boxes
    const container = document.createElement('div');
    container.className = 'project-card-container';
    
    // Left box: GitHub data (same styling as project-card)
    const leftBox = document.createElement('div');
    leftBox.className = 'project-card project-info-box';
    
    const name = document.createElement('h3');
    const nameLink = document.createElement('a');
    nameLink.href = project.html_url;
    nameLink.target = '_blank';
    nameLink.rel = 'noopener noreferrer';
    nameLink.textContent = project.name;
    name.appendChild(nameLink);
    
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description || 'No description available.';
    
    const updated = document.createElement('p');
    updated.className = 'project-updated';
    const updatedDate = new Date(project.updated_at);
    const lastUpdatedText = safeTranslate('projects.last_updated', 'Last Updated');
    updated.textContent = `${lastUpdatedText}: ${updatedDate.toLocaleDateString()}`;
    
    leftBox.appendChild(name);
    leftBox.appendChild(description);
    leftBox.appendChild(updated);
    
    // Right box: Languages, Libraries, Tools (same styling as project-card)
    const rightBox = document.createElement('div');
    rightBox.className = 'project-card project-tech-box';
    
    const sections = [];
    
    // Languages
    if (Object.keys(project.languages || {}).length > 0) {
        const languagesSection = document.createElement('div');
        languagesSection.className = 'tech-section languages-section';
        const langTitle = document.createElement('h4');
        langTitle.textContent = safeTranslate('projects.languages', 'Languages');
        languagesSection.appendChild(langTitle);
        
        const languagesList = document.createElement('div');
        languagesList.className = 'languages-list';
        Object.entries(project.languages)
            .sort((a, b) => b[1].percentage - a[1].percentage)
            .forEach(([lang, data]) => {
                const langItem = document.createElement('div');
                langItem.className = 'language-item';
                
                const langIcon = document.createElement('i');
                langIcon.className = getLanguageIcon(lang);
                langIcon.setAttribute('aria-hidden', 'true');
                
                const langName = document.createElement('span');
                langName.className = 'lang-name';
                langName.textContent = lang;
                
                const langPercent = document.createElement('span');
                langPercent.className = 'lang-percent';
                langPercent.textContent = `${data.percentage}%`;
                
                langItem.appendChild(langIcon);
                langItem.appendChild(langName);
                langItem.appendChild(langPercent);
                languagesList.appendChild(langItem);
            });
        languagesSection.appendChild(languagesList);
        sections.push(languagesSection);
    }
    
    // Libraries
    if (project.libraries && project.libraries.length > 0) {
        const librariesSection = document.createElement('div');
        librariesSection.className = 'tech-section libraries-section';
        const libTitle = document.createElement('h4');
        libTitle.textContent = 'Libraries';
        librariesSection.appendChild(libTitle);
        const libList = document.createElement('div');
        libList.className = 'libs-list';
        project.libraries.forEach(lib => {
            const libTag = document.createElement('span');
            libTag.className = 'lib-tag';
            libTag.textContent = lib;
            libList.appendChild(libTag);
        });
        librariesSection.appendChild(libList);
        sections.push(librariesSection);
    }
    
    // Tools
    if (project.tools && project.tools.length > 0) {
        const toolsSection = document.createElement('div');
        toolsSection.className = 'tech-section tools-section';
        const toolsTitle = document.createElement('h4');
        toolsTitle.textContent = 'Tools';
        toolsSection.appendChild(toolsTitle);
        const toolsList = document.createElement('div');
        toolsList.className = 'tools-list';
        project.tools.forEach(tool => {
            const toolTag = document.createElement('span');
            toolTag.className = 'tool-tag';
            toolTag.textContent = tool;
            toolsList.appendChild(toolTag);
        });
        toolsSection.appendChild(toolsList);
        sections.push(toolsSection);
    }
    
    // Append all sections
    sections.forEach(section => rightBox.appendChild(section));
    
    container.appendChild(leftBox);
    container.appendChild(rightBox);
    
    return container;
}

function createProjectBox(project) {
    const box = document.createElement('div');
    box.className = 'project-box';
    box.setAttribute('data-repo', project.name);
    // Store default branch for image URL fixing
    const defaultBranch = project.default_branch || 'main';
    box.setAttribute('data-branch', defaultBranch);
    // Add unique ID for TOC anchor
    const projectId = `project-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    box.id = projectId;
    
    const header = document.createElement('div');
    header.className = 'project-header';
    
    const title = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = project.html_url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.textContent = project.name;
    title.appendChild(titleLink);
    
    header.appendChild(title);
    
    // Create content wrapper with horizontal layout (like home page)
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'project-content-wrapper';
    
    // Left section: description and meta
    const leftSection = document.createElement('div');
    leftSection.className = 'project-info-section';
    
    const meta = document.createElement('div');
    meta.className = 'project-meta';
    
    const desc = document.createElement('p');
    desc.textContent = project.description || 'No description available.';
    
    const updatedSpan = document.createElement('span');
    updatedSpan.className = 'updated-date';
    const updatedDate = new Date(project.updated_at);
    updatedSpan.textContent = updatedDate.toLocaleDateString();
    
    const updatedP = document.createElement('p');
    const lastUpdatedText = safeTranslate('projects.last_updated', 'Last Updated');
    updatedP.textContent = `${lastUpdatedText}: `;
    updatedP.appendChild(updatedSpan);
    
    meta.appendChild(desc);
    meta.appendChild(updatedP);
    leftSection.appendChild(meta);
    
    // Right section: languages (with separator)
    const languagesSection = document.createElement('div');
    languagesSection.className = 'project-languages-section';
    
    const langTitle = document.createElement('h4');
    langTitle.textContent = safeTranslate('projects.languages', 'Languages');
    languagesSection.appendChild(langTitle);
    
    const languagesList = document.createElement('div');
    languagesList.className = 'languages-list';
    
    if (Object.keys(project.languages || {}).length > 0) {
        Object.entries(project.languages)
            .sort((a, b) => b[1].percentage - a[1].percentage)
            .forEach(([lang, data]) => {
                const langItem = document.createElement('div');
                langItem.className = 'language-item';
                
                const langIcon = document.createElement('i');
                langIcon.className = getLanguageIcon(lang);
                langIcon.setAttribute('aria-hidden', 'true');
                
                const langName = document.createElement('span');
                langName.className = 'lang-name';
                langName.textContent = lang;
                
                const langPercent = document.createElement('span');
                langPercent.className = 'lang-percent';
                langPercent.textContent = `${data.percentage}%`;
                
                langItem.appendChild(langIcon);
                langItem.appendChild(langName);
                langItem.appendChild(langPercent);
                languagesList.appendChild(langItem);
            });
    } else {
        const noLang = document.createElement('div');
        noLang.className = 'language-item';
        noLang.textContent = 'No languages detected';
        languagesList.appendChild(noLang);
    }
    
    languagesSection.appendChild(languagesList);
    
    contentWrapper.appendChild(leftSection);
    contentWrapper.appendChild(languagesSection);
    
    // Readme content with toggle button below divider
    const readmeContent = document.createElement('div');
    readmeContent.className = 'readme-content';
    
    const toggle = document.createElement('button');
    toggle.className = 'expand-toggle';
    const showReadmeText = safeTranslate('projects.show_readme', 'Show README');
    toggle.setAttribute('aria-label', showReadmeText);
    toggle.innerHTML = `<span class="toggle-text">${showReadmeText}</span><i class="fas fa-chevron-down"></i>`;
    
    // Add toggle button inside readme-content (after the border-top divider)
    readmeContent.appendChild(toggle);
    
    box.appendChild(header);
    box.appendChild(contentWrapper);
    box.appendChild(readmeContent);
    
    return box;
}

function attachExpandHandlers() {
    const toggles = document.querySelectorAll('.project-box .expand-toggle');
    console.log('Found', toggles.length, 'expand toggles');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', async function() {
            const box = this.closest('.project-box');
            if (!box) {
                console.error('Could not find project box');
                return;
            }
            
            const readmeContent = box.querySelector('.readme-content');
            if (!readmeContent) {
                console.error('Could not find readme content');
                return;
            }
            
            const icon = this.querySelector('i');
            const repoName = box.getAttribute('data-repo');
            
            if (!repoName) {
                console.error('Repository name not found in data-repo attribute');
                return;
            }
            
            const toggleText = this.querySelector('.toggle-text');
            
            if (readmeContent.classList.contains('expanded')) {
                // Collapse
                readmeContent.classList.remove('expanded');
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
                if (toggleText) {
                    toggleText.textContent = safeTranslate('projects.show_readme', 'Show README');
                }
                const showReadmeText = safeTranslate('projects.show_readme', 'Show README');
                this.setAttribute('aria-label', showReadmeText);
            } else {
                // Expand
                if (!readmeContent.hasAttribute('data-loaded')) {
                    // Fetch README if not already loaded
                    // Keep the toggle button, add loading message after it
                    const loadingMsg = document.createElement('p');
                    loadingMsg.style.color = 'var(--text-secondary, #b0b0b0)';
                    loadingMsg.textContent = 'Loading README...';
                    readmeContent.appendChild(loadingMsg);
                    
                    try {
                        // Get default branch from data attribute if available
                        const defaultBranch = box.getAttribute('data-branch') || 'main';
                        const html = await fetchReadmeHTML(repoName, defaultBranch);
                        // Remove loading message
                        if (loadingMsg.parentNode) {
                            loadingMsg.parentNode.removeChild(loadingMsg);
                        }
                        // Create a container for the README content (after toggle)
                        const readmeContainer = document.createElement('div');
                        readmeContainer.className = 'readme-container';
                        readmeContainer.innerHTML = html;
                        readmeContent.appendChild(readmeContainer);
                        readmeContent.setAttribute('data-loaded', 'true');
                    } catch (error) {
                        console.error('Error loading README:', error);
                        // Remove loading message
                        if (loadingMsg.parentNode) {
                            loadingMsg.parentNode.removeChild(loadingMsg);
                        }
                        const errorMsg = document.createElement('p');
                        errorMsg.style.color = '#ff6b6b';
                        errorMsg.textContent = safeTranslate('projects.unable_to_load', 'Error loading README. Please try again later.');
                        readmeContent.appendChild(errorMsg);
                    }
                }
                readmeContent.classList.add('expanded');
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
                if (toggleText) {
                    toggleText.textContent = safeTranslate('projects.hide_readme', 'Hide README');
                }
                const hideReadmeText = safeTranslate('projects.hide_readme', 'Hide README');
                this.setAttribute('aria-label', hideReadmeText);
            }
        });
    });
}

// Cache management functions
function getCachedEntry(key, allowExpired = false) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const data = JSON.parse(item);
        const now = Date.now();
        
        if (!allowExpired && data.expiry && now > data.expiry) {
            return null; // Cache expired
        }
        
        if (!data || typeof data !== 'object' || typeof data.value === 'undefined') {
            return null;
        }
        
        return data;
    } catch (e) {
        return null;
    }
}

function getCachedData(key, allowExpired = false) {
    const entry = getCachedEntry(key, allowExpired);
    return entry ? entry.value : null;
}

function setCachedData(key, value, metadata = {}) {
    try {
        const data = {
            value: value,
            expiry: Date.now() + CACHE_EXPIRY
        };
        
        if (metadata.etag) {
            data.etag = metadata.etag;
        }
        if (metadata.lastModified) {
            data.lastModified = metadata.lastModified;
        }
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        // Ignore storage errors (e.g., quota exceeded)
    }
}

async function fetchWithConditionalCache(url, cacheKey, fetchOptions, parseResponse) {
    const cachedEntry = getCachedEntry(cacheKey, true);
    const headers = new Headers((fetchOptions && fetchOptions.headers) ? fetchOptions.headers : {});
    const hasCachedValue = cachedEntry && typeof cachedEntry.value !== 'undefined';
    
    if (hasCachedValue) {
        if (cachedEntry.etag) {
            headers.set('If-None-Match', cachedEntry.etag);
        }
        if (cachedEntry.lastModified) {
            headers.set('If-Modified-Since', cachedEntry.lastModified);
        }
    }
    
    const response = await fetch(url, {
        ...fetchOptions,
        headers: headers
    });
    
    if (response.status === 304 && hasCachedValue) {
        setCachedData(cacheKey, cachedEntry.value, {
            etag: cachedEntry.etag,
            lastModified: cachedEntry.lastModified
        });
        return { value: cachedEntry.value, response: response };
    }
    
    const value = await parseResponse(response);
    setCachedData(cacheKey, value, {
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified')
    });
    return { value: value, response: response };
}

function buildProjectsTOC() {
    const tocList = document.getElementById('projects-toc-list');
    if (!tocList) return;
    
    const projectBoxes = document.querySelectorAll('.project-box');
    tocList.innerHTML = '';
    
    projectBoxes.forEach((box) => {
        const repoName = box.getAttribute('data-repo');
        const titleElement = box.querySelector('h3 a');
        if (titleElement && repoName) {
            const id = box.id || `project-${repoName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            // Ensure box has the ID
            if (!box.id) {
                box.id = id;
            }
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.className = 'toc-link';
            a.textContent = titleElement.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        }
    });
    
    // Initialize TOC handlers for dynamically added links
    if (typeof initTOC === 'function') {
        initTOC();
        
        // Trigger an immediate update of active section after projects load
        // This ensures the TOC tracking works with dynamically loaded content
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new Event('scroll'));
            }
        }, 100);
    }
}

function showEmptyState() {
    const noProjectsText = safeTranslate('projects.no_projects', 'No projects configured. Add repositories to the <code>repositories:</code> list in <code>_config.yml</code>.');
    
    // Show empty state message on home page
    const gridContainer = document.getElementById('projects-grid');
    if (gridContainer) {
        gridContainer.innerHTML = `<p style="color: var(--text-secondary, #b0b0b0); text-align: center; padding: 2rem;">${noProjectsText}</p>`;
    }
    
    // Show empty state message on projects page
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projectsContainer.innerHTML = `<p style="color: var(--text-secondary, #b0b0b0); text-align: center; padding: 2rem;">${noProjectsText}</p>`;
    }
}
