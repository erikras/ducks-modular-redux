# Ducks: Redux Reducer Bundles

<img src="duck.jpg" align="right"/>

I find as I am building my redux app, one piece of functionality at a time, I keep needing to add  `{actionTypes, actions, reducer}` tuples for each use case. I have been keeping these in separate files and even separate folders, however 95% of the time, it's only one reducer/actions pair that ever needs their associated actions.

To me, it makes more sense for these pieces to be bundled together in an isolated module that is self contained, and can even be packaged easily into a library.

## The Proposal

### Example

See also: [Common JS Example](CommonJs.md).

```javascript
// widgets.js

// Actions
const LOAD   = 'my-app/widgets/LOAD';
const CREATE = 'my-app/widgets/CREATE';
const UPDATE = 'my-app/widgets/UPDATE';
const REMOVE = 'my-app/widgets/REMOVE';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}

// Action Creators
export function loadWidgets() {
  return { type: LOAD };
}

export function createWidget(widget) {
  return { type: CREATE, widget };
}

export function updateWidget(widget) {
  return { type: UPDATE, widget };
}

export function removeWidget(widget) {
  return { type: REMOVE, widget };
}

// side effects, only as applicable
// e.g. thunks, epics, etc
export function getWidget () {
  return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
}

```
### Rules

A module...

1. MUST `export default` a function called `reducer()`
2. MUST `export` its action creators as functions
3. MUST have action types in the form `npm-module-or-app/reducer/ACTION_TYPE`
3. MAY export its action types as `UPPER_SNAKE_CASE`, if an external reducer needs to listen for them, or if it is a published reusable library

These same guidelines are recommended for `{actionType, action, reducer}` bundles that are shared as reusable Redux libraries.

### Name

Java has jars and beans. Ruby has gems. I suggest we call these reducer bundles "ducks", as in the last syllable of "redux".

### Usage

You can still do:

```javascript
import { combineReducers } from 'redux';
import * as reducers from './ducks/index';

const rootReducer = combineReducers(reducers);
export default rootReducer;
```

You can still do:

```javascript
import * as widgetActions from './ducks/widgets';
```
...and it will only import the action creators, ready to be passed to `bindActionCreators()`.

> Actually, it'll also import `default`, which will be the reducer function. It'll add an action creator named `default` that won't work. If that's a problem for you, you should enumerate each action creator when importing.

There will be some times when you want to `export` something other than an action creator. That's okay, too. The rules don't say that you can *only* `export` action creators. When that happens, you'll just have to enumerate the action creators that you want. Not a big deal.

```javascript
import {loadWidgets, createWidget, updateWidget, removeWidget} from './ducks/widgets';
// ...
bindActionCreators({loadWidgets, createWidget, updateWidget, removeWidget}, dispatch);
```

### Example

[React Redux Universal Hot Example](https://github.com/erikras/react-redux-universal-hot-example) uses ducks. See [`/src/redux/modules`](https://github.com/erikras/react-redux-universal-hot-example/tree/master/src/redux/modules).

[Todomvc using ducks.](https://github.com/goopscoop/ga-react-tutorial/tree/6-reduxActionsAndReducers)

### Implementation

The migration to this code structure was [painless](https://github.com/erikras/react-redux-universal-hot-example/commit/3fdf194683abb7c40f3cb7969fd1f8aa6a4f9c57), and I foresee it reducing much future development misery.

Although it's completely feasable to implement it without any extra library, there are some tools that might help you:

 * [extensible-duck](https://github.com/investtools/extensible-duck) - Implementation of the Ducks proposal. With this library you can create reusable and extensible ducks.
 * [saga-duck](https://github.com/cyrilluce/saga-duck) - Implementation of the Ducks proposal in Typescript with [sagas](https://github.com/redux-saga/redux-saga) in mind. Results in reusable and extensible ducks.
 * [redux-duck](https://github.com/PlatziDev/redux-duck) - Helper function to create Redux modules using the ducks-modular-redux proposal
 * [modular-redux-thunk](https://github.com/benbeadle/modular-redux-thunk) - A ducks-inspired package to help organize actions, reducers, and selectors together - with built-in redux-thunk support for async actions.
 * [molecular-js](https://www.npmjs.com/package/molecular-js) - Set of utilities to ease the development of modular state management patterns with Redux (also known as ducks).
 * [ducks-reducer](https://github.com/drpicox/ducks-reducer) - Function to combine _ducks object_ reducers into one reducer (equivalent to [combineReducers](https://redux.js.org/docs/api/combineReducers.html)), and function [ducks-middleware](https://github.com/drpicox/ducks-middleware) to combine _ducks object_ middleware into one single middleware compatible with [applyMiddleware](https://redux.js.org/docs/api/applyMiddleware.html).
 * [simple-duck](https://github.com/xander27/simple-duck) - Class based implementation of _duck modules_ with all OOP benifits like inheritance and composition. Support combining of duck-module classes and regular reducer functions using `combineModules` function.

Please submit any feedback via an issue or a tweet to [@erikras](https://twitter.com/erikras). It will be much appreciated.

Happy coding!

-- Erik Rasmussen


### Translation

[한국어](https://github.com/JisuPark/ducks-modular-redux)
[中文](https://github.com/deadivan/ducks-modular-redux)

---

![C'mon! Let's migrate all our reducers!](migrate.jpg)
> Photo credit to [Airwolfhound](https://www.flickr.com/photos/24874528@N04/3453886876/).

---

[![Beerpay](https://beerpay.io/erikras/ducks-modular-redux/badge.svg?style=beer-square)](https://beerpay.io/erikras/ducks-modular-redux)  [![Beerpay](https://beerpay.io/erikras/ducks-modular-redux/make-wish.svg?style=flat-square)](https://beerpay.io/erikras/ducks-modular-redux?focus=wish)
