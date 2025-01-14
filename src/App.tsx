import './App.css';
import { Toaster } from './components/ui';
import { AuthProvider } from './providers/authProvider';
import { AppRouter } from './routes';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
