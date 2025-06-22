'use client'

import './MoveList.css';

export type MoveEntry = {
  moveNumber: number;
  white: string;
  black?: string;
};

export const MoveList = ({ moveHistory }: { moveHistory: string[] }) => {

  const formatMoveHistory = () => {
    const result: MoveEntry[] = [];

    if (moveHistory !== undefined){
      for (let i = 0; i < moveHistory.length; i += 2) {
          result.push({
            moveNumber: Math.floor(i / 2) + 1,
            white: moveHistory[i],
            black: moveHistory[i + 1] ?? '',
          });
       }
    }

    return (
      <div className='movelist-table-container'>
        <table style={{width: '100%', textAlign: 'center'}}>
          <thead>
            <tr>
              <th>#</th>
              <th>White</th>
              <th>Black</th>
            </tr>
          </thead>
          <tbody>
            {result.map(({moveNumber, white, black}, index) => (
              <tr key={index}>
                <td>{moveNumber}</td>
                <td>{white}</td>
                <td>{black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="movelist-component" style={{
      background: '#262522',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    }}>
      <div className="movelist-title" style={{ fontWeight: 'bold', marginBottom: 8 }}>Move List</div>
      {formatMoveHistory()}
    </div>
  );
}

export default MoveList;