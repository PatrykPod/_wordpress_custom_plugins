# WordPress Plugins – Code Review Repository

This repository contains several custom WordPress plugins created for internal use.
It is published **for code review and presentation purposes only**.

The repository does **not** include build artifacts or `node_modules`.

---

## Setup (for local testing)

1. Clone or download this repository
2. Copy the desired plugin folder(s) into: wp-content/plugins/
3. For plugins using Gutenberg blocks:
```bash
npm install
npm run build
```
4. Activate the plugin(s) in WordPress Admin

Note: node_modules is intentionally excluded. All dependencies can be installed locally.
Note2: newsletters plugins won't work without properly configured endpoint.



## Plugins Overview

### 1. image-carousel-patpod

A custom Gutenberg block providing a simple image carousel.

**Features:**
- Images managed per post
- Native WordPress media uploader
- Drag & drop ordering
- Editable alt text and manual order input
- Block state stored per post

**Notes:**
- Styling is intentionally unfinished
- The block focuses on editor UX and a stable authoring workflow rather than final visuals

---

### 2. newsletter-footer / newsletter-sidebar

A lightweight AJAX-based newsletter form plugin.

**Purpose:**
- Submits newsletter signup data to an external service
- Displays response messages directly on the WordPress page

**Architecture:**
- Frontend: WordPress (AJAX)
- Backend: Django (external endpoint)
- No business logic handled in WordPress

**HTML rendering:**
- The HTML structure of the form is rendered directly in WordPress templates
- JavaScript enhances the markup with AJAX submission and response handling

**Usage:**
- Deployed in two locations: site footer and sidebar
- Separated into two plugins for clearer server-side routing and logic

**Important notes:**
- These plugins will **not function without a properly configured backend endpoint**
- The external Django service is responsible for validation and response data

**Live example:**
https://www.open-e.com/blog/
https://www.open-e.com/ (page footer)

---

### 3. oe-featured-posts

A custom plugin for highlighting selected blog posts.

**Features:**
- Featured post selection available directly in the post list (admin view)
- Ordering and configuration handled outside the post editor
- Frontend rendering integrated into the blog homepage

**References:**
- Frontend example: https://www.open-e.com/blog/
- Backend UI screenshots: `/oe-featured-posts/screenshots/`

---

### 4. open-e-gutenberg-blocks

A parent plugin bundling multiple custom Gutenberg blocks.

**Description:**
- Acts as a container for site-specific editor blocks
- Each block is isolated in its own folder
- Blocks are registered via `block.json`

**Current contents:**
- Two simple text-styling blocks
- Screenshot available at:
