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

## Ce qu'il reste à faire

1. **Renseigner Firebase** dans `admin-config.js` (clés du projet, console
   Firebase → Paramètres du projet). Tant qu'elles sont vides, le site
   fonctionne mais l'édition est indisponible.
2. **Déposer les règles Firestore et Storage** depuis `firebase/` du dépôt
   Module-admin, et inscrire le compte d'Audrey dans
   `sites/procomsolution/members/{uid}` avec `role: "owner"`.
3. **Porter `tools/admin-endpoint.php` en fonction Vercel**
   (`/api/admin-endpoint`). Sans lui, le contenu publié vit dans Firestore et
   n'est appliqué que côté navigateur — donc invisible pour Google. Avec lui,
   le fichier `.html` est réécrit à chaque publication. Le contrat est court :
   actions `source`, `page`, `create`, `config`, en JSON, avec un jeton
   Firebase en `Authorization: Bearer`.
4. **Compléter les mentions légales** : l'adresse postale et le SIRET manquent
   (obligatoires en droit français). Ils figuraient sur l'ancien site.

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
