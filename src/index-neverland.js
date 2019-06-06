import comp, {render, html} from 'neverland';
import { createStore, useStore } from './storeHook';
import reducer from './reducer';


const appState = {name: 'amigos'};
const todoListStore = createStore(
  'todoList',
  appState,
  reducer
);

const elementOne = comp(() => {
  const [state] = useStore(todoListStore);
  return html`
     <div>Hola: ${state.name}</div>
   `;
});


const elementTwo = comp(() => {
  const [state, dispatch] = useStore(todoListStore);
  return html`
     <div>aca tambien deberiamos saludar, Hola: ${state.name}</div>
     <button onclick=${() => dispatch({type:'change'})}>cambiar</button>
   `;
});

const App = comp(() => {
  return html`${[elementOne(), elementTwo()]}`
});
window.addEventListener(
  'DOMContentLoaded',
  () => {
    render(document.querySelector('.never1'),App);
  });


