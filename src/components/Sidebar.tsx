'use client'

import Chat from "./Chat";
import MoveList from "./MoveList";
import OperationButton from "./OperationButton";
import './Sidebar.css';

export const Sidebar = () => {
  return (
    <div className='sidebar-component'>
        <OperationButton />
        <MoveList />
        <Chat />
    </div>
  );
}

export default Sidebar;