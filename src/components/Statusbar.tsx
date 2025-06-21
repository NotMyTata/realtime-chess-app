import Clock from "./Clock";
import Turn from "./Turn";
import './Statusbar.css';

export const Statusbar = () => {
  return (
    <div className='statusbar-component'>
        <Clock />
        <Turn />
        <Clock />
    </div>
  );
}

export default Statusbar;