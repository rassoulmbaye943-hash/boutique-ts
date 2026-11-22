import "./style.css";
import { catalogue } from "./catalogue.ts";
import { formatPrix } from "./outils.ts";
import { ajouterAuPanier, changerQuantite, nombreArticles, retirerDuPanier, totalPanier } from "./panier.ts";
import type { LignePanier, Produit } from "./types.ts";

function trouver<T extends HTMLElement>(selecteur: string): T {
  const element = document.querySelector<T>(selecteur);
  if (!element) {
    throw new Error(`Élément ${selecteur} introuvable : vérifiez index.html`);
  }
  return element;
}

const zoneCatalogue = trouver<HTMLDivElement>("#catalogue");
const listePanier = trouver<HTMLUListElement>("#lignes-panier");
const zoneTotal = trouver<HTMLElement>("#total");
const compteur = trouver<HTMLSpanElement>("#compteur");
const champRecherche = trouver<HTMLInputElement>("#recherche");
const filtreCategorie = trouver<HTMLSelectElement>("#filtre-categorie");

let panier: LignePanier[] = [];

function creerCarte(produit: Produit): HTMLElement {
  const carte = document.createElement("article");
  carte.className = "carte";
  const titre = document.createElement("h3");
  titre.textContent = produit.nom;
  const prix = document.createElement("p");
  prix.className = "prix";
  prix.textContent = formatPrix(produit.prix);
  const bouton = document.createElement("button");
  bouton.type = "button";
  if (produit.stock === 0) {
    bouton.textContent = "Épuisé";
    bouton.disabled = true;
  } else {
    bouton.textContent = "Ajouter au panier";
  }
  bouton.addEventListener("click", () => {
    panier = ajouterAuPanier(panier, produit);
    afficherPanier();
  });
  carte.append(titre, prix);
  if (produit.stock > 0 && produit.stock < 5) {
    const stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = `Plus que ${produit.stock} en stock`;
    carte.append(stock);
  }
  carte.append(bouton);
  return carte;
}

function afficherCatalogue(): void {
  zoneCatalogue.replaceChildren(...catalogue.map(creerCarte));
}

function creerLignePanier(ligne: LignePanier): HTMLLIElement {
  const li = document.createElement("li");
  li.textContent = `${ligne.quantite} x ${ligne.produit.nom} : ${formatPrix(
    ligne.produit.prix * ligne.quantite,
  )} `;

  const boutonMoins = document.createElement("button");
  boutonMoins.type = "button";
  boutonMoins.textContent = "-";
  boutonMoins.addEventListener("click", () => {
    panier = changerQuantite(panier, ligne.produit.id, -1);
    afficherPanier();
  });

  const boutonPlus = document.createElement("button");
  boutonPlus.type = "button";
  boutonPlus.textContent = "+";
  boutonPlus.addEventListener("click", () => {
    panier = changerQuantite(panier, ligne.produit.id, 1);
    afficherPanier();
  });

  const boutonRetirer = document.createElement("button");
  boutonRetirer.type = "button";
  boutonRetirer.textContent = "Retirer";
  boutonRetirer.addEventListener("click", () => {
    panier = retirerDuPanier(panier, ligne.produit.id);
    afficherPanier();
  });

  li.append(boutonMoins, boutonPlus, boutonRetirer);
  return li;
}

function afficherPanier(): void {
  if (panier.length === 0) {
    const vide = document.createElement("li");
    vide.textContent = "Votre panier est vide";
    listePanier.replaceChildren(vide);
  } else {
    listePanier.replaceChildren(...panier.map(creerLignePanier));
  }
  zoneTotal.textContent = formatPrix(totalPanier(panier));
  compteur.textContent = String(nombreArticles(panier));
}

afficherCatalogue();
afficherPanier();