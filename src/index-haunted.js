import {html, component} from 'haunted';
import { createStore, useStore } from './storeHook';
import reducer from './reducer';


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

customElements.define('h-one', component(elementOne));
customElements.define('h-two', component(elementTwo));

const App =() => {
  return html`
    <h-one></h-one>
    <h-two></h-two>
  `;
};

customElements.define("my-haunted-app", component(App));
