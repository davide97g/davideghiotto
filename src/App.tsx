import './App.css';
import { Info } from './components/Info';
import Projects from './components/Projects';
import Skills from './components/Skills';

const App = () => {
  return (
    <div className="flex flex-col gap-4 h-screen w-screen justify-center items-center">
      <h1 className="text-4xl font-bold">Davide Ghiotto</h1>
      <p className="text-md">Full Stack Developer</p>
      <Skills />
      <Projects />
      <Info />
    </div>
  );
};

export default App;
