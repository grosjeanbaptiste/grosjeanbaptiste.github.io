# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio/resume website for Baptiste Grosjean, hosted on GitHub Pages. The site is built with vanilla HTML, CSS, and JavaScript without any build process or package manager dependencies.

## Architecture

### File Structure
- `index.html` - Main HTML file containing the entire website content
- `css/` - Stylesheet directory
  - `style.css` - Main stylesheet with responsive design and theme support
  - `variables.css` - CSS custom properties for theming (light/dark mode)
- `js/` - JavaScript modules
  - `theme.js` - Dark/light mode theme switching functionality
  - `chart.js` - Chart.js integration for daily life visualization
  - `nav.js` - Navigation functionality including mobile menu and smooth scrolling
- `assets/` - Static assets
  - `data/resume.json` - Structured resume data following JSON Resume schema
  - `data/registry.json` - Additional registry data
  - `images/` - Profile pictures and other images
  - `cv/` - PDF version of CV
- `CNAME` - GitHub Pages custom domain configuration

### Data Architecture
The website uses two JSON files for data:
- `assets/data/resume.json` - Primary resume data following the JSON Resume schema v1.0.0
- `assets/data/registry.json` - Secondary registry data with similar structure but different theme

The HTML content is currently hardcoded in `index.html` rather than dynamically generated from the JSON data.

### Theming System
- CSS custom properties in `variables.css` define color schemes
- Theme switching handled by `theme.js` with localStorage persistence
- Supports system preference detection via `prefers-color-scheme`
- Both light and dark themes with bordeaux/orange color palette

## Development Workflow

### No Build Process
This is a static website with no build tools, package managers, or transpilation. All files are served directly.

### Local Development
Simply open `index.html` in a web browser or serve the directory with any static web server:
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Using Node.js http-server (if available)
npx http-server

# Or any other static server
```

### Deployment
The site is hosted on GitHub Pages. Changes are deployed automatically when pushed to the `master` branch.

## Key Features

### Responsive Design
- Mobile-first approach with breakpoint at 768px
- Collapsible mobile navigation menu
- Flexible grid layout that stacks on mobile

### Interactive Elements
- Smooth scrolling navigation with active section highlighting
- Mobile hamburger menu with animation
- Dark/light theme toggle with icon switching
- Daily life chart using Chart.js (doughnut chart)
- Hover effects on profile picture and navigation elements

### Data Integration
The site could be enhanced to dynamically generate HTML content from the JSON resume data, but currently uses static HTML with the JSON files serving as potential data sources for future iterations.

## Styling Conventions
- Uses CSS custom properties for consistent theming
- Flexbox layout for responsive design
- CSS transitions for smooth interactions
- Font Awesome icons for visual elements
- Google Fonts (Roboto) for typography

## Potential Enhancements
- Dynamic HTML generation from JSON resume data
- JSON schema validation for resume data
- Additional chart visualizations
- Performance optimizations for mobile
- SEO meta tags optimization