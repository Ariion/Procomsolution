# procomsolution.fr

Site statique d'Audrey Duval-Lebret, community manager spécialisée en audiologie.
Hébergé sur Vercel, édité avec le [Module Admin](https://github.com/Ariion/Module-admin).

## Comment ça marche

Chaque page est du **HTML complet** : le contenu est dans le fichier, pas
injecté par JavaScript. C'est ce qui permet à Google et à LinkedIn de lire les
pages, et c'est aussi ce que le module d'administration attend pour s'y greffer.

Les deux seules lignes qui branchent le module, en bas de chaque page :

```html
<script src="/admin-config.js"></script>
<script type="module" src="/admin/runtime.js"></script>
```

Si le module tombe ou qu'on le retire, **le site continue de s'afficher
normalement** : tout est déjà dans le HTML.

## Éditer le site

```
https://procomsolution.fr/?admin
```

## Écrire dans le site : `api/admin-endpoint.js`

Créer une page ou régénérer son HTML veut dire **écrire un fichier**. Vercel
sert un disque en lecture seule, donc cette fonction committe dans le dépôt
GitHub ; le push relance le déploiement et la page est en ligne une trentaine
de secondes plus tard.

Elle reprend à l'identique le contrat de `tools/admin-endpoint.php` du dépôt
Module-admin : `check`, `source`, `page`, `create`. L'authentification passe
par le jeton Firebase, dont la signature est vérifiée contre les certificats
de Google, puis le compte doit être membre du site dans Firestore — les mêmes
règles que le reste du module, aucune liste d'UID à tenir à jour.

### Variables d'environnement à poser sur Vercel

*Settings → Environment Variables*, pour les trois environnements :

| Variable | Valeur |
|---|---|
| `GITHUB_TOKEN` | jeton fin avec **Contents: read and write** sur ce dépôt seulement |
| `GITHUB_REPO` | `Ariion/Procomsolution` |
| `GITHUB_BRANCH` | `main` (facultatif) |
| `FIREBASE_PROJECT_ID` | `procom-solution` |
| `SITE_ID` | `procomsolution` |

Le jeton se crée sur github.com → Settings → Developer settings → **Fine-grained
tokens** → Only select repositories → Repository permissions → Contents :
*Read and write*. Ne lui donnez rien d'autre.

### Les fichiers `.src.html`

À la première publication d'une page, la fonction dépose à côté d'elle une
copie de son code d'origine (`portfolio.src.html`). C'est ce qui permet au
module de repartir du code écrit à la main plutôt que d'un rendu déjà
régénéré, et de créer une page neuve qui hérite du site. Ces copies sont
servies en `noindex` et exclues du `robots.txt`.

## Ce qu'il reste à faire

1. **Poser les variables d'environnement** ci-dessus. Sans elles, l'édition
   fonctionne mais la création de pages échoue avec un message explicite.
2. **Compléter les mentions légales** : l'adresse postale et le SIRET manquent
   (obligatoires en droit français). Ils figuraient sur l'ancien site.
3. **Les médias** passent par `adapter: 'url'` — la bibliothèque se remplit
   par adresse. Le téléversement de fichiers demanderait une action de plus
   dans la fonction.

## Structure

```
index.html                  accueil
portfolio.html              liste des articles
ressources.html             guides à télécharger
<slug>.html                 un fichier par article
mentions-legales.html       ·  confidentialite.html
404.html
admin/                      le module (copie du dépôt Module-admin)
admin-config.js             configuration du site — servie publiquement
assets/                     images, logos et PDF
theme.css                   variables partagées
vercel.json                 en-têtes, URLs propres, redirections
```

## Pointer le module vers une version distante

Le module est aujourd'hui **copié** dans `admin/`. Pour le charger depuis un
canal partagé — et le mettre à jour sans toucher à ce dépôt — remplacer dans
les pages :

```
/admin/runtime.js   →   https://<domaine-du-module>/v1/admin/runtime.js
```

Cela demande un en-tête `Access-Control-Allow-Origin` sur le domaine qui sert
le module. `admin-config.js` reste local : il porte le `siteId` et les clés.
