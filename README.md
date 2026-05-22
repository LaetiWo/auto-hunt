# 🚗 Auto-Hunt

Auto-Hunt est une plateforme moderne de vente et de location de voitures. Elle permet aux utilisateurs de parcourir des annonces, de gérer leur boutique et de louer des véhicules via une interface fluide et intuitive.

## 🌟 Fonctionnalités

- **Recherche Avancée** : Filtres par marque, modèle et prix.
- **Gestion de Boutique** : Créez et gérez votre propre catalogue de voitures.
- **Location & Vente** : Support complet pour les deux types de transactions.
- **Notifications** : Alertes en temps réel pour les activités importantes.
- **Design Premium** : Interface responsive avec mode sombre et animations fluides.

## 🛠️ Stack Technique

- **Framework** : [Next.js 14+](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Backend-as-a-Service** : [Appwrite](https://appwrite.io/) (Database, Auth, Storage)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Emails** : [Resend](https://resend.com/)

## 🚀 Mise en route

### Prérequis

- Node.js 18+ installé.
- Un compte [Appwrite](https://appwrite.io/) (Cloud ou Self-hosted).
- Une clé API [Resend](https://resend.com/) pour les emails.

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/LaetiWo/auto-hunt.git
   cd auto-hunt
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Copiez le fichier `.env.example` vers un nouveau fichier `.env` :
   ```bash
   cp .env.example .env
   ```
   Remplissez ensuite les variables dans le fichier `.env` avec vos propres clés Appwrite et Resend.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔑 Variables d'Environnement

Le projet utilise plusieurs variables clés regroupées en trois sections :
- **Application** : URL de base et options de debug.
- **Appwrite (Public)** : Identifiants nécessaires pour le frontend.
- **Appwrite (Private)** : Clés API secrètes pour les opérations serveur.
- **Resend** : Clés pour l'envoi d'emails.

*Référez-vous au fichier `.env.example` pour la liste complète.*

## 📁 Structure du Projet

- `/app` : Routes et pages de l'application (Next.js App Router).
- `/components` : Composants UI réutilisables.
- `/lib` : Fonctions utilitaires et configuration des SDK (Appwrite).
- `/public` : Assets statiques (images, logos).

---

Développé avec ❤️ par l'équipe Auto-Hunt.
