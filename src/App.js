import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Pokemons from './components/Pokemons';
import PokemonDetail from './components/PokemonDetail';
import MyPokemon from './components/MyPokemon';
import 'bootstrap/dist/css/bootstrap.min.css';

function NoMatch() {
  return (
    <div>
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path='/' element={<Pokemons />} />
            <Route path='/myPokemon' element={<MyPokemon />} />
            <Route path='/pokemon' element={<PokemonDetail />} >
              <Route path=':pokemon' element={<PokemonDetail />} />
            </Route>
            <Route path='*' element={<NoMatch />} />
          </Routes>
        </header>
      </div >
    </BrowserRouter >
  );
}

export default App;
