<div align="center">
  <h1><a href="https://leonardobriquezi.me">leonardobriquezi.me</a></h1>
  Built with Next.js and Mantine. <br>
  Static export for GitHub Pages.
</div>

<div align="center">
  <a href="https://leonardobriquezi.me">leonardobriquezi.me</a> · <a href="https://leobrqz.github.io">leobrqz.github.io</a>
</div>



## Tech stack

<table>
<tr>
<td><strong>Framework</strong></td>
<td>Next.js 16 (App Router, static export)</td>
</tr>
<tr>
<td><strong>UI</strong></td>
<td>Mantine 8, Framer Motion, circle-flags</td>
</tr>
<tr>
<td><strong>Language</strong></td>
<td>TypeScript, React 19</td>
</tr>
<tr>
<td><strong>Data</strong></td>
<td>GitHub API (repos, languages, README), local i18n (PT/EN)</td>
</tr>
</table>


## Features

- **Multilanguage** — Portuguese (default) and English; URL-based routes; language switcher keeps you on the same page.
- **Projects** — Fetches repositories from GitHub; project page with languages/libs/tools and expandable README; home shows recent projects only.
- **Resume** — Structured CV with skills, certifications, education. The PDF download link fetches directly from this repo (<code>assets/cv/Leonardo_Briquezi_CV.pdf</code>), not from the built site.
- **Contact** — Links to GitHub, LinkedIn, and email.
- **Layout** — Floating nav (no separate header bar), single full-height background, typewriter hero on home.

<details>
<summary><strong>Routes (PT / EN)</strong></summary>

| Portuguese | English |
|------------|---------|
| <code>/</code> | <code>/en</code> |
| <code>/projects</code> | <code>/en/projects</code> |
| <code>/resume</code> | <code>/en/resume</code> |
| <code>/contact</code> | <code>/en/contact</code> |

</details>



## Setup and run

<pre><code>pnpm install
pnpm run build</code></pre>

Static output is in <code>out/</code>. For local dev:

<pre><code>pnpm run dev</code></pre>


## Project structure

All paths below are at repo root.

| Path | Purpose |
|------|---------|
| <code>assets/</code> | Repo-only: <code>assets/cv/</code> for the resume PDF (fetched directly from the repo, not served by the app) |
| <code>app/</code> | Next.js App Router: <code>(pt)</code> and <code>en</code> layouts and pages |
| <code>components/</code> | Shell, Home, Projects, Resume, Contact, IDE background |
| <code>config/</code> | Site and repo constants, repo list |
| <code>data/</code> | i18n (pt/en), about, contact, skills, resume data |
| <code>lib/</code> | i18n helper, GitHub API, useProjects hook |
| <code>public/</code> | Favicon, flags (PT/EN), <code>assets/</code> (icons and other app assets) |



## Author

**Leonardo Briquezi**

- GitHub: [leobrqz](https://github.com/leobrqz)
- LinkedIn: [leonardobri](https://linkedin.com/in/leonardobri)

<hr>

### Credits

Skill and brand logos are used from the following sources:

- [Font Awesome](https://fontawesome.com/)
- [Simple Icons](https://simpleicons.org/)
- [Wikimedia Commons](https://commons.wikimedia.org/)
- [SVG Repo](https://www.svgrepo.com/)
- [Python Software Foundation](https://www.python.org/community/logos/)
