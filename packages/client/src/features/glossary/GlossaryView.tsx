import React, { useState, useEffect } from 'react';
import { GlossaryTerm } from '@export-cost/shared';
import { fetchGlossary } from '../../services/api';
import { BookOpen, Search, HelpCircle, Tag, X } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setIsLoading(true);
      fetchGlossary(search, selectedCategory === 'ALL' ? undefined : selectedCategory)
        .then(setTerms)
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory]);

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={24} style={{ color: 'var(--primary)' }} />
          Export & Trade Logistics Glossary
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Educational guide clarifying complex international logistics terminology, Incoterms 2020 rules, and Indian customs procedures.
        </p>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : '1rem' }}
              placeholder="Search trade terms, Incoterms, ICEGATE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            className="form-select"
            style={{ width: '200px' }}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="INCOTERMS">Incoterms 2020</option>
            <option value="CUSTOMS">Customs & ICEGATE</option>
            <option value="DOCUMENTATION">Documentation</option>
            <option value="FREIGHT">Ocean & Air Freight</option>
            <option value="FINANCE">Export Finance</option>
          </select>
        </div>

        {/* Terms List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Loading glossary terms...
            </div>
          </div>
        ) : terms.length > 0 ? (
          <>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Showing {terms.length} {terms.length === 1 ? 'term' : 'terms'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {terms.map(item => (
                <div key={item.id} className="glass-card" style={{ padding: '1.2rem', background: 'var(--bg-card-solid)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {item.term}
                      </h3>
                      {item.abbreviation && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          ({item.abbreviation})
                        </span>
                      )}
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      {item.category}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                    {item.definition}
                  </p>

                  {item.example && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                      <strong>Example:</strong> {item.example}
                    </div>
                  )}

                  {item.incotermRelevance && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                      💡 {item.incotermRelevance}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <HelpCircle size={48} style={{ color: 'var(--text-subtle)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No terms found
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Try adjusting your search query or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
