import { Component } from "react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import pokeball from '../img/pokeball.png';
import { withRouter } from './withRouter';
import { Link } from 'react-router-dom';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import { ProgressBar } from "react-bootstrap";
import Catch from "./Catch";
import Footer from "./Footer";
import Header from "./Header";

class PokemonDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: [],
      isLoading: true,
      isError: false,
      pokemon: this.props.location.pathname.split('/')[2]
    }

  }

  getPokemonDetail() {
    const client = new ApolloClient({
      uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
      cache: new InMemoryCache()
    });

    const GET_POKEMONDETAIL = gql`
          query pokemon($name: String!) {
            pokemon(name: $name) {
              id
              name
              height
              weight
              moves {
                move {
                  name
                  url
                }
              }
              stats {
                stat {
                  name
                }
                base_stat
              }
              abilities {
                ability{
                  name
                }
              }
              species{
                url
              }
              types {
                type {
                  name
                }
              }
            }
          }
        `;

    const gqlVariables = {
      name: this.state.pokemon
    };

    client
      .query({
        query: GET_POKEMONDETAIL,
        variables: gqlVariables
      })
      .then(res => {
        const detail = fetch(res.data.pokemon.species.url, {
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        })
          .then(result => result.json())
          .then(data => {
            data = {
              ...res.data.pokemon,
              'genus': data.genera.find(item => item.language.name === 'en').genus,
              'habitat': data.habitat?.name ? data.habitat.name : 'Unknown',
            }
            return data;
          })
          .catch(err => console.log('Error', err));
        return detail;
      })
      .then(res => {
        const moves = Promise.all(res.moves.map(item => {
          return fetch(item.move.url, {
            credentials: 'omit',
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
          })
            .then(result => result.json())
        }))
          .then(data => {
            const move = res.moves.map(item => {
              return {
                ...item.move,
                'accuracy': data.find(move => move.name === item.move.name).accuracy ?? '-',
                'power': data.find(move => move.name === item.move.name).power ?? '-',
                'pp': data.find(move => move.name === item.move.name).pp ?? '-',
                'type': data.find(move => move.name === item.move.name).type.name
              }
            })
            return {
              ...res,
              'moves': move
            }
          })
        return moves
      })
      .then(res => this.setState(() => ({
        detail: res,
        isLoading: false
      })))
      .catch(() => this.setState(() => ({
        isError: true
      })));
  }


  componentDidMount() {
    document.title = `${this.state.pokemon} -  Pokémon Detail`;
    if (this.state.pokemon) this.getPokemonDetail();
  }

  render() {
    const { detail, isLoading, pokemon, isError } = this.state;
    if (!pokemon || isError) {
      return (
        <div>
          <h1>404</h1>
          <p>Pokemon Not Found</p>
          <Link to='/'>
            <button className="btn-back text-small"><img src={pokeball} alt="" className="pokeball-shake" /> &nbsp;&nbsp;Find Pokemon&nbsp;&nbsp;</button>
          </Link>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div>
          <img src={pokeball} alt="" className="pokeball-rotate" />
          <p>Loading .....</p>
        </div>
      )
    }

    return (
      <Container style={{ marginBottom: '80px' }}>
        <Header />
        <div className="square-large py-4 mx-3 justify-content-center" style={{ marginTop: '100px' }}>
          <h4 className="mb-2 text-dark">#{('000' + detail.id).slice(-4)}</h4>
          <h1 className="mb-1 text-dark">{this.state.pokemon.toUpperCase()}</h1>
          <div className="justify-content-center mb-5">
            {detail.types.map(type =>
              <span key={type.type.name} className={`type-${type.type.name} px-3 mx-1 radius-30`} >{type.type.name.toUpperCase()}</span>
            )}
          </div>
          <img src={`https://img.pokemondb.net/artwork/${detail.name}.jpg`} style={{ maxHeight: '400px', maxWidth: '80%' }} alt={detail.name} />
        </div>
        <Catch />
        <div className="square-large my-3 py-3">
          <Accordion className="mx-2">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Data</Accordion.Header>
              <Accordion.Body>
                <table className="text-dark mx-1">
                  <tbody>
                    <tr>
                      <th className="text-end px-3">Height</th>
                      <td className="text-start">{`${detail.height / 10} m`}</td>
                    </tr>
                    <tr>
                      <th className="text-end px-3">Weight</th>
                      <td className="text-start">{`${detail.weight / 10} kg`}</td>
                    </tr>
                    <tr>
                      <th className="text-end px-3">Species</th>
                      <td className="text-start">{detail.genus}</td>
                    </tr>
                    <tr>
                      <th className="text-end px-3">Abilities</th>
                      <td>
                        <ul>
                          {detail.abilities.map(ability =>
                            <li className="text-start text-capitalize" key={ability.ability.name}>{ability.ability.name}</li>
                          )}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-end px-3">Habitat</th>
                      <td className="text-start text-capitalize">{detail.habitat}</td>
                    </tr>
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Stats</Accordion.Header>
              <Accordion.Body>
                {detail.stats.map(stat =>
                  <div>
                    <Row key={stat.stat.name} className="text-dark mx-1 my-3">
                      <Col>
                        <div className="text-start text-capitalize">{stat.stat.name}</div>
                      </Col>
                      <Col>
                        <div className="text-end">{stat.base_stat}</div>
                      </Col>
                    </Row>
                    <ProgressBar variant="warning" style={{ color: 'black !important' }} now={stat.base_stat} max='180' />
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Moves</Accordion.Header>
              <Accordion.Body>
                {detail.moves.map(move => {
                  return (
                    <Row className='card-small my-3'>
                      <Col xs={7} className="my-auto">
                        <h5 className="mb-1 text-dark">{move.name.toUpperCase()}</h5>
                        <p className={`mb-1 text-dark type-${move.type} radius-30 px-3 mx-1`}>{move.type.toUpperCase()}</p>
                      </Col>
                      <Col xs={5}>
                        <div className="text-dark my-auto" style={{ fontSize: '0.8em' }}>
                          <span >Power: {move.power}</span>
                          <br />
                          <span >Accuracy: {move.accuracy}</span>
                          <br />
                          <span >PP: {move.pp}</span>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Footer />
        </div>
      </Container >
    )
  }
}

export default withRouter(PokemonDetail);