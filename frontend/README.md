# Gestion Pharmacie WFS — Système de Gestion de Pharmacie

> Application frontend complète pour la gestion d'une pharmacie, développée avec **React + Vite**.

---

## Table des matières

1. [Description du projet](#description-du-projet)
2. [Fonctionnalités](#fonctionnalités)
3. [Technologies utilisées](#technologies-utilisées)
4. [Installation](#installation)
5. [Comptes de test](#comptes-de-test)
6. [Structure du projet](#structure-du-projet)
7. [Modules détaillés](#modules-détaillés)
8. [Rôles et permissions](#rôles-et-permissions)
9. [Guide d'utilisation](#guide-dutilisation)

---

## Description du projet

**Pharmacie WFS** est un système de gestion de pharmacie permettant de gérer les médicaments, les stocks, les ordonnances, le point de vente, les clients, les fournisseurs et de générer des rapports d'analyse. Le projet a été élaboré dans le cadre d'un Projet de Synthèse.

---

## Fonctionnalités

- **Gestion des Médicaments** : CRUD complet, recherche, filtrage par catégorie, export Excel
- **Gestion des Stocks** : Suivi en temps réel, alertes de réapprovisionnement, historique des entrées
- **Gestion des Ordonnances** : Saisie, numérisation, suivi des statuts
- **Point de Vente (POS)** : Interface de caisse intuitive, panier, réductions, reçus
- **Gestion des Clients** : Base de données clients, statistiques d'achats, réductions
- **Gestion des Fournisseurs** : Informations fournisseurs, passation de commandes, statistiques
- **Rapports & Analyses** : Ventes, stock, financier, fournisseurs, médicaments
- **Authentification & Rôles** : Contrôle d'accès par rôle (Pharmacien, Caissier, Gestionnaire)
- **Export Excel** : Export des listes (médicaments, clients, stocks, rapports)

---

## Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| **React 19** | Framework UI |
| **Vite** | Build tool & dev server |
| **React Router v6** | Routing / Navigation |
| **React Icons** | Icônes (HeroIcons v2) |
| **Recharts** | Graphiques (Bar, Pie, Line charts) |
| **XLSX (SheetJS)** | Export vers Excel |
| **Date-fns** | Manipulation de dates |
| **CSS3** | Styles personnalisés (pas de framework CSS) |

---

## Installation

### Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd pharmacy-frontend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:5173
```

### Build de production

```bash
npm run build
npm run preview
```

---

## Comptes de test

> **Mot de passe pour tous les comptes** : `n'importe lequel` (tapez n'importe quel texte)

| Rôle | Email | Mot de passe | Accès |
|------|-------|-------------|-------|
| **Pharmacien** | `ahmed@pharmacie.dz` | `*` | Accès complet à tous les modules |
| **Caissier** | `fatima@pharmacie.dz` | `*` | Dashboard, Point de Vente, Clients |
| **Gestionnaire** | `mohamed@pharmacie.dz` | `*` | Dashboard, Médicaments, Stock, Fournisseurs, Rapports |

### Détail des accès par rôle

| Module | Pharmacien | Caissier | Gestionnaire |
|--------|:----------:|:--------:|:------------:|
| Tableau de bord | ✅ | ✅ | ✅ |
| Médicaments | ✅ | ❌ | ✅ |
| Stock | ✅ | ❌ | ✅ |
| Ordonnances | ✅ | ❌ | ❌ |
| Point de Vente | ✅ | ✅ | ❌ |
| Clients | ✅ | ✅ | ❌ |
| Fournisseurs | ✅ | ❌ | ✅ |
| Rapports | ✅ | ❌ | ✅ |
| Utilisateurs | ✅ | ❌ | ❌ |

---

## Structure du projet

```
pharmacy-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        # Barre latérale de navigation
│   │   │   ├── Sidebar.css
│   │   │   ├── Header.jsx         # Barre supérieure (recherche, notifications)
│   │   │   └── Header.css
│   │   └── ui/
│   │       ├── Modal.jsx          # Composant modale réutilisable
│   │       ├── Modal.css
│   │       ├── Table.jsx          # Tableau de données avec pagination
│   │       ├── Table.css
│   │       ├── StatsCard.jsx      # Cartes de statistiques
│   │       └── StatsCard.css
│   ├── context/
│   │   └── AuthContext.jsx        # Contexte d'authentification & rôles
│   ├── data/
│   │   └── mockData.js            # Données simulées (médicaments, clients...)
│   ├── pages/
│   │   ├── Login.jsx              # Page de connexion
│   │   ├── Login.css
│   │   ├── Dashboard.jsx          # Tableau de bord principal
│   │   ├── Dashboard.css
│   │   ├── Medicaments.jsx        # Gestion des médicaments
│   │   ├── Stock.jsx              # Gestion des stocks
│   │   ├── Ordonnances.jsx        # Gestion des ordonnances
│   │   ├── POS.jsx                # Point de vente
│   │   ├── POS.css
│   │   ├── Clients.jsx            # Gestion des clients
│   │   ├── Fournisseurs.jsx       # Gestion des fournisseurs
│   │   ├── Rapports.jsx           # Rapports et analyses
│   │   ├── Rapports.css
│   │   ├── Utilisateurs.jsx       # Gestion des utilisateurs et rôles
│   ├── utils/
│   │   └── helpers.js             # Utilitaires (export Excel, formatage)
│   ├── App.jsx                    # Configuration des routes
│   ├── App.css
│   ├── index.css                  # Styles globaux & variables CSS
│   └── main.jsx                   # Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

---

## Modules détaillés

### 1. Tableau de bord
- 6 cartes de statistiques (médicaments, ventes, clients, ventes du jour, stock bas, fournisseurs)
- Graphique des ventes mensuelles (barres)
- Graphique de répartition par catégorie (camembert)
- Liste des ventes récentes
- Liste des alertes de stock critique

### 2. Médicaments
- Liste complète avec recherche et pagination
- Ajout / Modification / Suppression de médicaments
- Champs : numéro, designation, catégorie, prix achat/vente, quantité min/disponible, utilisation, contre-indications, effets secondaires, taux de prise en charge, code-barres, date d'expiration
- Export de la liste vers Excel
- Vue détaillée de chaque médicament

### 3. Gestion des Stocks
- État du stock avec indicateurs de niveau (OK, Bas, Critique, Rupture)
- Alertes de réapprovisionnement automatiques
- Historique des entrées de stock
- Ajout de nouvelles entrées de stock
- Export du stock vers Excel

### 4. Ordonnances
- Saisie des ordonnances (client, médecin, médicaments)
- Suivi des statuts (En attente, Traitée, Annulée)
- Vue détaillée des ordonnances
- Bouton de numérisation (bonus)

### 5. Point de Vente (POS)
- Interface de caisse avec grille de produits
- Recherche et tri (par catégorie, A-Z, popularité)
- Panier avec quantités modifiables
- Sélection de client ou vente anonyme
- Réductions sur le total de la commande
- Génération de reçus détaillés
- Impression des reçus

### 6. Clients
- Base de données clients
- Ajout / Modification de clients
- Gestion des réductions par client
- Statistiques d'achats par client
- Export de la liste vers Excel

### 7. Fournisseurs
- Liste des fournisseurs avec informations complètes
- Passation de commandes d'achat
- Statistiques par fournisseur (montant et durée)
- Ajout / Modification de fournisseurs

### 8. Rapports & Analyses
- **Rapport de Ventes** : Évolution mensuelle, détail des ventes
- **Rapport de Stock** : Répartition par catégorie
- **Rapport Financier** : Revenus, dépenses, bénéfices, marges
- **Rapport Fournisseurs** : Commandes par fournisseur
- **Rapport Médicaments** : Prix et marges par médicament
- Export de chaque rapport vers Excel

### 9. Utilisateurs & Rôles
- Gestion des comptes utilisateurs
- 3 rôles avec permissions spécifiques
- Visualisation des permissions par rôle

---

## Rôles et permissions

### Pharmacien (accès complet)
- Tous les modules du système
- Gestion complète des médicaments, stocks, ordonnances
- Point de vente, clients, fournisseurs
- Rapports et administration

### Caissier (accès limité)
- Tableau de bord (lecture seule)
- Point de vente (vente, panier, reçus)
- Gestion des clients (consultation)

### Gestionnaire (accès intermédiaire)
- Tableau de bord (lecture seule)
- Gestion des médicaments
- Gestion des stocks
- Gestion des fournisseurs
- Rapports et analyses

---

## Guide d'utilisation rapide

1. **Se connecter** : Aller sur `http://localhost:5173`, entrer l'email et un mot de passe
2. **Naviguer** : Utiliser le menu latéral pour accéder aux modules
3. **Ajouter un médicament** : Médicaments → Ajouter → Remplir le formulaire → Enregistrer
4. **Vendre un produit** : Point de Vente → Cliquer sur un produit → Valider la vente
5. **Exporter** : Sur chaque module, cliquer sur "Exporter Excel"
6. **Voir les rapports** : Rapports → Choisir le type de rapport

---

## Auteurs

Projet de Synthèse — Gestion Pharmacie WFS

---

## Licence

Projet académique — Tous droits réservés
