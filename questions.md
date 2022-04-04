1. For PureComponent shouldComponentUpdate method is already implemented with shallow prop and state comparison. If we have some nested data structure in props or state this can lead to bugs.
2. As I remember this was dangerous for old context API, when the context changed PureComponent didn't update
3. Pass callback as a prop from parent to child,
   Pass a callback to a child inside context

4. shouldComponentUpdate lifecycle for class components and react.memo for functional components
5. fragment - is an empty node, that let's you group elements returned from the component. If the parent component is a flex container and it expects to have several children, if we don't wrap children components as fragment it will break layout.
6. react.memo, connect from 'react-redux' library
7. for promises .catch().finally(), for async await and callback try, catch, finally
8. setState takes 2 arguments, first argument is nextState, second argument is updater function (when your next state depends on previous state). setState is async to batch state updates during the same cycle.
9. transform render method to a return of functional component, transform this.state and this.setState usage to useState, transform lifecycles to useEffect
10. style attribute, css classes, css-in-js (styled-components)
11. With dangerouslySetInnerHTML prop
