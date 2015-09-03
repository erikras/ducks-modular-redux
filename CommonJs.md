## Common JS Example

```javascript
// widgets.js

const LOAD   = 'my-app/widgets/LOAD';
const CREATE = 'my-app/widgets/CREATE';
const UPDATE = 'my-app/widgets/UPDATE';
const REMOVE = 'my-app/widgets/REMOVE';

function reducer(state = {}, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}

reducer.loadWidgets = function() {
  return { type: LOAD };
}

reducer.createWidget = function(widget) {
  return { type: CREATE, widget };
}

reducer.updateWidget = function(widget) {
  return { type: UPDATE, widget };
}

reducer.removeWidget = function(widget) {
  return { type: REMOVE, widget };
}

module.exports = reducer;
```


One of the different caveats is that you can't use Redux' `bindActionCreators()` directly with a duck module, as it assumes that when given a function, it's a single action creator, so you need to do something like:

```javascript
var actionCreators = require('./ducks/widgets');
bindActionCreators({ ...actionCreators });
```

Another is that if you're also exporting some type constants, you need to attach those to the reducer function too, so you can't unpack just the action creators into another object at import time as easily (no `as` syntax) so the above trick isn't as viable.

You can avoid getting bitten by both of these by rolling your own dispatch binding function - this is the one I'm using to create a function to be passed as the `mapDispatchToProps` argument to `connect()`:

```javascript
/**
 * Creates a function which creates same-named action dispatchers from an object
 * whose function properties are action creators. Any non-functions in the actionCreators
 * object are ignored.
 */
var createActionDispatchers = actionCreators => dispatch =>
  Object.keys(actionCreators).reduce((actionDispatchers, name) => {
    var actionCreator = actionCreators[name];
    if (typeof actionCreator == 'function') {
      actionDispatchers[name] = (...args) => dispatch(actionCreator(...args));
    }
    return actionDispatchers;
  }, {})

var actionCreators = require('./ducks/widgets');
var mapStateToProps = state => state.widgets;
var mapDispatchToProps = createActionDispatchers(actionCreators);

var MyComponent = React.createClass({ /* ... */ });

module.exports = connect(mapStateToProps , mapDispatchToProps)(MyComponent);
```

---
This document copied almost verbatim from [@insin](https://github.com/insin)'s issue [#2](https://github.com/erikras/ducks-modular-redux/issues/2).