import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    displayName: 'Gestion des clients',
    iconName: 'users-group',
    route: '/clients',
  },
  {
    displayName: 'Gestion des freelances',
    iconName: 'user-dollar',
    route: '/freelancers',
  },
  {
    displayName: 'Gestion des Factures',
    iconName: 'receipt',
    route: '/invoice',
  },
  {
    displayName: 'Gestion des requêtes',
    iconName: 'user-question',
    route: '/requests',
  },
  {
    displayName: 'Gestion des réclamations',
    iconName: 'bell-question',
    route: '/reclamations',
  },
  {
    displayName: 'Gestion des Prestataires',
    iconName: 'user-plus',
    route: '/prestataires',
  },
  {
    displayName: 'Carte de visite',
    iconName: 'id',
    route: '/cartes-visites',
  },
  {
    navCap: 'Admininistration',
    requiresAdmin: true,
  },
  {
    displayName: 'Gestion des sociétés',
    iconName: 'building',
    route: '/societe',
    requiresAdmin: true,
  },
  {
    displayName: 'Gestion des utilisateurs',
    iconName: 'users',
    route: '/users',
    requiresAdmin: true,
  },
  {
    displayName: 'Gestion des villes',
    iconName: 'building-community',
    route: '/villes',
    requiresAdmin: true,
  },
  {
    displayName: 'Gestion des domaines',
    iconName: 'category',
    route: '/domaines',
    requiresAdmin: true,
  },
  {
    displayName: 'Paramètres entreprise',
    iconName: 'settings-2',
    route: '/entreprises',
    requiresAdmin: true,
  },

];
