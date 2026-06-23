import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Article } from '../../services/mock-data.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="catalog-container">
      <div class="catalog-layout">
        <!-- Left Sidebar Filters -->
        <aside class="sidebar-filters" [class.drawer-open]="showFiltersDrawer()">
          <!-- Close button for mobile drawer -->
          <div class="drawer-header-mobile">
            <h3>Filtros</h3>
            <button type="button" (click)="closeFiltersDrawer()" class="btn-close-drawer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Componentes Section -->
          <div class="filter-section">
            <h3 class="filter-title">Componentes</h3>
            <ul class="filter-list">
              <li *ngFor="let cat of categories">
                <button 
                  [class.active]="selectedCategory() === cat" 
                  (click)="toggleCategory(cat)"
                  class="filter-link"
                >
                  {{ cat }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Estado del Artículo Section -->
          <div class="filter-section">
            <h3 class="filter-title">Estado del Artículo</h3>
            <ul class="filter-list">
              <li *ngFor="let st of states">
                <button 
                  [class.active]="selectedState() === st" 
                  (click)="toggleState(st)"
                  class="filter-link"
                >
                  {{ st }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Tipo de Adquisición Section -->
          <div class="filter-section">
            <h3 class="filter-title">Tipo de Adquisición</h3>
            <ul class="filter-list">
              <li *ngFor="let type of acquisitionTypes">
                <button 
                  [class.active]="selectedAcquisition() === type" 
                  (click)="toggleAcquisition(type)"
                  class="filter-link"
                >
                  {{ type }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Reset Filters Button -->
          <button 
            *ngIf="hasActiveFilters()" 
            (click)="resetFilters()" 
            class="btn-secondary btn-reset-filters"
          >
            Limpiar Filtros
          </button>
        </aside>

        <!-- Backdrop overlay when drawer is open (only on mobile) -->
        <div *ngIf="showFiltersDrawer()" class="drawer-backdrop" (click)="closeFiltersDrawer()"></div>

        <!-- Main Grid of Items -->
        <main class="grid-content">
          <div class="grid-header">
            <p class="results-count">Mostrando {{ filteredArticles().length }} componentes</p>

            <div class="header-actions">
              <button routerLink="/create-publication" class="btn-accent btn-add-pub">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier"> 
                    <path d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> 
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z" fill="currentColor"></path> 
                  </g>
                </svg>
                Nueva Publicación
              </button>
            </div>
          </div>

          <div *ngIf="filteredArticles().length === 0" class="empty-state card-premium">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <h3>No se encontraron artículos</h3>
            <p>Intenta ajustar los criterios de búsqueda o filtros para encontrar lo que necesitas.</p>
            <button (click)="resetFilters()" class="btn-primary">Mostrar todo</button>
          </div>

          <div class="article-grid">
            <div *ngFor="let item of filteredArticles()" class="article-card card-premium">
              <!-- Item Image Wrapper -->
              <div class="card-image-wrapper" [routerLink]="['/product', item.id]">
                <div class="placeholder-img">
                  <img *ngIf="item.images && item.images[0] && (item.images[0].startsWith('data:') || item.images[0].startsWith('http')); else defaultSvg" [src]="item.images[0]" class="card-uploaded-img" alt="Foto del componente" />
                  <ng-template #defaultSvg>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </ng-template>
                </div>
                
                <!-- Floating State Tag -->
                <span class="state-tag" [class]="item.state.toLowerCase().replace(' ', '-')">{{ item.state }}</span>
              </div>

              <!-- Item Info -->
              <div class="card-info">
                <h3 class="item-title" [routerLink]="['/product', item.id]">{{ item.title }}</h3>
                <p class="item-seller">Vendedor: {{ item.sellerName }}</p>
                
                <!-- Reputation Stars -->
                <div class="reputation-stars">
                  <svg 
                    *ngFor="let star of [1,2,3,4,5]" 
                    [class.filled]="star <= item.sellerReputation"
                    viewBox="0 0 24 24" 
                    width="14" 
                    height="14" 
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span class="rep-number">{{ item.sellerReputation }}</span>
                </div>

                <!-- Acquisition type & Cost / Icons -->
                <div class="card-footer-details">
                  <div class="acquisition-type">
                    <span class="type-label">Adquisición:</span>
                    <span class="type-value" [class]="item.acquisitionType.toLowerCase()">{{ item.acquisitionType }}</span>
                  </div>

                  <div class="deal-indicator">
                    <!-- Venta details -->
                    <span *ngIf="item.acquisitionType === 'Venta'" class="price-value">
                      \${{ item.price | number:'1.2-2' }}
                    </span>

                    <!-- Donacion details -->
                    <span *ngIf="item.acquisitionType === 'Donación'" class="donation-icon" title="Donación / Regalo">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" class="heart-svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </span>

                    <!-- Intercambio details -->
                    <span *ngIf="item.acquisitionType === 'Intercambio'" class="intercambio-icon" title="Intercambio / Trueque">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" class="exchange-svg">
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Action button to save / unsave -->
                <div class="card-actions">
                  <button 
                    [class.saved]="mockService.isSaved(item.id)" 
                    (click)="mockService.toggleSave(item.id)"
                    class="btn-save-bookmark"
                    [title]="mockService.isSaved(item.id) ? 'Quitar de guardados' : 'Guardar publicación'"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                  <button [routerLink]="['/product', item.id]" class="btn-details">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Floating Action Buttons for Responsive / Mobile -->
      <div class="responsive-fabs">
        <!-- Floating Toggle Filters Button -->
        <button type="button" (click)="openFiltersDrawer()" class="fab-btn fab-btn-filters" title="Mostrar Filtros">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
          </svg>
        </button>

        <!-- Floating New Publication Button (SVG only) -->
        <button routerLink="/create-publication" class="fab-btn fab-btn-add" title="Nueva Publicación">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
              <path d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> 
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z" fill="currentColor"></path> 
            </g>
          </svg>
        </button>
      </div>

      <!-- Welcome Toast -->
      <div *ngIf="showWelcomeModal()" class="welcome-toast card-premium">
        <div class="welcome-toast-content">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="welcome-toast-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>¡Bienvenido, <strong>{{ mockService.currentUser()?.name }}</strong>!</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding-top: 20px;
    }

    /* Grid layout */
    .catalog-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 32px;
      align-items: start;
    }

    /* Sidebar Filters (Default Desktop) */
    .sidebar-filters {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: static;
      width: 100%;
      height: auto;
      backdrop-filter: none;
      z-index: 1;
    }

    /* Hide close button and mobile header on desktop */
    .drawer-header-mobile {
      display: none;
    }

    /* Floating action buttons container (Hidden on Desktop) */
    .responsive-fabs {
      display: none;
    }

    /* Backdrop overlay hidden on desktop */
    .drawer-backdrop {
      display: none;
    }

    .filter-section {
      margin-bottom: 24px;
    }

    .filter-section:last-of-type {
      margin-bottom: 0;
    }

    .filter-title {
      font-size: 1.1rem;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
      font-weight: 700;
    }

    .filter-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-link {
      width: 100%;
      text-align: left;
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: var(--border-radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .filter-link:hover {
      background-color: var(--primary-color-light);
      color: var(--primary-color);
      padding-left: 16px;
    }

    .filter-link.active {
      background-color: var(--primary-color-light);
      color: var(--primary-color);
      font-weight: 700;
      padding-left: 16px;
      border-left: 3px solid var(--primary-color);
    }

    .btn-reset-filters {
      width: 100%;
      margin-top: 16px;
      padding: 8px;
      font-size: 0.9rem;
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }

      /* Sidebar Filters Drawer on responsive screens */
      .sidebar-filters {
        position: fixed;
        top: 0;
        left: -340px; /* Hide by default */
        width: 320px;
        height: 100vh;
        z-index: 1100;
        background: rgba(255, 255, 255, 0.75); /* semi-transparent for blur */
        backdrop-filter: blur(16px); /* blur effect */
        box-shadow: var(--shadow-lg);
        transition: left var(--transition-normal);
        overflow-y: auto;
        border-radius: 0 !important;
        border: none !important;
        border-right: 1px solid var(--border-color) !important;
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .sidebar-filters.drawer-open {
        left: 0;
      }

      .drawer-header-mobile {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 16px;
        margin-bottom: 8px;
      }

      .drawer-header-mobile h3 {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--primary-color);
      }

      .btn-close-drawer {
        background: #f1f5f9;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-muted);
        transition: all var(--transition-fast);
      }

      .btn-close-drawer:hover {
        background: #e2e8f0;
        color: var(--text-main);
      }

      /* Hide the default desktop "Nueva Publicación" button */
      .btn-add-pub {
        display: none !important;
      }

      /* Backdrop overlay */
      .drawer-backdrop {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.25);
        backdrop-filter: blur(8px);
        z-index: 1050;
        animation: drawerFadeIn 0.2s ease-out;
      }

      /* Show Fabs on responsive screens */
      .responsive-fabs {
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1040;
      }

      .fab-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 51, 102, 0.25);
        transition: all var(--transition-fast);
      }

      .fab-btn:hover {
        transform: translateY(-3px) scale(1.05);
      }

      .fab-btn-filters {
        background-color: var(--primary-color);
        color: white;
      }

      .fab-btn-filters:hover {
        background-color: var(--primary-color-hover);
        box-shadow: 0 6px 20px rgba(0, 51, 102, 0.35);
      }

      .fab-btn-add {
        background-color: var(--accent-color);
        color: white;
      }

      .fab-btn-add:hover {
        background-color: var(--accent-color-hover);
        box-shadow: 0 6px 20px rgba(10, 136, 138, 0.35);
      }
    }

    @keyframes drawerFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 480px) {
      .grid-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      .results-count {
        text-align: center;
      }
    }

    /* Grid Content Area */
    .grid-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .results-count {
      color: var(--text-muted);
      font-weight: 500;
    }

    .btn-add-pub {
      font-size: 0.95rem;
      padding: 10px 18px;
    }

    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .article-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
      border-radius: var(--border-radius-md);
      transition: all var(--transition-normal);
    }

    .article-card:hover {
      transform: translateY(-4px);
    }

    .card-image-wrapper {
      width: 100%;
      height: 180px;
      background: #f1f5f9;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border-color);
    }

    .placeholder-img {
      color: #94a3b8;
      transition: transform var(--transition-normal);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-uploaded-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .article-card:hover .placeholder-img {
      transform: scale(1.04);
    }

    .state-tag {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .state-tag.nuevo {
      background-color: var(--accent-color);
    }

    .state-tag.casi-nuevo {
      background-color: #3498db;
    }

    .state-tag.usado {
      background-color: #7f8c8d;
    }

    .card-info {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .item-title {
      font-size: 1.15rem;
      margin-bottom: 6px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
    }

    .item-title:hover {
      color: var(--accent-color);
    }

    .item-seller {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .reputation-stars {
      display: flex;
      align-items: center;
      gap: 2px;
      color: #cbd5e1;
      margin-bottom: 14px;
    }

    .reputation-stars svg.filled {
      color: var(--star-color);
    }

    .rep-number {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-left: 6px;
    }

    .card-footer-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
      margin-bottom: 16px;
    }

    .acquisition-type {
      display: flex;
      flex-direction: column;
    }

    .type-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .type-value {
      font-size: 0.9rem;
      font-weight: 700;
    }

    .type-value.venta {
      color: var(--primary-color);
    }

    .type-value.donación {
      color: var(--heart-color);
    }

    .type-value.intercambio {
      color: var(--exchange-color);
    }

    .price-value {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--accent-color);
      font-family: var(--font-heading);
    }

    .donation-icon {
      color: var(--heart-color);
      animation: heartbeat 2s infinite;
    }

    .intercambio-icon {
      color: var(--exchange-color);
    }

    .card-actions {
      display: grid;
      grid-template-columns: 46px 1fr;
      gap: 10px;
    }

    .btn-save-bookmark {
      background: #f1f5f9;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #94a3b8;
      transition: all var(--transition-fast);
    }

    .btn-save-bookmark:hover {
      background: var(--primary-color-light);
      color: var(--primary-color);
    }

    .btn-save-bookmark.saved {
      background: var(--accent-color-light);
      color: var(--accent-color);
      border-color: var(--accent-color);
    }

    .btn-details {
      background: var(--primary-color-light);
      color: var(--primary-color);
      border: none;
      border-radius: var(--border-radius-sm);
      padding: 10px;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      text-align: center;
      transition: all var(--transition-fast);
    }

    .btn-details:hover {
      background: var(--primary-color);
      color: white;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 40px;
      color: var(--text-muted);
    }

    .empty-icon {
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 1.4rem;
      margin-bottom: 8px;
      color: var(--primary-color);
    }

    .empty-state p {
      max-width: 400px;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.12); }
      28% { transform: scale(1); }
      42% { transform: scale(1.12); }
      70% { transform: scale(1); }
    }

    /* Welcome Toast Styles */
    .welcome-toast {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: white;
      padding: 14px 28px;
      border-radius: var(--border-radius-sm);
      box-shadow: var(--shadow-lg);
      z-index: 3000;
      animation: slideDownFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .welcome-toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1rem;
      font-weight: 500;
    }

    .welcome-toast-icon {
      color: var(--accent-color-light);
    }

    @keyframes slideDownFadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  mockService = inject(MockDataService);
  private router = inject(Router);

  showWelcomeModal = signal(false);
  showFiltersDrawer = signal(false);

  openFiltersDrawer() {
    this.showFiltersDrawer.set(true);
  }

  closeFiltersDrawer() {
    this.showFiltersDrawer.set(false);
  }

  ngOnInit() {
    if (sessionStorage.getItem('show_welcome_modal') === 'true') {
      this.showWelcomeModal.set(true);
      sessionStorage.removeItem('show_welcome_modal');
      
      // Auto close the welcome toast after 2 seconds
      setTimeout(() => {
        this.showWelcomeModal.set(false);
      }, 2000);
    }
  }

  closeWelcomeModal() {
    this.showWelcomeModal.set(false);
  }

  // Filters State
  selectedCategory = signal<string | null>(null);
  selectedState = signal<string | null>(null);
  selectedAcquisition = signal<string | null>(null);
  
  categories = [
    'Semiconductores',
    'Pasivos',
    'Tarjetas de desarrollo',
    'Módulos y Sensores',
    'Herramientas y Equipo',
    'Kits Completos'
  ];

  states = ['Nuevo', 'Casi Nuevo', 'Usado'];

  acquisitionTypes = ['Venta', 'Donación', 'Intercambio'] as const;

  // Filtered Articles
  filteredArticles = computed(() => {
    const list = this.mockService.publications();
    const query = this.mockService.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const st = this.selectedState();
    const acq = this.selectedAcquisition();

    return list.filter(item => {
      // 1. Text Search
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesSeller = item.sellerName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSeller) return false;
      }

      // 2. Sidebar Category Filter
      if (cat && item.category !== cat) return false;

      // 3. Sidebar State Filter
      if (st && item.state !== st) return false;

      // 4. Sidebar Acquisition Type Filter
      if (acq && item.acquisitionType !== acq) return false;

      return true;
    });
  });

  toggleCategory(cat: string) {
    if (this.selectedCategory() === cat) {
      this.selectedCategory.set(null); // toggle off
    } else {
      this.selectedCategory.set(cat);
    }
  }

  toggleState(st: string) {
    if (this.selectedState() === st) {
      this.selectedState.set(null);
    } else {
      this.selectedState.set(st);
    }
  }

  toggleAcquisition(type: string) {
    if (this.selectedAcquisition() === type) {
      this.selectedAcquisition.set(null);
    } else {
      this.selectedAcquisition.set(type as any);
    }
  }

  hasActiveFilters(): boolean {
    return this.selectedCategory() !== null || 
           this.selectedState() !== null || 
           this.selectedAcquisition() !== null ||
           this.mockService.searchQuery() !== '';
  }

  resetFilters() {
    this.selectedCategory.set(null);
    this.selectedState.set(null);
    this.selectedAcquisition.set(null);
    this.mockService.searchQuery.set('');
    this.showFiltersDrawer.set(false);
  }
}
