import { Component } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Link, Outlet } from 'react-router-dom';
import Footer from "./Footer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

class Pokemons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      offset: 0
    }

    this.loadMore = this.loadMore.bind(this);
  }

  getPokemons() {
    const client = new ApolloClient({
      uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
      cache: new InMemoryCache()
    });

    const GET_POKEMONS = gql`
          query pokemons($limit: Int, $offset: Int) {
            pokemons(limit: $limit, offset: $offset) {
              count
              next
              previous
              status
              message
              results {
                id
                url
                name
                image
              }
            }
          }
        `;

    const gqlVariables = {
      limit: 21,
      offset: this.state.offset,
    };

    client
      .query({
        query: GET_POKEMONS,
        variables: gqlVariables
      })
      .then((res) =>

        this.setState((state) => ({
          items: state.items.concat(res.data.pokemons.results),
          isLoading: false
        })))
      .catch(err => console.log('Error', err));
  }

  loadMore() {
    if (window.innerHeight + document.documentElement.scrollTop + 5 > document.scrollingElement.scrollHeight) {
      this.setState(state => ({
        offset: state.offset + 21,
      }), () => {
        this.getPokemons();
      })
    }
  }

  componentDidMount() {
    document.title = "Pokédex";
    this.getPokemons();
    window.addEventListener('scroll', this.loadMore);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  render() {
    const { items, isLoading } = this.state;

    if (isLoading) {
      return (
        <p>Loading .....</p>
      )
    }

    return (
      <Container className="my-5">
        <h1 className="mb-5">Pokédex</h1>
        <Row className="card-large pt-3">
          {items.map(item =>
            <Col xs={4} key={item.id} className="p-2">
              <div className="card-small text-dark p-2 overflow">
                <Link to={`/pokemon/${item.name}`} key={item.name} className="link-disabled">
                  <img src={item.image} alt={item.name} />
                  <br />
                  <span className="text-small"><b>{item.name.toUpperCase()}</b></span>
                  <br />
                  <span className="text-small">{` You have: ${JSON.parse(localStorage.getItem('myPokemon'))?.filter(p => p.pokemon === item.name).length ?? 0}`}</span>
                </Link>
              </div>
            </Col>
          )}
        </Row>
        <Outlet />
        <Footer />
      </Container >
    )
  }
}

export default Pokemons;