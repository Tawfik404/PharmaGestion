export const medications = [
  { id: 1, numero: 'MED001', designation: 'Paracétamol 500mg', prixAchat: 2.50, prixVente: 5.00, quantiteMin: 20, quantiteDisponible: 150, categorie: 'Antalgique', utilisations: 'Douleurs légères, fièvre', contreIndications: 'Insuffisance hépatique', effetsSecondaires: 'Rare: éruption cutanée', tauxPriseEnCharge: 70, codeBarres: '6123456789012', dateExpiration: '2026-12-31', photo: null },
  { id: 2, numero: 'MED002', designation: 'Amoxicilline 1g', prixAchat: 4.00, prixVente: 8.50, quantiteMin: 30, quantiteDisponible: 45, categorie: 'Antibiotique', utilisations: 'Infections bactériennes', contreIndications: 'Allergie pénicilline', effetsSecondaires: 'Diarrhée, nausées', tauxPriseEnCharge: 80, codeBarres: '6123456789013', dateExpiration: '2026-06-30', photo: null },
  { id: 3, numero: 'MED003', designation: 'Ibuprofène 400mg', prixAchat: 3.00, prixVente: 6.00, quantiteMin: 25, quantiteDisponible: 80, categorie: 'Anti-inflammatoire', utilisations: 'Douleurs, inflammation', contreIndications: 'Ulcère gastrique', effetsSecondaires: 'Troubles digestifs', tauxPriseEnCharge: 65, codeBarres: '6123456789014', dateExpiration: '2027-03-15', photo: null },
  { id: 4, numero: 'MED004', designation: 'Omeprazole 20mg', prixAchat: 5.00, prixVente: 11.00, quantiteMin: 15, quantiteDisponible: 12, categorie: 'Gastro', utilisations: 'Reflux gastrique', contreIndications: 'Grossesse', effetsSecondaires: 'Maux de tête', tauxPriseEnCharge: 75, codeBarres: '6123456789015', dateExpiration: '2026-09-20', photo: null },
  { id: 5, numero: 'MED005', designation: 'Metformine 850mg', prixAchat: 3.50, prixVente: 7.00, quantiteMin: 40, quantiteDisponible: 200, categorie: 'Antidiabétique', utilisations: 'Diabète de type 2', contreIndications: 'Insuffisance rénale', effetsSecondaires: 'Nausées, diarrhée', tauxPriseEnCharge: 85, codeBarres: '6123456789016', dateExpiration: '2027-01-10', photo: null },
  { id: 6, numero: 'MED006', designation: 'Azithromycine 500mg', prixAchat: 6.00, prixVente: 12.50, quantiteMin: 20, quantiteDisponible: 8, categorie: 'Antibiotique', utilisations: 'Infections respiratoires', contreIndications: 'Hypersensibilité', effetsSecondaires: 'Troubles digestifs', tauxPriseEnCharge: 70, codeBarres: '6123456789017', dateExpiration: '2026-08-25', photo: null },
  { id: 7, numero: 'MED007', designation: 'Doliprane 1000mg', prixAchat: 2.00, prixVente: 4.50, quantiteMin: 50, quantiteDisponible: 300, categorie: 'Antalgique', utilisations: 'Douleurs, fièvre', contreIndications: 'Insuffisance hépatique', effetsSecondaires: 'Très rare', tauxPriseEnCharge: 70, codeBarres: '6123456789018', dateExpiration: '2027-06-01', photo: null },
  { id: 8, numero: 'MED008', designation: 'Ventoline 100µg', prixAchat: 8.00, prixVente: 15.00, quantiteMin: 10, quantiteDisponible: 5, categorie: 'Respiratoire', utilisations: 'Asthme', contreIndications: 'Hypersensibilité', effetsSecondaires: 'Tremblements', tauxPriseEnCharge: 90, codeBarres: '6123456789019', dateExpiration: '2026-07-15', photo: null },
  { id: 9, numero: 'MED009', designation: 'Levothyrox 75µg', prixAchat: 5.50, prixVente: 10.00, quantiteMin: 20, quantiteDisponible: 60, categorie: 'Hormone', utilisations: 'Hypothyroïdie', contreIndications: 'Thyrotoxicose', effetsSecondaires: 'Palpitations si surdosage', tauxPriseEnCharge: 80, codeBarres: '6123456789020', dateExpiration: '2027-04-20', photo: null },
  { id: 10, numero: 'MED010', designation: 'Gaviscon 250ml', prixAchat: 6.00, prixVente: 12.00, quantiteMin: 10, quantiteDisponible: 25, categorie: 'Gastro', utilisations: 'Reflux, brûlures gastriques', contreIndications: 'Aucune', effetsSecondaires: 'Rare', tauxPriseEnCharge: 50, codeBarres: '6123456789021', dateExpiration: '2027-02-28', photo: null },
]

export const clients = [
  { id: 1, nom: 'Benali', prenom: 'Karim', telephone: '0555123456', email: 'karim.benali@email.com', dateNaissance: '1985-03-15', adresse: '12 Rue Didouche Mourad, Alger', aDroitReduction: true, reduction: 10, achatsTotal: 450.00, derniereVisite: '2026-04-28' },
  { id: 2, nom: 'Hadj', prenom: 'Amina', telephone: '0661789012', email: 'amina.hadj@email.com', dateNaissance: '1990-07-22', adresse: '45 Boulevard Khemisti, Oran', aDroitReduction: false, reduction: 0, achatsTotal: 120.50, derniereVisite: '2026-04-25' },
  { id: 3, nom: 'Mebarki', prenom: 'Youcef', telephone: '0770987654', email: 'youcef.m@email.com', dateNaissance: '1978-11-08', adresse: '8 Cité AADL, Constantine', aDroitReduction: true, reduction: 15, achatsTotal: 1200.00, derniereVisite: '2026-04-30' },
  { id: 4, nom: 'Charef', prenom: 'Nadia', telephone: '0550345678', email: 'nadia.ch@email.com', dateNaissance: '1995-01-30', adresse: '23 Rue Abane Ramdane, Blida', aDroitReduction: false, reduction: 0, achatsTotal: 75.00, derniereVisite: '2026-04-20' },
  { id: 5, nom: 'Bouazza', prenom: 'Omar', telephone: '0668456789', email: 'omar.bouazza@email.com', dateNaissance: '1982-06-12', adresse: '67 Avenue de la République, Tlemcen', aDroitReduction: true, reduction: 5, achatsTotal: 890.00, derniereVisite: '2026-05-01' },
]

export const fournisseurs = [
  { id: 1, nom: 'SARPHARM Distribution', contact: 'M. Rabah', telephone: '021634567', email: 'contact@sarpharm.dz', adresse: 'Zone Industrielle, Alger', specialite: 'Généraliste', commandesTotal: 45, montantTotal: 125000, derniereCommande: '2026-04-15' },
  { id: 2, nom: 'PHARMA-ALGERIE', contact: 'Mme. Saliha', telephone: '031890123', email: 'info@pharma-alg.dz', adresse: 'Rue des Frères Abbas, Blida', specialite: 'Antibiotiques', commandesTotal: 22, montantTotal: 67000, derniereCommande: '2026-04-20' },
  { id: 3, nom: 'MEDIPHARMA', contact: 'M. Karim', telephone: '041234567', email: 'cmd@medipharma.dz', adresse: 'Cité 1000 logements, Oran', specialite: 'Spécialités', commandesTotal: 18, montantTotal: 89000, derniereCommande: '2026-04-22' },
  { id: 4, nom: 'ALGER PHARMA', contact: 'Mme. Nesrine', telephone: '021567890', email: 'vente@algerpharma.dz', adresse: 'Bab Ezzouar, Alger', specialite: 'Généraliste', commandesTotal: 30, montantTotal: 95000, derniereCommande: '2026-04-28' },
]

export const ordonnances = [
  { id: 1, numero: 'ORD-2026-001', clientNom: 'Karim Benali', medecin: 'Dr. Mekhaled', date: '2026-04-25', medicaments: ['Paracétamol 500mg x2', 'Amoxicilline 1g x1'], statut: 'Traitée', montantTotal: 18.50 },
  { id: 2, numero: 'ORD-2026-002', clientNom: 'Amina Hadj', medecin: 'Dr. Bensalem', date: '2026-04-28', medicaments: ['Ibuprofène 400mg x1', 'Omeprazole 20mg x1'], statut: 'En attente', montantTotal: 17.00 },
  { id: 3, numero: 'ORD-2026-003', clientNom: 'Youcef Mebarki', medecin: 'Dr. Mekhaled', date: '2026-04-30', medicaments: ['Metformine 850mg x2', 'Levothyrox 75µg x1'], statut: 'Traitée', montantTotal: 24.00 },
  { id: 4, numero: 'ORD-2026-004', clientNom: 'Nadia Charef', medecin: 'Dr. Hamidi', date: '2026-05-01', medicaments: ['Ventoline 100µg x1'], statut: 'En attente', montantTotal: 15.00 },
]

export const ventes = [
  { id: 1, date: '2026-05-01', clientNom: 'Karim Benali', articles: 3, total: 24.50, reduction: 2.45, net: 22.05, caissier: 'Fatima Zahra' },
  { id: 2, date: '2026-05-01', clientNom: 'Client anonyme', articles: 1, total: 8.50, reduction: 0, net: 8.50, caissier: 'Fatima Zahra' },
  { id: 3, date: '2026-05-02', clientNom: 'Omar Bouazza', articles: 5, total: 45.00, reduction: 2.25, net: 42.75, caissier: 'Fatima Zahra' },
  { id: 4, date: '2026-05-02', clientNom: 'Youcef Mebarki', articles: 2, total: 17.00, reduction: 2.55, net: 14.45, caissier: 'Fatima Zahra' },
]

export const CATEGORIES_MED = ['Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Gastro', 'Antidiabétique', 'Respiratoire', 'Hormone']
