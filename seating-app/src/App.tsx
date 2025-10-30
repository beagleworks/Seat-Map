import { Toolbar } from './components/Toolbar/Toolbar';
import { VenueCanvas } from './components/Venue/VenueCanvas';
import './App.css';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <VenueCanvas />
    </div>
  );
}

export default App;
