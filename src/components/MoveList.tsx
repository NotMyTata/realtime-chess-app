'use client'

import './MoveList.css';

export const MoveList = () => {
  return (
    <div className="movelist-component" style={{
      background: '#262522',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Move List</div>
      <div style={{ color: '#6b7280' }}>(Belum ada langkah)</div>
    </div>
  );
}

export default MoveList;