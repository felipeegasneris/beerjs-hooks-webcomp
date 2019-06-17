const reducer = (state, action) => {
  const {type} = action;
  switch (type) {
    case 'change':
      return {...state, name: 'DevsChile'};
      return state;
    default:
      return state;
  }
};
export default reducer;
