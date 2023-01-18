import './App.css';
import HelloWorld from './components/HelloWorld'
import Frase from './components/Frase'
import SayMyName from './components/SayMyName'
import Pessoa from './components/Pessoa';
function App() {


  const url = "https://gifs.eco.br/wp-content/uploads/2021/12/imagens-de-feliz-ano-novo-gifs-de-feliz-ano-novo-imagens-animadas-com-frases-e-mensagens-4.gif"
  
  return (
    <div className="App">
      <h1> Passando Pra Desejar Um Feliz Ano Novo </h1>
      <img src={url} alt="" />




      < HelloWorld />
      < Frase />
      < SayMyName />
      <Pessoa nome="chuinca" idade="30" profissao="programador" foto=""/>
      
      
      
    </div>
  );
}

export default App;
