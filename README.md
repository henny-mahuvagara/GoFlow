# GoFlow — Real-Time Mobility & Delivery Platform

GoFlow is a modern urban mobility and delivery platform designed to connect passenger transit and package logistics into an intuitive, real-time GPS-powered network.

---

## 1. Current Experiment

### **EXP-1: Create a Basic Webpage Using HTML and CSS**

* **Theme:** **GOFLOW — URBAN FLOW LIGHT** (Clean, bright white urban mobility and connected network interface)
* **Objective:** Design and build the foundational responsive homepage for GoFlow using semantic HTML5, modern CSS3, and Bootstrap 5 utilities/components.
* **Status:** Completed.

---

## 2. Technologies & Visual Design System

* **Theme Name:** Urban Flow Light
* **HTML5:** Semantic document structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
* **CSS3:** Predominantly white and light color system (`--goflow-white: #FFFFFF`, `--goflow-background: #F8FAFC`, `--goflow-navy: #0F172A`, `--goflow-orange: #FF6B2C`, `--goflow-cyan: #18BFEF`, `--goflow-green: #22C55E`), subtle city grid patterns, light GPS route vector visualizations, and connected horizontal journey tracks.
* **Bootstrap 5.3.3 & Bootstrap Icons:** Responsive navbar collapse, grid system, utility spacing, and mobility iconography.
* **Google Fonts:** Plus Jakarta Sans font family for technical and modern typography.

---

## 3. Project Structure

```text
GoFlow/
│
├── frontend/
│   ├── index.html          # Main homepage markup with Urban Flow Light design
│   ├── css/
│   │   └── style.css       # Custom stylesheet with light urban tokens & responsive rules
│   └── js/
│       └── script.js       # Base script placeholder (validation starts in EXP-2)
│
├── backend/                # Reserved for Django & Django REST Framework (EXP-3+)
│   └── .gitkeep
│
├── database/               # Reserved for MongoDB schemas & connection scripts (EXP-5+)
│   └── .gitkeep
│
└── README.md               # Project documentation and experiment progression
```

---

## 4. How to Run the Frontend (Experiment 1)

1. Open `frontend/index.html` directly in any modern web browser:
   ```bash
   # On Windows PowerShell
   Start-Process .\frontend\index.html
   ```
2. Or serve via VS Code Live Server / Lightweight Python HTTP server:
   ```bash
   python -m http.server 5500 --directory frontend
   ```
   Then navigate to `http://localhost:5500/index.html`.

---

## 5. Scope & Deferred Implementations

To maintain strict adherence to **Experiment 1**:
* ❌ **No backend / Django server** (deferred to EXP-3)
* ❌ **No database / MongoDB connection** (deferred to EXP-5)
* ❌ **No client-side form validation / complex JS logic** (deferred to EXP-2)
* ❌ **No user authentication or API routes** (deferred to EXP-6)

---

## 6. Planned Experiment Progression

```text
EXP-1  ──► Basic GoFlow Webpage (HTML5 + CSS3 + Bootstrap) [URBAN FLOW LIGHT REDESIGN COMPLETED]
EXP-2  ──► JavaScript Form Validation & Interactivity
EXP-3  ──► Connect Django Backend Framework
EXP-4  ──► Dynamic Django Templates
EXP-5  ──► MongoDB CRUD Operations
EXP-6  ──► User Authentication (Login / Signup / Logout)
EXP-7  ──► Profile Images & Media Handling
EXP-8  ──► Pagination & Data Filtering
EXP-9  ──► Deployment & Production Readiness
EXP-10 ──► Complete GoFlow Full-Stack Application


---

## 7. Git Version Control Workflow

GoFlow uses Git and GitHub for source code management and version control.

### Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Main branch containing the stable project |
| `feature-crud` | Development branch for implementing and updating features |

### Git Workflow

The following workflow is used to manage project changes:

**1. Create a feature branch**
```bash
git switch -c feature-crud
```

**2. Check project changes**
```bash
git status
```

**3. Stage modified files**
```bash
git add .
```

**4. Commit changes**
```bash
git commit -m "Update GoFlow project documentation"
```

**5. Push the feature branch to GitHub**
```bash
git push -u origin feature-crud
```

**6. Merge changes into the main branch**
```bash
git switch main
git pull origin main
git merge feature-crud
git push origin main
```

### GitHub Repository

Repository: https://github.com/henny-mahuvagara/GoFlow

All project changes are maintained using Git commits and synchronized with the GitHub repository.
```
