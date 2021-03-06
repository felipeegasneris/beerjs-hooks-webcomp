// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@ungap/custom-event/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};
self.CustomEvent = typeof CustomEvent === 'function' ? CustomEvent : function (__p__) {
  CustomEvent[__p__] = new CustomEvent('').constructor[__p__];
  return CustomEvent;

  function CustomEvent(type, init) {
    if (!init) init = {};
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, !!init.bubbles, !!init.cancelable, init.detail);
    return e;
  }
}('prototype');
var _default = self.CustomEvent;
exports.default = _default;
},{}],"node_modules/@ungap/weakset/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};

try {
  self.WeakSet = WeakSet;
} catch (WeakSet) {
  // requires a global WeakMap (IE11+)
  (function (WeakMap) {
    var all = new WeakMap();
    var proto = WeakSet.prototype;

    proto.add = function (value) {
      return all.get(this).set(value, 1), this;
    };

    proto.delete = function (value) {
      return all.get(this).delete(value);
    };

    proto.has = function (value) {
      return all.get(this).has(value);
    };

    self.WeakSet = WeakSet;

    function WeakSet(iterable) {
      'use strict';

      all.set(this, new WeakMap());
      if (iterable) iterable.forEach(this.add, this);
    }
  })(WeakMap);
}

var _default = self.WeakSet;
exports.default = _default;
},{}],"node_modules/augmentor/esm/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.unstacked = exports.uid = exports.stacked = exports.diff = exports.$ = exports.setup = exports.empty = exports.current = void 0;
let now = null;

const current = () => now;

exports.current = current;
const empty = [];
exports.empty = empty;
const setup = [];
exports.setup = setup;

const $ = (value, args) => typeof value === typeof $ ? value.apply(null, args) : value;

exports.$ = $;

const diff = (a, b) => a.length !== b.length || a.some(diverse, b);

exports.diff = diff;

const stacked = id => runner => {
  const state = {
    i: 0,
    stack: []
  };
  runner[id] = state;
  runner.before.push(() => {
    state.i = 0;
  });
};

exports.stacked = stacked;
let id = 0;

const uid = () => '_$' + id++;

exports.uid = uid;

const unstacked = id => {
  const {
    [id]: state,
    update
  } = now;
  const {
    i,
    stack
  } = state;
  state.i++;
  return {
    i,
    stack,
    update,
    unknown: i === stack.length
  };
};

exports.unstacked = unstacked;

var _default = fn => {
  const current = runner($);
  each(setup, current);

  $.reset = () => {
    each(current.reset, current);

    for (const key in current) {
      if (/^_\$/.test(key)) current[key].stack.splice(0);
    }
  };

  return $;

  function $() {
    const prev = now;
    now = current;
    const {
      _,
      before,
      after,
      external
    } = current;

    try {
      let result;

      do {
        _.$ = _._ = false;
        each(before, current);
        result = fn.apply(_.c = this, _.a = arguments);
        each(after, current);
        if (external.length) each(external.splice(0), result);
      } while (_._);

      return result;
    } finally {
      _.$ = true;
      now = prev;
    }
  }
};

exports.default = _default;

const each = (arr, value) => {
  const {
    length
  } = arr;
  let i = 0;

  while (i < length) arr[i++](value);
};

const runner = $ => {
  const _ = {
    _: true,
    $: true,
    c: null,
    a: null
  };
  return {
    _: _,
    before: [],
    after: [],
    external: [],
    reset: [],
    update: () => _.$ ? $.apply(_.c, _.a) : _._ = true
  };
};

function diverse(value, i) {
  return value !== this[i];
}
},{}],"node_modules/augmentor/esm/use/effect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLayoutEffect = exports.useEffect = void 0;

var _core = require("../core.js");

const id = (0, _core.uid)();
let cancel, request;

try {
  cancel = cancelAnimationFrame;
  request = requestAnimationFrame;
} catch (o_O) {
  cancel = clearTimeout;
  request = setTimeout;
}

const create = (always, check, inputs, raf, cb, stack, i) => {
  const info = {
    always,
    cb,
    check,
    clean: null,
    inputs,
    raf,
    t: 0,
    update: check,
    fn: () => {
      set(stack[i], info.cb());
    }
  };
  return info;
};

const effect = raf => (cb, refs) => {
  const {
    i,
    stack,
    unknown
  } = (0, _core.unstacked)(id);
  const comp = refs || _core.empty;

  if (unknown) {
    const always = comp === _core.empty;
    const check = always || !raf || typeof comp !== typeof effect;

    if (always || !raf || typeof comp !== typeof effect) {
      stack.push(create(always, check, comp, raf, cb, stack, i));
    } else {
      (0, _core.current)().external.push(result => refs(cb, result));
      stack.push(create(always, always, _core.empty, raf, effect, stack, i));
    }
  } else {
    const info = stack[i];
    const {
      check,
      always,
      inputs
    } = info;

    if (check && (always || (0, _core.diff)(inputs, comp))) {
      info.cb = cb;
      info.inputs = comp;
      info.update = true;
    }
  }
};

const set = (info, clean) => {
  info.t = 0;
  info.clean = clean;
};

_core.setup.push(runner => {
  const stack = [];
  const state = {
    i: 0,
    stack
  };

  const drop = (current, clean, raf, t) => {
    if (raf && t) cancel(t);else if (clean) clean();
    set(current, null);
  };

  runner[id] = state;
  runner.before.push(() => {
    state.i = 0;
  });
  runner.reset.push(() => {
    state.i = 0;

    for (let {
      length
    } = stack, i = 0; i < length; i++) {
      const current = stack[i];
      const {
        check,
        clean,
        raf,
        t
      } = current;
      if (check) drop(current, clean, raf, t);
    }
  });
  runner.after.push(() => {
    for (let {
      length
    } = stack, i = 0; i < length; i++) {
      const current = stack[i];
      const {
        check,
        clean,
        fn,
        raf,
        t,
        update
      } = current;

      if (check && update) {
        current.update = false;
        drop(current, clean, raf, t);
        if (raf) current.t = request(fn);else fn();
      }
    }
  });
});

const useEffect = effect(true);
exports.useEffect = useEffect;
const useLayoutEffect = effect(false);
exports.useLayoutEffect = useLayoutEffect;
},{"../core.js":"node_modules/augmentor/esm/core.js"}],"node_modules/augmentor/esm/use/ref.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core.js");

const id = (0, _core.uid)();

_core.setup.push((0, _core.stacked)(id));

var _default = value => {
  const {
    i,
    stack,
    unknown
  } = (0, _core.unstacked)(id);

  if (unknown) {
    const info = {
      current: null
    };
    stack.push(info);
    info.current = (0, _core.$)(value, _core.empty);
  }

  return stack[i];
};

exports.default = _default;
},{"../core.js":"node_modules/augmentor/esm/core.js"}],"node_modules/augmentor/esm/use/memo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core.js");

const id = (0, _core.uid)();

_core.setup.push((0, _core.stacked)(id));

var _default = (callback, refs) => {
  const {
    i,
    stack,
    unknown
  } = (0, _core.unstacked)(id);
  const comp = refs || _core.empty;
  if (unknown) create(stack, -1, callback, comp);
  const {
    filter,
    value,
    fn,
    inputs
  } = stack[i];
  return (filter ? (0, _core.diff)(inputs, comp) : callback !== fn) ? create(stack, i, callback, comp) : value;
};

exports.default = _default;

const create = (stack, i, fn, inputs) => {
  const info = {
    filter: inputs !== _core.empty,
    value: null,
    fn,
    inputs
  };
  if (i < 0) stack.push(info);else stack[i] = info;
  info.value = fn();
  return info.value;
};
},{"../core.js":"node_modules/augmentor/esm/core.js"}],"node_modules/augmentor/esm/use/callback.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memo = _interopRequireDefault(require("./memo.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (fn, inputs) => (0, _memo.default)(() => fn, inputs);

exports.default = _default;
},{"./memo.js":"node_modules/augmentor/esm/use/memo.js"}],"node_modules/augmentor/esm/use/reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core.js");

const id = (0, _core.uid)();

_core.setup.push((0, _core.stacked)(id));

var _default = (reducer, value) => {
  const {
    i,
    stack,
    unknown,
    update
  } = (0, _core.unstacked)(id);

  if (unknown) {
    const info = [null, action => {
      value = reducer(value, action);
      info[0] = value;
      update();
    }];
    stack.push(info);
    info[0] = (0, _core.$)(value, _core.empty);
  }

  return stack[i];
};

exports.default = _default;
},{"../core.js":"node_modules/augmentor/esm/core.js"}],"node_modules/augmentor/esm/use/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("../core.js");

var _reducer = _interopRequireDefault(require("./reducer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = value => (0, _reducer.default)((_, value) => (0, _core.$)(value, [_]), value);

exports.default = _default;
},{"../core.js":"node_modules/augmentor/esm/core.js","./reducer.js":"node_modules/augmentor/esm/use/reducer.js"}],"node_modules/augmentor/esm/use/context.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContext = exports.createContext = void 0;

var _core = require("../core.js");

const all = new WeakMap();
const id = (0, _core.uid)();

_core.setup.push((0, _core.stacked)(id));

const createContext = value => {
  const context = {
    value,
    provide
  };
  all.set(context, []);
  return context;
};

exports.createContext = createContext;

const useContext = context => {
  const {
    i,
    stack,
    unknown,
    update
  } = (0, _core.unstacked)(id);

  if (unknown) {
    all.get(context).push(update);
    stack.push(context);
  }

  return stack[i].value;
};

exports.useContext = useContext;

function provide(value) {
  if (this.value !== value) {
    this.value = value;

    for (let arr = all.get(this), {
      length
    } = arr, i = 0; i < length; i++) arr[i]();
  }
}
},{"../core.js":"node_modules/augmentor/esm/core.js"}],"node_modules/augmentor/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _effect.useEffect;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _effect.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _ref.default;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _memo.default;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _callback.default;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _reducer.default;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _state.default;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _context.createContext;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _context.useContext;
  }
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./core.js"));

var _effect = require("./use/effect.js");

var _ref = _interopRequireDefault(require("./use/ref.js"));

var _memo = _interopRequireDefault(require("./use/memo.js"));

var _callback = _interopRequireDefault(require("./use/callback.js"));

var _reducer = _interopRequireDefault(require("./use/reducer.js"));

var _state = _interopRequireDefault(require("./use/state.js"));

var _context = require("./use/context.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _core.default;
exports.default = _default;
},{"./core.js":"node_modules/augmentor/esm/core.js","./use/effect.js":"node_modules/augmentor/esm/use/effect.js","./use/ref.js":"node_modules/augmentor/esm/use/ref.js","./use/memo.js":"node_modules/augmentor/esm/use/memo.js","./use/callback.js":"node_modules/augmentor/esm/use/callback.js","./use/reducer.js":"node_modules/augmentor/esm/use/reducer.js","./use/state.js":"node_modules/augmentor/esm/use/state.js","./use/context.js":"node_modules/augmentor/esm/use/context.js"}],"node_modules/disconnected/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi */
function disconnected(poly) {
  'use strict';

  var CONNECTED = 'connected';
  var DISCONNECTED = 'dis' + CONNECTED;
  var Event = poly.Event;
  var WeakSet = poly.WeakSet;
  var notObserving = true;
  var observer = new WeakSet();
  return function observe(node) {
    if (notObserving) {
      notObserving = !notObserving;
      startObserving(node.ownerDocument);
    }

    observer.add(node);
    return node;
  };

  function startObserving(document) {
    var dispatched = null;

    try {
      new MutationObserver(changes).observe(document, {
        subtree: true,
        childList: true
      });
    } catch (o_O) {
      var timer = 0;
      var records = [];

      var reschedule = function (record) {
        records.push(record);
        clearTimeout(timer);
        timer = setTimeout(function () {
          changes(records.splice(timer = 0, records.length));
        }, 0);
      };

      document.addEventListener('DOMNodeRemoved', function (event) {
        reschedule({
          addedNodes: [],
          removedNodes: [event.target]
        });
      }, true);
      document.addEventListener('DOMNodeInserted', function (event) {
        reschedule({
          addedNodes: [event.target],
          removedNodes: []
        });
      }, true);
    }

    function changes(records) {
      dispatched = new Tracker();

      for (var record, length = records.length, i = 0; i < length; i++) {
        record = records[i];
        dispatchAll(record.removedNodes, DISCONNECTED, CONNECTED);
        dispatchAll(record.addedNodes, CONNECTED, DISCONNECTED);
      }

      dispatched = null;
    }

    function dispatchAll(nodes, type, counter) {
      for (var node, event = new Event(type), length = nodes.length, i = 0; i < length; (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, event, type, counter));
    }

    function dispatchTarget(node, event, type, counter) {
      if (observer.has(node) && !dispatched[type].has(node)) {
        dispatched[counter].delete(node);
        dispatched[type].add(node);
        node.dispatchEvent(event);
        /*
        // The event is not bubbling (perf reason: should it?),
        // hence there's no way to know if
        // stop/Immediate/Propagation() was called.
        // Should DOM Level 0 work at all?
        // I say it's a YAGNI case for the time being,
        // and easy to implement in user-land.
        if (!event.cancelBubble) {
          var fn = node['on' + type];
          if (fn)
            fn.call(node, event);
        }
        */
      }

      for (var // apparently is node.children || IE11 ... ^_^;;
      // https://github.com/WebReflection/disconnected/issues/1
      children = node.children || [], length = children.length, i = 0; i < length; dispatchTarget(children[i++], event, type, counter));
    }

    function Tracker() {
      this[CONNECTED] = new WeakSet();
      this[DISCONNECTED] = new WeakSet();
    }
  }
}

var _default = disconnected;
exports.default = _default;
},{}],"node_modules/dom-augmentor/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _augmentor.createContext;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _augmentor.useCallback;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _augmentor.useContext;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _augmentor.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _augmentor.useMemo;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _augmentor.useReducer;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _augmentor.useRef;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _augmentor.useState;
  }
});
exports.useEffect = exports.default = void 0;

var _customEvent = _interopRequireDefault(require("@ungap/custom-event"));

var _weakset = _interopRequireDefault(require("@ungap/weakset"));

var _augmentor = _interopRequireWildcard(require("augmentor"));

var _disconnected = _interopRequireDefault(require("disconnected"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const find = node => {
  const {
    childNodes
  } = node;
  const {
    length
  } = childNodes;
  let i = 0;

  while (i < length) {
    const child = childNodes[i++];
    if (child.nodeType === 1) return child;
  }

  throw 'unobservable';
};

const observe = (0, _disconnected.default)({
  Event: _customEvent.default,
  WeakSet: _weakset.default
});

const observer = ($, element) => {
  const {
    nodeType
  } = element;

  if (nodeType) {
    const node = nodeType === 1 ? element : find(element);
    observe(node);
    const handler = {
      handleEvent,
      onconnected,
      ondisconnected,
      $,
      _: null
    };
    node.addEventListener('connected', handler, false);
    node.addEventListener('disconnected', handler, false);
  } else {
    const value = element.valueOf(); // give a chance to facades to return a reasonable value

    if (value !== element) observer($, value);
  }
};

const useEffect = (fn, inputs) => {
  const args = [fn];
  if (inputs) // if the inputs is an empty array
    // observe the returned element for connect/disconnect events
    // and invoke effects/cleanup on these events only
    args.push(inputs.length ? inputs : observer);
  return _augmentor.useEffect.apply(null, args);
};

exports.useEffect = useEffect;
var _default = _augmentor.default;
exports.default = _default;

// handlers methods
function handleEvent(e) {
  this['on' + e.type]();
}

function onconnected() {
  ondisconnected.call(this);
  this._ = this.$();
}

function ondisconnected() {
  const {
    _
  } = this;
  this._ = null;
  if (_) _();
}
},{"@ungap/custom-event":"node_modules/@ungap/custom-event/esm/index.js","@ungap/weakset":"node_modules/@ungap/weakset/esm/index.js","augmentor":"node_modules/augmentor/esm/index.js","disconnected":"node_modules/disconnected/esm/index.js"}],"node_modules/@ungap/weakmap/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};

try {
  self.WeakMap = WeakMap;
} catch (WeakMap) {
  // this could be better but 90% of the time
  // it's everything developers need as fallback
  self.WeakMap = function (id, Object) {
    'use strict';

    var dP = Object.defineProperty;
    var hOP = Object.hasOwnProperty;
    var proto = WeakMap.prototype;

    proto.delete = function (key) {
      return this.has(key) && delete key[this._];
    };

    proto.get = function (key) {
      return this.has(key) ? key[this._] : void 0;
    };

    proto.has = function (key) {
      return hOP.call(key, this._);
    };

    proto.set = function (key, value) {
      dP(key, this._, {
        configurable: true,
        value: value
      });
      return this;
    };

    return WeakMap;

    function WeakMap(iterable) {
      dP(this, '_', {
        value: '_@ungap/weakmap' + id++
      });
      if (iterable) iterable.forEach(add, this);
    }

    function add(pair) {
      this.set(pair[0], pair[1]);
    }
  }(Math.random(), Object);
}

var _default = self.WeakMap;
exports.default = _default;
},{}],"node_modules/@ungap/template-literal/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var templateLiteral = function () {
  'use strict';

  var RAW = 'raw';
  var isNoOp = typeof document !== 'object';

  var templateLiteral = function (tl) {
    if ( // for badly transpiled literals
    !(RAW in tl) || // for some version of TypeScript
    tl.propertyIsEnumerable(RAW) || // and some other version of TypeScript
    !Object.isFrozen(tl[RAW]) || // or for Firefox < 55
    /Firefox\/(\d+)/.test((document.defaultView.navigator || {}).userAgent) && parseFloat(RegExp.$1) < 55) {
      var forever = {};

      templateLiteral = function (tl) {
        for (var key = '.', i = 0; i < tl.length; i++) key += tl[i].length + '.' + tl[i];

        return forever[key] || (forever[key] = tl);
      };
    } else {
      isNoOp = true;
    }

    return TL(tl);
  };

  return TL;

  function TL(tl) {
    return isNoOp ? tl : templateLiteral(tl);
  }
}();

var _default = templateLiteral;
exports.default = _default;
},{}],"node_modules/@ungap/template-tag-arguments/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _templateLiteral = _interopRequireDefault(require("@ungap/template-literal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(template) {
  var length = arguments.length;
  var args = [(0, _templateLiteral.default)(template)];
  var i = 1;

  while (i < length) args.push(arguments[i++]);

  return args;
}

;
},{"@ungap/template-literal":"node_modules/@ungap/template-literal/esm/index.js"}],"node_modules/hyperhtml-wire/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var Wire = function (slice, proto) {
  proto = Wire.prototype;
  proto.ELEMENT_NODE = 1;
  proto.nodeType = 111;

  proto.remove = function (keepFirst) {
    var childNodes = this.childNodes;
    var first = this.firstChild;
    var last = this.lastChild;
    this._ = null;

    if (keepFirst && childNodes.length === 2) {
      last.parentNode.removeChild(last);
    } else {
      var range = this.ownerDocument.createRange();
      range.setStartBefore(keepFirst ? childNodes[1] : first);
      range.setEndAfter(last);
      range.deleteContents();
    }

    return first;
  };

  proto.valueOf = function (forceAppend) {
    var fragment = this._;
    var noFragment = fragment == null;
    if (noFragment) fragment = this._ = this.ownerDocument.createDocumentFragment();

    if (noFragment || forceAppend) {
      for (var n = this.childNodes, i = 0, l = n.length; i < l; i++) fragment.appendChild(n[i]);
    }

    return fragment;
  };

  return Wire;

  function Wire(childNodes) {
    var nodes = this.childNodes = slice.call(childNodes, 0);
    this.firstChild = nodes[0];
    this.lastChild = nodes[nodes.length - 1];
    this.ownerDocument = nodes[0].ownerDocument;
    this._ = null;
  }
}([].slice);

var _default = Wire;
exports.default = _default;
},{}],"node_modules/lighterhtml/esm/shared.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Wire", {
  enumerable: true,
  get: function () {
    return _hyperhtmlWire.default;
  }
});
exports.wireType = exports.isArray = void 0;

var _hyperhtmlWire = _interopRequireDefault(require("hyperhtml-wire"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;
exports.isArray = isArray;
const wireType = _hyperhtmlWire.default.prototype.nodeType;
exports.wireType = wireType;
},{"hyperhtml-wire":"node_modules/hyperhtml-wire/esm/index.js"}],"node_modules/@ungap/create-content/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var createContent = function (document) {
  'use strict';

  var FRAGMENT = 'fragment';
  var TEMPLATE = 'template';
  var HAS_CONTENT = 'content' in create(TEMPLATE);
  var createHTML = HAS_CONTENT ? function (html) {
    var template = create(TEMPLATE);
    template.innerHTML = html;
    return template.content;
  } : function (html) {
    var content = create(FRAGMENT);
    var template = create(TEMPLATE);
    var childNodes = null;

    if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
      var selector = RegExp.$1;
      template.innerHTML = '<table>' + html + '</table>';
      childNodes = template.querySelectorAll(selector);
    } else {
      template.innerHTML = html;
      childNodes = template.childNodes;
    }

    append(content, childNodes);
    return content;
  };
  return function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
  };

  function append(root, childNodes) {
    var length = childNodes.length;

    while (length--) root.appendChild(childNodes[0]);
  }

  function create(element) {
    return element === FRAGMENT ? document.createDocumentFragment() : document.createElementNS('http://www.w3.org/1999/xhtml', element);
  } // it could use createElementNS when hasNode is there
  // but this fallback is equally fast and easier to maintain
  // it is also battle tested already in all IE


  function createSVG(svg) {
    var content = create(FRAGMENT);
    var template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
  }
}(document);

var _default = createContent;
exports.default = _default;
},{}],"node_modules/@ungap/essential-map/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};

try {
  self.Map = Map;
} catch (Map) {
  self.Map = function Map() {
    var i = 0;
    var k = [];
    var v = [];
    return {
      delete: function (key) {
        var had = contains(key);

        if (had) {
          k.splice(i, 1);
          v.splice(i, 1);
        }

        return had;
      },
      get: function get(key) {
        return contains(key) ? v[i] : void 0;
      },
      has: function has(key) {
        return contains(key);
      },
      set: function set(key, value) {
        v[contains(key) ? i : k.push(key) - 1] = value;
        return this;
      }
    };

    function contains(v) {
      i = k.indexOf(v);
      return -1 < i;
    }
  };
}

var _default = self.Map;
exports.default = _default;
},{}],"node_modules/domdiff/esm/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smartDiff = exports.remove = exports.next = exports.isReversed = exports.indexOf = exports.identity = exports.eqeq = exports.append = void 0;

var _essentialMap = _interopRequireDefault(require("@ungap/essential-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const append = (get, parent, children, start, end, before) => {
  if (end - start < 2) parent.insertBefore(get(children[start], 1), before);else {
    const fragment = parent.ownerDocument.createDocumentFragment();

    while (start < end) fragment.appendChild(get(children[start++], 1));

    parent.insertBefore(fragment, before);
  }
};

exports.append = append;

const eqeq = (a, b) => a == b;

exports.eqeq = eqeq;

const identity = O => O;

exports.identity = identity;

const indexOf = (moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd, compare) => {
  const length = lessEnd - lessStart;
  /* istanbul ignore if */

  if (length < 1) return -1;

  while (moreEnd - moreStart >= length) {
    let m = moreStart;
    let l = lessStart;

    while (m < moreEnd && l < lessEnd && compare(moreNodes[m], lessNodes[l])) {
      m++;
      l++;
    }

    if (l === lessEnd) return moreStart;
    moreStart = m + 1;
  }

  return -1;
};

exports.indexOf = indexOf;

const isReversed = (futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare) => {
  while (currentStart < currentEnd && compare(currentNodes[currentStart], futureNodes[futureEnd - 1])) {
    currentStart++;
    futureEnd--;
  }

  ;
  return futureEnd === 0;
};

exports.isReversed = isReversed;

const next = (get, list, i, length, before) => i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;

exports.next = next;

const remove = (get, parent, children, start, end) => {
  if (end - start < 2) parent.removeChild(get(children[start], -1));else {
    const range = parent.ownerDocument.createRange();
    range.setStartBefore(get(children[start], -1));
    range.setEndAfter(get(children[end - 1], -1));
    range.deleteContents();
  }
}; // - - - - - - - - - - - - - - - - - - -
// diff related constants and utilities
// - - - - - - - - - - - - - - - - - - -


exports.remove = remove;
const DELETION = -1;
const INSERTION = 1;
const SKIP = 0;
const SKIP_OND = 50;

const HS = (futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges) => {
  let k = 0;
  /* istanbul ignore next */

  let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
  const link = Array(minLen++);
  const tresh = Array(minLen);
  tresh[0] = -1;

  for (let i = 1; i < minLen; i++) tresh[i] = currentEnd;

  const keymap = new _essentialMap.default();

  for (let i = currentStart; i < currentEnd; i++) keymap.set(currentNodes[i], i);

  for (let i = futureStart; i < futureEnd; i++) {
    const idxInOld = keymap.get(futureNodes[i]);

    if (idxInOld != null) {
      k = findK(tresh, minLen, idxInOld);
      /* istanbul ignore else */

      if (-1 < k) {
        tresh[k] = idxInOld;
        link[k] = {
          newi: i,
          oldi: idxInOld,
          prev: link[k - 1]
        };
      }
    }
  }

  k = --minLen;
  --currentEnd;

  while (tresh[k] > currentEnd) --k;

  minLen = currentChanges + futureChanges - k;
  const diff = Array(minLen);
  let ptr = link[k];
  --futureEnd;

  while (ptr) {
    const {
      newi,
      oldi
    } = ptr;

    while (futureEnd > newi) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }

    while (currentEnd > oldi) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }

    diff[--minLen] = SKIP;
    --futureEnd;
    --currentEnd;
    ptr = ptr.prev;
  }

  while (futureEnd >= futureStart) {
    diff[--minLen] = INSERTION;
    --futureEnd;
  }

  while (currentEnd >= currentStart) {
    diff[--minLen] = DELETION;
    --currentEnd;
  }

  return diff;
}; // this is pretty much the same petit-dom code without the delete map part
// https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561


const OND = (futureNodes, futureStart, rows, currentNodes, currentStart, cols, compare) => {
  const length = rows + cols;
  const v = [];
  let d, k, r, c, pv, cv, pd;

  outer: for (d = 0; d <= length; d++) {
    /* istanbul ignore if */
    if (d > SKIP_OND) return null;
    pd = d - 1;
    /* istanbul ignore next */

    pv = d ? v[d - 1] : [0, 0];
    cv = v[d] = [];

    for (k = -d; k <= d; k += 2) {
      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        c = pv[pd + k + 1];
      } else {
        c = pv[pd + k - 1] + 1;
      }

      r = c - k;

      while (c < cols && r < rows && compare(currentNodes[currentStart + c], futureNodes[futureStart + r])) {
        c++;
        r++;
      }

      if (c === cols && r === rows) {
        break outer;
      }

      cv[d + k] = c;
    }
  }

  const diff = Array(d / 2 + length / 2);
  let diffIdx = diff.length - 1;

  for (d = v.length - 1; d >= 0; d--) {
    while (c > 0 && r > 0 && compare(currentNodes[currentStart + c - 1], futureNodes[futureStart + r - 1])) {
      // diagonal edge = equality
      diff[diffIdx--] = SKIP;
      c--;
      r--;
    }

    if (!d) break;
    pd = d - 1;
    /* istanbul ignore next */

    pv = d ? v[d - 1] : [0, 0];
    k = c - r;

    if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
      // vertical edge = insertion
      r--;
      diff[diffIdx--] = INSERTION;
    } else {
      // horizontal edge = deletion
      c--;
      diff[diffIdx--] = DELETION;
    }
  }

  return diff;
};

const applyDiff = (diff, get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before) => {
  const live = new _essentialMap.default();
  const length = diff.length;
  let currentIndex = currentStart;
  let i = 0;

  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        futureStart++;
        currentIndex++;
        break;

      case INSERTION:
        // TODO: bulk appends for sequential nodes
        live.set(futureNodes[futureStart], 1);
        append(get, parentNode, futureNodes, futureStart++, futureStart, currentIndex < currentLength ? get(currentNodes[currentIndex], 0) : before);
        break;

      case DELETION:
        currentIndex++;
        break;
    }
  }

  i = 0;

  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        currentStart++;
        break;

      case DELETION:
        // TODO: bulk removes for sequential nodes
        if (live.has(currentNodes[currentStart])) currentStart++;else remove(get, parentNode, currentNodes, currentStart++, currentStart);
        break;
    }
  }
};

const findK = (ktr, length, j) => {
  let lo = 1;
  let hi = length;

  while (lo < hi) {
    const mid = (lo + hi) / 2 >>> 0;
    if (j < ktr[mid]) hi = mid;else lo = mid + 1;
  }

  return lo;
};

const smartDiff = (get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before) => {
  applyDiff(OND(futureNodes, futureStart, futureChanges, currentNodes, currentStart, currentChanges, compare) || HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges), get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before);
};

exports.smartDiff = smartDiff;
},{"@ungap/essential-map":"node_modules/@ungap/essential-map/esm/index.js"}],"node_modules/domdiff/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

/*! (c) 2018 Andrea Giammarchi (ISC) */
const domdiff = (parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
options // optional object with one of the following properties
//  before: domNode
//  compare(generic, generic) => true if same generic
//  node(generic) => Node
) => {
  if (!options) options = {};
  const compare = options.compare || _utils.eqeq;
  const get = options.node || _utils.identity;
  const before = options.before == null ? null : get(options.before, 0);
  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;
  let futureEnd = futureNodes.length;
  let futureStart = 0; // common prefix

  while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentStart], futureNodes[futureStart])) {
    currentStart++;
    futureStart++;
  } // common suffix


  while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd; // same list

  if (currentSame && futureSame) return futureNodes; // only stuff to add

  if (currentSame && futureStart < futureEnd) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, (0, _utils.next)(get, currentNodes, currentStart, currentLength, before));
    return futureNodes;
  } // only stuff to remove


  if (futureSame && currentStart < currentEnd) {
    (0, _utils.remove)(get, parentNode, currentNodes, currentStart, currentEnd);
    return futureNodes;
  }

  const currentChanges = currentEnd - currentStart;
  const futureChanges = futureEnd - futureStart;
  let i = -1; // 2 simple indels: the shortest sequence is a subsequence of the longest

  if (currentChanges < futureChanges) {
    i = (0, _utils.indexOf)(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd, compare); // inner diff

    if (-1 < i) {
      (0, _utils.append)(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
      (0, _utils.append)(get, parentNode, futureNodes, i + currentChanges, futureEnd, (0, _utils.next)(get, currentNodes, currentEnd, currentLength, before));
      return futureNodes;
    }
  }
  /* istanbul ignore else */
  else if (futureChanges < currentChanges) {
      i = (0, _utils.indexOf)(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd, compare); // outer diff

      if (-1 < i) {
        (0, _utils.remove)(get, parentNode, currentNodes, currentStart, i);
        (0, _utils.remove)(get, parentNode, currentNodes, i + futureChanges, currentEnd);
        return futureNodes;
      }
    } // common case with one replacement for many nodes
  // or many nodes replaced for a single one

  /* istanbul ignore else */


  if (currentChanges < 2 || futureChanges < 2) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
    (0, _utils.remove)(get, parentNode, currentNodes, currentStart, currentEnd);
    return futureNodes;
  } // the half match diff part has been skipped in petit-dom
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
  // accordingly, I think it's safe to skip in here too
  // if one day it'll come out like the speediest thing ever to do
  // then I might add it in here too
  // Extra: before going too fancy, what about reversed lists ?
  //        This should bail out pretty quickly if that's not the case.


  if (currentChanges === futureChanges && (0, _utils.isReversed)(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare)) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, (0, _utils.next)(get, currentNodes, currentEnd, currentLength, before));
    return futureNodes;
  } // last resort through a smart diff


  (0, _utils.smartDiff)(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before);
  return futureNodes;
};

var _default = domdiff;
exports.default = _default;
},{"./utils.js":"node_modules/domdiff/esm/utils.js"}],"node_modules/@ungap/import-node/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var importNode = function (document, appendChild, cloneNode, createTextNode, importNode) {
  var native = importNode in document; // IE 11 has problems with cloning templates:
  // it "forgets" empty childNodes. This feature-detects that.

  var fragment = document.createDocumentFragment();
  fragment[appendChild](document[createTextNode]('g'));
  fragment[appendChild](document[createTextNode](''));
  var content = native ? document[importNode](fragment, true) : fragment[cloneNode](true);
  return content.childNodes.length < 2 ? function importNode(node, deep) {
    var clone = node[cloneNode]();

    for (var childNodes = node.childNodes || [], length = childNodes.length, i = 0; deep && i < length; i++) {
      clone[appendChild](importNode(childNodes[i], deep));
    }

    return clone;
  } : native ? document[importNode] : function (node, deep) {
    return node[cloneNode](!!deep);
  };
}(document, 'appendChild', 'cloneNode', 'createTextNode', 'importNode');

var _default = importNode;
exports.default = _default;
},{}],"node_modules/@ungap/trim/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var trim = ''.trim || function () {
  return String(this).replace(/^\s+|\s+/g, '');
};

var _default = trim;
exports.default = _default;
},{}],"node_modules/domtagger/esm/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VOID_ELEMENTS = exports.SHOULD_USE_TEXT_CONTENT = exports.TEXT_NODE = exports.ELEMENT_NODE = exports.DOCUMENT_FRAGMENT_NODE = exports.COMMENT_NODE = exports.UIDC = exports.UID = void 0;
// Custom
var UID = '-' + Math.random().toFixed(6) + '%'; //                           Edge issue!

exports.UID = UID;

if (!function (template, content, tabindex) {
  return content in template && (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>', template[content].childNodes[0].getAttribute(tabindex) == UID);
}(document.createElement('template'), 'content', 'tabindex')) {
  exports.UID = UID = '_dt: ' + UID.slice(1, -1) + ';';
}

var UIDC = '<!--' + UID + '-->'; // DOM

exports.UIDC = UIDC;
var COMMENT_NODE = 8;
exports.COMMENT_NODE = COMMENT_NODE;
var DOCUMENT_FRAGMENT_NODE = 11;
exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;
var ELEMENT_NODE = 1;
exports.ELEMENT_NODE = ELEMENT_NODE;
var TEXT_NODE = 3;
exports.TEXT_NODE = TEXT_NODE;
var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
exports.SHOULD_USE_TEXT_CONTENT = SHOULD_USE_TEXT_CONTENT;
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
exports.VOID_ELEMENTS = VOID_ELEMENTS;
},{}],"node_modules/domtagger/esm/sanitizer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constants = require("./constants.js");

function _default(template) {
  return template.join(_constants.UIDC).replace(selfClosing, fullClosing).replace(attrSeeker, attrReplacer);
}

var spaces = ' \\f\\n\\r\\t';
var almostEverything = '[^ ' + spaces + '\\/>"\'=]+';
var attrName = '[ ' + spaces + ']+' + almostEverything;
var tagName = '<([A-Za-z]+[A-Za-z0-9:_-]*)((?:';
var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything + '))?)';
var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([ ' + spaces + ']*/?>)', 'g');
var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([ ' + spaces + ']*/>)', 'g');
var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + _constants.UIDC + '\\2', 'gi');

function attrReplacer($0, $1, $2, $3) {
  return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
}

function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + _constants.UID + ($2 || '"');
}

function fullClosing($0, $1, $2) {
  return _constants.VOID_ELEMENTS.test($1) ? $0 : '<' + $1 + $2 + '></' + $1 + '>';
}
},{"./constants.js":"node_modules/domtagger/esm/constants.js"}],"node_modules/domtagger/esm/walker.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.parse = parse;

var _essentialMap = _interopRequireDefault(require("@ungap/essential-map"));

var _trim = _interopRequireDefault(require("@ungap/trim"));

var _constants = require("./constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create(type, node, path, name) {
  return {
    name: name,
    node: node,
    path: path,
    type: type
  };
}

function find(node, path) {
  var length = path.length;
  var i = 0;

  while (i < length) node = node.childNodes[path[i++]];

  return node;
}

function parse(node, holes, parts, path) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var i = 0;

  while (i < length) {
    var child = childNodes[i];

    switch (child.nodeType) {
      case _constants.ELEMENT_NODE:
        var childPath = path.concat(i);
        parseAttributes(child, holes, parts, childPath);
        parse(child, holes, parts, childPath);
        break;

      case _constants.COMMENT_NODE:
        if (child.textContent === _constants.UID) {
          parts.shift();
          holes.push( // basicHTML or other non standard engines
          // might end up having comments in nodes
          // where they shouldn't, hence this check.
          _constants.SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ? create('text', node, path) : create('any', child, path.concat(i)));
        }

        break;

      case _constants.TEXT_NODE:
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior

        /* istanbul ignore if */
        if (_constants.SHOULD_USE_TEXT_CONTENT.test(node.nodeName) && _trim.default.call(child.textContent) === _constants.UIDC) {
          parts.shift();
          holes.push(create('text', node, path));
        }

        break;
    }

    i++;
  }
}

function parseAttributes(node, holes, parts, path) {
  var cache = new _essentialMap.default();
  var attributes = node.attributes;
  var remove = [];
  var array = remove.slice.call(attributes, 0);
  var length = array.length;
  var i = 0;

  while (i < length) {
    var attribute = array[i++];

    if (attribute.value === _constants.UID) {
      var name = attribute.name; // the following ignore is covered by IE
      // and the IE9 double viewBox test

      /* istanbul ignore else */

      if (!cache.has(name)) {
        var realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*['"]?$/, '$1');
        var value = attributes[realName] || // the following ignore is covered by browsers
        // while basicHTML is already case-sensitive

        /* istanbul ignore next */
        attributes[realName.toLowerCase()];
        cache.set(name, value);
        holes.push(create('attr', value, path, realName));
      }

      remove.push(attribute);
    }
  }

  length = remove.length;
  i = 0;

  while (i < length) {
    // Edge HTML bug #16878726
    var attr = remove[i++];
    if (/^id$/i.test(attr.name)) node.removeAttribute(attr.name); // standard browsers would work just fine here
    else node.removeAttributeNode(attr);
  } // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense?


  var nodeName = node.nodeName;

  if (/^script$/i.test(nodeName)) {
    // this used to be like that
    // var script = createElement(node, nodeName);
    // then Edge arrived and decided that scripts created
    // through template documents aren't worth executing
    // so it became this ... hopefully it won't hurt in the wild
    var script = document.createElement(nodeName);
    length = attributes.length;
    i = 0;

    while (i < length) script.setAttributeNode(attributes[i++].cloneNode(true));

    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
  }
}
},{"@ungap/essential-map":"node_modules/@ungap/essential-map/esm/index.js","@ungap/trim":"node_modules/@ungap/trim/esm/index.js","./constants.js":"node_modules/domtagger/esm/constants.js"}],"node_modules/domtagger/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

var _createContent = _interopRequireDefault(require("@ungap/create-content"));

var _importNode = _interopRequireDefault(require("@ungap/import-node"));

var _trim = _interopRequireDefault(require("@ungap/trim"));

var _sanitizer = _interopRequireDefault(require("./sanitizer.js"));

var _walker = require("./walker.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// globals
// utils
// local
// the domtagger 🎉
var _default = domtagger;
exports.default = _default;
var parsed = new _weakmap.default();
var referenced = new _weakmap.default();

function createInfo(options, template) {
  var markup = (0, _sanitizer.default)(template);
  var transform = options.transform;
  if (transform) markup = transform(markup);
  var content = (0, _createContent.default)(markup, options.type);
  cleanContent(content);
  var holes = [];
  (0, _walker.parse)(content, holes, template.slice(0), []);
  var info = {
    content: content,
    updates: function (content) {
      var callbacks = [];
      var len = holes.length;
      var i = 0;

      while (i < len) {
        var info = holes[i++];
        var node = (0, _walker.find)(content, info.path);

        switch (info.type) {
          case 'any':
            callbacks.push(options.any(node, []));
            break;

          case 'attr':
            callbacks.push(options.attribute(node, info.name, info.node));
            break;

          case 'text':
            callbacks.push(options.text(node));
            node.textContent = '';
            break;
        }
      }

      return function () {
        var length = arguments.length;
        var values = length - 1;
        var i = 1;

        if (len !== values) {
          throw new Error(values + ' values instead of ' + len + '\n' + template.join(', '));
        }

        while (i < length) callbacks[i - 1](arguments[i++]);

        return content;
      };
    }
  };
  parsed.set(template, info);
  return info;
}

function createDetails(options, template) {
  var info = parsed.get(template) || createInfo(options, template);

  var content = _importNode.default.call(document, info.content, true);

  var details = {
    content: content,
    template: template,
    updates: info.updates(content)
  };
  referenced.set(options, details);
  return details;
}

function domtagger(options) {
  return function (template) {
    var details = referenced.get(options);
    if (details == null || details.template !== template) details = createDetails(options, template);
    details.updates.apply(null, arguments);
    return details.content;
  };
}

function cleanContent(fragment) {
  var childNodes = fragment.childNodes;
  var i = childNodes.length;

  while (i--) {
    var child = childNodes[i];

    if (child.nodeType !== 1 && _trim.default.call(child.textContent).length === 0) {
      fragment.removeChild(child);
    }
  }
}
},{"@ungap/weakmap":"node_modules/@ungap/weakmap/esm/index.js","@ungap/create-content":"node_modules/@ungap/create-content/esm/index.js","@ungap/import-node":"node_modules/@ungap/import-node/esm/index.js","@ungap/trim":"node_modules/@ungap/trim/esm/index.js","./sanitizer.js":"node_modules/domtagger/esm/sanitizer.js","./walker.js":"node_modules/domtagger/esm/walker.js"}],"node_modules/hyperhtml-style/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var hyperStyle = function () {
  'use strict'; // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js

  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
  var hyphen = /([^A-Z])([A-Z]+)/g;
  return function hyperStyle(node, original) {
    return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
  };

  function ized($0, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }

  function svg(node, original) {
    var style;
    if (original) style = original.cloneNode(true);else {
      node.setAttribute('style', '--hyper:style;');
      style = node.getAttributeNode('style');
    }
    style.value = '';
    node.setAttributeNode(style);
    return update(style, true);
  }

  function toStyle(object) {
    var key,
        css = [];

    for (key in object) css.push(key.replace(hyphen, ized), ':', object[key], ';');

    return css.join('');
  }

  function update(style, isSVG) {
    var oldType, oldValue;
    return function (newValue) {
      var info, key, styleValue, value;

      switch (typeof newValue) {
        case 'object':
          if (newValue) {
            if (oldType === 'object') {
              if (!isSVG) {
                if (oldValue !== newValue) {
                  for (key in oldValue) {
                    if (!(key in newValue)) {
                      style[key] = '';
                    }
                  }
                }
              }
            } else {
              if (isSVG) style.value = '';else style.cssText = '';
            }

            info = isSVG ? {} : style;

            for (key in newValue) {
              value = newValue[key];
              styleValue = typeof value === 'number' && !IS_NON_DIMENSIONAL.test(key) ? value + 'px' : value;
              if (!isSVG && /^--/.test(key)) info.setProperty(key, styleValue);else info[key] = styleValue;
            }

            oldType = 'object';
            if (isSVG) style.value = toStyle(oldValue = info);else oldValue = newValue;
            break;
          }

        default:
          if (oldValue != newValue) {
            oldType = 'string';
            oldValue = newValue;
            if (isSVG) style.value = newValue || '';else style.cssText = newValue || '';
          }

          break;
      }
    };
  }
}();

var _default = hyperStyle;
exports.default = _default;
},{}],"node_modules/lighterhtml/esm/tagger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Tagger;

var _createContent = _interopRequireDefault(require("@ungap/create-content"));

var _domdiff = _interopRequireDefault(require("domdiff"));

var _domtagger = _interopRequireDefault(require("domtagger"));

var _hyperhtmlStyle = _interopRequireDefault(require("hyperhtml-style"));

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const OWNER_SVG_ELEMENT = 'ownerSVGElement'; // returns nodes from wires and components

const asNode = (item, i) => item.nodeType === _shared.wireType ? 1 / i < 0 ? i ? item.remove(true) : item.lastChild : i ? item.valueOf(true) : item.firstChild : item; // returns true if domdiff can handle the value


const canDiff = value => 'ELEMENT_NODE' in value; // generic attributes helpers


const hyperAttribute = (node, original) => {
  let oldValue;
  let owner = false;
  const attribute = original.cloneNode(true);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;

      if (attribute.value !== newValue) {
        if (newValue == null) {
          if (owner) {
            owner = false;
            node.removeAttributeNode(attribute);
          }

          attribute.value = newValue;
        } else {
          attribute.value = newValue;

          if (!owner) {
            owner = true;
            node.setAttributeNode(attribute);
          }
        }
      }
    }
  };
}; // events attributes helpers


const hyperEvent = (node, name) => {
  let oldValue;
  let type = name.slice(2);
  if (name.toLowerCase() in node) type = type.toLowerCase();
  return newValue => {
    if (oldValue !== newValue) {
      if (oldValue) node.removeEventListener(type, oldValue, false);
      oldValue = newValue;
      if (newValue) node.addEventListener(type, newValue, false);
    }
  };
}; // special attributes helpers


const hyperProperty = (node, name) => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;

      if (node[name] !== newValue) {
        node[name] = newValue;

        if (newValue == null) {
          node.removeAttribute(name);
        }
      }
    }
  };
}; // special hooks helpers


const hyperRef = node => {
  return ref => {
    ref.current = node;
  };
}; // list of attributes that should not be directly assigned


const readOnly = /^(?:form|list)$/i; // reused every slice time

const slice = [].slice; // simplifies text node creation

const text = (node, text) => node.ownerDocument.createTextNode(text);

function Tagger(type) {
  this.type = type;
  return (0, _domtagger.default)(this);
}

Tagger.prototype = {
  // there are four kind of attributes, and related behavior:
  //  * events, with a name starting with `on`, to add/remove event listeners
  //  * special, with a name present in their inherited prototype, accessed directly
  //  * regular, accessed through get/setAttribute standard DOM methods
  //  * style, the only regular attribute that also accepts an object as value
  //    so that you can style=${{width: 120}}. In this case, the behavior has been
  //    fully inspired by Preact library and its simplicity.
  attribute(node, name, original) {
    switch (name) {
      case 'class':
        if (OWNER_SVG_ELEMENT in node) return hyperAttribute(node, original);
        name = 'className';

      case 'data':
      case 'props':
        return hyperProperty(node, name);

      case 'style':
        return (0, _hyperhtmlStyle.default)(node, original, OWNER_SVG_ELEMENT in node);

      case 'ref':
        return hyperRef(node);

      default:
        if (name.slice(0, 2) === 'on') return hyperEvent(node, name);
        if (name in node && !(OWNER_SVG_ELEMENT in node || readOnly.test(name))) return hyperProperty(node, name);
        return hyperAttribute(node, original);
    }
  },

  // in a hyper(node)`<div>${content}</div>` case
  // everything could happen:
  //  * it's a JS primitive, stored as text
  //  * it's null or undefined, the node should be cleaned
  //  * it's a promise, update the content once resolved
  //  * it's an explicit intent, perform the desired operation
  //  * it's an Array, resolve all values if Promises and/or
  //    update the node with the resulting list of content
  any(node, childNodes) {
    const diffOptions = {
      node: asNode,
      before: node
    };
    const nodeType = OWNER_SVG_ELEMENT in node ?
    /* istanbul ignore next */
    'svg' : 'html';
    let fastPath = false;
    let oldValue;

    const anyContent = value => {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          if (fastPath) {
            if (oldValue !== value) {
              oldValue = value;
              childNodes[0].textContent = value;
            }
          } else {
            fastPath = true;
            oldValue = value;
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [text(node, value)], diffOptions);
          }

          break;

        case 'function':
          anyContent(value(node));
          break;

        case 'object':
        case 'undefined':
          if (value == null) {
            fastPath = false;
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [], diffOptions);
            break;
          }

        default:
          fastPath = false;
          oldValue = value;

          if ((0, _shared.isArray)(value)) {
            if (value.length === 0) {
              if (childNodes.length) {
                childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [], diffOptions);
              }
            } else {
              switch (typeof value[0]) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent(String(value));
                  break;

                case 'function':
                  anyContent(value.map(invoke, node));
                  break;

                case 'object':
                  if ((0, _shared.isArray)(value[0])) {
                    value = value.concat.apply([], value);
                  }

                default:
                  childNodes = (0, _domdiff.default)(node.parentNode, childNodes, value, diffOptions);
                  break;
              }
            }
          } else if (canDiff(value)) {
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, value.nodeType === 11 ? slice.call(value.childNodes) : [value], diffOptions);
          } else if ('text' in value) {
            anyContent(String(value.text));
          } else if ('any' in value) {
            anyContent(value.any);
          } else if ('html' in value) {
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, slice.call((0, _createContent.default)([].concat(value.html).join(''), nodeType).childNodes), diffOptions);
          } else if ('length' in value) {
            anyContent(slice.call(value));
          }

          break;
      }
    };

    return anyContent;
  },

  // style or textareas don't accept HTML as content
  // it's pointless to transform or analyze anything
  // different from text there but it's worth checking
  // for possible defined intents.
  text(node) {
    let oldValue;

    const textContent = value => {
      if (oldValue !== value) {
        oldValue = value;
        const type = typeof value;

        if (type === 'object' && value) {
          if ('text' in value) {
            textContent(String(value.text));
          } else if ('any' in value) {
            textContent(value.any);
          } else if ('html' in value) {
            textContent([].concat(value.html).join(''));
          } else if ('length' in value) {
            textContent(slice.call(value).join(''));
          }
        } else if (type === 'function') {
          textContent(value(node));
        } else {
          node.textContent = value == null ? '' : value;
        }
      }
    };

    return textContent;
  }

};

function invoke(callback) {
  return callback(this);
}
},{"@ungap/create-content":"node_modules/@ungap/create-content/esm/index.js","domdiff":"node_modules/domdiff/esm/index.js","domtagger":"node_modules/domtagger/esm/index.js","hyperhtml-style":"node_modules/hyperhtml-style/esm/index.js","./shared.js":"node_modules/lighterhtml/esm/shared.js"}],"node_modules/lighterhtml/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.svg = exports.html = exports.hook = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

var _templateTagArguments = _interopRequireDefault(require("@ungap/template-tag-arguments"));

var _shared = require("./shared.js");

var _tagger = _interopRequireDefault(require("./tagger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wm = new _weakmap.default();
const container = new _weakmap.default();
let current = null; // can be used with any useRef hook
// returns an `html` and `svg` function

const hook = useRef => ({
  html: createHook(useRef, html),
  svg: createHook(useRef, svg)
}); // generic content render


exports.hook = hook;

function render(node, callback) {
  const value = update.call(this, node, callback);

  if (container.get(node) !== value) {
    container.set(node, value);
    appendClean(node, value);
  }

  return node;
} // keyed render via render(node, () => html`...`)
// non keyed renders in the wild via html`...`


const html = outer('html');
exports.html = html;
const svg = outer('svg'); // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

exports.svg = svg;

function appendClean(node, fragment) {
  node.textContent = '';
  node.appendChild(fragment);
}

function asNode(result, forceFragment) {
  return result.nodeType === _shared.wireType ? result.valueOf(forceFragment) : result;
}

function createHook(useRef, view) {
  return function () {
    const ref = useRef(null);
    if (ref.current === null) ref.current = view.for(ref);
    return asNode(ref.current.apply(null, arguments), false);
  };
}

function outer(type) {
  const wm = new _weakmap.default();

  tag.for = (identity, id) => {
    const ref = wm.get(identity) || set(identity);
    if (id == null) id = '$';
    return ref[id] || create(ref, id);
  };

  return tag;

  function create(ref, id) {
    let wire = null;
    const $ = new _tagger.default(type);
    return ref[id] = function () {
      const result = $.apply(null, _templateTagArguments.default.apply(null, arguments));
      return wire || (wire = wiredContent(result));
    };
  }

  function set(identity) {
    const ref = {
      '$': null
    };
    wm.set(identity, ref);
    return ref;
  }

  function tag() {
    const args = _templateTagArguments.default.apply(null, arguments);

    return current ? new Hole(type, args) : new _tagger.default(type).apply(null, args);
  }
}

function set(node) {
  const info = {
    i: 0,
    length: 0,
    stack: [],
    update: false
  };
  wm.set(node, info);
  return info;
}

function update(reference, callback) {
  const prev = current;
  current = wm.get(reference) || set(reference);
  current.i = 0;
  const ret = callback.call(this);
  let value;

  if (ret instanceof Hole) {
    value = asNode(unroll(ret, 0), current.update);
    const {
      i,
      length,
      stack,
      update
    } = current;
    if (i < length) stack.splice(current.length = i);
    if (update) current.update = false;
  } else {
    value = asNode(ret, false);
  }

  current = prev;
  return value;
}

function unroll(hole, level) {
  const {
    i,
    length,
    stack
  } = current;
  const {
    type,
    args
  } = hole;
  const stacked = i < length;
  current.i++;
  if (!stacked) current.length = stack.push({
    l: level,
    kind: type,
    tag: null,
    tpl: args[0],
    wire: null
  });
  unrollArray(args, 1, level + 1);
  const info = stack[i];

  if (stacked) {
    const {
      l: control,
      kind,
      tag,
      tpl,
      wire
    } = info;

    if (control === level && type === kind && tpl === args[0]) {
      tag.apply(null, args);
      return wire;
    }
  }

  const tag = new _tagger.default(type);
  const wire = wiredContent(tag.apply(null, args));
  info.l = level;
  info.kind = type;
  info.tag = tag;
  info.tpl = args[0];
  info.wire = wire;
  if (i < 1) current.update = true;
  return wire;
}

function unrollArray(arr, i, level) {
  for (const {
    length
  } = arr; i < length; i++) {
    const value = arr[i];

    if (typeof value === 'object' && value) {
      if (value instanceof Hole) {
        arr[i] = unroll(value, level - 1);
      } else if ((0, _shared.isArray)(value)) {
        arr[i] = unrollArray(value, 0, level++);
      }
    }
  }

  return arr;
}

function wiredContent(node) {
  const childNodes = node.childNodes;
  const {
    length
  } = childNodes;
  return length === 1 ? childNodes[0] : length ? new _shared.Wire(childNodes) : node;
}

function Hole(type, args) {
  this.type = type;
  this.args = args;
}
},{"@ungap/weakmap":"node_modules/@ungap/weakmap/esm/index.js","@ungap/template-tag-arguments":"node_modules/@ungap/template-tag-arguments/esm/index.js","./shared.js":"node_modules/lighterhtml/esm/shared.js","./tagger.js":"node_modules/lighterhtml/esm/tagger.js"}],"node_modules/neverland/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _domAugmentor.createContext;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useCallback;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useContext;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useEffect;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useMemo;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useReducer;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useRef;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useState;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _lighterhtml.render;
  }
});
exports.svg = exports.html = exports.default = void 0;

var _domAugmentor = _interopRequireWildcard(require("dom-augmentor"));

var _lighterhtml = require("lighterhtml");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const {
  html,
  svg
} = (0, _lighterhtml.hook)(_domAugmentor.useRef);
exports.svg = svg;
exports.html = html;

var _default = fn => (0, _domAugmentor.default)(function () {
  const {
    current: info
  } = (0, _domAugmentor.useRef)({
    i: 0,
    $: []
  });
  const {
    i,
    $
  } = info;
  (0, _domAugmentor.useEffect)(() => {
    const {
      i,
      $
    } = info;
    if (i > $.length) $.splice(i);
    info.i = 0;
  });
  info.i++;
  if (i === $.length) $.push((0, _domAugmentor.default)(fn));
  return $[i].apply(this, arguments);
});

exports.default = _default;
},{"dom-augmentor":"node_modules/dom-augmentor/esm/index.js","lighterhtml":"node_modules/lighterhtml/esm/index.js"}],"src/storeHook.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
exports.getStoreByName = getStoreByName;
exports.useStore = useStore;

var _neverland = require("neverland");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var stores = {};
var subscriptions = {};

var defaultReducer = function defaultReducer(state, payload) {
  return payload;
};

var StoreInterface =
/*#__PURE__*/
function () {
  function StoreInterface(name, store, useReducer) {
    _classCallCheck(this, StoreInterface);

    this.name = name;
    useReducer ? this.dispatch = store.setState : this.setState = store.setState;

    this.getState = function () {
      return store.state;
    };

    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
  }

  _createClass(StoreInterface, [{
    key: "setState",
    value: function setState() {
      console.warn("[React Hookstore] Store ".concat(this.name, " uses a reducer to handle its state updates. use dispatch instead of setState"));
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      console.warn("[React Hookstore] Store ".concat(this.name, " does not use a reducer to handle state updates. use setState instead of dispatch"));
    }
  }]);

  return StoreInterface;
}();

function getStoreByIdentifier(identifier) {
  var name = identifier instanceof StoreInterface ? identifier.name : identifier;
  return stores[name];
}
/**
 * Creates a new store
 * @param {String} name - The store namespace.
 * @param {*} state [{}] - The store initial state. It can be of any type.
 * @callback reducer [null]
 * @returns {StoreInterface} The store instance.
 */

/**
 *
 * @param {reducer} prevState, action - The reducer handler. Optional.
 */


function createStore(name) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var reducer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultReducer;

  if (typeof name !== 'string') {
    throw 'store name must be a string';
  }

  if (stores[name]) {
    throw 'store already exists';
  }

  var store = {
    state: state,
    reducer: reducer,
    setState: function setState(action, callback) {
      var _this = this;

      this.state = this.reducer(this.state, action);
      this.setters.forEach(function (setter) {
        return setter(_this.state);
      });
      if (typeof callback === 'function') callback(this.state);

      if (action && action.type && subscriptions[action.type]) {
        subscriptions[action.type].forEach(function (subscription) {
          return subscription.name === name && subscription.callback(action, _this.state);
        });
      }
    },
    setters: []
  };
  store.setState = store.setState.bind(store);
  store.public = new StoreInterface(name, store, reducer !== defaultReducer);
  stores = Object.assign({}, stores, _defineProperty({}, name, store));
  return store.public;
}
/**
 * Returns a store instance based on its name
 * @param {String} name - The name of the wanted store
 * @returns {StoreInterface} the store instance
 */


function getStoreByName(name) {
  try {
    return stores[name].public;
  } catch (e) {
    throw 'store does not exist';
  }
}
/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @returns {Array} the [state, setState] pair.
 */


function useStore(identifier) {
  var store = getStoreByIdentifier(identifier);

  if (!store) {
    throw 'store does not exist';
  }

  var _useState = (0, _neverland.useState)(store.state),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  (0, _neverland.useEffect)(function () {
    return function () {
      store.setters = store.setters.filter(function (setter) {
        return setter !== set;
      });
    };
  }, []);

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  return [state, store.setState];
}

function subscribe(actions, callback) {
  var _this2 = this;

  if (!actions || !Array.isArray(actions)) throw 'first argument must be an array';
  if (!callback || typeof callback !== 'function') throw 'second argument must be a function';
  if (subsriberExists(this.name)) throw 'you are already subscribing to this store. unsubscribe to configure a new subscription.';
  actions.forEach(function (action) {
    if (!subscriptions[action]) {
      subscriptions[action] = [];
    }

    subscriptions[action].push({
      callback: callback,
      name: _this2.name
    });
  });
}

function unsubscribe() {
  var _this3 = this;

  var keys = Object.keys(subscriptions);
  keys.forEach(function (key) {
    if (subscriptions[key].length === 1) {
      delete subscriptions[key];
    } else {
      subscriptions[key] = subscriptions[key].filter(function (action, i) {
        return action.name !== _this3.name;
      });
    }
  });
}

;

function subsriberExists(name) {
  var keys = Object.keys(subscriptions);
  return keys.find(function (key) {
    return subscriptions[key].find(function (action) {
      return action && action.name === name;
    });
  });
}
},{"neverland":"node_modules/neverland/esm/index.js"}],"src/reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var reducer = function reducer(state, action) {
  var type = action.type;

  switch (type) {
    case 'change':
      state.name = 'devsChile';
      return state;

    default:
      return state;
  }
};

var _default = reducer;
exports.default = _default;
},{}],"src/index-neverland.js":[function(require,module,exports) {
"use strict";

var _neverland = _interopRequireWildcard(require("neverland"));

var _storeHook = require("./storeHook");

var _reducer = _interopRequireDefault(require("./reducer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n     <div>aca tambien deberiamos saludar, Hola: ", "</div>\n     <button onclick=", ">cambiar</button>\n   "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n     <div>Hola: ", "</div>\n   "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var appState = {
  name: 'amigos'
};
var todoListStore = (0, _storeHook.createStore)('todoList', appState, _reducer.default);
var elementOne = (0, _neverland.default)(function () {
  var _useStore = (0, _storeHook.useStore)(todoListStore),
      _useStore2 = _slicedToArray(_useStore, 1),
      state = _useStore2[0];

  return (0, _neverland.html)(_templateObject(), state.name);
});
var elementTwo = (0, _neverland.default)(function () {
  var _useStore3 = (0, _storeHook.useStore)(todoListStore),
      _useStore4 = _slicedToArray(_useStore3, 2),
      state = _useStore4[0],
      dispatch = _useStore4[1];

  return (0, _neverland.html)(_templateObject2(), state.name, function () {
    return dispatch({
      type: 'change'
    });
  });
});
var App = (0, _neverland.default)(function () {
  return (0, _neverland.html)(_templateObject3(), [elementOne(), elementTwo()]);
});
window.addEventListener('DOMContentLoaded', function () {
  (0, _neverland.render)(document.querySelector('.never1'), App);
});
},{"neverland":"node_modules/neverland/esm/index.js","./storeHook":"src/storeHook.js","./reducer":"src/reducer.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49768" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index-neverland.js"], null)
//# sourceMappingURL=/index-neverland.7163d37c.js.map