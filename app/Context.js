import React, { createContext } from 'react';

const Context = createContext();
const { Consumer } = Context;

export function useConsumer(WrappedComponent) {
  return <Consumer>{props => <WrappedComponent {...props} />}</Consumer>;
}

export default Context;
