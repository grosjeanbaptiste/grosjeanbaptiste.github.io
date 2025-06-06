console.log('Fichier data-loader.js chargé avec succès');

class DataLoader {
  constructor() {
    console.log('Initialisation de la classe DataLoader');
    this.baseUrl = 'data';
    this.dataTypes = ['experiences', 'education', 'projects'];
    this.allItems = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.paginationContainer = null;
    console.log('DataLoader initialisé avec succès');
  }

  async loadData(type) {
    try {
      console.log(`Chargement des données pour ${type}...`);
      const response = await fetch(`${this.baseUrl}/${type}/${type}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Données chargées pour ${type}:`, data);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error(`Erreur lors du chargement de ${type}:`, error);
      return [];
    }
  }

  async renderTimelineItems() {
    console.log('Début de renderTimelineItems()');
    
    // Mise à jour des sélecteurs pour correspondre à la structure HTML
    const timelineContainer = document.querySelector('.timeline');
    const filtersContainer = document.querySelector('.timeline-filters');
    const paginationContainer = document.querySelector('.pagination-container');
    
    console.log('Conteneurs trouvés:', {
      timelineContainer: !!timelineContainer,
      filtersContainer: !!filtersContainer,
      paginationContainer: !!paginationContainer
    });
    
    if (!timelineContainer || !filtersContainer) {
      console.error('Conteneur de timeline ou filtres non trouvé');
      return;
    }
    
    // Créer le conteneur de pagination s'il n'existe pas
    if (!paginationContainer) {
      console.log('Création du conteneur de pagination...');
      const pagination = document.createElement('div');
      pagination.className = 'pagination-container';
      timelineContainer.parentNode.insertBefore(pagination, timelineContainer.nextSibling);
      this.paginationContainer = pagination;
    } else {
      this.paginationContainer = paginationContainer;
    }

    // Afficher le message de chargement
    timelineContainer.innerHTML = '<div class="loading-message">Chargement des données...</div>';
    console.log('Message de chargement affiché');

    try {
      console.log('Types de données à charger:', this.dataTypes);
      
      // Charger toutes les données en parallèle
      const allData = await Promise.all(
        this.dataTypes.map(async type => {
          console.log(`Chargement des données de type: ${type}`);
          const data = await this.loadData(type);
          console.log(`Données chargées pour ${type}:`, data);
          return data;
        })
      );

      // Fusionner et trier toutes les entrées par date
      this.allItems = allData.flat().sort((a, b) => {
        const dateA = a.startDate || a.date || '1970-01-01';
        const dateB = b.startDate || b.date || '1970-01-01';
        console.log(`Tri: ${dateA} vs ${dateB}`);
        return new Date(dateB) - new Date(dateA);
      });
      
      console.log('Toutes les données chargées et triées:', this.allItems);

      // Afficher les filtres
      this.renderFilters(filtersContainer);
      
      // Afficher les éléments filtrés et paginés
      this.renderFilteredItems(timelineContainer, paginationContainer);

    } catch (error) {
      console.error('Erreur lors du rendu de la timeline:', error);
      if (timelineContainer) {
        timelineContainer.innerHTML = `
          <div class="error-message">
            <p>Erreur lors du chargement des données.</p>
            <p>${error.message || 'Veuillez réessayer plus tard.'}</p>
          </div>`;
      }
    }
  }

  renderFilters(container) {
    if (!container) return;
    
    const filters = [
      { id: 'all', label: 'Tout' },
      { id: 'experience', label: 'Expériences' },
      { id: 'education', label: 'Formation' },
      { id: 'project', label: 'Projets' }
    ];

    container.innerHTML = `
      <div class="filters">
        ${filters.map(filter => `
          <button 
            class="filter-btn ${this.currentFilter === filter.id ? 'active' : ''}" 
            data-filter="${filter.id}"
          >
            ${filter.label}
          </button>
        `).join('')}
      </div>
    `;

    // Ajouter les écouteurs d'événements
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentFilter = e.target.dataset.filter;
        this.currentPage = 1; // Réinitialiser à la première page
        this.renderFilteredItems(
          document.querySelector('#timeline .timeline'),
          document.querySelector('#pagination')
        );
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  getFilteredItems() {
    if (this.currentFilter === 'all') {
      return this.allItems;
    }
    return this.allItems.filter(item => item.type === this.currentFilter);
  }

  renderFilteredItems(container, paginationContainer) {
    if (!container) return;
    
    const filteredItems = this.getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / this.itemsPerPage);
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedItems = filteredItems.slice(startIdx, startIdx + this.itemsPerPage);

    // Afficher les éléments
    container.innerHTML = '';
    if (paginatedItems.length === 0) {
      container.innerHTML = '<div class="no-data">Aucun élément à afficher.</div>';
    } else {
      paginatedItems.forEach(item => {
        const element = this.createTimelineItem(item);
        if (element) container.appendChild(element);
      });
    }

    // Afficher la pagination si nécessaire
    this.renderPagination(paginationContainer, totalPages);
  }

  renderPagination(container, totalPages) {
    if (!container || totalPages <= 1) {
      container && (container.innerHTML = '');
      return;
    }

    container.innerHTML = `
      <div class="pagination">
        <button class="page-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>
          &laquo; Précédent
        </button>
        <span class="page-info">
          Page ${this.currentPage} sur ${totalPages}
        </span>
        <button class="page-btn" data-page="next" ${this.currentPage === totalPages ? 'disabled' : ''}>
          Suivant &raquo;
        </button>
      </div>
    `;

    // Ajouter les écouteurs d'événements
    container.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.dataset.page === 'prev' && this.currentPage > 1) {
          this.currentPage--;
        } else if (e.target.dataset.page === 'next' && this.currentPage < totalPages) {
          this.currentPage++;
        }
        this.renderFilteredItems(
          document.querySelector('#timeline .timeline'),
          container
        );
      });
    });
  }

  createTimelineItem(data) {
    if (!data) return null;

    const item = document.createElement('div');
    item.className = `timeline-item ${this.getItemPositionClass(data.type)}`;
    item.dataset.type = data.type;

    // Créer le contenu en fonction du type
    let content = '';
    
    switch(data.type) {
      case 'experience':
        content = this.createExperienceContent(data);
        break;
      case 'education':
        content = this.createEducationContent(data);
        break;
      case 'project':
        content = this.createProjectContent(data);
        break;
      default:
        return null;
    }

    item.innerHTML = content;
    return item;
  }

  getItemPositionClass(type) {
    // Alterner la position gauche/droite en fonction du type
    const positions = {
      experience: 'right',
      education: 'left',
      project: 'right'
    };
    return positions[type] || 'left';
  }

  createExperienceContent(data) {
    const descriptionList = Array.isArray(data.description) 
      ? data.description.map(desc => `<li>${desc}</li>`).join('')
      : '';

    const tags = Array.isArray(data.tags)
      ? data.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')
      : '';

    return `
      <section id="timeline" class="section">
        <div class="section-header reveal" data-animate="animate-fade-in-up">
          <h2 class="section-title">Mon Parcours</h2>
          <div class="section-divider"></div>
        </div>
        
        <!-- Filtres -->
        <div id="timeline-filters" class="timeline-filters">
          <!-- Les filtres seront insérés ici par JavaScript -->
        </div>
        
        <!-- Conteneur de la timeline -->
        <div class="timeline">
          <div class="loading-message">Chargement des données...</div>
        </div>
        
        <!-- Pagination -->
        <div id="pagination" class="pagination-container">
          <!-- La pagination sera insérée ici par JavaScript -->
        </div>
      </section>
      <div class="timeline-content">
        <span class="timeline-date">${data.date || ''}</span>
        <h3 class="timeline-title">${data.title || ''}</h3>
        <div class="timeline-company">
          <i class="fas fa-building"></i>
          ${data.company || ''}
        </div>
        ${data.location ? `
        <div class="timeline-location">
          <i class="fas fa-map-marker-alt"></i>
          ${data.location}
        </div>` : ''}
        ${descriptionList ? `<ul class="timeline-description">${descriptionList}</ul>` : ''}
        ${tags ? `<div class="timeline-tags">${tags}</div>` : ''}
      </div>`;
  }

  createEducationContent(data) {
    return `
      <div class="timeline-content">
        <span class="timeline-date">${data.date || ''}</span>
        <h3 class="timeline-title">${data.degree || ''}</h3>
        <div class="timeline-company">
          <i class="fas fa-university"></i>
          ${data.institution || ''}
        </div>
        ${data.location ? `
        <div class="timeline-location">
          <i class="fas fa-map-marker-alt"></i>
          ${data.location}
        </div>` : ''}
        ${data.description ? `<p class="timeline-description">${data.description}</p>` : ''}
      </div>`;
  }

  createProjectContent(data) {
    const tags = Array.isArray(data.technologies)
      ? data.technologies.map(tech => `<span class="timeline-tag">${tech}</span>`).join('')
      : '';

    return `
      <div class="timeline-content">
        <span class="timeline-date">${data.date || ''}</span>
        <h3 class="timeline-title">${data.title || ''}</h3>
        ${data.description ? `<p class="timeline-description">${data.description}</p>` : ''}
        ${data.link ? `
        <div class="timeline-links">
          <a href="${data.link}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Voir le projet
          </a>
        </div>` : ''}
        ${tags ? `<div class="timeline-tags">${tags}</div>` : ''}
      </div>`;
  }

  // Initialiser le chargement des données
  async init() {
    console.log('Début de la méthode init()');
    try {
      console.log('Appel de renderTimelineItems()...');
      await this.renderTimelineItems();
      console.log('Méthode renderTimelineItems() terminée avec succès');
    } catch (error) {
      console.error('Erreur dans renderTimelineItems():', error);
      throw error; // Propager l'erreur pour qu'elle soit capturée par le gestionnaire d'erreur externe
    }
  }
}

// Exporter la classe DataLoader en tant que variable globale
console.log('Exportation de la classe DataLoader...');
window.DataLoader = DataLoader;
console.log('DataLoader exporté avec succès:', typeof DataLoader);

// Initialiser le chargeur de données lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - Début de l\'initialisation du DataLoader');
  try {
    console.log('Création d\'une nouvelle instance de DataLoader...');
    const dataLoader = new DataLoader();
    console.log('Instance DataLoader créée avec succès:', dataLoader);
    console.log('Appel de la méthode init()...');
    dataLoader.init();
    console.log('Méthode init() appelée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du DataLoader:', error);
  }
});
