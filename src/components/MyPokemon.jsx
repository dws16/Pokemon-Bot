import { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import pokeball from '../img/pokeball.png';

class MyPokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
    }

    this.releasePokemon = this.releasePokemon.bind(this);
    this.getMyPokemon = this.getMyPokemon.bind(this);
  }

  getPokemonDetail(pokemon, nickname) {
    const client = new ApolloClient({
      uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
      cache: new InMemoryCache()
    });

    const GET_POKEMONDETAIL = gql`
          query pokemon($name: String!) {
            pokemon(name: $name) {
              id
              name
              sprites {
                front_default
              }
            }
          }
        `;

    const gqlVariables = {
      name: pokemon
    };

    client
      .query({
        query: GET_POKEMONDETAIL,
        variables: gqlVariables
      })
      .then(res => {
        const data = {
          id: res.data.pokemon.id,
          name: res.data.pokemon.name,
          image: res.data.pokemon.sprites.front_default,
          nickname: nickname
        }
        return data;
      })
      .then(data => this.setState((state) => ({
        items: state.items.concat(data),
        isLoading: false
      })))
      .catch(() => this.setState(() => ({
        isError: true
      })));
  }

  getMyPokemon() {
    this.setState({
      items: [],
      isLoading: true
    })
    JSON.parse(localStorage.getItem('myPokemon'))?.map(item => this.getPokemonDetail(item.pokemon, item.nickname));
  }

  releasePokemon(e) {
    const data = e.target.value.split('+');
    const nickname = data[0];
    const pokemon = data[1];
    const items = JSON.parse(localStorage.getItem('myPokemon'));
    const newItems = items.filter(item => {
      if (item.nickname === nickname && item.pokemon === pokemon) {
        return false;
      } else {
        return item;
      }
    });
    localStorage.setItem('myPokemon', JSON.stringify(newItems));
    this.getMyPokemon();
  }

  componentDidMount() {
    document.title = "My Pokémon";
    this.getMyPokemon();
  }

  render() {
    if (this.state.items.length === 0) {
      return (
        <Container style={{ marginBottom: '80px' }}>
          <Header />
          <div style={{ marginTop: '100px' }}>
            <h5>You don't have any pokemon yet.</h5>
          </div>
        </Container >
      )
    }

    if (this.state.isLoading) {
      return (
        <div>
          <img src={pokeball} alt="" className="pokeball-rotate" />
          <p>Loading .....</p>
        </div>
      )
    }
    return (
      <Container style={{ marginBottom: '80px', }}>
        <Header />
        <div style={{ marginTop: '100px' }}>
          <h1>My Pokémon</h1>
          <Row>
            {this.state.items.map((item, index) => (
              <Col xs={6} className="my-3" key={index}>
                <div className="card-small text-dark p-3 overflow" style={{ backgroundColor: 'white' }}>
                  <h5 className="mb-2 text-dark">#{('000' + item.id).slice(-4)}</h5>
                  <h5 className="text-dark text-capitalize">{item.name}</h5>
                  <img src={item.image} style={{ maxHeight: '100px', maxWidth: '100%' }} alt={item.name} />
                  <p className="text-dark">{item.nickname}</p>
                  <Button variant="danger" value={`${item.nickname}+${item.name}`} onClick={this.releasePokemon}>Release</Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    )

  }

}

export default MyPokemon;