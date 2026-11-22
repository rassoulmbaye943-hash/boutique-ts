import type { LignePanier, Produit } from "./types.ts";
export function ajouterAuPanier(panier: LignePanier[], produit: Produit): LignePanier[] {
  const dejaPresent = panier.some((ligne) => ligne.produit.id === produit.id);
  if (!dejaPresent) {
    return [...panier, { produit, quantite: 1 }];
  }
  return panier.map((ligne) =>
    ligne.produit.id === produit.id ? { ...ligne, quantite: ligne.quantite + 1 } : ligne,
  );
}
export function retirerDuPanier(panier: LignePanier[], idProduit: number): LignePanier[] {
  return panier.filter((ligne) => ligne.produit.id !== idProduit);
}
export function nombreArticles(panier: LignePanier[]): number {
  return panier.reduce((somme, ligne) => somme + ligne.quantite, 0);
}
export function totalPanier(panier: LignePanier[]): number {
  return panier.reduce((somme, ligne) => somme + ligne.produit.prix * ligne.quantite, 0);
}

export function changerQuantite(panier: LignePanier[], idProduit: number, variation: number): LignePanier[] {
  return panier
    .map((ligne) =>
      ligne.produit.id === idProduit ? { ...ligne, quantite: ligne.quantite + variation } : ligne,
    )
    .filter((ligne) => ligne.quantite > 0);
}