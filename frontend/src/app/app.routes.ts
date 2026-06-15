import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditPublicationComponent } from './components/edit-publication/edit-publication.component';
import { SavedPublicationsComponent } from './components/saved-publications/saved-publications.component';
import { MessagesComponent } from './components/messages/messages.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'RE-USE | Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'RE-USE | Registrarse' },
  { path: 'catalog', component: CatalogComponent, title: 'RE-USE | Catálogo de Componentes' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'RE-USE | Detalle de Componente' },
  { path: 'profile', component: ProfileComponent, title: 'RE-USE | Mi Perfil' },
  { path: 'create-publication', component: EditPublicationComponent, title: 'RE-USE | Crear Publicación' },
  { path: 'edit-publication/:id', component: EditPublicationComponent, title: 'RE-USE | Editar Publicación' },
  { path: 'saved', component: SavedPublicationsComponent, title: 'RE-USE | Guardados' },
  { path: 'messages', component: MessagesComponent, title: 'RE-USE | Mensajes' },
  { path: '**', redirectTo: 'login' }
];
