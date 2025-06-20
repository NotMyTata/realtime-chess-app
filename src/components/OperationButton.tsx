'use client'

import './OperationButton.css';

export const OperationButton = () => {
  return (
    <div className='operationbutton-component'>
        <button className="rematch-button button-primary" disabled>Rematch</button>
        <button className="draw-button button-primary">Draw</button>
        <button className="resign-button button-primary">Resign</button>
    </div>
  );
}

export default OperationButton;