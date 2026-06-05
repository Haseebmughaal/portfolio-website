/**
 * Professional Portfolio Website - Interactive Scripting Engine
 * Compatible with GitHub Pages, featuring high performance and lightweight modules.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize UI Elements
  initNavbarScroll();
  initBackToTop();
  initTypingAnimation();
  initScrollSpy();
  loadProjects();
  initAdminPanel();
  initResumeManager();
  initWeb3FormsManager();
  initContactForm();
  initScrollReveal();
});

/**
 * Adds styling to navbar when scrolled down the viewport
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check
}

/**
 * Typewriter typing effect for Hero Header subtitle titles
 */
function initTypingAnimation() {
  const target = document.getElementById('typed-text');
  if (!target) return;
  
  const words = [
  "Software Engineering Student",
  "Web Developer",
  "PHP Developer",
  "Frontend Developer",
  "UI/UX Enthusiast"
];
  
  let wordIndex = 0;
  let text = '';
  let isDeleting = false;
  
  function type() {
    const currentWord = words[wordIndex % words.length];
    
    if (isDeleting) {
      text = currentWord.substring(0, text.length - 1);
    } else {
      text = currentWord.substring(0, text.length + 1);
    }
    
    target.textContent = text;
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && text === currentWord) {
      typeSpeed = 2000; // Pause at top
      isDeleting = true;
    } else if (isDeleting && text === '') {
      isDeleting = false;
      wordIndex++;
      typeSpeed = 400; // Pause before typing new word
    }
    
    setTimeout(type, typeSpeed);
  }
  
  // Inject typing cursor in HTML alongside target if not present
  setTimeout(type, 800);
}

/**
 * Loads and dynamically renders projects from projects.json or localStorage database
 */
async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  let rawProjects = [];
  
  // Load user-defined projects from local database, fallback to projects.json if empty
  // Always fetch projects.json as base, then merge admin-added projects from localStorage
  let jsonProjects = [];
  try {
    const response = await fetch('./projects.json?v=' + Date.now());
    if (response.ok) {
      jsonProjects = await response.json();
    }
  } catch (error) {
    console.warn("Failed fetching projects.json database.", error);
  }

  // Load admin-added projects from localStorage
  const stored = localStorage.getItem('haseeb_projects');
  let storedProjects = [];
  if (stored) {
    try {
      storedProjects = JSON.parse(stored);
    } catch (e) {
      console.warn("Corrupted portfolio database storage.", e);
    }
  }

  // Filter out any stored projects that duplicate json projects by title
  const jsonTitles = jsonProjects.map(p => p.title);
  const adminProjects = storedProjects.filter(p => !jsonTitles.includes(p.title));

  // Merge: admin-added first, then json projects
  rawProjects = [...adminProjects, ...jsonProjects];
  
  // Render projects HTML template
  container.innerHTML = '';
  if (rawProjects.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="mb-3 text-muted">
          <i data-lucide="folder-open" style="width: 44px; height: 44px; stroke-width: 1.5; margin: 0 auto; display: block;"></i>
        </div>
        <h4 class="text-secondary fw-medium">No Case Studies Uploaded</h4>
        <p class="text-muted small">Access the Admin Panel in the navbar to configure your first specification.</p>
      </div>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }

  rawProjects.forEach((proj, idx) => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-12 mb-4 scroll-reveal';
    col.style.transitionDelay = `${(idx % 3) * 0.1}s`;
    
    // Generate skill badges HTML string
    const badgesHtml = proj.technologies.map(tech => `<span class="badge-tag">${tech}</span>`).join('');
    
    // Standardize images list
    const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"];
    const thumbnail = images[0];
    const imageCountBadge = images.length > 1 ? `<span class="position-absolute badge bg-dark bg-opacity-75 top-0 end-0 m-3 px-2 py-1.5 fs-8 text-white shadow-sm" style="border-radius: 6px; z-index: 5;"><i data-lucide="layers" class="me-1" style="width: 12px; height: 12px; display: inline-block;"></i> ${images.length} Images</span>` : '';

    col.innerHTML = `
      <div class="project-card h-100 position-relative d-flex flex-column" id="project-${idx}">
        <div class="project-img-container position-relative bg-light" style="cursor: pointer;" onclick="openProjectDetails(${idx})">
          <img src="${thumbnail}" alt="${proj.title}" class="project-img" loading="lazy" referrerPolicy="no-referrer">
          ${imageCountBadge}
        </div>
        <div class="project-body d-flex flex-column flex-grow-1">
          <h3 class="project-title" style="cursor: pointer;" onclick="openProjectDetails(${idx})">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>
          <div class="mb-3">${badgesHtml}</div>
          <div class="project-links d-flex gap-2 mt-auto">
            <button onclick="openProjectDetails(${idx})" class="btn btn-primary d-inline-flex align-items-center gap-1.5 flex-grow-1 justify-content-center">
              <i data-lucide="eye" style="width: 16px; height: 16px;"></i> Explore Case Specs
            </button>
            ${proj.github ? `
            <a href="${proj.github}" target="_blank" class="btn btn-secondary border d-inline-flex align-items-center justify-content-center px-3" title="GitHub Repository">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>` : ''}
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(col);
  });

  // Render new lucide SVGs
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Re-observe newly added scroll-reveals
  initScrollReveal();
}

/**
 * Handle Single Case Project Detail presentation Modal with Carousel
 */
window.openProjectDetails = function(index) {
  const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
  const proj = allProjects[index];
  if (!proj) return;

  // Set Title & Description
  document.getElementById('projectDetailTitle').innerText = proj.title;
  document.getElementById('projectDetailDesc').innerText = proj.description;

  // Render Badges
  const badgesContainer = document.getElementById('projectDetailBadges');
  badgesContainer.innerHTML = '';
  proj.technologies.forEach(tech => {
    const badge = document.createElement('span');
    badge.className = 'badge-tag';
    badge.innerText = tech;
    badgesContainer.appendChild(badge);
  });

  // Compile Slides & Indicators for Carousel
  const slidesContainer = document.getElementById('projectDetailSlides');
  const indicatorsContainer = document.getElementById('projectDetailIndicators');
  slidesContainer.innerHTML = '';
  indicatorsContainer.innerHTML = '';

  // Standardize single or multiple images
  const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"];

  images.forEach((imgUrl, i) => {
    // Indicator
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.setAttribute('data-bs-target', '#projectDetailCarousel');
    indicator.setAttribute('data-bs-slide-to', i);
    if (i === 0) {
      indicator.className = 'active';
      indicator.setAttribute('aria-current', 'true');
    }
    indicator.className += ' bg-dark';
    indicator.setAttribute('aria-label', `Slide ${i + 1}`);
    indicatorsContainer.appendChild(indicator);

    // Slide
    const slide = document.createElement('div');
    slide.className = `carousel-item h-100 ${i === 0 ? 'active' : ''}`;
    slide.innerHTML = `
      <div class="h-100 d-flex align-items-center justify-content-center bg-light">
        <img src="${imgUrl}" class="d-block w-100 h-100" alt="Project image ${i+1}" referrerPolicy="no-referrer" style="object-fit: contain;">
      </div>
    `;
    slidesContainer.appendChild(slide);
  });

  // Reset Carousel to index 0 on start
  const carouselInstance = bootstrap.Carousel.getOrCreateInstance(document.getElementById('projectDetailCarousel'));
  if (carouselInstance) {
    carouselInstance.to(0);
  }

  // Track slide change to update image counter badge
  const counterBadge = document.getElementById('carouselImageCounter');
  counterBadge.innerText = `1 of ${images.length} Images`;
  
  const carouselEl = document.getElementById('projectDetailCarousel');
  
  // Clear old listener
  const newCarouselEl = carouselEl.cloneNode(true);
  carouselEl.parentNode.replaceChild(newCarouselEl, carouselEl);
  
  newCarouselEl.addEventListener('slide.bs.carousel', event => {
    counterBadge.innerText = `${event.to + 1} of ${images.length} Images`;
  });

  // Render modal links
  const linksContainer = document.getElementById('projectDetailLinks');
  linksContainer.innerHTML = '';

  // Demo Link
  if (proj.demo) {
    const demoLink = document.createElement('a');
    demoLink.href = proj.demo;
    demoLink.target = '_blank';
    demoLink.className = 'btn btn-primary d-inline-flex align-items-center gap-2 flex-grow-1 justify-content-center';
    demoLink.innerHTML = `<i data-lucide="external-link" style="width: 16px; height: 16px;"></i> View Operational Live Presentation`;
    linksContainer.appendChild(demoLink);
  }

  // GitHub Link
  if (proj.github) {
    const ghLink = document.createElement('a');
    ghLink.href = proj.github;
    ghLink.target = '_blank';
    ghLink.className = 'btn btn-secondary d-inline-flex align-items-center gap-2 px-3 py-2 border shadow-none';
    ghLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> Code Repository`;
    linksContainer.appendChild(ghLink);
  }

  // Reload Lucide icons inside the modal
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Trigger Bootstrap Modal
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('projectDetailModal'));
  modal.show();
}

/**
 * Administrator Panel Operations, Credentials, and Creation Utilities.
 */
function initAdminPanel() {
  const loginBtn = document.getElementById('adminLoginBtn');
  const passwordInput = document.getElementById('adminPasswordInput');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const authLockState = document.getElementById('adminAuthLockState');
  const panelState = document.getElementById('adminPanelState');
  const sessionIndicator = document.getElementById('adminSessionIndicator');
  const addProjectForm = document.getElementById('adminAddProjectForm');

  // Handle URL parameter access detection for administrative view
  const navBtnAdmin = document.getElementById('nav-btn-admin');

  const checkAdminAccessVisibility = () => {
    const hasParam = window.location.search.includes('admin');
    const isUnlocked = localStorage.getItem('admin_access_enabled') === 'true';
    if (hasParam || isUnlocked) {
      if (navBtnAdmin) {
        navBtnAdmin.style.setProperty('display', 'inline-flex', 'important');
      }
      localStorage.setItem('admin_access_enabled', 'true');
    } else {
      if (navBtnAdmin) {
        navBtnAdmin.style.setProperty('display', 'none', 'important');
      }
    }
  };

  // Run on load to determine if Admin button is visible on this browser
  checkAdminAccessVisibility();

  // Load correct states if sessionStorage is true
  const checkAuth = () => {
    if (sessionStorage.getItem('portfolio_authenticated') === 'true') {
      if (authLockState) authLockState.classList.add('d-none');
      if (panelState) panelState.classList.remove('d-none');
      if (sessionIndicator) {
        sessionIndicator.classList.remove('d-none');
        sessionIndicator.classList.add('d-flex');
      }
      renderAdminProjectsList();
    } else {
      if (authLockState) authLockState.classList.remove('d-none');
      if (panelState) panelState.classList.add('d-none');
      if (sessionIndicator) {
        sessionIndicator.classList.add('d-none');
        sessionIndicator.classList.remove('d-flex');
      }
    }
  };

  const attemptLogin = () => {
    if (!passwordInput) return;
    const pwd = passwordInput.value;
    const storedPwd = localStorage.getItem('haseeb_admin_password') || 'admin';
    if (pwd === storedPwd) {
      sessionStorage.setItem('portfolio_authenticated', 'true');
      localStorage.setItem('admin_access_enabled', 'true');
      if (authErrorMsg) authErrorMsg.classList.add('d-none');
      passwordInput.value = '';
      checkAuth();
      showCustomNotification('Admin Workspace Authenticated Successfully');
    } else {
      if (authErrorMsg) authErrorMsg.classList.remove('d-none');
    }
  };

  if (loginBtn && passwordInput) {
    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') attemptLogin();
    });
  }

  // Active secure Logout button in footer
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('portfolio_authenticated');
      localStorage.removeItem('admin_access_enabled');
      checkAuth();
      checkAdminAccessVisibility();
      showCustomNotification('Secure admin session terminated and button hidden.');
    });
  }

  // Change security password form
  const customPasswordInput = document.getElementById('adminCustomPasswordInput');
  const savePasswordBtn = document.getElementById('btnSaveAdminPassword');
  if (savePasswordBtn) {
    savePasswordBtn.addEventListener('click', () => {
      const newPwd = customPasswordInput ? customPasswordInput.value.trim() : '';
      if (!newPwd) {
        showCustomNotification('Please enter a valid password.');
        return;
      }
      localStorage.setItem('haseeb_admin_password', newPwd);
      if (customPasswordInput) customPasswordInput.value = '';
      showCustomNotification('Admin security password changed successfully!');
    });
  }

  let currentLoadedImages = [];
  let thumbnailIndex = 0;

  const renderImagePreviews = () => {
    const previewContainer = document.getElementById('adminProjImagesPreviewContainer');
    if (!previewContainer) return;
    previewContainer.innerHTML = '';

    if (currentLoadedImages.length === 0) {
      return;
    }

    currentLoadedImages.forEach((base64, k) => {
      const isThumbnail = k === thumbnailIndex;
      const col = document.createElement('div');
      col.className = `position-relative rounded border p-1 shadow-sm d-flex flex-column align-items-center bg-white ${isThumbnail ? 'border-primary' : 'border-secondary-subtle'}`;
      col.style.width = '85px';
      col.style.cursor = 'pointer';
      col.style.transition = 'all 0.15s ease';
      if (isThumbnail) {
        col.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
      }
      
      col.innerHTML = `
        <div style="width: 100%; height: 60px; overflow: hidden; position: relative;" class="bg-light rounded mb-1">
          <img src="${base64}" alt="Preview image ${k+1}" style="width: 100%; height: 100%; object-fit: contain;">
          ${isThumbnail ? `
            <span class="position-absolute badge bg-primary top-0 start-0 m-1 px-1 py-0.5" style="font-size: 8px; border-radius: 4px; z-index: 2;">Cover</span>
          ` : ''}
        </div>
        <div class="text-center" style="font-size: 0.65rem; color: ${isThumbnail ? 'var(--primary)' : '#64748B'}; font-weight: ${isThumbnail ? '700' : '500'}; line-height: 1;">
          ${isThumbnail ? 'Cover' : 'Set Cover'}
        </div>
      `;

      col.addEventListener('click', () => {
        thumbnailIndex = k;
        renderImagePreviews();
      });

      previewContainer.appendChild(col);
    });
  };

  const imageFileInput = document.getElementById('adminProjImages');
  if (imageFileInput) {
    imageFileInput.addEventListener('change', async (e) => {
      const files = Array.from(imageFileInput.files || []);
      if (files.length === 0) {
        currentLoadedImages = [];
        thumbnailIndex = 0;
        renderImagePreviews();
        return;
      }
      
      try {
        const compressionPromises = files.map(file => compressImage(file, 800, 800, 0.7));
        currentLoadedImages = await Promise.all(compressionPromises);
        thumbnailIndex = 0;
        renderImagePreviews();
      } catch (err) {
        console.error("Compression preview error", err);
        showCustomNotification('Error reading uploaded images. Ensure files are valid images.');
      }
    });
  }

  // Bind Form Submission
  if (addProjectForm) {
    addProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('adminProjTitle').value;
      const description = document.getElementById('adminProjDesc').value;
      const technologiesText = document.getElementById('adminProjTech').value;
      const github = document.getElementById('adminProjGithub').value;
      const demo = document.getElementById('adminProjDemo').value;

      if (!title || !description || !technologiesText) {
        showCustomNotification('Please fulfill all mandatory properties.');
        return;
      }

      const isEditing = !isNaN(parseInt(addProjectForm.dataset.editingIndex, 10));
      if (currentLoadedImages.length === 0 && !isEditing) {
        showCustomNotification('Please select at least 1 image.');
        return;
      }

      // Re-order images so the selected thumbnail is at index 0
      const reorderedImages = [
        currentLoadedImages[thumbnailIndex],
        ...currentLoadedImages.filter((_, idx) => idx !== thumbnailIndex)
      ];

      const techArray = technologiesText.split(',').map(t => t.trim()).filter(Boolean);

      const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
      const newProject = {
        title,
        description,
        images: reorderedImages,
        technologies: techArray,
        github: github || undefined,
        demo: demo || undefined
      };

const editingIndex = parseInt(addProjectForm.dataset.editingIndex, 10);
      if (!isNaN(editingIndex) && editingIndex >= 0) {
        // Edit mode — keep old images if none uploaded
        if (currentLoadedImages.length === 0) {
          newProject.images = allProjects[editingIndex].images;
        }
        allProjects[editingIndex] = newProject;
        delete addProjectForm.dataset.editingIndex;
        const submitBtn = addProjectForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = `<i data-lucide="plus-circle" style="width: 18px; height: 18px;"></i> Append Project to Portfolio`;
          if (window.lucide) window.lucide.createIcons();
        }
      } else {
        // Add mode
        allProjects.unshift(newProject);
      }

      try {
        localStorage.setItem('haseeb_projects', JSON.stringify(allProjects));
      } catch (err) {
        console.error("Local storage quota exceeded writing project", err);
        showCustomNotification('Storage limits exceeded! Try uploading fewer or smaller screenshots, or delete older projects.');
        return;
      }

      // Reset form controls
      addProjectForm.reset();
      currentLoadedImages = [];
      thumbnailIndex = 0;
      renderImagePreviews();

      // Update UI panels instantly!
      loadProjects();
      renderAdminProjectsList();
      showCustomNotification(
        !isNaN(editingIndex) && editingIndex >= 0
          ? `Project "${title}" updated successfully!`
          : 'Dynamic Case Project added to portfolio!'
      );
    });
  }

  // Bind Export Projects JSON configuration
  const exportBtn = document.getElementById('btnExportProjectsJSON');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
      if (allProjects.length === 0) {
        showCustomNotification('You have no projects to export! Add a project first.');
        return;
      }
      
      const dataStr = JSON.stringify(allProjects, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'projects.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showCustomNotification('Static projects.json downloaded successfully!');
    });
  }

  // Initialize checks
  checkAuth();
}

/**
 * Renders the admin console projects list for deleting and managing added apps
 */
function renderAdminProjectsList() {
  const container = document.getElementById('adminProjectsList');
  const countSpan = document.getElementById('adminProjCount');
  if (!container) return;

  const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
  if (countSpan) {
    countSpan.innerText = allProjects.length;
  }

  if (allProjects.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4 text-secondary small">
        No active cases configured. Add a new project schema on the left.
      </div>
    `;
    return;
  }

  container.innerHTML = allProjects.map((proj, idx) => {
    const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"];
    const thumbnail = images[0];
    const imageCount = images.length;

    return `
      <div class="d-flex align-items-center gap-3 p-2 border-bottom" style="padding: 10px 0;">
        <img src="${thumbnail}" class="rounded border" style="width: 44px; height: 44px; object-fit: cover;" alt="${proj.title}" referrerPolicy="no-referrer">
        <div style="flex-grow: 1; min-width: 0;">
          <h5 class="small font-heading text-dark text-truncate mb-0 fw-bold">${proj.title}</h5>
          <span class="text-muted d-block" style="font-size: 0.725rem;">${imageCount} image${imageCount !== 1 ? 's' : ''} • ${proj.technologies.slice(0, 2).join(', ')}</span>
        </div>
        <button type="button" class="btn btn-outline-primary btn-sm border-0 px-2 py-1 btn-edit-proj" data-index="${idx}" title="Edit project">
          <i data-lucide="pencil" style="width: 14px; height: 14px; pointer-events: none;"></i>
        </button>
        <button type="button" class="btn btn-outline-danger btn-sm border-0 px-2 py-1 btn-delete-proj" data-index="${idx}" title="Delete project">
          <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
        </button>
      </div>
    `;
  }).join('');

// Bind delete buttons
  const deleteBtns = container.querySelectorAll('.btn-delete-proj');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-index'), 10);
      if (typeof window.deleteProjectFromAdmin === 'function') {
        window.deleteProjectFromAdmin(index);
      }
    });
  });

  // Bind edit buttons
  const editBtns = container.querySelectorAll('.btn-edit-proj');
  editBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-index'), 10);
      if (typeof window.editProjectFromAdmin === 'function') {
        window.editProjectFromAdmin(index);
      }
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Handle deletion triggered from Admin Row entries
 */
window.deleteProjectFromAdmin = function(idx) {
  const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
  if (idx < 0 || idx >= allProjects.length) return;

  const originalTitle = allProjects[idx].title;
  allProjects.splice(idx, 1);
  localStorage.setItem('haseeb_projects', JSON.stringify(allProjects));

  loadProjects();
  renderAdminProjectsList();
  showCustomNotification(`Deleted project "${originalTitle}" successfully`);
};

/**
 * Handle edit triggered from Admin Row — pre-fills the left form
 */
window.editProjectFromAdmin = function(idx) {
  const allProjects = JSON.parse(localStorage.getItem('haseeb_projects')) || [];
  if (idx < 0 || idx >= allProjects.length) return;

  const proj = allProjects[idx];

  document.getElementById('adminProjTitle').value = proj.title || '';
  document.getElementById('adminProjDesc').value = proj.description || '';
  document.getElementById('adminProjTech').value = (proj.technologies || []).join(', ');
  document.getElementById('adminProjGithub').value = proj.github || '';
  document.getElementById('adminProjDemo').value = proj.demo || '';

  const form = document.getElementById('adminAddProjectForm');
  form.dataset.editingIndex = idx;

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i data-lucide="save" style="width: 18px; height: 18px;"></i> Save Changes`;
    if (window.lucide) window.lucide.createIcons();
  }

  showCustomNotification(`Editing "${proj.title}" — update fields and click Save Changes.`);
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Handle Back to top button triggers
 */
function initBackToTop() {
  const bttBtn = document.getElementById('back-to-top');
  if (!bttBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  });
  
  bttBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Highlight navbar links when standard scrolling is performed
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (sections.length === 0 || navLinks.length === 0) return;
  
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // safe top spacer offset
    
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentId}` || (currentId === 'hero' && href === '#home')) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * Contact Form Interaction Handler
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitText = submitBtn ? submitBtn.innerHTML : 'Submit Dispatch';
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = document.getElementById('contactName') ? document.getElementById('contactName').value.trim() : '';
    const emailVal = document.getElementById('contactEmail') ? document.getElementById('contactEmail').value.trim() : '';
    const subjectVal = document.getElementById('contactSubject') ? document.getElementById('contactSubject').value.trim() : '';
    const messageVal = document.getElementById('contactMessage') ? document.getElementById('contactMessage').value.trim() : '';

    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
      showCustomNotification("Please fill in all the required fields.");
      return;
    }

    // Visual processing indicators
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending Message...
      `;
    }
    
    const savedKey = localStorage.getItem('haseeb_web3_key') || 'ba28a97b-32fb-4daa-8961-00b87f2204d3';

    if (savedKey) {
      // Real Web3Forms Submission
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: savedKey,
          botcheck: false,
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          from_name: "Portfolio Hub Inquiry"
        })
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok && json.success) {
          showCustomNotification("Message dispatched successfully directly to Haseeb's inbox!");
          form.reset();
        } else {
          showCustomNotification("Message could not be delivered. Please email me directly at haseebmughal016@gmail.com");
        }
      })
      .catch((error) => {
        console.error(error);
        showCustomNotification("Delivery failed. Please email me directly at haseebmughal016@gmail.com");
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitText;
        }
      });
    } else {
      // Simulate real asynchronous dispatcher latency
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitText;
        }
        
        showCustomNotification("Demo Sent! To get real emails, save a free Web3Forms Key in the Admin Panel.");
        form.reset();
      }, 1200);
    }
  });
}

/**
 * Floating luxury feedback modal notification
 */
function showCustomNotification(message) {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: #0F172A;
    color: #FFFFFF;
    padding: 16px 28px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    z-index: 9999;
    font-size: 0.95rem;
    font-weight: 500;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  feedback.innerHTML = `
    <span style="color: #60A5FA; font-size: 1.2rem;">✓</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(feedback);
  
  // Trigger transition entry
  requestAnimationFrame(() => {
    feedback.style.transform = "translateX(-50%) translateY(0)";
  });
  
  // Fade and self-destruct cycle
  setTimeout(() => {
    feedback.style.opacity = "0";
    feedback.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => {
      feedback.remove();
    }, 400);
  }, 4000);
}

/**
 * Intersection Observer entry effect
 */
function initScrollReveal() {
  const items = document.querySelectorAll('.scroll-reveal');
  if (items.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  items.forEach(item => observer.observe(item));
}

/**
 * Compress an image file using HTML5 Canvas to prevent local storage quota limit exceeded errors
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling dimensions to keep aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If no canvas context, return original base64
          resolve(e.target.result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to a compressed standard JPEG (highly storage efficient)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to convert a Base64 data URI to a local browser Blob URL.
 * Bypasses modern browser top-level navigation blocks on raw data URIs.
 */
function dataURItoBlobUrl(dataURI) {
  try {
    const parts = dataURI.split(';base64,');
    if (parts.length < 2) return dataURI;
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Error converting data URI to blob URL", e);
    return dataURI;
  }
}

/**
 * Interactive PDF Resume management state machine
 */
function initResumeManager() {
  const fileInput = document.getElementById('adminResumePDF');
  const statusDiv = document.getElementById('adminResumeStatus');
  const btnClear = document.getElementById('btnClearResumePDF');
  
  const defaultTemplate = document.getElementById('resumeDefaultTemplate');
  const pdfTemplate = document.getElementById('resumePDFTemplate');
  const btnDownload = document.getElementById('btnDownloadResumePDF');
  const btnOpen = document.getElementById('btnOpenResumePDF');
  const pdfObject = document.getElementById('resumePDFObject');

  let currentBlobUrl = null;

const updateResumeViews = () => {
    const savedPDF = localStorage.getItem('haseeb_resume_pdf');
    
    // Revoke old blob URL to prevent memory leaks
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }

    // Update main page modal views
    if (savedPDF) {
      currentBlobUrl = dataURItoBlobUrl(savedPDF);
      if (defaultTemplate) defaultTemplate.classList.add('d-none');
      if (pdfTemplate) pdfTemplate.classList.remove('d-none');
      if (btnDownload) btnDownload.href = currentBlobUrl;
      if (btnOpen) btnOpen.href = currentBlobUrl;
      if (pdfObject) pdfObject.setAttribute('data', currentBlobUrl);
    } else {
      // No custom PDF — fall back to the committed static PDF
      if (defaultTemplate) defaultTemplate.classList.add('d-none');
      if (pdfTemplate) pdfTemplate.classList.remove('d-none');
      const staticPDF = './Muhammad Haseeb CV.pdf';
      if (btnDownload) btnDownload.href = staticPDF;
      if (btnOpen) btnOpen.href = staticPDF;
      if (pdfObject) pdfObject.setAttribute('data', staticPDF);
    }

    // Update Admin Panel status controls
    if (fileInput) fileInput.value = ''; // clear input state
    
    if (savedPDF) {
      if (statusDiv) {
        statusDiv.innerHTML = `<i data-lucide="check" class="text-success" style="width: 14px; height: 14px;"></i> Custom PDF resume is active`;
      }
      if (btnClear) btnClear.style.display = 'inline-block';
    } else {
      if (statusDiv) {
        statusDiv.innerHTML = `<i data-lucide="info" style="width: 13px; height: 13px;"></i> Currently using the default static PDF`;
      }
      if (btnClear) btnClear.style.display = 'none';
    }

    // Refresh icon layout
    if (window.lucide && (statusDiv || btnClear)) {
      window.lucide.createIcons();
    }
  };

  // Bind change upload event
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        showCustomNotification('Please select a valid PDF document.');
        fileInput.value = '';
        return;
      }

      // Check size limit: 1.5MB to secure storage limits
      if (file.size > 1.5 * 1024 * 1024) {
        showCustomNotification('File too large! Upload a compressed PDF under 1.5MB.');
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          localStorage.setItem('haseeb_resume_pdf', reader.result);
          updateResumeViews();
          showCustomNotification('Custom PDF Resume attached successfully!');
        } catch (e) {
          console.error("Local storage error saving resume", e);
          showCustomNotification('Storage error! Try a smaller, more compressed PDF resume.');
        }
      };
      reader.onerror = () => {
        showCustomNotification('Error reading PDF file. Ensure it is not corrupted.');
      };
      reader.readAsDataURL(file);
    });
  }

  // Bind clear event
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      localStorage.removeItem('haseeb_resume_pdf');
      updateResumeViews();
      showCustomNotification('Custom PDF resume cleared. Reverted to default static PDF.');
    });
  }

  // Initial render on boot
  updateResumeViews();
}
/**
 * Manage Web3Forms Access Key and validation
 */
function initWeb3FormsManager() {
  const keyInput = document.getElementById('adminWeb3Key');
  const saveBtn = document.getElementById('btnSaveWeb3Key');
  const statusDiv = document.getElementById('adminWeb3Status');

  const updateWeb3Status = () => {
    const savedKey = localStorage.getItem('haseeb_web3_key') || 'ba28a97b-32fb-4daa-8961-00b87f2204d3';
    if (keyInput) {
      keyInput.value = savedKey || '';
    }
    if (statusDiv) {
      if (savedKey) {
        statusDiv.innerHTML = `<i data-lucide="check" class="text-success" style="width: 14px; height: 14px;"></i> Real email delivery is active`;
      } else {
        statusDiv.innerHTML = `<i data-lucide="info" class="text-muted" style="width: 13px; height: 13px;"></i> Running in demo simulation mode`;
      }
    }
    if (window.lucide && statusDiv) {
      window.lucide.createIcons();
    }
  };

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const key = keyInput ? keyInput.value.trim() : '';
      if (!key) {
        localStorage.removeItem('haseeb_web3_key');
        showCustomNotification('Access key cleared. Reverted to default key.');
      } else {
        localStorage.setItem('haseeb_web3_key', key);
        showCustomNotification('Web3Forms Access Key saved successfully!');
      }
      updateWeb3Status();
    });
  }

  updateWeb3Status();
}
