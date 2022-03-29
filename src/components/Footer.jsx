import { Component } from "react";
import { Link } from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";


class Footer extends Component {

  render() {
    return (
      <div className="fixed-bottom">
        <Navbar className="footer">
          <Container>
            <div className="item-footer">
              <Link to="/myPokemon" className="main-item">
                <span className="item-logo"></span>
              </Link>
              <div>
                <span className="item-text">My Pokémon</span>
              </div>
            </div>
          </Container>
        </Navbar>
      </div >
    )
  }
}

export default Footer;