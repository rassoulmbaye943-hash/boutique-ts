export type Categorie = "vetements" | "chaussures" | "accessoires" | "maison";
export type Produit = {
  readonly id: number;
  nom: string;
  prix: number;
  categorie: Categorie;
  stock: number;
};
export type LignePanier = {
  produit: Produit;
  quantite: number;
};