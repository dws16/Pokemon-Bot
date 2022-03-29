import { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import pokeball from '../img/pokeball.png';
import wind from '../img/wind.png';
import { withRouter } from './withRouter';

class Catch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isLoading: true,
      isCatch: false,
      nickname: '',
      isDisabled: true,
      message: '',
      success: false,
      pokemon: this.props.location.pathname.split('/')[2]
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleType = this.handleType.bind(this);
    this.handleCatch = this.handleCatch.bind(this);
  }

  handleClick() {
    this.setState({ show: true });
    setTimeout(() => {
      this.setState({ isLoading: false });
      if (Math.random() > 0) {
        this.setState({ isCatch: true });
      } else {
        setTimeout(() => {
          this.handleClose();
        }, 3000);
      }
    }, 3000);
  }

  handleCatch() {
    const data = {
      nickname: this.state.nickname,
      pokemon: this.state.pokemon
    }

    if (localStorage.getItem('myPokemon')) {
      const pokemon = JSON.parse(localStorage.getItem('myPokemon'));
      pokemon.push(data);
      localStorage.setItem('myPokemon', JSON.stringify(pokemon));
    } else {
      const pokemon = [];
      pokemon.push(data);
      localStorage.setItem('myPokemon', JSON.stringify(pokemon));
    }

    this.setState({ success: true });
    setTimeout(() => {
      this.handleClose();
    }, 3000);
  }

  handleType(event) {
    const nickname = event.target.value;
    const pokemon = JSON.parse(localStorage.getItem('myPokemon'));

    if (nickname.length > 0) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }

    if (pokemon) {
      if (pokemon.filter(p => p.pokemon === this.state.pokemon).find(p => p.nickname === nickname)) {
        this.setState({ isDisabled: true, message: 'Nickname already taken' });
      } else {
        this.setState({ message: '', isDisabled: false, nickname: nickname });
      }
    } else {
      this.setState({ message: '', isDisabled: false, nickname: nickname });
    }

  }

  handleClose() {
    this.setState({ show: false, isCatch: false, isLoading: true, nickname: '', isDisabled: true, message: '', success: false });
  }

  render() {
    const { show, isLoading, isCatch, pokemon, isDisabled, message, success } = this.state;
    let modal = null;

    if (isLoading) {
      modal = (
        <Modal.Body className="justify-content-center text-center">
          <img src={pokeball} style={{ height: '70px', width: '70px' }} className="pokeball-shake my-3" alt="" />
          <h1 className="text-capitalize">{`Catching ${pokemon} ...`}</h1>
        </Modal.Body>
      );
    } else {
      if (isCatch) {
        modal = (
          <Modal.Body className="justify-content-center text-center">
            <h4>Gotcha! <br /><span className="text-capitalize">{`${pokemon} `}</span>was caught!</h4>
            <p>Give it a nickname</p>
            <input type="text" className="form-control" placeholder="Nickname" onChange={this.handleType} />
            <small className="text-danger my-3">{message}</small>
            <br />
            <br />
            <br />
            <Button className="mx-3" onClick={this.handleClose} variant="secondary">Release</Button>
            <Button disabled={isDisabled} onClick={this.handleCatch} className="mx-3" variant="warning">Catch</Button>
          </Modal.Body>
        );
      } else {
        modal = (
          <Modal.Body className="justify-content-center text-center">
            <div className="my-3">
              <img src={`https://img.pokemondb.net/artwork/${pokemon}.jpg`} style={{ maxHeight: '100px', }} alt="" />
              <img src={wind} style={{ height: '70px', width: '70px' }} alt="" />
            </div>
            <h1 className="text-capitalize">{`Wild ${pokemon} fled!`}</h1>
          </Modal.Body>
        );
      }
    }

    if (success) {
      modal = (
        <Modal.Body className="justify-content-center text-center">
          <h5><span className="text-capitalize">{`${pokemon} `}</span>has been stored to your bag!</h5>
        </Modal.Body>
      )
    }
    return (
      <div className="my-3">
        <button onClick={this.handleClick} className="btn-catch"><img src={pokeball} alt="" className="pokeball-shake" /> &nbsp;&nbsp;Catch&nbsp;&nbsp;</button>
        <Modal backdrop="static" show={show} onHide={this.handleClose} centered>
          {modal}
        </Modal>
      </div>
    )
  }

}

export default withRouter(Catch);