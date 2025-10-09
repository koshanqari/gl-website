# Work Content Guide - Markdown Editor

This guide explains how to use the markdown content feature for work/project pages, similar to the blog system.

## Overview

Each work item now supports a detailed `content` field that uses **Markdown formatting**. This allows you to create rich, formatted project case studies with:

- ✅ Headings and subheadings
- ✅ Bold and italic text
- ✅ Bullet and numbered lists
- ✅ Blockquotes for testimonials
- ✅ Tables for data
- ✅ Links and inline formatting
- ✅ Horizontal rules for section breaks

## Accessing the Editor

### Admin Panel
1. Go to `/intellsys/our-work`
2. Click **"Edit"** on an existing project, or
3. Click **"Add New Project"** to create a new one
4. Scroll to the **"Project Details (Optional)"** section
5. Use the markdown editor to write your content

### The Markdown Editor
The editor includes a toolbar with helpful buttons:
- **H1, H2, H3**: Add headings
- **B**: Bold text
- **I**: Italic text
- **Quote**: Block quote
- **UL**: Bullet list
- **OL**: Numbered list
- **Link**: Insert link
- **Code**: Inline code

## Markdown Syntax Quick Reference

### 1. Headings

```markdown
# Heading 1 (Main title)
## Heading 2 (Section)
### Heading 3 (Subsection)
#### Heading 4 (Minor section)
```

### 2. Text Formatting

```markdown
**Bold text** or __Bold text__
*Italic text* or _Italic text_
***Bold and italic***
~~Strikethrough~~
```

### 3. Lists

**Bullet Lists:**
```markdown
- Item 1
- Item 2
  - Nested item
- Item 3
```

**Numbered Lists:**
```markdown
1. First item
2. Second item
3. Third item
```

### 4. Links

```markdown
[Link text](https://example.com)
[Contact us](/contact)
```

### 5. Blockquotes (Great for Testimonials!)

```markdown
> "This is a quote or testimonial from a client."
> 
> — *Client Name, Company*
```

### 6. Horizontal Rules

```markdown
---
```

### 7. Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### 8. Emojis (Optional)

You can use emojis directly:
```markdown
🎯 Event Strategy
🎨 Creative Design
✅ Completed task
```

## Content Structure Best Practices

### Recommended Sections for Project Content

```markdown
# Project Overview
Brief introduction to the project

## Event Highlights
Key features and moments

### Planning & Preparation
- Timeline
- Objectives
- Challenges

### Execution
- Venue setup
- Technical production
- Guest experience

## Services Provided
What your team delivered

### 🎯 Event Strategy
Details...

### 🎨 Creative Design
Details...

## Results & Impact
Key metrics and outcomes

| Metric | Target | Achieved |
|--------|--------|----------|
| Attendance | 500 | 650 |
| Satisfaction | 85% | 92% |

## Client Testimonial
> "Quote from satisfied client..."
> 
> — *Name, Position*

## Photo Gallery
Description of visuals

---

*Call to action link*
```

## Example Use Cases

### 1. Conference Event Content

```markdown
# Tech Summit 2024 Overview

This flagship technology conference brought together 2000+ industry leaders.

## Key Highlights

### Day 1: Innovation
- Keynote speakers from Fortune 500
- Live tech demonstrations
- Networking sessions

### Day 2: Workshops
12 parallel tracks covering AI, Cloud, and Cybersecurity

## Results
- ✅ 2000+ attendees
- ✅ 98% satisfaction rate
- ✅ Zero technical issues
```

### 2. Product Launch Content

```markdown
# Revolutionary Product Launch

## The Reveal
A dramatic unveiling that captured audience attention

### Audio Visual Setup
- 4K LED screens (20ft x 10ft)
- Custom light show
- Multi-camera live streaming

## Media Coverage
- 📰 50+ media outlets
- 📱 10M+ social impressions
- 🎥 2M+ live stream views
```

### 3. Gala Event Content

```markdown
# Elegant Charity Gala

## Event Flow
- 🍸 Cocktail hour with live quartet
- 🍽️ Five-course dinner
- 🎤 Fundraising program
- 🎵 After-party with live band

## Fundraising Success
Total Raised: **$825,000** (exceeded goal by 38%)
```

## Tips for Great Content

### ✅ DO:
- Use clear, descriptive headings
- Include specific metrics and numbers
- Add client testimonials in blockquotes
- Break content into scannable sections
- Use lists for easy reading
- Include calls-to-action at the end
- Add emojis for visual interest (sparingly)

### ❌ DON'T:
- Write walls of text without formatting
- Use too many heading levels (stick to H1-H4)
- Forget to proofread
- Leave the content field completely empty (description is enough)
- Overuse emojis or special characters

## When to Use Content vs. Description

### Description (Required)
- Always shown on listing pages
- 2-4 sentences summary
- Appears in featured project cards
- Used for SEO meta descriptions

### Content (Optional)
- Only shown on individual project pages
- Detailed case study format
- Can be 500-2000+ words
- Rich formatting with markdown

**Use Content When:**
- You want to showcase a project in detail
- You have specific metrics and testimonials
- The project demonstrates your capabilities
- You want better SEO for the project page

**Skip Content When:**
- The project is straightforward
- Description is sufficient
- You don't have detailed information yet

## Preview Your Content

After editing:
1. Save the project in admin panel
2. Visit the public site at `/our-work`
3. Click on your project
4. Verify formatting looks correct
5. Make adjustments as needed

## Keyboard Shortcuts

In the markdown editor:
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + K**: Insert link
- **Tab**: Indent list item
- **Shift + Tab**: Unindent list item

## Getting Help

Need assistance with markdown or content structure?
- Check the toolbar buttons for quick formatting
- Reference this guide for syntax
- Look at existing blog posts for inspiration
- View sample content in the migration SQL file

---

## Sample Content Templates

### Template 1: Standard Project

```markdown
# [Project Name]

Brief introduction paragraph about the project and client.

## Overview
Key information about the event

## What We Delivered
- Service 1
- Service 2
- Service 3

## Results
Specific outcomes and metrics

## Client Feedback
> "Testimonial quote"
> — *Client Name*

---

*Ready to create something amazing? [Contact us](/contact)*
```

### Template 2: Detailed Case Study

```markdown
# [Project Name] - Complete Case Study

## The Challenge
What problem was the client facing?

## Our Solution
How did you approach it?

### Phase 1: Planning
Details...

### Phase 2: Execution
Details...

### Phase 3: Post-Event
Details...

## Key Achievements
| Metric | Result |
|--------|--------|
| Item 1 | Value 1 |
| Item 2 | Value 2 |

## Testimonial
> "Quote"

## Lessons Learned
Insights for future projects

---

[CTA Link]
```

Save this guide for future reference! 📚

