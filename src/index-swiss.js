import { element, renderer } from "swiss";
import { createStore, useStore } from './storeHook'
import reducer from './reducer';
import { html, render } from "lit-html";

const appState = {name: 'amigos'};
const todoListStore = createStore(
  'todoList',
  appState,
  reducer
);

const elementOne = () => {
  const [state] = useStore(todoListStore);
   return html`
     <div>Hola: ${state.name}</div>
   `;
};


const elementTwo = () => {
  const [state, dispatch] = useStore(todoListStore);
  return html`
     <div>aca tambien deberiamos saludar, Hola: ${state.name}</div>
     <button @click=${() => dispatch({type:'change'})}>cambiar</button>
   `;
};

element("ele-one", elementOne, renderer(render));
element("ele-two", elementTwo, renderer(render));

function App() {
  return html`
    <ele-one></ele-one>
    <ele-two></ele-two>
  `;
}

element("my-app", App, renderer(render));
