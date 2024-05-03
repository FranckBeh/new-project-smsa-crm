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
  },
  {
    displayName: 'Gestion des sociétés',
    iconName: 'building',
    route: '/societe',
  },
  {
    displayName: 'Gestion des utilisateurs',
    iconName: 'users',
    route: '/users',
  },
  {
    displayName: 'Gestion des villes',
    iconName: 'building-community',
    route: '/villes',
  },
  {
    displayName: 'Gestion des domaines',
    iconName: 'category',
    route: '/domaines',
  },
  {
    displayName: 'Paramètres entreprise',
    iconName: 'settings-2',
    route: '/entreprises',
  },
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'rosette',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'poker-chip',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'layout-navbar-expand',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: '/ui-components/tooltips',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'aperture',
    route: '/extra/sample-page',
  },
];
