'use client'

import Chat from "./Chat";
import MoveList from "./MoveList";
import './Sidebar.css';

export const Sidebar = () => {
  return (
    <div className='sidebar-component'>
        <MoveList />
        <Chat />
    </div>
  );
}

export default Sidebar;