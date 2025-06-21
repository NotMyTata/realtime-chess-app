'use client'

import './MoveList.css';

export const MoveList = () => {
  return (
    <div className="movelist-component" style={{
      background: '#262522',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Move List</div>
      <div style={{ color: '#6b7280' }}>(Belum ada langkah)</div>
    </div>
  );
}

export default MoveList;