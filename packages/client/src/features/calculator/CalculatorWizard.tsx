import React, { useState, useEffect } from 'react';
import {
  CalculationInput,
  CurrencyCode,
  IncotermCode,
  Location,
  PackageType,
  ProductCategory,
  TransportMode,
  UrgencyLevel
} from '@export-cost/shared';
import { INCOTERMS } from '@export-cost/shared';
import { fetchDestinations, fetchOrigins } from '../../services/api';
import { ArrowLeft, ArrowRight, Calculator, Check, HelpCircle, Package, Ship } from 'lucide-react';

interface CalculatorWizardProps {
  onCalculate: (input: CalculationInput) => void;
  loading?: boolean;
}

export const CalculatorWizard: React.FC<CalculatorWizardProps> = ({ onCalculate, loading }) => {
  const [step, setStep] = useState<number>(1);
  const [origins, setOrigins] = useState<Location[]>([]);
  const [destinations, setDestinations] = useState<Location[]>([]);

  // Form State
  const [form, setForm] = useState<CalculationInput>({
    productName: 'Finished Cotton Garments',
    category: 'TEXTILES',
    declaredValue: 500000,
    valueCurrency: 'INR',
    quantity: 1000,
    unit: 'Pieces',
    weightKg: 450,
    volumeCbm: 2.5,
    packageType: 'PALLET',
    originId: 'origin-delhi',
    destinationId: 'dest-hamburg',
    incoterm: 'CIF',
    transportMode: 'SEA',
    urgency: 'STANDARD',
    includeInsurance: true,
    targetCurrency: 'EUR'
  });

  useEffect(() => {
    fetchOrigins().then(setOrigins);
    fetchDestinations().then(setDestinations);
  }, []);

  const updateForm = (field: keyof CalculationInput, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(form);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Step Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div
              key={num}
              onClick={() => num < step && setStep(num)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: num < step ? 'pointer' : 'default',
                background: num === step ? 'var(--primary)' : num < step ? 'var(--accent-green-bg)' : 'rgba(255,255,255,0.06)',
                color: num === step ? '#fff' : num < step ? 'var(--accent-green)' : 'var(--text-muted)',
                border: num < step ? '1px solid var(--accent-green)' : '1px solid var(--border-card)',
                transition: 'all 0.2s ease'
              }}
            >
              {num < step ? <Check size={18} /> : num}
            </div>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${((step - 1) / 5) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Product Information */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 1: Product Specifications</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Enter exported product category, invoice valuation, and units.
            </p>

            <div className="form-group">
              <label className="form-label">Product Name / Commodity Description</label>
              <input
                type="text"
                className="form-input"
                value={form.productName}
                onChange={e => updateForm('productName', e.target.value)}
                placeholder="e.g. Organic Black Tea, Leather Shoes"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Industry Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={e => updateForm('category', e.target.value as ProductCategory)}
                >
                  <option value="TEXTILES">Textiles & Apparel</option>
                  <option value="AGRICULTURE">Agri & Food Products</option>
                  <option value="ENGINEERING">Engineering & Machinery</option>
                  <option value="PHARMA">Pharmaceuticals & Healthcare</option>
                  <option value="CHEMICALS">Chemicals & Dyes</option>
                  <option value="HANDICRAFTS">Handicrafts & Decor</option>
                  <option value="ELECTRONICS">Electronics & Hardware</option>
                  <option value="OTHER">Other Industrial Goods</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Declared Value Currency</label>
                <select
                  className="form-select"
                  value={form.valueCurrency}
                  onChange={e => updateForm('valueCurrency', e.target.value as CurrencyCode)}
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Declared Invoice Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.declaredValue}
                  onChange={e => updateForm('declaredValue', parseFloat(e.target.value) || 0)}
                  min="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.quantity}
                  onChange={e => updateForm('quantity', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.unit}
                  onChange={e => updateForm('unit', e.target.value)}
                  placeholder="Pieces/Kgs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Weight & Volume */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 2: Cargo Package & Dimensions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Provide cargo gross weight and volume to compute freight volumetric chargeable weights.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Gross Weight (Kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.weightKg}
                  onChange={e => updateForm('weightKg', parseFloat(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Volume (CBM / m³)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={form.volumeCbm}
                  onChange={e => updateForm('volumeCbm', parseFloat(e.target.value) || 0.1)}
                  min="0.1"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Package Type</label>
                <select
                  className="form-select"
                  value={form.packageType}
                  onChange={e => updateForm('packageType', e.target.value as PackageType)}
                >
                  <option value="BOX">Boxes / Cartons</option>
                  <option value="PALLET">Wooden Pallets (Euro/Standard)</option>
                  <option value="CRATE">Wooden Crates</option>
                  <option value="DRUM">Drums / Barrels</option>
                  <option value="CONTAINER_20FT">20ft Full Container (FCL)</option>
                  <option value="CONTAINER_40FT">40ft Full Container (FCL)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Shipment Urgency</label>
                <select
                  className="form-select"
                  value={form.urgency}
                  onChange={e => updateForm('urgency', e.target.value as UrgencyLevel)}
                >
                  <option value="STANDARD">Standard Ocean / Freight</option>
                  <option value="EXPRESS">Express Priority Air</option>
                  <option value="ECONOMY">Economy Slow Transit</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Origin Location */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 3: Indian Export Origin</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Select your manufacturing facility or inland container depot (ICD) location in India.
            </p>

            <div className="form-group">
              <label className="form-label">Indian Origin City / Hub</label>
              <select
                className="form-select"
                value={form.originId}
                onChange={e => updateForm('originId', e.target.value)}
              >
                {origins.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.state}, {o.country}) - Code: {o.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Destination Location */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 4: International Destination Port</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Select target foreign destination port or city.
            </p>

            <div className="form-group">
              <label className="form-label">Destination Country / Port</label>
              <select
                className="form-select"
                value={form.destinationId}
                onChange={e => updateForm('destinationId', e.target.value)}
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country}) - Code: {d.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Incoterms & Transport Mode */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 5: Incoterm 2020 & Transport Selection</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Define contract responsibility allocation and preferred transport mode.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Incoterm 2020 Standard</label>
                <select
                  className="form-select"
                  value={form.incoterm}
                  onChange={e => updateForm('incoterm', e.target.value as IncotermCode)}
                >
                  <option value="EXW">EXW - Ex Works (Buyer pays all transport)</option>
                  <option value="FOB">FOB - Free On Board (Seller pays to Indian port)</option>
                  <option value="CFR">CFR - Cost & Freight (Seller pays ocean freight)</option>
                  <option value="CIF">CIF - Cost, Insurance & Freight (Standard MSME)</option>
                  <option value="DAP">DAP - Delivered at Place (Seller delivers to buyer)</option>
                  <option value="DDP">DDP - Delivered Duty Paid (Seller pays duties)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Transport Mode</label>
                <select
                  className="form-select"
                  value={form.transportMode}
                  onChange={e => updateForm('transportMode', e.target.value as TransportMode)}
                >
                  <option value="SEA">Ocean Sea Freight (LCL/FCL)</option>
                  <option value="AIR">Air Cargo Express</option>
                </select>
              </div>
            </div>

            {/* Incoterm Explanation Box */}
            <div style={{
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.3)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: 'var(--text-main)',
              marginBottom: '1rem'
            }}>
              <strong>Incoterm Summary ({form.incoterm}):</strong> {INCOTERMS[form.incoterm]?.description}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="chkInsurance"
                  checked={form.includeInsurance}
                  onChange={e => updateForm('includeInsurance', e.target.checked)}
                />
                <label htmlFor="chkInsurance" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  Include Marine Cargo Insurance Cover
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Report Display Currency</label>
                <select
                  className="form-select"
                  value={form.targetCurrency}
                  onChange={e => updateForm('targetCurrency', e.target.value as CurrencyCode)}
                >
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Calculate */}
        {step === 6 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 6: Review & Calculate</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Review your shipment parameter summary before running calculation engine.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Product:</strong> {form.productName}</div>
              <div><strong>Category:</strong> {form.category}</div>
              <div><strong>Declared Value:</strong> {form.valueCurrency} {form.declaredValue.toLocaleString()}</div>
              <div><strong>Weight / Vol:</strong> {form.weightKg} kg / {form.volumeCbm} CBM</div>
              <div><strong>Incoterm:</strong> {form.incoterm}</div>
              <div><strong>Mode:</strong> {form.transportMode}</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              disabled={loading}
            >
              <Calculator size={20} />
              {loading ? 'Calculating Export Costs...' : 'Calculate Export Cost & Score'}
            </button>
          </div>
        )}

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
          {step > 1 ? (
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 6 && (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
