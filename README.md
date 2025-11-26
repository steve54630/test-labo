# 🧪 Laboratoire – Système de Planification

## 📌 Description

Ce projet implémente un système de planification permettant d’allouer automatiquement des créneaux d’analyse à différents équipements de laboratoire.  
Il gère notamment :

- la disponibilité des équipements,
- le découpage automatique des créneaux après réservation,
- la validation d’un créneau en fonction de l’heure d’arrivée d’un échantillon,
- la durée d’analyse et les contraintes métier,
- la gestion de différents types d’équipement.

Le but est de simuler ou automatiser l’organisation d’un laboratoire en optimisant l'utilisation des ressources.

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le projet
```bash
npm start
```

### 4.Lancer les tests
```bash
npm test
```

### 5. Tester avec vos propres données
📂 Fournir vos propres données
Ajoutez ou modifiez vos fichiers de données dans :

```bash
src/data/easy.json
```

### 6. Structure du projet

```markdown
src/
  models/
    equipment.ts
    sample.ts
    ...
  type/
    type.ts
    enum.ts
    rules.ts
  dto/
    equipment.dto.ts
    sample.dto.ts
  utils/
    ...
  data/
    ...
  test/
    ...
  core/
    index.ts
```  
🧱 Technologies utilisées
Node.js

TypeScript

Jest (tests unitaires)

ts-node (exécution directe en TS — optionnel)
