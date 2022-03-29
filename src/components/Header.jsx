import { Component } from "react";
import { Link } from 'react-router-dom';
import pokeball from '../img/pokeball.png';

class Header extends Component {

  render() {
    return (
      <div className="my-3 mx-3 justify-content-start text-start" style={{ top: 20, position: 'absolute' }}>
        <Link to='/'>
          <button className="btn-back"><img src={pokeball} alt="" className="pokeball" /> &nbsp;&nbsp;Find Pokemon&nbsp;&nbsp;</button>
        </Link>
      </div>
    )
  }
}

export default Header;

