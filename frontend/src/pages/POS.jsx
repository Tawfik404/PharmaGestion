import { useEffect, useState } from 'react'
import Modal from '../components/ui/Modal'
import { fetchInventory, fetchClients, processSale } from '../services/pos'
import { normalizeMedicament } from '../services/medicaments'
import { formatCurrency } from '../utils/helpers'
import { HiOutlineShoppingCart, HiOutlineMagnifyingGlass, HiOutlinePrinter, HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2'
import './POS.css'

export default function POS() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [discount, setDiscount] = useState(0)
  const [sortBy, setSortBy] = useState('categorie')
  const [receiptModal, setReceiptModal] = useState(null)
  const [meds, setMeds] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchInventory(), fetchClients()])
      .then(([inventory, clientsList]) => {
        setMeds(inventory.map(normalizeMedicament))
        setClients(clientsList)
        setLoading(false)
      })
      .catch((err) => {
        setError('Erreur lors du chargement des données')
        setLoading(false)
      })
  }, [])

  const filtered = meds
    .filter(m => m.quantiteDisponible > 0)
    .filter(m => m.designation.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'nom') return a.designation.localeCompare(b.designation)
      if (sortBy === 'ventes') return b.quantiteDisponible - a.quantiteDisponible
      return a.categorie.localeCompare(b.categorie)
    })

  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id)
    if (existing) {
      if (existing.qty < med.quantiteDisponible) {
        setCart(cart.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c))
      }
    } else {
      setCart([...cart, { ...med, qty: 1 }])
    }
  }

  const updateQty = (id, delta) => {
    const med = meds.find(m => m.id === id)
    setCart(cart.map(c => c.id === id ? { ...c, qty: Math.max(1, Math.min(c.qty + delta, med.quantiteDisponible)) } : c))
  }

  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id))

  const subtotal = cart.reduce((s, c) => s + c.prixVente * c.qty, 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount

  const handleCheckout = async () => {
    if (cart.length === 0) return
    try {
      const salePayload = {
        client_id: selectedClient || null,
        items: cart.map(item => ({ medicament_id: item.id, quantity: item.qty })),
        discount_rate: discount,
      }
      const response = await processSale(salePayload)
      setReceiptModal(response.recu)
      setCart([])
      setSelectedClient('')
      setDiscount(0)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="pos-layout">
      {error && <div className="pos-error">{error}</div>}
      <div className="pos-products">
        <div className="pos-products-header">
          <h1><HiOutlineShoppingCart size={22} /> Point de Vente</h1>
          <div className="pos-search">
            <HiOutlineMagnifyingGlass />
            <input type="text" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="pos-sort">
            <button className={sortBy === 'categorie' ? 'active' : ''} onClick={() => setSortBy('categorie')}>Catégorie</button>
            <button className={sortBy === 'nom' ? 'active' : ''} onClick={() => setSortBy('nom')}>A-Z</button>
            <button className={sortBy === 'ventes' ? 'active' : ''} onClick={() => setSortBy('ventes')}>Popularité</button>
          </div>
        </div>
        <div className="pos-grid">
          {loading ? <div>Chargement...</div> : filtered.map(med => (
            <div key={med.id} className="pos-product-card" onClick={() => addToCart(med)}>
              <div className="pos-product-icon">💊</div>
              <div className="pos-product-info">
                <h4>{med.designation}</h4>
                <p>{med.categorie}</p>
              </div>
              <div className="pos-product-price">{formatCurrency(med.prixVente)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-cart">
        <div className="pos-cart-header">
          <h2>Panier</h2>
          <span>{cart.length} article(s)</span>
        </div>

        <div className="pos-cart-client">
          <label>Client</label>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
            <option value="">Client anonyme</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
          </select>
        </div>

        <div className="pos-cart-items">
          {cart.length === 0 ? (
            <div className="pos-cart-empty">Panier vide</div>
          ) : cart.map(item => (
            <div key={item.id} className="pos-cart-item">
              <div className="pos-cart-item-info">
                <strong>{item.designation}</strong>
                <span>{formatCurrency(item.prixVente)}</span>
              </div>
              <div className="pos-cart-item-actions">
                <button onClick={() => updateQty(item.id, -1)}><HiOutlineMinus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><HiOutlinePlus size={14} /></button>
                <button className="remove" onClick={() => removeFromCart(item.id)}><HiOutlineTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="pos-cart-discount">
          <label>Réduction (%)</label>
          <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(parseInt(e.target.value) || 0)} />
        </div>

        <div className="pos-cart-totals">
          <div className="pos-total-row"><span>Sous-total</span><span>{formatCurrency(subtotal)}</span></div>
          {discount > 0 && <div className="pos-total-row discount"><span>Réduction ({discount}%)</span><span>-{formatCurrency(discountAmount)}</span></div>}
          <div className="pos-total-row total"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>

        <button className="pos-checkout" onClick={handleCheckout} disabled={cart.length === 0}>
          Valider la vente — {formatCurrency(total)}
        </button>
      </div>

      <Modal isOpen={!!receiptModal} onClose={() => setReceiptModal(null)} title="Reçu de Vente"
        footer={<><button className="btn btn-outline" onClick={() => setReceiptModal(null)}>Fermer</button><button className="btn btn-primary" onClick={() => { window.print() }}><HiOutlinePrinter size={16} /> Imprimer</button></>}>
        {receiptModal && (
          <div className="receipt">
            <div className="receipt-header">
              <h3>Pharmacie WFS</h3>
              <p>Réf: VTE-{receiptModal.id}</p>
            </div>
            <div className="receipt-info">
              <p>Date: {receiptModal.date}</p>
              <p>Client: {receiptModal.clientNom}</p>
              <p>Caissier: {receiptModal.caissier}</p>
            </div>
            <div className="receipt-items">
              {receiptModal.items?.map((item, i) => (
                <div key={i} className="receipt-item">
                  <span>{item.designation} x{item.qty}</span>
                  <span>{formatCurrency(item.prixVente * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="receipt-totals">
              <div className="receipt-total-row"><span>Sous-total</span><span>{formatCurrency(receiptModal.total)}</span></div>
              {receiptModal.reduction > 0 && <div className="receipt-total-row"><span>Réduction</span><span>-{formatCurrency(receiptModal.reduction)}</span></div>}
              <div className="receipt-total-row total"><span>TOTAL</span><span>{formatCurrency(receiptModal.net)}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
