<div align="center">
  <h1><a href="https://leonardobriquezi.me">leonardobriquezi.me</a></h1>
  Built with Next.js and Mantine. <br>
  Static export, deployed to GitHub Pages.
</div>

<div align="center">
  <a href="https://leonardobriquezi.me">leonardobriquezi.me</a> · <a href="https://leobrqz.github.io">leobrqz.github.io</a>
</div>



## Tech stack

<table>
<tr>
<td><strong>Framework</strong></td>
<td>Next.js 16, Mantine 8</td>
</tr>
<tr>
<td><strong>Libraries</strong></td>
<td>tsparticles, Howler, canvas,Tabler Icons, circle-flags, Framer Motion</td>
</tr>
<tr>
<td><strong>Language</strong></td>
<td>TypeScript 5.9, React 19</td>
</tr>
</table>


## Features

- **Multilanguage** — Portuguese (default) and English; URL-based routes; language switcher.
- **Projects** — Repos from GitHub; project page with languages, libs, tools, expandable README.
- **Resume** — CV with skills, certifications, education; PDF from repo (<code>assets/cv/Leonardo_Briquezi_CV.pdf</code>).
- **Contact** — GitHub, LinkedIn, email.
- **Layout** — Floating nav, full-height background, typewriter hero. Nav pills hover glow; mobile drawer with GitHub/LinkedIn below role/education.
- **Background** — Starfield with parallax; floating asteroids. Content layer on top so the page stays interactive.
- **Home** — About me, skills grid and recent projects.
- **SEO** — Sitemap, robots, per-page meta and OG/Twitter, canonical and hreflang, JSON-LD Person.




## Project structure


| Path | Purpose |
|------|---------|
| <code>assets/</code> | Repo-only: <code>assets/cv/</code> for the resume PDF |
| <code>app/</code> | Next.js App Router: <code>(pt)</code> and <code>en</code> layouts and pages; <code>sitemap.ts</code>, <code>robots.ts</code> for static SEO files |
| <code>components/</code> | Shell (FloatingNav, SiteShell), Home, Projects, Resume, Contact; IdeBackground, SpaceBackground (stars), AsteroidLayer; ClientOnlyChildren (hydration); JsonLd (Person schema) |
| <code>config/</code> | Site and repo constants, repo list; <code>seo.ts</code> for canonical/hreflang helpers |
| <code>data/</code> | i18n (pt/en), about (home + resume content), contact, skills, resume data |
| <code>lib/</code> | i18n helper, GitHub API, useProjects hook |
| <code>public/</code> | Favicon, flags (PT/EN), <code>assets/</code> (icons and other app assets) |



## Author

**Leonardo Briquezi**

- GitHub: [leobrqz](https://github.com/leobrqz)
- LinkedIn: [leonardobri](https://linkedin.com/in/leonardobri)

<hr>

### Credits

Icons:

- [Tabler Icons](https://tabler.io/icons)
- [Simple Icons](https://simpleicons.org/) 
- [Circle Flags](https://github.com/HatScripts/circle-flags)
- [Font Awesome](https://fontawesome.com/)
- [Wikimedia Commons](https://commons.wikimedia.org/)
- [SVG Repo](https://www.svgrepo.com/) 
- [Python Software Foundation](https://www.python.org/community/logos/)

Assets:
- [Space Background](https://space-spheremaps.itch.io/pixelart-starfields)
- [Space Background Generator](deep-fold.itch.io/space-background-generator)
- [Space Ships](https://disruptorart.itch.io/tiny-ships-free-spaceships)
- [Sound Effects](https://mixkit.co/)