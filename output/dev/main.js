(window["dojoWebpackJsonpi18n_issues"] = window["dojoWebpackJsonpi18n_issues"] || []).push([["main"],{

/***/ "./node_modules/@dojo/framework/core/Destroyable.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Destroyable.mjs ***!
  \***********************************************************/
/*! exports provided: Destroyable, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Destroyable", function() { return Destroyable; });
/* harmony import */ var _shim_Promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/Promise */ "./node_modules/@dojo/framework/shim/Promise.mjs");

/**
 * No op function used to replace a Destroyable instance's `destroy` method, once the instance has been destroyed
 */
function noop() {
    return _shim_Promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(false);
}
/**
 * No op function used to replace a Destroyable instance's `own` method, once the instance has been destroyed
 */
function destroyed() {
    throw new Error('Call made to destroyed method');
}
class Destroyable {
    /**
     * @constructor
     */
    constructor() {
        this.handles = [];
    }
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} A wrapper Handle. When the wrapper Handle's `destroy` method is invoked, the original handle is
     *                   removed from the instance, and its `destroy` method is invoked.
     */
    own(handle) {
        const { handles: _handles } = this;
        _handles.push(handle);
        return {
            destroy() {
                _handles.splice(_handles.indexOf(handle));
                handle.destroy();
            }
        };
    }
    /**
     * Destroys all handlers registered for the instance
     *
     * @returns {Promise<any} A Promise that resolves once all handles have been destroyed
     */
    destroy() {
        return new _shim_Promise__WEBPACK_IMPORTED_MODULE_0__["default"]((resolve) => {
            this.handles.forEach((handle) => {
                handle && handle.destroy && handle.destroy();
            });
            this.destroy = noop;
            this.own = destroyed;
            resolve(true);
        });
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Destroyable);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Evented.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Evented.mjs ***!
  \*******************************************************/
/*! exports provided: isGlobMatch, Evented, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isGlobMatch", function() { return isGlobMatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Evented", function() { return Evented; });
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _Destroyable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Destroyable */ "./node_modules/@dojo/framework/core/Destroyable.mjs");


/**
 * Map of computed regular expressions, keyed by string
 */
const regexMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_0__["default"]();
/**
 * Determines if the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
function isGlobMatch(globString, targetString) {
    if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
        let regex;
        if (regexMap.has(globString)) {
            regex = regexMap.get(globString);
        }
        else {
            regex = new RegExp(`^${globString.replace(/\*/g, '.*')}$`);
            regexMap.set(globString, regex);
        }
        return regex.test(targetString);
    }
    else {
        return globString === targetString;
    }
}
/**
 * Event Class
 */
class Evented extends _Destroyable__WEBPACK_IMPORTED_MODULE_1__["Destroyable"] {
    constructor() {
        super(...arguments);
        /**
         * map of listeners keyed by event type
         */
        this.listenersMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_0__["default"]();
    }
    emit(event) {
        this.listenersMap.forEach((methods, type) => {
            if (isGlobMatch(type, event.type)) {
                [...methods].forEach((method) => {
                    method.call(this, event);
                });
            }
        });
    }
    on(type, listener) {
        if (Array.isArray(listener)) {
            const handles = listener.map((listener) => this._addListener(type, listener));
            return {
                destroy() {
                    handles.forEach((handle) => handle.destroy());
                }
            };
        }
        return this._addListener(type, listener);
    }
    _addListener(type, listener) {
        const listeners = this.listenersMap.get(type) || [];
        listeners.push(listener);
        this.listenersMap.set(type, listeners);
        return {
            destroy: () => {
                const listeners = this.listenersMap.get(type) || [];
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Evented);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Injector.mjs":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Injector.mjs ***!
  \********************************************************/
/*! exports provided: Injector, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Injector", function() { return Injector; });
/* harmony import */ var _core_Evented__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.mjs");

class Injector extends _core_Evented__WEBPACK_IMPORTED_MODULE_0__["Evented"] {
    constructor(payload) {
        super();
        this._payload = payload;
    }
    setInvalidator(invalidator) {
        this._invalidator = invalidator;
    }
    get() {
        return this._payload;
    }
    set(payload) {
        this._payload = payload;
        if (this._invalidator) {
            this._invalidator();
        }
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Injector);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Registry.mjs":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Registry.mjs ***!
  \********************************************************/
/*! exports provided: WIDGET_BASE_TYPE, isWidgetBaseConstructor, isWidgetFunction, isWNodeFactory, isWidget, isWidgetConstructorDefaultExport, Registry, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WIDGET_BASE_TYPE", function() { return WIDGET_BASE_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWidgetBaseConstructor", function() { return isWidgetBaseConstructor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWidgetFunction", function() { return isWidgetFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWNodeFactory", function() { return isWNodeFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWidget", function() { return isWidget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWidgetConstructorDefaultExport", function() { return isWidgetConstructorDefaultExport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Registry", function() { return Registry; });
/* harmony import */ var _shim_Promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/Promise */ "./node_modules/@dojo/framework/shim/Promise.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _core_Evented__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.mjs");



/**
 * Widget base type
 */
const WIDGET_BASE_TYPE = '__widget_base_type';
/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
function isWidgetBaseConstructor(item) {
    return Boolean(item && item._type === WIDGET_BASE_TYPE);
}
function isWidgetFunction(item) {
    return Boolean(item && item.isWidget);
}
function isWNodeFactory(node) {
    if (typeof node === 'function' && node.isFactory) {
        return true;
    }
    return false;
}
function isWidget(item) {
    return isWidgetBaseConstructor(item) || isWidgetFunction(item);
}
function isWidgetConstructorDefaultExport(item) {
    return Boolean(item &&
        item.hasOwnProperty('__esModule') &&
        item.hasOwnProperty('default') &&
        (isWidget(item.default) || isWNodeFactory(item.default)));
}
/**
 * The Registry implementation
 */
class Registry extends _core_Evented__WEBPACK_IMPORTED_MODULE_2__["Evented"] {
    /**
     * Emit loaded event for registry label
     */
    emitLoadedEvent(widgetLabel, item) {
        this.emit({
            type: widgetLabel,
            action: 'loaded',
            item
        });
    }
    define(label, item) {
        if (this._widgetRegistry === undefined) {
            this._widgetRegistry = new _shim_Map__WEBPACK_IMPORTED_MODULE_1__["default"]();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error(`widget has already been registered for '${label.toString()}'`);
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof _shim_Promise__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            item.then((widgetCtor) => {
                this._widgetRegistry.set(label, widgetCtor);
                this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, (error) => {
                throw error;
            });
        }
        else if (isWidgetBaseConstructor(item)) {
            this.emitLoadedEvent(label, item);
        }
    }
    defineInjector(label, injectorFactory) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new _shim_Map__WEBPACK_IMPORTED_MODULE_1__["default"]();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error(`injector has already been registered for '${label.toString()}'`);
        }
        const invalidator = new _core_Evented__WEBPACK_IMPORTED_MODULE_2__["Evented"]();
        const injectorItem = {
            injector: injectorFactory(() => invalidator.emit({ type: 'invalidate' })),
            invalidator
        };
        this._injectorRegistry.set(label, injectorItem);
        this.emitLoadedEvent(label, injectorItem);
    }
    get(label) {
        if (!this._widgetRegistry || !this.has(label)) {
            return null;
        }
        const item = this._widgetRegistry.get(label);
        if (isWidget(item) || isWNodeFactory(item)) {
            return item;
        }
        if (item instanceof _shim_Promise__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            return null;
        }
        const promise = item();
        this._widgetRegistry.set(label, promise);
        promise.then((widgetCtor) => {
            if (isWidgetConstructorDefaultExport(widgetCtor)) {
                widgetCtor = widgetCtor.default;
            }
            this._widgetRegistry.set(label, widgetCtor);
            this.emitLoadedEvent(label, widgetCtor);
            return widgetCtor;
        }, (error) => {
            throw error;
        });
        return null;
    }
    getInjector(label) {
        if (!this._injectorRegistry || !this.hasInjector(label)) {
            return null;
        }
        return this._injectorRegistry.get(label);
    }
    has(label) {
        return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
    }
    hasInjector(label) {
        return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Registry);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/RegistryHandler.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/RegistryHandler.mjs ***!
  \***************************************************************/
/*! exports provided: RegistryHandler, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistryHandler", function() { return RegistryHandler; });
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _core_Evented__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.mjs");
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.mjs");



class RegistryHandler extends _core_Evented__WEBPACK_IMPORTED_MODULE_1__["Evented"] {
    constructor() {
        super();
        this._registry = new _Registry__WEBPACK_IMPORTED_MODULE_2__["Registry"]();
        this._registryWidgetLabelMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_0__["Map"]();
        this._registryInjectorLabelMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_0__["Map"]();
        this.own(this._registry);
        const destroy = () => {
            if (this.baseRegistry) {
                this._registryWidgetLabelMap.delete(this.baseRegistry);
                this._registryInjectorLabelMap.delete(this.baseRegistry);
                this.baseRegistry = undefined;
            }
        };
        this.own({ destroy });
    }
    set base(baseRegistry) {
        if (this.baseRegistry) {
            this._registryWidgetLabelMap.delete(this.baseRegistry);
            this._registryInjectorLabelMap.delete(this.baseRegistry);
        }
        this.baseRegistry = baseRegistry;
    }
    get base() {
        return this.baseRegistry;
    }
    define(label, widget) {
        this._registry.define(label, widget);
    }
    defineInjector(label, injector) {
        this._registry.defineInjector(label, injector);
    }
    has(label) {
        return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
    }
    hasInjector(label) {
        return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
    }
    get(label, globalPrecedence = false) {
        return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
    }
    getInjector(label, globalPrecedence = false) {
        return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
    }
    _get(label, globalPrecedence, getFunctionName, labelMap) {
        const registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
        for (let i = 0; i < registries.length; i++) {
            const registry = registries[i];
            if (!registry) {
                continue;
            }
            const item = registry[getFunctionName](label);
            const registeredLabels = labelMap.get(registry) || [];
            if (item) {
                return item;
            }
            else if (registeredLabels.indexOf(label) === -1) {
                const handle = registry.on(label, (event) => {
                    if (event.action === 'loaded' &&
                        this[getFunctionName](label, globalPrecedence) === event.item) {
                        this.emit({ type: 'invalidate' });
                    }
                });
                this.own(handle);
                labelMap.set(registry, [...registeredLabels, label]);
            }
        }
        return null;
    }
}
/* harmony default export */ __webpack_exports__["default"] = (RegistryHandler);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/decorators/afterRender.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/decorators/afterRender.mjs ***!
  \**********************************************************************/
/*! exports provided: afterRender, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "afterRender", function() { return afterRender; });
/* harmony import */ var _handleDecorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handleDecorator */ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs");

function afterRender(method) {
    return Object(_handleDecorator__WEBPACK_IMPORTED_MODULE_0__["handleDecorator"])((target, propertyKey) => {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
/* harmony default export */ __webpack_exports__["default"] = (afterRender);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/decorators/beforeProperties.mjs":
/*!***************************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/decorators/beforeProperties.mjs ***!
  \***************************************************************************/
/*! exports provided: beforeProperties, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeProperties", function() { return beforeProperties; });
/* harmony import */ var _handleDecorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handleDecorator */ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs");

function beforeProperties(method) {
    return Object(_handleDecorator__WEBPACK_IMPORTED_MODULE_0__["handleDecorator"])((target, propertyKey) => {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
/* harmony default export */ __webpack_exports__["default"] = (beforeProperties);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/decorators/diffProperty.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/decorators/diffProperty.mjs ***!
  \***********************************************************************/
/*! exports provided: diffProperty, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "diffProperty", function() { return diffProperty; });
/* harmony import */ var _handleDecorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handleDecorator */ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../diff */ "./node_modules/@dojo/framework/core/diff.mjs");


/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
function diffProperty(propertyName, diffFunction = _diff__WEBPACK_IMPORTED_MODULE_1__["auto"], reactionFunction) {
    return Object(_handleDecorator__WEBPACK_IMPORTED_MODULE_0__["handleDecorator"])((target, propertyKey) => {
        target.addDecorator(`diffProperty:${propertyName}`, diffFunction.bind(null));
        target.addDecorator('registeredDiffProperty', propertyName);
        if (reactionFunction || propertyKey) {
            target.addDecorator('diffReaction', {
                propertyName,
                reaction: propertyKey ? target[propertyKey] : reactionFunction
            });
        }
    });
}
/* harmony default export */ __webpack_exports__["default"] = (diffProperty);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs ***!
  \**************************************************************************/
/*! exports provided: handleDecorator, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDecorator", function() { return handleDecorator; });
/**
 * Generic decorator handler to take care of whether or not the decorator was called at the class level
 * or the method level.
 *
 * @param handler
 */
function handleDecorator(handler) {
    return function (target, propertyKey, descriptor) {
        if (typeof target === 'function') {
            handler(target.prototype, undefined);
        }
        else {
            handler(target, propertyKey);
        }
    };
}
/* harmony default export */ __webpack_exports__["default"] = (handleDecorator);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/decorators/inject.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/decorators/inject.mjs ***!
  \*****************************************************************/
/*! exports provided: inject, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return inject; });
/* harmony import */ var _shim_WeakMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shim/WeakMap */ "./node_modules/@dojo/framework/shim/WeakMap.mjs");
/* harmony import */ var _handleDecorator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handleDecorator */ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs");
/* harmony import */ var _beforeProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./beforeProperties */ "./node_modules/@dojo/framework/core/decorators/beforeProperties.mjs");



/**
 * Map of instances against registered injectors.
 */
const registeredInjectorsMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_0__["default"]();
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
function inject({ name, getProperties }) {
    return Object(_handleDecorator__WEBPACK_IMPORTED_MODULE_1__["handleDecorator"])((target, propertyKey) => {
        Object(_beforeProperties__WEBPACK_IMPORTED_MODULE_2__["beforeProperties"])(function (properties) {
            const injectorItem = this.registry.getInjector(name);
            if (injectorItem) {
                const { injector, invalidator } = injectorItem;
                const registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injectorItem) === -1) {
                    this.own(invalidator.on('invalidate', () => {
                        this.invalidate();
                    }));
                    registeredInjectors.push(injectorItem);
                }
                return getProperties(injector(), properties);
            }
        })(target);
    });
}
/* harmony default export */ __webpack_exports__["default"] = (inject);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/diff.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/framework/core/diff.mjs ***!
  \****************************************************/
/*! exports provided: always, ignore, reference, shallow, auto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "always", function() { return always; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ignore", function() { return ignore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reference", function() { return reference; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallow", function() { return shallow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "auto", function() { return auto; });
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.mjs");

function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}
function always(previousProperty, newProperty) {
    return {
        changed: true,
        value: newProperty
    };
}
function ignore(previousProperty, newProperty) {
    return {
        changed: false,
        value: newProperty
    };
}
function reference(previousProperty, newProperty) {
    return {
        changed: previousProperty !== newProperty,
        value: newProperty
    };
}
function shallow(previousProperty, newProperty, depth = 0) {
    let changed = false;
    const validOldProperty = previousProperty && isObjectOrArray(previousProperty);
    const validNewProperty = newProperty && isObjectOrArray(newProperty);
    if (!validOldProperty || !validNewProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    const previousKeys = Object.keys(previousProperty);
    const newKeys = Object.keys(newProperty);
    if (previousKeys.length !== newKeys.length) {
        changed = true;
    }
    else {
        changed = newKeys.some((key) => {
            if (depth > 0) {
                return shallow(newProperty[key], previousProperty[key], depth - 1).changed;
            }
            return newProperty[key] !== previousProperty[key];
        });
    }
    return {
        changed,
        value: newProperty
    };
}
function auto(previousProperty, newProperty) {
    let result;
    if (typeof newProperty === 'function') {
        if (newProperty._type === _Registry__WEBPACK_IMPORTED_MODULE_0__["WIDGET_BASE_TYPE"]) {
            result = reference(previousProperty, newProperty);
        }
        else {
            result = ignore(previousProperty, newProperty);
        }
    }
    else if (isObjectOrArray(newProperty)) {
        result = shallow(previousProperty, newProperty);
    }
    else {
        result = reference(previousProperty, newProperty);
    }
    return result;
}


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/cache.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/cache.mjs ***!
  \****************************************************************/
/*! exports provided: cache, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cache", function() { return cache; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");


const factory = Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ destroy: _vdom__WEBPACK_IMPORTED_MODULE_0__["destroy"] });
const cache = factory(({ middleware: { destroy } }) => {
    const cacheMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_1__["default"]();
    destroy(() => {
        cacheMap.clear();
    });
    return {
        get(key) {
            return cacheMap.get(key);
        },
        set(key, value) {
            cacheMap.set(key, value);
        },
        clear() {
            cacheMap.clear();
        }
    };
});
/* harmony default export */ __webpack_exports__["default"] = (cache);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/i18n.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/i18n.mjs ***!
  \***************************************************************/
/*! exports provided: i18n, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i18n", function() { return i18n; });
/* harmony import */ var _i18n_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../i18n/i18n */ "./node_modules/@dojo/framework/i18n/i18n.mjs");
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _injector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./injector */ "./node_modules/@dojo/framework/core/middleware/injector.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _mixins_I18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mixins/I18n */ "./node_modules/@dojo/framework/core/mixins/I18n.mjs");
/* tslint:disable:interface-name */





const factory = Object(_vdom__WEBPACK_IMPORTED_MODULE_1__["create"])({ invalidator: _vdom__WEBPACK_IMPORTED_MODULE_1__["invalidator"], injector: _injector__WEBPACK_IMPORTED_MODULE_2__["default"], getRegistry: _vdom__WEBPACK_IMPORTED_MODULE_1__["getRegistry"] }).properties();
const i18n = factory(({ properties, middleware: { invalidator, injector, getRegistry } }) => {
    const i18nInjector = injector.get(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
    if (!i18nInjector) {
        const registry = getRegistry();
        if (registry) {
            Object(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["registerI18nInjector"])({}, registry.base);
        }
    }
    injector.subscribe(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
    function getLocaleMessages(bundle) {
        let { locale } = properties();
        if (!locale) {
            const injectedLocale = injector.get(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
            if (injectedLocale) {
                locale = injectedLocale.get().locale;
            }
        }
        locale = locale || _i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["default"].locale;
        const localeMessages = Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["getCachedMessages"])(bundle, locale);
        if (localeMessages) {
            return localeMessages;
        }
        Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["default"])(bundle, locale).then(() => {
            invalidator();
        });
    }
    function resolveBundle(bundle) {
        let { i18nBundle } = properties();
        if (i18nBundle) {
            if (i18nBundle instanceof _shim_Map__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                i18nBundle = i18nBundle.get(bundle);
                if (!i18nBundle) {
                    return bundle;
                }
            }
            return i18nBundle;
        }
        return bundle;
    }
    function getBlankMessages(bundle) {
        const blank = {};
        return Object.keys(bundle.messages).reduce((blank, key) => {
            blank[key] = '';
            return blank;
        }, blank);
    }
    return {
        localize(bundle, useDefaults = false) {
            let { locale } = properties();
            bundle = resolveBundle(bundle);
            const messages = getLocaleMessages(bundle);
            const isPlaceholder = !messages;
            if (!locale) {
                const injectedLocale = injector.get(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
                if (injectedLocale) {
                    locale = injectedLocale.get().locale;
                }
            }
            const format = isPlaceholder && !useDefaults
                ? () => ''
                : (key, options) => Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(bundle, key, options, locale);
            return Object.create({
                format,
                isPlaceholder,
                messages: messages || (useDefaults ? bundle.messages : getBlankMessages(bundle))
            });
        },
        set(localeData) {
            const currentLocale = injector.get(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
            if (currentLocale) {
                currentLocale.set(localeData);
            }
        },
        get() {
            const currentLocale = injector.get(_mixins_I18n__WEBPACK_IMPORTED_MODULE_4__["INJECTOR_KEY"]);
            if (currentLocale) {
                return currentLocale.get();
            }
        }
    };
});
/* harmony default export */ __webpack_exports__["default"] = (i18n);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/icache.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/icache.mjs ***!
  \*****************************************************************/
/*! exports provided: createICacheMiddleware, icache, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createICacheMiddleware", function() { return createICacheMiddleware; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "icache", function() { return icache; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cache */ "./node_modules/@dojo/framework/core/middleware/cache.mjs");
/* tslint:disable:interface-name */


const factory = Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ cache: _cache__WEBPACK_IMPORTED_MODULE_1__["default"], invalidator: _vdom__WEBPACK_IMPORTED_MODULE_0__["invalidator"] });
function createICacheMiddleware() {
    const icache = factory(({ middleware: { invalidator, cache } }) => {
        return {
            getOrSet(key, value) {
                let cachedValue = cache.get(key);
                if (!cachedValue) {
                    this.set(key, value);
                }
                cachedValue = cache.get(key);
                if (!cachedValue || cachedValue.status === 'pending') {
                    return undefined;
                }
                return cachedValue.value;
            },
            get(key) {
                const cachedValue = cache.get(key);
                if (!cachedValue || cachedValue.status === 'pending') {
                    return undefined;
                }
                return cachedValue.value;
            },
            set(key, value) {
                if (typeof value === 'function') {
                    value = value();
                    if (value && typeof value.then === 'function') {
                        cache.set(key, {
                            status: 'pending',
                            value
                        });
                        value.then((result) => {
                            const cachedValue = cache.get(key);
                            if (cachedValue && cachedValue.value === value) {
                                cache.set(key, {
                                    status: 'resolved',
                                    value: result
                                });
                                invalidator();
                            }
                        });
                        return;
                    }
                }
                cache.set(key, {
                    status: 'resolved',
                    value
                });
                invalidator();
            },
            clear() {
                cache.clear();
            }
        };
    });
    return icache;
}
const icache = createICacheMiddleware();
/* harmony default export */ __webpack_exports__["default"] = (icache);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/injector.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/injector.mjs ***!
  \*******************************************************************/
/*! exports provided: injector, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injector", function() { return injector; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");

const injectorFactory = Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ getRegistry: _vdom__WEBPACK_IMPORTED_MODULE_0__["getRegistry"], invalidator: _vdom__WEBPACK_IMPORTED_MODULE_0__["invalidator"], destroy: _vdom__WEBPACK_IMPORTED_MODULE_0__["destroy"] });
const injector = injectorFactory(({ middleware: { getRegistry, invalidator, destroy } }) => {
    const handles = [];
    destroy(() => {
        let handle;
        while ((handle = handles.pop())) {
            handle.destroy();
        }
    });
    const registry = getRegistry();
    return {
        subscribe(label, callback = invalidator) {
            if (registry) {
                const item = registry.getInjector(label);
                if (item) {
                    const handle = item.invalidator.on('invalidate', () => {
                        callback();
                    });
                    handles.push(handle);
                    return () => {
                        const index = handles.indexOf(handle);
                        if (index !== -1) {
                            handles.splice(index, 1);
                            handle.destroy();
                        }
                    };
                }
            }
        },
        get(label) {
            if (registry) {
                const item = registry.getInjector(label);
                if (item) {
                    return item.injector();
                }
            }
            return null;
        }
    };
});
/* harmony default export */ __webpack_exports__["default"] = (injector);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/theme.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/theme.mjs ***!
  \****************************************************************/
/*! exports provided: theme, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "theme", function() { return theme; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cache */ "./node_modules/@dojo/framework/core/middleware/cache.mjs");
/* harmony import */ var _injector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./injector */ "./node_modules/@dojo/framework/core/middleware/injector.mjs");
/* harmony import */ var _shim_Set__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shim/Set */ "./node_modules/@dojo/framework/shim/Set.mjs");
/* harmony import */ var _mixins_Themed__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mixins/Themed */ "./node_modules/@dojo/framework/core/mixins/Themed.mjs");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../diff */ "./node_modules/@dojo/framework/core/diff.mjs");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};






const factory = Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ invalidator: _vdom__WEBPACK_IMPORTED_MODULE_0__["invalidator"], cache: _cache__WEBPACK_IMPORTED_MODULE_1__["default"], diffProperty: _vdom__WEBPACK_IMPORTED_MODULE_0__["diffProperty"], injector: _injector__WEBPACK_IMPORTED_MODULE_2__["default"], getRegistry: _vdom__WEBPACK_IMPORTED_MODULE_0__["getRegistry"] }).properties();
const theme = factory(({ middleware: { invalidator, cache, diffProperty, injector, getRegistry }, properties }) => {
    let themeKeys = new _shim_Set__WEBPACK_IMPORTED_MODULE_3__["default"]();
    diffProperty('theme', (current, next) => {
        if (current.theme !== next.theme) {
            cache.clear();
            invalidator();
        }
    });
    diffProperty('classes', (current, next) => {
        let result = false;
        if ((current.classes && !next.classes) || (!current.classes && next.classes)) {
            result = true;
        }
        else if (current.classes && next.classes) {
            const keys = [...themeKeys.values()];
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                result = Object(_diff__WEBPACK_IMPORTED_MODULE_5__["shallow"])(current.classes[key], next.classes[key], 1).changed;
                if (result) {
                    break;
                }
            }
        }
        if (result) {
            cache.clear();
            invalidator();
        }
    });
    const themeInjector = injector.get(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["INJECTED_THEME_KEY"]);
    if (!themeInjector) {
        const registry = getRegistry();
        if (registry) {
            Object(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["registerThemeInjector"])(undefined, registry.base);
        }
    }
    injector.subscribe(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["INJECTED_THEME_KEY"], () => {
        cache.clear();
        invalidator();
    });
    return {
        classes(css) {
            let theme = cache.get(css);
            if (theme) {
                return theme;
            }
            const _a = _mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["THEME_KEY"], key = css[_a], classes = __rest(css, [typeof _a === "symbol" ? _a : _a + ""]);
            themeKeys.add(key);
            theme = classes;
            let { theme: currentTheme, classes: currentClasses } = properties();
            if (!currentTheme) {
                const injectedTheme = injector.get(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["INJECTED_THEME_KEY"]);
                currentTheme = injectedTheme ? injectedTheme.get() : undefined;
            }
            if (currentTheme && currentTheme[key]) {
                theme = Object.assign({}, theme, currentTheme[key]);
            }
            if (currentClasses && currentClasses[key]) {
                const classKeys = Object.keys(currentClasses[key]);
                for (let i = 0; i < classKeys.length; i++) {
                    const classKey = classKeys[i];
                    if (theme[classKey]) {
                        theme[classKey] = `${theme[classKey]} ${currentClasses[key][classKey].join(' ')}`;
                    }
                }
            }
            cache.set(css, theme);
            return theme;
        },
        set(css) {
            const currentTheme = injector.get(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["INJECTED_THEME_KEY"]);
            if (currentTheme) {
                currentTheme.set(css);
            }
        },
        get() {
            const currentTheme = injector.get(_mixins_Themed__WEBPACK_IMPORTED_MODULE_4__["INJECTED_THEME_KEY"]);
            if (currentTheme) {
                return currentTheme.get();
            }
        }
    };
});
/* harmony default export */ __webpack_exports__["default"] = (theme);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/mixins/I18n.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@dojo/framework/core/mixins/I18n.mjs ***!
  \***********************************************************/
/*! exports provided: INJECTOR_KEY, registerI18nInjector, I18nMixin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INJECTOR_KEY", function() { return INJECTOR_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerI18nInjector", function() { return registerI18nInjector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I18nMixin", function() { return I18nMixin; });
/* harmony import */ var _i18n_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../i18n/i18n */ "./node_modules/@dojo/framework/i18n/i18n.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _decorators_afterRender__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../decorators/afterRender */ "./node_modules/@dojo/framework/core/decorators/afterRender.mjs");
/* harmony import */ var _decorators_inject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../decorators/inject */ "./node_modules/@dojo/framework/core/decorators/inject.mjs");
/* harmony import */ var _Injector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../Injector */ "./node_modules/@dojo/framework/core/Injector.mjs");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util */ "./node_modules/@dojo/framework/core/util.mjs");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* tslint:disable:interface-name */







const INJECTOR_KEY = '__i18n_injector';
function registerI18nInjector(localeData, registry) {
    const injector = new _Injector__WEBPACK_IMPORTED_MODULE_5__["Injector"](localeData);
    registry.defineInjector(INJECTOR_KEY, (invalidator) => {
        injector.setInvalidator(invalidator);
        return () => injector;
    });
    return injector;
}
function I18nMixin(Base) {
    let I18n = class I18n extends Base {
        /**
         * Return a localized messages object for the provided bundle, deferring to the `i18nBundle` property
         * when present. If the localized messages have not yet been loaded, return either a blank bundle or the
         * default messages.
         *
         * @param bundle
         * The bundle to localize
         *
         * @param useDefaults
         * If `true`, the default messages will be used when the localized messages have not yet been loaded. If `false`
         * (the default), then a blank bundle will be returned (i.e., each key's value will be an empty string).
         */
        localizeBundle(baseBundle, useDefaults = false) {
            const bundle = this._resolveBundle(baseBundle);
            const messages = this._getLocaleMessages(bundle);
            const isPlaceholder = !messages;
            const { locale } = this.properties;
            const format = isPlaceholder && !useDefaults
                ? (key, options) => ''
                : (key, options) => Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(bundle, key, options, locale);
            return Object.create({
                format,
                isPlaceholder,
                messages: messages || (useDefaults ? bundle.messages : this._getBlankMessages(bundle))
            });
        }
        renderDecorator(result) {
            Object(_util__WEBPACK_IMPORTED_MODULE_6__["decorate"])(result, {
                modifier: (node, breaker) => {
                    const { locale, rtl } = this.properties;
                    const properties = {};
                    if (typeof rtl === 'boolean') {
                        properties['dir'] = rtl ? 'rtl' : 'ltr';
                    }
                    if (locale) {
                        properties['lang'] = locale;
                    }
                    node.properties = Object.assign({}, node.properties, properties);
                    breaker();
                },
                predicate: _vdom__WEBPACK_IMPORTED_MODULE_2__["isVNode"]
            });
            return result;
        }
        /**
         * @private
         * Return a message bundle containing an empty string for each key in the provided bundle.
         *
         * @param bundle
         * The message bundle
         *
         * @return
         * The blank message bundle
         */
        _getBlankMessages(bundle) {
            const blank = {};
            return Object.keys(bundle.messages).reduce((blank, key) => {
                blank[key] = '';
                return blank;
            }, blank);
        }
        /**
         * @private
         * Return the cached dictionary for the specified bundle and locale, if it exists. If the requested dictionary does not
         * exist, then load it and update the instance's state with the appropriate messages.
         *
         * @param bundle
         * The bundle for which to load a locale-specific dictionary.
         *
         * @return
         * The locale-specific dictionary, if it has already been loaded and cached.
         */
        _getLocaleMessages(bundle) {
            const { properties } = this;
            const locale = properties.locale || _i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["default"].locale;
            const localeMessages = Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["getCachedMessages"])(bundle, locale);
            if (localeMessages) {
                return localeMessages;
            }
            Object(_i18n_i18n__WEBPACK_IMPORTED_MODULE_0__["default"])(bundle, locale).then(() => {
                this.invalidate();
            });
        }
        /**
         * @private
         * Resolve the bundle to use for the widget's messages to either the provided bundle or to the
         * `i18nBundle` property.
         *
         * @param bundle
         * The base bundle
         *
         * @return
         * Either override bundle or the original bundle.
         */
        _resolveBundle(bundle) {
            let { i18nBundle } = this.properties;
            if (i18nBundle) {
                if (i18nBundle instanceof _shim_Map__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                    i18nBundle = i18nBundle.get(bundle);
                    if (!i18nBundle) {
                        return bundle;
                    }
                }
                return i18nBundle;
            }
            return bundle;
        }
    };
    __decorate([
        Object(_decorators_afterRender__WEBPACK_IMPORTED_MODULE_3__["afterRender"])()
    ], I18n.prototype, "renderDecorator", null);
    I18n = __decorate([
        Object(_decorators_inject__WEBPACK_IMPORTED_MODULE_4__["inject"])({
            name: INJECTOR_KEY,
            getProperties: (localeData, properties) => {
                const { locale = localeData.get().locale, rtl = localeData.get().rtl } = properties;
                return { locale, rtl };
            }
        })
    ], I18n);
    return I18n;
}
/* harmony default export */ __webpack_exports__["default"] = (I18nMixin);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/mixins/Themed.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/mixins/Themed.mjs ***!
  \*************************************************************/
/*! exports provided: THEME_KEY, INJECTED_THEME_KEY, theme, registerThemeInjector, ThemedMixin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THEME_KEY", function() { return THEME_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INJECTED_THEME_KEY", function() { return INJECTED_THEME_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "theme", function() { return theme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerThemeInjector", function() { return registerThemeInjector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemedMixin", function() { return ThemedMixin; });
/* harmony import */ var _Injector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../Injector */ "./node_modules/@dojo/framework/core/Injector.mjs");
/* harmony import */ var _decorators_inject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../decorators/inject */ "./node_modules/@dojo/framework/core/decorators/inject.mjs");
/* harmony import */ var _decorators_handleDecorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../decorators/handleDecorator */ "./node_modules/@dojo/framework/core/decorators/handleDecorator.mjs");
/* harmony import */ var _decorators_diffProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../decorators/diffProperty */ "./node_modules/@dojo/framework/core/decorators/diffProperty.mjs");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../diff */ "./node_modules/@dojo/framework/core/diff.mjs");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};





const THEME_KEY = ' _key';
const INJECTED_THEME_KEY = '__theme_injector';
/**
 * Decorator for base css classes
 */
function theme(theme) {
    return Object(_decorators_handleDecorator__WEBPACK_IMPORTED_MODULE_2__["handleDecorator"])((target) => {
        target.addDecorator('baseThemeClasses', theme);
    });
}
/**
 * Creates a reverse lookup for the classes passed in via the `theme` function.
 *
 * @param classes The baseClasses object
 * @requires
 */
function createThemeClassesLookup(classes) {
    return classes.reduce((currentClassNames, baseClass) => {
        Object.keys(baseClass).forEach((key) => {
            currentClassNames[baseClass[key]] = key;
        });
        return currentClassNames;
    }, {});
}
/**
 * Convenience function that is given a theme and an optional registry, the theme
 * injector is defined against the registry, returning the theme.
 *
 * @param theme the theme to set
 * @param themeRegistry registry to define the theme injector against. Defaults
 * to the global registry
 *
 * @returns the theme injector used to set the theme
 */
function registerThemeInjector(theme, themeRegistry) {
    const themeInjector = new _Injector__WEBPACK_IMPORTED_MODULE_0__["Injector"](theme);
    themeRegistry.defineInjector(INJECTED_THEME_KEY, (invalidator) => {
        themeInjector.setInvalidator(invalidator);
        return () => themeInjector;
    });
    return themeInjector;
}
/**
 * Function that returns a class decorated with with Themed functionality
 */
function ThemedMixin(Base) {
    let Themed = class Themed extends Base {
        constructor() {
            super(...arguments);
            /**
             * Registered base theme keys
             */
            this._registeredBaseThemeKeys = [];
            /**
             * Indicates if classes meta data need to be calculated.
             */
            this._recalculateClasses = true;
            /**
             * Loaded theme
             */
            this._theme = {};
        }
        theme(classes) {
            if (this._recalculateClasses) {
                this._recalculateThemeClasses();
            }
            if (Array.isArray(classes)) {
                return classes.map((className) => this._getThemeClass(className));
            }
            return this._getThemeClass(classes);
        }
        /**
         * Function fired when `theme` or `extraClasses` are changed.
         */
        onPropertiesChanged() {
            this._recalculateClasses = true;
        }
        _getThemeClass(className) {
            if (className === undefined || className === null || className === false || className === true) {
                return className;
            }
            const extraClasses = this.properties.extraClasses || {};
            const themeClassName = this._baseThemeClassesReverseLookup[className];
            let resultClassNames = [];
            if (!themeClassName) {
                console.warn(`Class name: '${className}' not found in theme`);
                return null;
            }
            if (this._classes) {
                const classes = Object.keys(this._classes).reduce((classes, key) => {
                    const classNames = Object.keys(this._classes[key]);
                    for (let i = 0; i < classNames.length; i++) {
                        const extraClass = this._classes[key][classNames[i]];
                        if (classNames[i] === themeClassName && extraClass) {
                            extraClass.forEach((className) => {
                                if (className && className !== true) {
                                    classes.push(className);
                                }
                            });
                            break;
                        }
                    }
                    return classes;
                }, []);
                resultClassNames.push(...classes);
            }
            if (extraClasses[themeClassName]) {
                resultClassNames.push(extraClasses[themeClassName]);
            }
            if (this._theme[themeClassName]) {
                resultClassNames.push(this._theme[themeClassName]);
            }
            else {
                resultClassNames.push(this._registeredBaseTheme[themeClassName]);
            }
            return resultClassNames.join(' ');
        }
        _recalculateThemeClasses() {
            const { theme = {}, classes = {} } = this.properties;
            if (!this._registeredBaseTheme) {
                const baseThemes = this.getDecorator('baseThemeClasses');
                if (baseThemes.length === 0) {
                    console.warn('A base theme has not been provided to this widget. Please use the @theme decorator to add a theme.');
                }
                this._registeredBaseTheme = baseThemes.reduce((finalBaseTheme, baseTheme) => {
                    const _a = THEME_KEY, key = baseTheme[_a], classes = __rest(baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
                    this._registeredBaseThemeKeys.push(key);
                    return Object.assign({}, finalBaseTheme, classes);
                }, {});
                this._baseThemeClassesReverseLookup = createThemeClassesLookup(baseThemes);
            }
            this._theme = this._registeredBaseThemeKeys.reduce((baseTheme, themeKey) => {
                return Object.assign({}, baseTheme, theme[themeKey]);
            }, {});
            this._classes = Object.keys(classes).reduce((computed, key) => {
                if (this._registeredBaseThemeKeys.indexOf(key) > -1) {
                    computed = Object.assign({}, computed, { [key]: classes[key] });
                }
                return computed;
            }, {});
            this._recalculateClasses = false;
        }
    };
    __decorate([
        Object(_decorators_diffProperty__WEBPACK_IMPORTED_MODULE_3__["diffProperty"])('theme', _diff__WEBPACK_IMPORTED_MODULE_4__["shallow"]),
        Object(_decorators_diffProperty__WEBPACK_IMPORTED_MODULE_3__["diffProperty"])('extraClasses', _diff__WEBPACK_IMPORTED_MODULE_4__["shallow"]),
        Object(_decorators_diffProperty__WEBPACK_IMPORTED_MODULE_3__["diffProperty"])('classes', _diff__WEBPACK_IMPORTED_MODULE_4__["shallow"])
    ], Themed.prototype, "onPropertiesChanged", null);
    Themed = __decorate([
        Object(_decorators_inject__WEBPACK_IMPORTED_MODULE_1__["inject"])({
            name: INJECTED_THEME_KEY,
            getProperties: (theme, properties) => {
                if (!properties.theme) {
                    return { theme: theme.get() };
                }
                return {};
            }
        })
    ], Themed);
    return Themed;
}
/* harmony default export */ __webpack_exports__["default"] = (ThemedMixin);


/***/ }),

/***/ "./node_modules/@dojo/framework/core/util.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/framework/core/util.mjs ***!
  \****************************************************/
/*! exports provided: deepAssign, deepMixin, mixin, partial, guaranteeMinimumTimeout, debounce, throttle, uuid, decorate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepAssign", function() { return deepAssign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepMixin", function() { return deepMixin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mixin", function() { return mixin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partial", function() { return partial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "guaranteeMinimumTimeout", function() { return guaranteeMinimumTimeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuid", function() { return uuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decorate", function() { return decorate; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");

const slice = Array.prototype.slice;
const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Type guard that ensures that the value can be coerced to Object
 * to weed out host objects that do not derive from Object.
 * This function is used to check if we want to deep copy an object or not.
 * Note: In ES6 it is possible to modify an object's Symbol.toStringTag property, which will
 * change the value returned by `toString`. This is a rare edge case that is difficult to handle,
 * so it is not handled here.
 * @param  value The value to check
 * @return       If the value is coercible into an Object
 */
function shouldDeepCopyObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
function copyArray(array, inherited) {
    return array.map(function (item) {
        if (Array.isArray(item)) {
            return copyArray(item, inherited);
        }
        return !shouldDeepCopyObject(item)
            ? item
            : _mixin({
                deep: true,
                inherited: inherited,
                sources: [item],
                target: {}
            });
    });
}
function _mixin(kwArgs) {
    const deep = kwArgs.deep;
    const inherited = kwArgs.inherited;
    const target = kwArgs.target;
    const copied = kwArgs.copied || [];
    const copiedClone = [...copied];
    for (let i = 0; i < kwArgs.sources.length; i++) {
        const source = kwArgs.sources[i];
        if (source === null || source === undefined) {
            continue;
        }
        for (let key in source) {
            if (inherited || hasOwnProperty.call(source, key)) {
                let value = source[key];
                if (copiedClone.indexOf(value) !== -1) {
                    continue;
                }
                if (deep) {
                    if (Array.isArray(value)) {
                        value = copyArray(value, inherited);
                    }
                    else if (shouldDeepCopyObject(value)) {
                        const targetValue = target[key] || {};
                        copied.push(source);
                        value = _mixin({
                            deep: true,
                            inherited: inherited,
                            sources: [value],
                            target: targetValue,
                            copied
                        });
                    }
                }
                target[key] = value;
            }
        }
    }
    return target;
}
function deepAssign(target, ...sources) {
    return _mixin({
        deep: true,
        inherited: false,
        sources: sources,
        target: target
    });
}
function deepMixin(target, ...sources) {
    return _mixin({
        deep: true,
        inherited: true,
        sources: sources,
        target: target
    });
}
function mixin(target, ...sources) {
    return _mixin({
        deep: false,
        inherited: true,
        sources: sources,
        target: target
    });
}
/**
 * Returns a function which invokes the given function with the given arguments prepended to its argument list.
 * Like `Function.prototype.bind`, but does not alter execution context.
 *
 * @param targetFunction The function that needs to be bound
 * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
 * @return The bound function
 */
function partial(targetFunction, ...suppliedArgs) {
    return function () {
        const args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
        return targetFunction.apply(this, args);
    };
}
function guaranteeMinimumTimeout(callback, delay) {
    const startTime = Date.now();
    let timerId;
    function timeoutHandler() {
        const delta = Date.now() - startTime;
        if (delay == null || delta >= delay) {
            callback();
        }
        else {
            timerId = setTimeout(timeoutHandler, delay - delta);
        }
    }
    timerId = setTimeout(timeoutHandler, delay);
    return {
        destroy: () => {
            if (timerId != null) {
                clearTimeout(timerId);
                timerId = null;
            }
        }
    };
}
function debounce(callback, delay) {
    let timer;
    return function () {
        timer && timer.destroy();
        let context = this;
        let args = arguments;
        timer = guaranteeMinimumTimeout(function () {
            callback.apply(context, args);
            args = context = timer = null;
        }, delay);
    };
}
function throttle(callback, delay) {
    let ran;
    return function () {
        if (ran) {
            return;
        }
        ran = true;
        let args = arguments;
        callback.apply(this, args);
        guaranteeMinimumTimeout(function () {
            ran = null;
        }, delay);
    };
}
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function decorate(dNodes, optionsOrModifier, predicate) {
    let shallow = false;
    let modifier;
    if (typeof optionsOrModifier === 'function') {
        modifier = optionsOrModifier;
    }
    else {
        modifier = optionsOrModifier.modifier;
        predicate = optionsOrModifier.predicate;
        shallow = optionsOrModifier.shallow || false;
    }
    let nodes = Array.isArray(dNodes) ? [...dNodes] : [dNodes];
    function breaker() {
        nodes = [];
    }
    while (nodes.length) {
        const node = nodes.shift();
        if (node && node !== true) {
            if (!shallow && (Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["isWNode"])(node) || Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["isVNode"])(node)) && node.children) {
                nodes = [...nodes, ...node.children];
            }
            if (!predicate || predicate(node)) {
                modifier(node, breaker);
            }
        }
    }
    return dNodes;
}


/***/ }),

/***/ "./node_modules/@dojo/framework/core/vdom.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/framework/core/vdom.mjs ***!
  \****************************************************/
/*! exports provided: isTextNode, isWNode, isVNode, isDomVNode, isElementNode, w, v, dom, REGISTRY_ITEM, FromRegistry, fromRegistry, tsx, propertiesDiff, create, widgetInstanceMap, invalidator, node, diffProperty, destroy, getRegistry, defer, renderer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTextNode", function() { return isTextNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWNode", function() { return isWNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVNode", function() { return isVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDomVNode", function() { return isDomVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementNode", function() { return isElementNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return w; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return v; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dom", function() { return dom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGISTRY_ITEM", function() { return REGISTRY_ITEM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FromRegistry", function() { return FromRegistry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromRegistry", function() { return fromRegistry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsx", function() { return tsx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propertiesDiff", function() { return propertiesDiff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "widgetInstanceMap", function() { return widgetInstanceMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invalidator", function() { return invalidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "node", function() { return node; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "diffProperty", function() { return diffProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRegistry", function() { return getRegistry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return defer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderer", function() { return renderer; });
/* harmony import */ var _shim_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
/* harmony import */ var _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shim/WeakMap */ "./node_modules/@dojo/framework/shim/WeakMap.mjs");
/* harmony import */ var _shim_Set__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shim/Set */ "./node_modules/@dojo/framework/shim/Set.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _Registry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.mjs");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./diff */ "./node_modules/@dojo/framework/core/diff.mjs");
/* harmony import */ var _RegistryHandler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./RegistryHandler */ "./node_modules/@dojo/framework/core/RegistryHandler.mjs");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};








const EMPTY_ARRAY = [];
const nodeOperations = ['focus', 'blur', 'scrollIntoView', 'click'];
const NAMESPACE_W3 = 'http://www.w3.org/';
const NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
const NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
const WNODE = '__WNODE_TYPE';
const VNODE = '__VNODE_TYPE';
const DOMVNODE = '__DOMVNODE_TYPE';
function isTextNode(item) {
    return item && item.nodeType === 3;
}
function isLazyDefine(item) {
    return Boolean(item && item.label);
}
function isWNodeWrapper(child) {
    return child && isWNode(child.node);
}
function isVNodeWrapper(child) {
    return !!child && isVNode(child.node);
}
function isVirtualWrapper(child) {
    return isVNodeWrapper(child) && child.node.tag === 'virtual';
}
function isBodyWrapper(wrapper) {
    return isVNodeWrapper(wrapper) && wrapper.node.tag === 'body';
}
function isAttachApplication(value) {
    return !!value.type;
}
function isWNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && child.type === WNODE);
}
function isVNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && (child.type === VNODE || child.type === DOMVNODE));
}
function isDomVNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && child.type === DOMVNODE);
}
function isElementNode(value) {
    return !!value.tagName;
}
function toTextVNode(data) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        text: `${data}`,
        type: VNODE
    };
}
function updateAttributes(domNode, previousAttributes, attributes, namespace) {
    const attrNames = Object.keys(attributes);
    const attrCount = attrNames.length;
    for (let i = 0; i < attrCount; i++) {
        const attrName = attrNames[i];
        const attrValue = attributes[attrName];
        const previousAttrValue = previousAttributes[attrName];
        if (attrValue !== previousAttrValue) {
            updateAttribute(domNode, attrName, attrValue, namespace);
        }
    }
}
function w(widgetConstructorOrNode, properties, children) {
    if (Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWNodeFactory"])(widgetConstructorOrNode)) {
        return widgetConstructorOrNode(properties, children);
    }
    if (isWNode(widgetConstructorOrNode)) {
        properties = Object.assign({}, widgetConstructorOrNode.properties, properties);
        children = children ? children : widgetConstructorOrNode.children;
        widgetConstructorOrNode = widgetConstructorOrNode.widgetConstructor;
    }
    return {
        children: children || [],
        widgetConstructor: widgetConstructorOrNode,
        properties,
        type: WNODE
    };
}
function v(tag, propertiesOrChildren = {}, children = undefined) {
    let properties = propertiesOrChildren;
    let deferredPropertiesCallback;
    if (Array.isArray(propertiesOrChildren)) {
        children = propertiesOrChildren;
        properties = {};
    }
    if (typeof properties === 'function') {
        deferredPropertiesCallback = properties;
        properties = {};
    }
    if (isVNode(tag)) {
        let { classes = [], styles = {} } = properties, newProperties = __rest(properties, ["classes", "styles"]);
        let _a = tag.properties, { classes: nodeClasses = [], styles: nodeStyles = {} } = _a, nodeProperties = __rest(_a, ["classes", "styles"]);
        nodeClasses = Array.isArray(nodeClasses) ? nodeClasses : [nodeClasses];
        classes = Array.isArray(classes) ? classes : [classes];
        styles = Object.assign({}, nodeStyles, styles);
        properties = Object.assign({}, nodeProperties, newProperties, { classes: [...nodeClasses, ...classes], styles });
        children = children ? children : tag.children;
        tag = tag.tag;
    }
    return {
        tag,
        deferredPropertiesCallback,
        children,
        properties,
        type: VNODE
    };
}
/**
 * Create a VNode for an existing DOM Node.
 */
function dom({ node, attrs = {}, props = {}, on = {}, diffType = 'none', onAttach }, children) {
    return {
        tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
        properties: props,
        attributes: attrs,
        events: on,
        children,
        type: DOMVNODE,
        domNode: node,
        text: isElementNode(node) ? undefined : node.data,
        diffType,
        onAttach
    };
}
const REGISTRY_ITEM = '__registry_item';
class FromRegistry {
    constructor() {
        this.properties = {};
    }
}
FromRegistry.type = REGISTRY_ITEM;
function fromRegistry(tag) {
    var _a;
    return _a = class extends FromRegistry {
            constructor() {
                super(...arguments);
                this.properties = {};
                this.name = tag;
            }
        },
        _a.type = REGISTRY_ITEM,
        _a;
}
function spreadChildren(children, child) {
    if (Array.isArray(child)) {
        return child.reduce(spreadChildren, children);
    }
    else {
        return [...children, child];
    }
}
function tsx(tag, properties = {}, ...children) {
    children = children.reduce(spreadChildren, []);
    properties = properties === null ? {} : properties;
    if (typeof tag === 'string') {
        return v(tag, properties, children);
    }
    else if (tag.type === 'registry' && properties.__autoRegistryItem) {
        const name = properties.__autoRegistryItem;
        delete properties.__autoRegistryItem;
        return w(name, properties, children);
    }
    else if (tag.type === REGISTRY_ITEM) {
        const registryItem = new tag();
        return w(registryItem.name, properties, children);
    }
    else {
        return w(tag, properties, children);
    }
}
function propertiesDiff(current, next, invalidator, ignoreProperties) {
    const propertyNames = [...Object.keys(current), ...Object.keys(next)];
    for (let i = 0; i < propertyNames.length; i++) {
        if (ignoreProperties.indexOf(propertyNames[i]) > -1) {
            continue;
        }
        const result = Object(_diff__WEBPACK_IMPORTED_MODULE_6__["auto"])(current[propertyNames[i]], next[propertyNames[i]]);
        if (result.changed) {
            invalidator();
            break;
        }
        ignoreProperties.push(propertyNames[i]);
    }
}
function buildPreviousProperties(domNode, current) {
    const { node: { diffType, properties, attributes } } = current;
    if (!diffType || diffType === 'vdom') {
        return {
            properties: current.deferredProperties
                ? Object.assign({}, current.deferredProperties, current.node.properties) : current.node.properties,
            attributes: current.node.attributes,
            events: current.node.events
        };
    }
    else if (diffType === 'none') {
        return {
            properties: {},
            attributes: current.node.attributes ? {} : undefined,
            events: current.node.events
        };
    }
    let newProperties = {
        properties: {}
    };
    if (attributes) {
        newProperties.attributes = {};
        newProperties.events = current.node.events;
        Object.keys(properties).forEach((propName) => {
            newProperties.properties[propName] = domNode[propName];
        });
        Object.keys(attributes).forEach((attrName) => {
            newProperties.attributes[attrName] = domNode.getAttribute(attrName);
        });
        return newProperties;
    }
    newProperties.properties = Object.keys(properties).reduce((props, property) => {
        props[property] = domNode.getAttribute(property) || domNode[property];
        return props;
    }, {});
    return newProperties;
}
function checkDistinguishable(wrappers, index, parentWNodeWrapper) {
    const wrapperToCheck = wrappers[index];
    if (isVNodeWrapper(wrapperToCheck) && !wrapperToCheck.node.tag) {
        return;
    }
    const { key } = wrapperToCheck.node.properties;
    let parentName = 'unknown';
    if (parentWNodeWrapper) {
        const { node: { widgetConstructor } } = parentWNodeWrapper;
        parentName = widgetConstructor.name || 'unknown';
    }
    if (key === undefined || key === null) {
        for (let i = 0; i < wrappers.length; i++) {
            if (i !== index) {
                const wrapper = wrappers[i];
                if (same(wrapper, wrapperToCheck)) {
                    let nodeIdentifier;
                    if (isWNodeWrapper(wrapper)) {
                        nodeIdentifier = wrapper.node.widgetConstructor.name || 'unknown';
                    }
                    else {
                        nodeIdentifier = wrapper.node.tag;
                    }
                    console.warn(`A widget (${parentName}) has had a child added or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (${nodeIdentifier}) multiple times as siblings`);
                    break;
                }
            }
        }
    }
}
function same(dnode1, dnode2) {
    if (isVNodeWrapper(dnode1) && isVNodeWrapper(dnode2)) {
        if (isDomVNode(dnode1.node) && isDomVNode(dnode2.node)) {
            if (dnode1.node.domNode !== dnode2.node.domNode) {
                return false;
            }
        }
        if (dnode1.node.tag !== dnode2.node.tag) {
            return false;
        }
        if (dnode1.node.properties.key !== dnode2.node.properties.key) {
            return false;
        }
        return true;
    }
    else if (isWNodeWrapper(dnode1) && isWNodeWrapper(dnode2)) {
        const widgetConstructor1 = dnode1.registryItem || dnode1.node.widgetConstructor;
        const widgetConstructor2 = dnode2.registryItem || dnode2.node.widgetConstructor;
        if (dnode1.instance === undefined && typeof widgetConstructor2 === 'string') {
            return false;
        }
        if (widgetConstructor1 !== widgetConstructor2) {
            return false;
        }
        if (dnode1.node.properties.key !== dnode2.node.properties.key) {
            return false;
        }
        return true;
    }
    return false;
}
function findIndexOfChild(children, sameAs, start) {
    for (let i = start; i < children.length; i++) {
        if (same(children[i], sameAs)) {
            return i;
        }
    }
    return -1;
}
function createClassPropValue(classes = []) {
    let classNames = '';
    if (Array.isArray(classes)) {
        for (let i = 0; i < classes.length; i++) {
            let className = classes[i];
            if (className && className !== true) {
                classNames = classNames ? `${classNames} ${className}` : className;
            }
        }
        return classNames;
    }
    if (classes && classes !== true) {
        classNames = classes;
    }
    return classNames;
}
function updateAttribute(domNode, attrName, attrValue, namespace) {
    if (namespace === NAMESPACE_SVG && attrName === 'href' && attrValue) {
        domNode.setAttributeNS(NAMESPACE_XLINK, attrName, attrValue);
    }
    else if ((attrName === 'role' && attrValue === '') || attrValue === undefined) {
        domNode.removeAttribute(attrName);
    }
    else {
        domNode.setAttribute(attrName, attrValue);
    }
}
function arrayFrom(arr) {
    return Array.prototype.slice.call(arr);
}
function createFactory(callback, middlewares) {
    const factory = (properties, children) => {
        if (properties) {
            const result = w(callback, properties, children);
            callback.isWidget = true;
            callback.middlewares = middlewares;
            return result;
        }
        return {
            middlewares,
            callback
        };
    };
    factory.isFactory = true;
    return factory;
}
function create(middlewares = {}) {
    function properties() {
        function returns(callback) {
            return createFactory(callback, middlewares);
        }
        return returns;
    }
    function returns(callback) {
        return createFactory(callback, middlewares);
    }
    returns.properties = properties;
    return returns;
}
const factory = create();
function wrapNodes(renderer) {
    const result = renderer();
    const isWNodeWrapper = isWNode(result);
    const callback = () => {
        return result;
    };
    callback.isWNodeWrapper = isWNodeWrapper;
    return factory(callback);
}
const widgetInstanceMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
const widgetMetaMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
const requestedDomNodes = new _shim_Set__WEBPACK_IMPORTED_MODULE_3__["default"]();
let wrapperId = 0;
let metaId = 0;
function addNodeToMap(id, key, node) {
    const widgetMeta = widgetMetaMap.get(id);
    if (widgetMeta) {
        widgetMeta.nodeMap = widgetMeta.nodeMap || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
        widgetMeta.nodeMap.set(key, node);
        if (requestedDomNodes.has(`${id}-${key}`)) {
            widgetMeta.invalidator();
            requestedDomNodes.delete(`${id}-${key}`);
        }
    }
}
function destroyHandles(meta) {
    const { destroyMap, middlewareIds } = meta;
    if (!destroyMap) {
        return;
    }
    for (let i = 0; i < middlewareIds.length; i++) {
        const id = middlewareIds[i];
        const destroy = destroyMap.get(id);
        destroy && destroy();
        destroyMap.delete(id);
        if (destroyMap.size === 0) {
            break;
        }
    }
    destroyMap.clear();
}
function runDiffs(meta, current, next) {
    meta.customDiffMap = meta.customDiffMap || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
    if (meta.customDiffMap.size) {
        meta.customDiffMap.forEach((diffMap) => {
            diffMap.forEach((diff) => diff(Object.assign({}, current), Object.assign({}, next)));
        });
    }
}
const invalidator = factory(({ id }) => {
    const [widgetId] = id.split('-');
    return () => {
        const widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            return widgetMeta.invalidator();
        }
    };
});
const node = factory(({ id }) => {
    return {
        get(key) {
            const [widgetId] = id.split('-');
            const widgetMeta = widgetMetaMap.get(widgetId);
            if (widgetMeta) {
                widgetMeta.nodeMap = widgetMeta.nodeMap || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
                const mountNode = widgetMeta.mountNode;
                const node = widgetMeta.nodeMap.get(key);
                if (node && mountNode.contains(node)) {
                    return node;
                }
                requestedDomNodes.add(`${widgetId}-${key}`);
            }
            return null;
        }
    };
});
const diffProperty = factory(({ id }) => {
    return (propertyName, diff) => {
        const [widgetId] = id.split('-');
        const widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            widgetMeta.customDiffMap = widgetMeta.customDiffMap || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
            widgetMeta.customDiffProperties = widgetMeta.customDiffProperties || new _shim_Set__WEBPACK_IMPORTED_MODULE_3__["default"]();
            const propertyDiffMap = widgetMeta.customDiffMap.get(id) || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
            if (!propertyDiffMap.has(propertyName)) {
                propertyDiffMap.set(propertyName, diff);
                widgetMeta.customDiffProperties.add(propertyName);
            }
            widgetMeta.customDiffMap.set(id, propertyDiffMap);
        }
    };
});
const destroy = factory(({ id }) => {
    return (destroyFunction) => {
        const [widgetId] = id.split('-');
        const widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            widgetMeta.destroyMap = widgetMeta.destroyMap || new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
            if (!widgetMeta.destroyMap.has(id)) {
                widgetMeta.destroyMap.set(id, destroyFunction);
            }
        }
    };
});
const getRegistry = factory(({ id }) => {
    const [widgetId] = id.split('-');
    return () => {
        const widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            if (!widgetMeta.registryHandler) {
                widgetMeta.registryHandler = new _RegistryHandler__WEBPACK_IMPORTED_MODULE_7__["default"]();
                widgetMeta.registryHandler.base = widgetMeta.registry;
                widgetMeta.registryHandler.on('invalidate', widgetMeta.invalidator);
            }
            widgetMeta.registryHandler = widgetMeta.registryHandler || new _RegistryHandler__WEBPACK_IMPORTED_MODULE_7__["default"]();
            return widgetMeta.registryHandler;
        }
        return null;
    };
});
const defer = factory(({ id }) => {
    const [widgetId] = id.split('-');
    let isDeferred = false;
    return {
        pause() {
            const widgetMeta = widgetMetaMap.get(widgetId);
            if (!isDeferred && widgetMeta) {
                widgetMeta.deferRefs = widgetMeta.deferRefs + 1;
                isDeferred = true;
            }
        },
        resume() {
            const widgetMeta = widgetMetaMap.get(widgetId);
            if (isDeferred && widgetMeta) {
                widgetMeta.deferRefs = widgetMeta.deferRefs - 1;
                isDeferred = false;
            }
        }
    };
});
function renderer(renderer) {
    let _mountOptions = {
        sync: false,
        merge: true,
        transition: undefined,
        domNode: _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.body,
        registry: new _Registry__WEBPACK_IMPORTED_MODULE_5__["Registry"]()
    };
    let _invalidationQueue = [];
    let _processQueue = [];
    let _deferredProcessQueue = [];
    let _applicationQueue = [];
    let _eventMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
    let _idToWrapperMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
    let _wrapperSiblingMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
    let _idToChildrenWrappers = new _shim_Map__WEBPACK_IMPORTED_MODULE_4__["default"]();
    let _insertBeforeMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
    let _nodeToWrapperMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
    let _renderScheduled;
    let _idleCallbacks = [];
    let _deferredRenderCallbacks = [];
    let parentInvalidate;
    let _allMergedNodes = [];
    function nodeOperation(propName, propValue, previousValue, domNode) {
        let result = propValue && !previousValue;
        if (typeof propValue === 'function') {
            result = propValue();
        }
        if (result === true) {
            _deferredRenderCallbacks.push(() => {
                domNode[propName]();
            });
        }
    }
    function updateEvent(domNode, eventName, currentValue, previousValue) {
        if (previousValue) {
            const previousEvent = _eventMap.get(previousValue);
            previousEvent && domNode.removeEventListener(eventName, previousEvent);
        }
        let callback = currentValue;
        if (eventName === 'input') {
            callback = function (evt) {
                currentValue.call(this, evt);
                evt.target['oninput-value'] = evt.target.value;
            };
        }
        domNode.addEventListener(eventName, callback);
        _eventMap.set(currentValue, callback);
    }
    function removeOrphanedEvents(domNode, previousProperties, properties, onlyEvents = false) {
        Object.keys(previousProperties).forEach((propName) => {
            const isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
            const eventName = onlyEvents ? propName : propName.substr(2);
            if (isEvent && !properties[propName]) {
                const eventCallback = _eventMap.get(previousProperties[propName]);
                if (eventCallback) {
                    domNode.removeEventListener(eventName, eventCallback);
                }
            }
        });
    }
    function resolveRegistryItem(wrapper, instance, id) {
        if (!Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidget"])(wrapper.node.widgetConstructor)) {
            const owningNode = _nodeToWrapperMap.get(wrapper.node);
            if (owningNode) {
                if (owningNode.instance) {
                    instance = owningNode.instance;
                }
                else {
                    id = owningNode.id;
                }
            }
            let registry;
            if (instance) {
                const instanceData = widgetInstanceMap.get(instance);
                if (instanceData) {
                    registry = instanceData.registry;
                }
            }
            else if (id !== undefined) {
                const widgetMeta = widgetMetaMap.get(id);
                if (widgetMeta) {
                    if (!widgetMeta.registryHandler) {
                        widgetMeta.registryHandler = new _RegistryHandler__WEBPACK_IMPORTED_MODULE_7__["default"]();
                        widgetMeta.registryHandler.base = widgetMeta.registry;
                        widgetMeta.registryHandler.on('invalidate', widgetMeta.invalidator);
                    }
                    registry = widgetMeta.registryHandler;
                }
            }
            if (registry) {
                let registryLabel;
                if (isLazyDefine(wrapper.node.widgetConstructor)) {
                    const { label, registryItem } = wrapper.node.widgetConstructor;
                    if (!registry.has(label)) {
                        registry.define(label, registryItem);
                    }
                    registryLabel = label;
                }
                else {
                    registryLabel = wrapper.node.widgetConstructor;
                }
                let item = registry.get(registryLabel);
                if (Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWNodeFactory"])(item)) {
                    const node = item(wrapper.node.properties, wrapper.node.children);
                    if (Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidgetFunction"])(node.widgetConstructor)) {
                        wrapper.registryItem = node.widgetConstructor;
                    }
                }
                else {
                    wrapper.registryItem = item;
                }
            }
        }
    }
    function mapNodeToInstance(nodes, wrapper) {
        while (nodes.length) {
            let node = nodes.pop();
            if (isWNode(node) || isVNode(node)) {
                if (!_nodeToWrapperMap.has(node)) {
                    _nodeToWrapperMap.set(node, wrapper);
                    if (node.children && node.children.length) {
                        nodes = [...nodes, ...node.children];
                    }
                }
            }
        }
    }
    function renderedToWrapper(rendered, parent, currentParent) {
        const { requiresInsertBefore, hasPreviousSiblings, namespace, depth } = parent;
        const wrappedRendered = [];
        const hasParentWNode = isWNodeWrapper(parent);
        const hasVirtualParentNode = isVirtualWrapper(parent);
        const currentParentChildren = (isVNodeWrapper(currentParent) && _idToChildrenWrappers.get(currentParent.id)) || [];
        const hasCurrentParentChildren = currentParentChildren.length > 0;
        const insertBefore = ((requiresInsertBefore || hasPreviousSiblings !== false) && (hasParentWNode || hasVirtualParentNode)) ||
            (hasCurrentParentChildren && rendered.length > 1);
        let previousItem;
        if (isWNodeWrapper(parent) && rendered.length) {
            mapNodeToInstance([...rendered], parent);
        }
        for (let i = 0; i < rendered.length; i++) {
            let renderedItem = rendered[i];
            if (!renderedItem || renderedItem === true) {
                continue;
            }
            if (typeof renderedItem === 'string') {
                renderedItem = toTextVNode(renderedItem);
            }
            const owningNode = _nodeToWrapperMap.get(renderedItem);
            const wrapper = {
                node: renderedItem,
                depth: depth + 1,
                order: i,
                parentId: parent.id,
                requiresInsertBefore: insertBefore,
                hasParentWNode,
                namespace: namespace
            };
            if (isVNode(renderedItem)) {
                if (renderedItem.deferredPropertiesCallback) {
                    wrapper.deferredProperties = renderedItem.deferredPropertiesCallback(false);
                }
                if (renderedItem.properties.exitAnimation) {
                    parent.hasAnimations = true;
                    let nextParent = _idToWrapperMap.get(parent.parentId);
                    while (nextParent) {
                        if (nextParent.hasAnimations) {
                            break;
                        }
                        nextParent.hasAnimations = true;
                        nextParent = _idToWrapperMap.get(nextParent.parentId);
                    }
                }
            }
            if (owningNode) {
                wrapper.owningId = owningNode.id;
            }
            if (isWNode(renderedItem)) {
                resolveRegistryItem(wrapper, parent.instance, parent.id);
            }
            if (previousItem) {
                _wrapperSiblingMap.set(previousItem, wrapper);
            }
            wrappedRendered.push(wrapper);
            previousItem = wrapper;
        }
        return wrappedRendered;
    }
    function findParentDomNode(currentNode) {
        let parentDomNode;
        let parentWrapper = _idToWrapperMap.get(currentNode.parentId);
        while (!parentDomNode && parentWrapper) {
            if (!parentDomNode &&
                isVNodeWrapper(parentWrapper) &&
                !isVirtualWrapper(parentWrapper) &&
                parentWrapper.domNode) {
                parentDomNode = parentWrapper.domNode;
            }
            parentWrapper = _idToWrapperMap.get(parentWrapper.parentId);
        }
        return parentDomNode;
    }
    function runDeferredProperties(next) {
        const { deferredPropertiesCallback } = next.node;
        if (deferredPropertiesCallback) {
            const properties = next.node.properties;
            _deferredRenderCallbacks.push(() => {
                if (_idToWrapperMap.has(next.owningId)) {
                    const deferredProperties = next.deferredProperties;
                    next.deferredProperties = deferredPropertiesCallback(true);
                    processProperties(next, {
                        properties: Object.assign({}, deferredProperties, properties)
                    });
                }
            });
        }
    }
    function findInsertBefore(next) {
        let insertBefore = null;
        let searchNode = next;
        while (!insertBefore) {
            const nextSibling = _wrapperSiblingMap.get(searchNode);
            if (nextSibling) {
                let domNode = nextSibling.domNode;
                if ((isWNodeWrapper(nextSibling) || isVirtualWrapper(nextSibling)) && nextSibling.childDomWrapperId) {
                    const childWrapper = _idToWrapperMap.get(nextSibling.childDomWrapperId);
                    if (childWrapper) {
                        domNode = childWrapper.domNode;
                    }
                }
                if (domNode && domNode.parentNode) {
                    insertBefore = domNode;
                    break;
                }
                searchNode = nextSibling;
                continue;
            }
            searchNode = searchNode && _idToWrapperMap.get(searchNode.parentId);
            if (!searchNode || (isVNodeWrapper(searchNode) && !isVirtualWrapper(searchNode))) {
                break;
            }
        }
        return insertBefore;
    }
    function setValue(domNode, propValue, previousValue) {
        const domValue = domNode.value;
        const onInputValue = domNode['oninput-value'];
        const onSelectValue = domNode['select-value'];
        if (onSelectValue && domValue !== onSelectValue) {
            domNode.value = onSelectValue;
            if (domNode.value === onSelectValue) {
                domNode['select-value'] = undefined;
            }
        }
        else if ((onInputValue && domValue === onInputValue) || propValue !== previousValue) {
            domNode.value = propValue;
            domNode['oninput-value'] = undefined;
        }
    }
    function setProperties(domNode, currentProperties = {}, nextWrapper, includesEventsAndAttributes = true) {
        const properties = nextWrapper.deferredProperties
            ? Object.assign({}, nextWrapper.deferredProperties, nextWrapper.node.properties) : nextWrapper.node.properties;
        const propNames = Object.keys(properties);
        const propCount = propNames.length;
        if (propNames.indexOf('classes') === -1 && currentProperties.classes) {
            domNode.removeAttribute('class');
        }
        includesEventsAndAttributes && removeOrphanedEvents(domNode, currentProperties, properties);
        for (let i = 0; i < propCount; i++) {
            const propName = propNames[i];
            let propValue = properties[propName];
            const previousValue = currentProperties[propName];
            if (propName === 'classes') {
                const previousClassString = createClassPropValue(previousValue);
                let currentClassString = createClassPropValue(propValue);
                if (previousClassString !== currentClassString) {
                    if (currentClassString) {
                        if (nextWrapper.merged) {
                            const domClasses = (domNode.getAttribute('class') || '').split(' ');
                            for (let i = 0; i < domClasses.length; i++) {
                                if (currentClassString.indexOf(domClasses[i]) === -1) {
                                    currentClassString = `${domClasses[i]} ${currentClassString}`;
                                }
                            }
                        }
                        domNode.setAttribute('class', currentClassString);
                    }
                    else {
                        domNode.removeAttribute('class');
                    }
                }
            }
            else if (nodeOperations.indexOf(propName) !== -1) {
                nodeOperation(propName, propValue, previousValue, domNode);
            }
            else if (propName === 'styles') {
                const styleNames = Object.keys(propValue);
                const styleCount = styleNames.length;
                for (let j = 0; j < styleCount; j++) {
                    const styleName = styleNames[j];
                    const newStyleValue = propValue[styleName];
                    const oldStyleValue = previousValue && previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    domNode.style[styleName] = newStyleValue || '';
                }
            }
            else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') {
                    if (domNode.tagName === 'SELECT') {
                        domNode['select-value'] = propValue;
                    }
                    setValue(domNode, propValue, previousValue);
                }
                else if (propName !== 'key' && propValue !== previousValue) {
                    const type = typeof propValue;
                    if (type === 'function' && propName.lastIndexOf('on', 0) === 0 && includesEventsAndAttributes) {
                        updateEvent(domNode, propName.substr(2), propValue, previousValue);
                    }
                    else if (type === 'string' && propName !== 'innerHTML' && includesEventsAndAttributes) {
                        updateAttribute(domNode, propName, propValue, nextWrapper.namespace);
                    }
                    else if (propName === 'scrollLeft' || propName === 'scrollTop') {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    else {
                        domNode[propName] = propValue;
                    }
                }
            }
        }
    }
    function runDeferredRenderCallbacks() {
        const { sync } = _mountOptions;
        const callbacks = _deferredRenderCallbacks;
        _deferredRenderCallbacks = [];
        if (callbacks.length) {
            const run = () => {
                let callback;
                while ((callback = callbacks.shift())) {
                    callback();
                }
            };
            if (sync) {
                run();
            }
            else {
                _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].requestAnimationFrame(run);
            }
        }
    }
    function runAfterRenderCallbacks() {
        const { sync } = _mountOptions;
        const callbacks = _idleCallbacks;
        _idleCallbacks = [];
        if (callbacks.length) {
            const run = () => {
                let callback;
                while ((callback = callbacks.shift())) {
                    callback();
                }
            };
            if (sync) {
                run();
            }
            else {
                if (_shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].requestIdleCallback) {
                    _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].requestIdleCallback(run);
                }
                else {
                    setTimeout(run);
                }
            }
        }
    }
    function processProperties(next, previousProperties) {
        if (next.node.attributes && next.node.events) {
            updateAttributes(next.domNode, previousProperties.attributes || {}, next.node.attributes, next.namespace);
            setProperties(next.domNode, previousProperties.properties, next, false);
            const events = next.node.events || {};
            if (previousProperties.events) {
                removeOrphanedEvents(next.domNode, previousProperties.events || {}, next.node.events, true);
            }
            previousProperties.events = previousProperties.events || {};
            Object.keys(events).forEach((event) => {
                updateEvent(next.domNode, event, events[event], previousProperties.events[event]);
            });
        }
        else {
            setProperties(next.domNode, previousProperties.properties, next);
        }
    }
    function mount(mountOptions = {}) {
        _mountOptions = Object.assign({}, _mountOptions, mountOptions);
        const { domNode } = _mountOptions;
        const renderResult = wrapNodes(renderer)({});
        const nextWrapper = {
            id: `${wrapperId++}`,
            node: renderResult,
            order: 0,
            depth: 1,
            owningId: '-1',
            parentId: '-1',
            siblingId: '-1',
            properties: {}
        };
        _idToWrapperMap.set('-1', {
            id: `-1`,
            depth: 0,
            order: 0,
            owningId: '',
            domNode,
            node: v('fake'),
            parentId: '-1'
        });
        _processQueue.push({
            current: [],
            next: [nextWrapper],
            meta: { mergeNodes: arrayFrom(domNode.childNodes) }
        });
        _runProcessQueue();
        _runDomInstructionQueue();
        _cleanUpMergedNodes();
        _insertBeforeMap = undefined;
        _runCallbacks();
    }
    function invalidate() {
        parentInvalidate && parentInvalidate();
    }
    function _schedule() {
        const { sync } = _mountOptions;
        if (sync) {
            _runInvalidationQueue();
        }
        else if (!_renderScheduled) {
            _renderScheduled = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].requestAnimationFrame(() => {
                _runInvalidationQueue();
            });
        }
    }
    function getWNodeWrapper(id) {
        const wrapper = _idToWrapperMap.get(id);
        if (wrapper && isWNodeWrapper(wrapper)) {
            return wrapper;
        }
    }
    function _runInvalidationQueue() {
        _renderScheduled = undefined;
        let invalidationQueue = [..._invalidationQueue];
        const previouslyRendered = [];
        _invalidationQueue = [];
        invalidationQueue.sort((a, b) => {
            let result = b.depth - a.depth;
            if (result === 0) {
                result = b.order - a.order;
            }
            return result;
        });
        if (_deferredProcessQueue.length) {
            _processQueue = [..._deferredProcessQueue];
            _deferredProcessQueue = [];
            _runProcessQueue();
            if (_deferredProcessQueue.length) {
                _invalidationQueue = [...invalidationQueue];
                invalidationQueue = [];
            }
        }
        let item;
        while ((item = invalidationQueue.pop())) {
            let { id } = item;
            const current = getWNodeWrapper(id);
            if (!current || previouslyRendered.indexOf(id) !== -1 || !_idToWrapperMap.has(current.parentId)) {
                continue;
            }
            previouslyRendered.push(id);
            const sibling = _wrapperSiblingMap.get(current);
            const next = {
                node: {
                    type: WNODE,
                    widgetConstructor: current.node.widgetConstructor,
                    properties: current.properties || {},
                    children: current.node.children || []
                },
                instance: current.instance,
                id: current.id,
                properties: current.properties,
                depth: current.depth,
                order: current.order,
                owningId: current.owningId,
                parentId: current.parentId,
                registryItem: current.registryItem
            };
            sibling && _wrapperSiblingMap.set(next, sibling);
            const result = _updateWidget({ current, next });
            if (result && result.item) {
                _processQueue.push(result.item);
                _idToWrapperMap.set(id, next);
                _runProcessQueue();
            }
        }
        _runDomInstructionQueue();
        _cleanUpMergedNodes();
        _runCallbacks();
    }
    function _cleanUpMergedNodes() {
        if (_deferredProcessQueue.length === 0) {
            let mergedNode;
            while ((mergedNode = _allMergedNodes.pop())) {
                mergedNode.parentNode && mergedNode.parentNode.removeChild(mergedNode);
            }
            _mountOptions.merge = false;
        }
    }
    function _runProcessQueue() {
        let item;
        while ((item = _processQueue.pop())) {
            if (isAttachApplication(item)) {
                item.type === 'attach' && setDomNodeOnParentWrapper(item.id);
                if (item.instance) {
                    _applicationQueue.push(item);
                }
            }
            else {
                const { current, next, meta } = item;
                _process(current || EMPTY_ARRAY, next || EMPTY_ARRAY, meta);
            }
        }
    }
    function _runDomInstructionQueue() {
        _applicationQueue.reverse();
        let item;
        while ((item = _applicationQueue.pop())) {
            if (item.type === 'create') {
                const { parentDomNode, next, next: { domNode, merged, requiresInsertBefore, node } } = item;
                processProperties(next, { properties: {} });
                runDeferredProperties(next);
                if (!merged) {
                    let insertBefore;
                    if (requiresInsertBefore) {
                        insertBefore = findInsertBefore(next);
                    }
                    else if (_insertBeforeMap) {
                        insertBefore = _insertBeforeMap.get(next);
                    }
                    parentDomNode.insertBefore(domNode, insertBefore);
                    if (isDomVNode(next.node) && next.node.onAttach) {
                        next.node.onAttach();
                    }
                }
                if (domNode.tagName === 'OPTION' && domNode.parentElement) {
                    setValue(domNode.parentElement);
                }
                const { enterAnimation, enterAnimationActive } = node.properties;
                if (_mountOptions.transition && enterAnimation && enterAnimation !== true) {
                    _mountOptions.transition.enter(domNode, enterAnimation, enterAnimationActive);
                }
                const owningWrapper = _nodeToWrapperMap.get(next.node);
                if (owningWrapper && node.properties.key != null) {
                    if (owningWrapper.instance) {
                        const instanceData = widgetInstanceMap.get(owningWrapper.instance);
                        instanceData && instanceData.nodeHandler.add(domNode, `${node.properties.key}`);
                    }
                    else {
                        addNodeToMap(owningWrapper.id, node.properties.key, domNode);
                    }
                }
                item.next.inserted = true;
            }
            else if (item.type === 'update') {
                const { next, next: { domNode }, current, current: { domNode: currentDomNode } } = item;
                if (isTextNode(domNode) && isTextNode(currentDomNode) && domNode !== currentDomNode) {
                    currentDomNode.parentNode && currentDomNode.parentNode.replaceChild(domNode, currentDomNode);
                }
                else {
                    const previousProperties = buildPreviousProperties(domNode, current);
                    processProperties(next, previousProperties);
                    runDeferredProperties(next);
                }
            }
            else if (item.type === 'delete') {
                const { current } = item;
                const { exitAnimation, exitAnimationActive } = current.node.properties;
                if (_mountOptions.transition && exitAnimation && exitAnimation !== true) {
                    _mountOptions.transition.exit(current.domNode, exitAnimation, exitAnimationActive);
                }
                else {
                    current.domNode.parentNode.removeChild(current.domNode);
                }
            }
            else if (item.type === 'attach') {
                const { instance, attached } = item;
                const instanceData = widgetInstanceMap.get(instance);
                if (instanceData) {
                    instanceData.nodeHandler.addRoot();
                    attached && instanceData.onAttach();
                }
            }
            else if (item.type === 'detach') {
                if (item.current.instance) {
                    const instanceData = widgetInstanceMap.get(item.current.instance);
                    instanceData && instanceData.onDetach();
                }
                item.current.instance = undefined;
            }
        }
        if (_deferredProcessQueue.length === 0) {
            _nodeToWrapperMap = new _shim_WeakMap__WEBPACK_IMPORTED_MODULE_2__["default"]();
        }
    }
    function _runCallbacks() {
        runAfterRenderCallbacks();
        runDeferredRenderCallbacks();
    }
    function _processMergeNodes(next, mergeNodes) {
        const { merge } = _mountOptions;
        if (merge && mergeNodes.length) {
            if (isVNodeWrapper(next)) {
                let { node: { tag } } = next;
                for (let i = 0; i < mergeNodes.length; i++) {
                    const domElement = mergeNodes[i];
                    const tagName = domElement.tagName || '';
                    if (tag.toUpperCase() === tagName.toUpperCase()) {
                        const mergeNodeIndex = _allMergedNodes.indexOf(domElement);
                        if (mergeNodeIndex !== -1) {
                            _allMergedNodes.splice(mergeNodeIndex, 1);
                        }
                        mergeNodes.splice(i, 1);
                        next.domNode = domElement;
                        break;
                    }
                }
            }
            else {
                next.mergeNodes = mergeNodes;
            }
        }
    }
    function registerDistinguishableCallback(childNodes, index) {
        _idleCallbacks.push(() => {
            const parentWNodeWrapper = getWNodeWrapper(childNodes[index].owningId);
            checkDistinguishable(childNodes, index, parentWNodeWrapper);
        });
    }
    function createKeyMap(wrappers) {
        const keys = [];
        for (let i = 0; i < wrappers.length; i++) {
            const wrapper = wrappers[i];
            if (wrapper.node.properties.key != null) {
                keys.push(wrapper.node.properties.key);
            }
            else {
                return false;
            }
        }
        return keys;
    }
    function _process(current, next, meta = {}) {
        let { mergeNodes = [], oldIndex = 0, newIndex = 0 } = meta;
        const currentLength = current.length;
        const nextLength = next.length;
        const hasPreviousSiblings = currentLength > 1 || (currentLength > 0 && currentLength < nextLength);
        let instructions = [];
        let replace = false;
        if (oldIndex === 0 && newIndex === 0 && currentLength) {
            const currentKeys = createKeyMap(current);
            if (currentKeys) {
                const nextKeys = createKeyMap(next);
                if (nextKeys) {
                    for (let i = 0; i < currentKeys.length; i++) {
                        if (nextKeys.indexOf(currentKeys[i]) !== -1) {
                            instructions = [];
                            replace = false;
                            break;
                        }
                        replace = true;
                        instructions.push({ current: current[i], next: undefined });
                    }
                }
            }
        }
        if (replace || (currentLength === 0 && !_mountOptions.merge)) {
            for (let i = 0; i < next.length; i++) {
                instructions.push({ current: undefined, next: next[i] });
            }
        }
        else {
            if (newIndex < nextLength) {
                let currentWrapper = oldIndex < currentLength ? current[oldIndex] : undefined;
                const nextWrapper = next[newIndex];
                nextWrapper.hasPreviousSiblings = hasPreviousSiblings;
                _processMergeNodes(nextWrapper, mergeNodes);
                if (currentWrapper && same(currentWrapper, nextWrapper)) {
                    oldIndex++;
                    newIndex++;
                    if (isVNodeWrapper(currentWrapper) && isVNodeWrapper(nextWrapper)) {
                        nextWrapper.inserted = currentWrapper.inserted;
                    }
                    instructions.push({ current: currentWrapper, next: nextWrapper });
                }
                else if (!currentWrapper || findIndexOfChild(current, nextWrapper, oldIndex + 1) === -1) {
                     true && current.length && registerDistinguishableCallback(next, newIndex);
                    instructions.push({ current: undefined, next: nextWrapper });
                    newIndex++;
                }
                else if (findIndexOfChild(next, currentWrapper, newIndex + 1) === -1) {
                     true && registerDistinguishableCallback(current, oldIndex);
                    instructions.push({ current: currentWrapper, next: undefined });
                    oldIndex++;
                }
                else {
                     true && registerDistinguishableCallback(next, newIndex);
                     true && registerDistinguishableCallback(current, oldIndex);
                    instructions.push({ current: currentWrapper, next: undefined });
                    instructions.push({ current: undefined, next: nextWrapper });
                    oldIndex++;
                    newIndex++;
                }
            }
            if (newIndex < nextLength) {
                _processQueue.push({ current, next, meta: { mergeNodes, oldIndex, newIndex } });
            }
            if (currentLength > oldIndex && newIndex >= nextLength) {
                for (let i = oldIndex; i < currentLength; i++) {
                     true && registerDistinguishableCallback(current, i);
                    instructions.push({ current: current[i], next: undefined });
                }
            }
        }
        for (let i = 0; i < instructions.length; i++) {
            const result = _processOne(instructions[i]);
            if (result === false) {
                if (_mountOptions.merge && mergeNodes.length) {
                    if (newIndex < nextLength) {
                        _processQueue.pop();
                    }
                    _processQueue.push({ next, current, meta });
                    _deferredProcessQueue = _processQueue;
                    _processQueue = [];
                    break;
                }
                continue;
            }
            const { widget, item, dom } = result;
            widget && _processQueue.push(widget);
            item && _processQueue.push(item);
            dom && _applicationQueue.push(dom);
        }
    }
    function _processOne({ current, next }) {
        if (current !== next) {
            if (!current && next) {
                if (isVNodeWrapper(next)) {
                    return _createDom({ next });
                }
                else {
                    return _createWidget({ next });
                }
            }
            else if (current && next) {
                if (isVNodeWrapper(current) && isVNodeWrapper(next)) {
                    return _updateDom({ current, next });
                }
                else if (isWNodeWrapper(current) && isWNodeWrapper(next)) {
                    return _updateWidget({ current, next });
                }
            }
            else if (current && !next) {
                if (isVNodeWrapper(current)) {
                    return _removeDom({ current });
                }
                else if (isWNodeWrapper(current)) {
                    return _removeWidget({ current });
                }
            }
        }
        return {};
    }
    function resolveMiddleware(middlewares, id, middlewareIds = []) {
        const keys = Object.keys(middlewares);
        const results = {};
        const uniqueId = `${id}-${metaId++}`;
        for (let i = 0; i < keys.length; i++) {
            const middleware = middlewares[keys[i]]();
            const payload = {
                id: uniqueId,
                properties: () => {
                    const widgetMeta = widgetMetaMap.get(id);
                    if (widgetMeta) {
                        return Object.assign({}, widgetMeta.properties);
                    }
                    return {};
                },
                children: () => {
                    const widgetMeta = widgetMetaMap.get(id);
                    if (widgetMeta) {
                        return widgetMeta.children;
                    }
                    return [];
                }
            };
            if (middleware.middlewares) {
                const { middlewares: resolvedMiddleware } = resolveMiddleware(middleware.middlewares, id, middlewareIds);
                payload.middleware = resolvedMiddleware;
                results[keys[i]] = middleware.callback(payload);
            }
            else {
                results[keys[i]] = middleware.callback(payload);
            }
        }
        middlewareIds.push(uniqueId);
        return { middlewares: results, ids: middlewareIds };
    }
    function _createWidget({ next }) {
        let { node: { widgetConstructor } } = next;
        let { registry } = _mountOptions;
        let Constructor = next.registryItem || widgetConstructor;
        if (!Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidget"])(Constructor)) {
            resolveRegistryItem(next);
            if (!next.registryItem) {
                return false;
            }
            Constructor = next.registryItem;
        }
        let rendered;
        let invalidate;
        next.properties = next.node.properties;
        next.id = next.id || `${wrapperId++}`;
        _idToWrapperMap.set(next.id, next);
        const { id, depth, order } = next;
        if (!Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidgetBaseConstructor"])(Constructor)) {
            let widgetMeta = widgetMetaMap.get(id);
            if (!widgetMeta) {
                invalidate = () => {
                    const widgetMeta = widgetMetaMap.get(id);
                    if (widgetMeta) {
                        widgetMeta.dirty = true;
                        if (!widgetMeta.rendering && _idToWrapperMap.has(id)) {
                            _invalidationQueue.push({ id, depth, order });
                            _schedule();
                        }
                    }
                };
                widgetMeta = {
                    mountNode: _mountOptions.domNode,
                    dirty: false,
                    invalidator: invalidate,
                    properties: next.node.properties,
                    children: next.node.children,
                    deferRefs: 0,
                    rendering: true,
                    middleware: {},
                    middlewareIds: [],
                    registry: _mountOptions.registry
                };
                widgetMetaMap.set(next.id, widgetMeta);
                if (Constructor.middlewares) {
                    const { middlewares, ids } = resolveMiddleware(Constructor.middlewares, id);
                    widgetMeta.middleware = middlewares;
                    widgetMeta.middlewareIds = ids;
                }
            }
            else {
                invalidate = widgetMeta.invalidator;
            }
            rendered = Constructor({
                id,
                properties: () => next.node.properties,
                children: () => next.node.children,
                middleware: widgetMeta.middleware
            });
            widgetMeta.rendering = false;
            if (widgetMeta.deferRefs > 0) {
                return false;
            }
        }
        else {
            let instance = new Constructor();
            instance.registry.base = registry;
            const instanceData = widgetInstanceMap.get(instance);
            invalidate = () => {
                instanceData.dirty = true;
                if (!instanceData.rendering && _idToWrapperMap.has(id)) {
                    _invalidationQueue.push({ id, depth, order });
                    _schedule();
                }
            };
            instanceData.invalidate = invalidate;
            instanceData.rendering = true;
            instance.__setProperties__(next.node.properties);
            instance.__setChildren__(next.node.children);
            next.instance = instance;
            rendered = instance.__render__();
            instanceData.rendering = false;
        }
        let children;
        if (rendered) {
            rendered = Array.isArray(rendered) ? rendered : [rendered];
            children = renderedToWrapper(rendered, next, null);
            _idToChildrenWrappers.set(id, children);
        }
        if (!parentInvalidate && !Constructor.isWNodeWrapper) {
            parentInvalidate = invalidate;
        }
        return {
            item: {
                next: children,
                meta: { mergeNodes: next.mergeNodes }
            },
            widget: { type: 'attach', instance: next.instance, id, attached: true }
        };
    }
    function _updateWidget({ current, next }) {
        current = getWNodeWrapper(current.id) || current;
        const { instance, domNode, hasAnimations } = current;
        let { node: { widgetConstructor } } = next;
        const Constructor = next.registryItem || widgetConstructor;
        if (!Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidget"])(Constructor)) {
            return {};
        }
        let rendered;
        let processResult = {};
        let didRender = false;
        let currentChildren = _idToChildrenWrappers.get(current.id);
        next.hasAnimations = hasAnimations;
        next.id = current.id;
        next.childDomWrapperId = current.childDomWrapperId;
        next.properties = next.node.properties;
        _wrapperSiblingMap.delete(current);
        if (domNode && domNode.parentNode) {
            next.domNode = domNode;
        }
        if (!Object(_Registry__WEBPACK_IMPORTED_MODULE_5__["isWidgetBaseConstructor"])(Constructor)) {
            const widgetMeta = widgetMetaMap.get(next.id);
            if (widgetMeta) {
                widgetMeta.properties = next.properties;
                widgetMeta.rendering = true;
                runDiffs(widgetMeta, current.properties, next.properties);
                if (current.node.children.length > 0 || next.node.children.length > 0) {
                    widgetMeta.dirty = true;
                }
                if (!widgetMeta.dirty) {
                    propertiesDiff(current.properties, next.properties, () => {
                        widgetMeta.dirty = true;
                    }, widgetMeta.customDiffProperties ? [...widgetMeta.customDiffProperties.values()] : []);
                }
                if (widgetMeta.dirty) {
                    _idToChildrenWrappers.delete(next.id);
                    didRender = true;
                    widgetMeta.dirty = false;
                    rendered = Constructor({
                        id: next.id,
                        properties: () => next.node.properties,
                        children: () => next.node.children,
                        middleware: widgetMeta.middleware
                    });
                    if (widgetMeta.deferRefs > 0) {
                        rendered = null;
                    }
                }
                widgetMeta.rendering = false;
            }
        }
        else {
            const instanceData = widgetInstanceMap.get(instance);
            next.instance = instance;
            instanceData.rendering = true;
            instance.__setProperties__(next.node.properties);
            instance.__setChildren__(next.node.children);
            if (instanceData.dirty) {
                didRender = true;
                _idToChildrenWrappers.delete(next.id);
                rendered = instance.__render__();
            }
            instanceData.rendering = false;
        }
        _idToWrapperMap.set(next.id, next);
        processResult.widget = { type: 'attach', instance, id: next.id, attached: false };
        let children;
        if (rendered) {
            rendered = Array.isArray(rendered) ? rendered : [rendered];
            children = renderedToWrapper(rendered, next, current);
            _idToChildrenWrappers.set(next.id, children);
        }
        if (didRender) {
            processResult.item = {
                current: currentChildren,
                next: children,
                meta: {}
            };
        }
        return processResult;
    }
    function _removeWidget({ current }) {
        current = getWNodeWrapper(current.id) || current;
        _idToWrapperMap.delete(current.id);
        const meta = widgetMetaMap.get(current.id);
        let currentChildren = _idToChildrenWrappers.get(current.id);
        _idToChildrenWrappers.delete(current.id);
        _wrapperSiblingMap.delete(current);
        let processResult = {
            item: {
                current: currentChildren,
                meta: {}
            }
        };
        if (meta) {
            meta.registryHandler && meta.registryHandler.destroy();
            destroyHandles(meta);
            widgetMetaMap.delete(current.id);
        }
        else {
            processResult.widget = { type: 'detach', current, instance: current.instance };
        }
        return processResult;
    }
    function setDomNodeOnParentWrapper(id) {
        let wrapper = _idToWrapperMap.get(id);
        let children = [...(_idToChildrenWrappers.get(id) || [])];
        let child;
        while (children.length && !wrapper.domNode) {
            child = children.shift();
            if (child) {
                if (child.domNode) {
                    wrapper.childDomWrapperId = child.id;
                    break;
                }
                let nextChildren = _idToChildrenWrappers.get(child.id);
                if (nextChildren) {
                    children = [...nextChildren, ...children];
                }
            }
        }
    }
    function _createDom({ next }) {
        const parentDomNode = findParentDomNode(next);
        const isVirtual = isVirtualWrapper(next);
        const isBody = isBodyWrapper(next);
        let mergeNodes = [];
        next.id = `${wrapperId++}`;
        _idToWrapperMap.set(next.id, next);
        if (!next.domNode) {
            if (next.node.domNode) {
                next.domNode = next.node.domNode;
            }
            else {
                if (next.node.tag === 'svg') {
                    next.namespace = NAMESPACE_SVG;
                }
                if (isBody) {
                    next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.body;
                }
                else if (next.node.tag && !isVirtual) {
                    if (next.namespace) {
                        next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElementNS(next.namespace, next.node.tag);
                    }
                    else {
                        next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.createElement(next.node.tag);
                    }
                }
                else if (next.node.text != null) {
                    next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.createTextNode(next.node.text);
                }
            }
            if (_insertBeforeMap && _allMergedNodes.length) {
                if (parentDomNode === _allMergedNodes[0].parentNode) {
                    _insertBeforeMap.set(next, _allMergedNodes[0]);
                }
            }
        }
        else if (_mountOptions.merge) {
            next.merged = true;
            if (isTextNode(next.domNode)) {
                if (next.domNode.data !== next.node.text) {
                    _allMergedNodes = [next.domNode, ..._allMergedNodes];
                    next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.createTextNode(next.node.text);
                    next.merged = false;
                }
            }
            else {
                mergeNodes = arrayFrom(next.domNode.childNodes);
                _allMergedNodes = [..._allMergedNodes, ...mergeNodes];
            }
        }
        let children;
        if (next.domNode || isVirtual) {
            if (next.node.children && next.node.children.length) {
                children = renderedToWrapper(next.node.children, next, null);
                _idToChildrenWrappers.set(next.id, children);
            }
        }
        const dom = isVirtual || isBody
            ? undefined
            : {
                next: next,
                parentDomNode: parentDomNode,
                type: 'create'
            };
        if (children) {
            return {
                item: {
                    current: [],
                    next: children,
                    meta: { mergeNodes }
                },
                dom,
                widget: isVirtual ? { type: 'attach', id: next.id, attached: false } : undefined
            };
        }
        return { dom };
    }
    function _updateDom({ current, next }) {
        next.domNode = current.domNode;
        next.namespace = current.namespace;
        next.id = current.id;
        next.childDomWrapperId = current.childDomWrapperId;
        let children;
        let currentChildren = _idToChildrenWrappers.get(next.id);
        if (next.node.text != null && next.node.text !== current.node.text) {
            next.domNode = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].document.createTextNode(next.node.text);
        }
        else if (next.node.children) {
            children = renderedToWrapper(next.node.children, next, current);
            _idToChildrenWrappers.set(next.id, children);
        }
        _wrapperSiblingMap.delete(current);
        _idToWrapperMap.set(next.id, next);
        return {
            item: {
                current: currentChildren,
                next: children,
                meta: {}
            },
            dom: { type: 'update', next, current }
        };
    }
    function _removeDom({ current }) {
        const isVirtual = isVirtualWrapper(current);
        const isBody = isBodyWrapper(current);
        const children = _idToChildrenWrappers.get(current.id);
        _idToChildrenWrappers.delete(current.id);
        _idToWrapperMap.delete(current.id);
        _wrapperSiblingMap.delete(current);
        if (current.node.properties.key) {
            const widgetMeta = widgetMetaMap.get(current.owningId);
            const parentWrapper = getWNodeWrapper(current.owningId);
            if (widgetMeta) {
                widgetMeta.nodeMap && widgetMeta.nodeMap.delete(current.node.properties.key);
            }
            else if (parentWrapper && parentWrapper.instance) {
                const instanceData = widgetInstanceMap.get(parentWrapper.instance);
                instanceData && instanceData.nodeHandler.remove(current.node.properties.key);
            }
        }
        if (current.hasAnimations || isVirtual || isBody) {
            return {
                item: { current: children, meta: {} },
                dom: isVirtual || isBody ? undefined : { type: 'delete', current }
            };
        }
        if (children) {
            _deferredRenderCallbacks.push(() => {
                let wrappers = children || [];
                let wrapper;
                let bodyIds = [];
                while ((wrapper = wrappers.pop())) {
                    if (isWNodeWrapper(wrapper)) {
                        wrapper = getWNodeWrapper(wrapper.id) || wrapper;
                        if (wrapper.instance) {
                            const instanceData = widgetInstanceMap.get(wrapper.instance);
                            instanceData && instanceData.onDetach();
                            wrapper.instance = undefined;
                        }
                        else {
                            const meta = widgetMetaMap.get(wrapper.id);
                            if (meta) {
                                meta.registryHandler && meta.registryHandler.destroy();
                                destroyHandles(meta);
                                widgetMetaMap.delete(wrapper.id);
                            }
                        }
                    }
                    let wrapperChildren = _idToChildrenWrappers.get(wrapper.id);
                    if (wrapperChildren) {
                        wrappers.push(...wrapperChildren);
                    }
                    if (isBodyWrapper(wrapper)) {
                        bodyIds.push(wrapper.id);
                    }
                    else if (bodyIds.indexOf(wrapper.parentId) !== -1) {
                        if (isWNodeWrapper(wrapper) || isVirtualWrapper(wrapper)) {
                            bodyIds.push(wrapper.id);
                        }
                        else if (wrapper.domNode && wrapper.domNode.parentNode) {
                            wrapper.domNode.parentNode.removeChild(wrapper.domNode);
                        }
                    }
                    _idToChildrenWrappers.delete(wrapper.id);
                    _idToWrapperMap.delete(wrapper.id);
                }
            });
        }
        return {
            dom: { type: 'delete', current }
        };
    }
    return {
        mount,
        invalidate
    };
}
/* harmony default export */ __webpack_exports__["default"] = (renderer);


/***/ }),

/***/ "./node_modules/@dojo/framework/i18n/cldr/load.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@dojo/framework/i18n/cldr/load.mjs ***!
  \*********************************************************/
/*! exports provided: mainPackages, supplementalPackages, isLoaded, default, reset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mainPackages", function() { return mainPackages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supplementalPackages", function() { return supplementalPackages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLoaded", function() { return isLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loadCldrData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reset", function() { return reset; });
/* harmony import */ var cldrjs_dist_cldr_unresolved__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cldrjs/dist/cldr/unresolved */ "./node_modules/cldrjs/dist/cldr/unresolved.js");
/* harmony import */ var cldrjs_dist_cldr_unresolved__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cldrjs_dist_cldr_unresolved__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var globalize_dist_globalize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! globalize/dist/globalize */ "./node_modules/globalize/dist/globalize.js");
/* harmony import */ var globalize_dist_globalize__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(globalize_dist_globalize__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _locales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./locales */ "./node_modules/@dojo/framework/i18n/cldr/locales.mjs");
/* harmony import */ var _util_main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/main */ "./node_modules/@dojo/framework/i18n/util/main.mjs");
// required for Globalize/Cldr to properly resolve locales in the browser.




/**
 * A list of all required CLDR packages for an individual locale.
 */
const mainPackages = Object.freeze([
    'dates/calendars/gregorian',
    'dates/fields',
    'dates/timeZoneNames',
    'numbers',
    'numbers/currencies',
    'units'
]);
/**
 * A list of all required CLDR supplement packages.
 */
const supplementalPackages = Object.freeze([
    'currencyData',
    'likelySubtags',
    'numberingSystems',
    'plurals-type-cardinal',
    'plurals-type-ordinal',
    'timeData',
    'weekData'
]);
/**
 * @private
 * A simple map containing boolean flags indicating whether a particular CLDR package has been loaded.
 */
const loadCache = {
    main: Object.create(null),
    supplemental: generateSupplementalCache()
};
/**
 * @private
 * Generate the locale-specific data cache from a list of keys. Nested objects will be generated from
 * slash-separated strings.
 *
 * @param cache
 * An empty locale cache object.
 *
 * @param keys
 * The list of keys.
 */
function generateLocaleCache(cache, keys) {
    return keys.reduce((tree, key) => {
        const parts = key.split('/');
        if (parts.length === 1) {
            tree[key] = false;
            return tree;
        }
        parts.reduce((tree, key, i) => {
            if (typeof tree[key] !== 'object') {
                tree[key] = i === parts.length - 1 ? false : Object.create(null);
            }
            return tree[key];
        }, tree);
        return tree;
    }, cache);
}
/**
 * @private
 * Generate the supplemental data cache.
 */
function generateSupplementalCache() {
    return supplementalPackages.reduce((map, key) => {
        map[key] = false;
        return map;
    }, Object.create(null));
}
/**
 * @private
 * Recursively determine whether a list of packages have been loaded for the specified CLDR group.
 *
 * @param group
 * The CLDR group object (e.g., the supplemental data, or a specific locale group)
 *
 * @param args
 * A list of keys to recursively check from left to right. For example, if [ "en", "numbers" ],
 * then `group.en.numbers` must exist for the test to pass.
 *
 * @return
 * `true` if the deepest value exists; `false` otherwise.
 */
function isLoadedForGroup(group, args) {
    return args.every((arg) => {
        const next = group[arg];
        group = next;
        return Boolean(next);
    });
}
/**
 * @private
 * Recursively flag as loaded all recognized keys on the provided CLDR data object.
 *
 * @param cache
 * The load cache (either the entire object, or a nested segment of it).
 *
 * @param localeData
 * The CLDR data object being loaded (either the entire object, or a nested segment of it).
 */
function registerLocaleData(cache, localeData) {
    Object.keys(localeData).forEach((key) => {
        if (key in cache) {
            const value = cache[key];
            if (typeof value === 'boolean') {
                cache[key] = true;
            }
            else {
                registerLocaleData(value, localeData[key]);
            }
        }
    });
}
/**
 * @private
 * Flag all supplied CLDR packages for a specific locale as loaded.
 *
 * @param data
 * The `main` locale data.
 */
function registerMain(data) {
    if (!data) {
        return;
    }
    Object.keys(data).forEach((locale) => {
        if (_locales__WEBPACK_IMPORTED_MODULE_2__["default"].indexOf(locale) < 0) {
            return;
        }
        let loadedData = loadCache.main[locale];
        if (!loadedData) {
            loadedData = loadCache.main[locale] = generateLocaleCache(Object.create(null), mainPackages);
        }
        registerLocaleData(loadedData, data[locale]);
    });
}
/**
 * @private
 * Flag all supplied CLDR supplemental packages as loaded.
 *
 * @param data
 * The supplemental data.
 */
function registerSupplemental(data) {
    if (!data) {
        return;
    }
    const supplemental = loadCache.supplemental;
    Object.keys(data).forEach((key) => {
        if (key in supplemental) {
            supplemental[key] = true;
        }
    });
}
/**
 * Determine whether a particular CLDR package has been loaded.
 *
 * Example: to check that `supplemental.likelySubtags` has been loaded, `isLoaded` would be called as
 * `isLoaded('supplemental', 'likelySubtags')`.
 *
 * @param groupName
 * The group to check; either "main" or "supplemental".
 *
 * @param ...args
 * Any remaining keys in the path to the desired package.
 *
 * @return
 * `true` if the deepest value exists; `false` otherwise.
 */
function isLoaded(groupName, ...args) {
    let group = loadCache[groupName];
    if (groupName === 'main' && args.length > 0) {
        const locale = args[0];
        if (!Object(_util_main__WEBPACK_IMPORTED_MODULE_3__["validateLocale"])(locale)) {
            return false;
        }
        args = args.slice(1);
        return Object(_util_main__WEBPACK_IMPORTED_MODULE_3__["generateLocales"])(locale).some((locale) => {
            const next = group[locale];
            return next ? isLoadedForGroup(next, args) : false;
        });
    }
    return isLoadedForGroup(group, args);
}
/**
 * Load the specified CLDR data with the i18n ecosystem.
 *
 * @param data
 * A data object containing `main` and/or `supplemental` objects with CLDR data.
 */
function loadCldrData(data) {
    registerMain(data.main);
    registerSupplemental(data.supplemental);
    globalize_dist_globalize__WEBPACK_IMPORTED_MODULE_1__["load"](data);
    return Promise.resolve();
}
/**
 * Clear the load cache, either the entire cache for the specified group. After calling this method,
 * `isLoaded` will return false for keys within the specified group(s).
 *
 * @param group
 * An optional group name. If not provided, then both the "main" and "supplemental" caches will be cleared.
 */
function reset(group) {
    if (group !== 'supplemental') {
        loadCache.main = Object.create(null);
    }
    if (group !== 'main') {
        loadCache.supplemental = generateSupplementalCache();
    }
}


/***/ }),

/***/ "./node_modules/@dojo/framework/i18n/cldr/locales.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/framework/i18n/cldr/locales.mjs ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A list of `cldr-data/main` directories used to load the correct CLDR data for a given locale.
 */
const localesList = [
    'af-NA',
    'af',
    'agq',
    'ak',
    'am',
    'ar-AE',
    'ar-BH',
    'ar-DJ',
    'ar-DZ',
    'ar-EG',
    'ar-EH',
    'ar-ER',
    'ar-IL',
    'ar-IQ',
    'ar-JO',
    'ar-KM',
    'ar-KW',
    'ar-LB',
    'ar-LY',
    'ar-MA',
    'ar-MR',
    'ar-OM',
    'ar-PS',
    'ar-QA',
    'ar-SA',
    'ar-SD',
    'ar-SO',
    'ar-SS',
    'ar-SY',
    'ar-TD',
    'ar-TN',
    'ar-YE',
    'ar',
    'as',
    'asa',
    'ast',
    'az-Cyrl',
    'az-Latn',
    'az',
    'bas',
    'be',
    'bem',
    'bez',
    'bg',
    'bm',
    'bn-IN',
    'bn',
    'bo-IN',
    'bo',
    'br',
    'brx',
    'bs-Cyrl',
    'bs-Latn',
    'bs',
    'ca-AD',
    'ca-ES-VALENCIA',
    'ca-FR',
    'ca-IT',
    'ca',
    'ce',
    'cgg',
    'chr',
    'ckb-IR',
    'ckb',
    'cs',
    'cu',
    'cy',
    'da-GL',
    'da',
    'dav',
    'de-AT',
    'de-BE',
    'de-CH',
    'de-IT',
    'de-LI',
    'de-LU',
    'de',
    'dje',
    'dsb',
    'dua',
    'dyo',
    'dz',
    'ebu',
    'ee-TG',
    'ee',
    'el-CY',
    'el',
    'en-001',
    'en-150',
    'en-AG',
    'en-AI',
    'en-AS',
    'en-AT',
    'en-AU',
    'en-BB',
    'en-BE',
    'en-BI',
    'en-BM',
    'en-BS',
    'en-BW',
    'en-BZ',
    'en-CA',
    'en-CC',
    'en-CH',
    'en-CK',
    'en-CM',
    'en-CX',
    'en-CY',
    'en-DE',
    'en-DG',
    'en-DK',
    'en-DM',
    'en-ER',
    'en-FI',
    'en-FJ',
    'en-FK',
    'en-FM',
    'en-GB',
    'en-GD',
    'en-GG',
    'en-GH',
    'en-GI',
    'en-GM',
    'en-GU',
    'en-GY',
    'en-HK',
    'en-IE',
    'en-IL',
    'en-IM',
    'en-IN',
    'en-IO',
    'en-JE',
    'en-JM',
    'en-KE',
    'en-KI',
    'en-KN',
    'en-KY',
    'en-LC',
    'en-LR',
    'en-LS',
    'en-MG',
    'en-MH',
    'en-MO',
    'en-MP',
    'en-MS',
    'en-MT',
    'en-MU',
    'en-MW',
    'en-MY',
    'en-NA',
    'en-NF',
    'en-NG',
    'en-NL',
    'en-NR',
    'en-NU',
    'en-NZ',
    'en-PG',
    'en-PH',
    'en-PK',
    'en-PN',
    'en-PR',
    'en-PW',
    'en-RW',
    'en-SB',
    'en-SC',
    'en-SD',
    'en-SE',
    'en-SG',
    'en-SH',
    'en-SI',
    'en-SL',
    'en-SS',
    'en-SX',
    'en-SZ',
    'en-TC',
    'en-TK',
    'en-TO',
    'en-TT',
    'en-TV',
    'en-TZ',
    'en-UG',
    'en-UM',
    'en-US-POSIX',
    'en-VC',
    'en-VG',
    'en-VI',
    'en-VU',
    'en-WS',
    'en-ZA',
    'en-ZM',
    'en-ZW',
    'en',
    'eo',
    'es-419',
    'es-AR',
    'es-BO',
    'es-BR',
    'es-CL',
    'es-CO',
    'es-CR',
    'es-CU',
    'es-DO',
    'es-EA',
    'es-EC',
    'es-GQ',
    'es-GT',
    'es-HN',
    'es-IC',
    'es-MX',
    'es-NI',
    'es-PA',
    'es-PE',
    'es-PH',
    'es-PR',
    'es-PY',
    'es-SV',
    'es-US',
    'es-UY',
    'es-VE',
    'es',
    'et',
    'eu',
    'ewo',
    'fa-AF',
    'fa',
    'ff-CM',
    'ff-GN',
    'ff-MR',
    'ff',
    'fi',
    'fil',
    'fo-DK',
    'fo',
    'fr-BE',
    'fr-BF',
    'fr-BI',
    'fr-BJ',
    'fr-BL',
    'fr-CA',
    'fr-CD',
    'fr-CF',
    'fr-CG',
    'fr-CH',
    'fr-CI',
    'fr-CM',
    'fr-DJ',
    'fr-DZ',
    'fr-GA',
    'fr-GF',
    'fr-GN',
    'fr-GP',
    'fr-GQ',
    'fr-HT',
    'fr-KM',
    'fr-LU',
    'fr-MA',
    'fr-MC',
    'fr-MF',
    'fr-MG',
    'fr-ML',
    'fr-MQ',
    'fr-MR',
    'fr-MU',
    'fr-NC',
    'fr-NE',
    'fr-PF',
    'fr-PM',
    'fr-RE',
    'fr-RW',
    'fr-SC',
    'fr-SN',
    'fr-SY',
    'fr-TD',
    'fr-TG',
    'fr-TN',
    'fr-VU',
    'fr-WF',
    'fr-YT',
    'fr',
    'fur',
    'fy',
    'ga',
    'gd',
    'gl',
    'gsw-FR',
    'gsw-LI',
    'gsw',
    'gu',
    'guz',
    'gv',
    'ha-GH',
    'ha-NE',
    'ha',
    'haw',
    'he',
    'hi',
    'hr-BA',
    'hr',
    'hsb',
    'hu',
    'hy',
    'id',
    'ig',
    'ii',
    'is',
    'it-CH',
    'it-SM',
    'it',
    'ja',
    'jgo',
    'jmc',
    'ka',
    'kab',
    'kam',
    'kde',
    'kea',
    'khq',
    'ki',
    'kk',
    'kkj',
    'kl',
    'kln',
    'km',
    'kn',
    'ko-KP',
    'ko',
    'kok',
    'ks',
    'ksb',
    'ksf',
    'ksh',
    'kw',
    'ky',
    'lag',
    'lb',
    'lg',
    'lkt',
    'ln-AO',
    'ln-CF',
    'ln-CG',
    'ln',
    'lo',
    'lrc-IQ',
    'lrc',
    'lt',
    'lu',
    'luo',
    'luy',
    'lv',
    'mas-TZ',
    'mas',
    'mer',
    'mfe',
    'mg',
    'mgh',
    'mgo',
    'mk',
    'ml',
    'mn',
    'mr',
    'ms-BN',
    'ms-SG',
    'ms',
    'mt',
    'mua',
    'my',
    'mzn',
    'naq',
    'nb-SJ',
    'nb',
    'nd',
    'nds-NL',
    'nds',
    'ne-IN',
    'ne',
    'nl-AW',
    'nl-BE',
    'nl-BQ',
    'nl-CW',
    'nl-SR',
    'nl-SX',
    'nl',
    'nmg',
    'nn',
    'nnh',
    'nus',
    'nyn',
    'om-KE',
    'om',
    'or',
    'os-RU',
    'os',
    'pa-Arab',
    'pa-Guru',
    'pa',
    'pl',
    'prg',
    'ps',
    'pt-AO',
    'pt-CH',
    'pt-CV',
    'pt-GQ',
    'pt-GW',
    'pt-LU',
    'pt-MO',
    'pt-MZ',
    'pt-PT',
    'pt-ST',
    'pt-TL',
    'pt',
    'qu-BO',
    'qu-EC',
    'qu',
    'rm',
    'rn',
    'ro-MD',
    'ro',
    'rof',
    'root',
    'ru-BY',
    'ru-KG',
    'ru-KZ',
    'ru-MD',
    'ru-UA',
    'ru',
    'rw',
    'rwk',
    'sah',
    'saq',
    'sbp',
    'se-FI',
    'se-SE',
    'se',
    'seh',
    'ses',
    'sg',
    'shi-Latn',
    'shi-Tfng',
    'shi',
    'si',
    'sk',
    'sl',
    'smn',
    'sn',
    'so-DJ',
    'so-ET',
    'so-KE',
    'so',
    'sq-MK',
    'sq-XK',
    'sq',
    'sr-Cyrl-BA',
    'sr-Cyrl-ME',
    'sr-Cyrl-XK',
    'sr-Cyrl',
    'sr-Latn-BA',
    'sr-Latn-ME',
    'sr-Latn-XK',
    'sr-Latn',
    'sr',
    'sv-AX',
    'sv-FI',
    'sv',
    'sw-CD',
    'sw-KE',
    'sw-UG',
    'sw',
    'ta-LK',
    'ta-MY',
    'ta-SG',
    'ta',
    'te',
    'teo-KE',
    'teo',
    'th',
    'ti-ER',
    'ti',
    'tk',
    'to',
    'tr-CY',
    'tr',
    'twq',
    'tzm',
    'ug',
    'uk',
    'ur-IN',
    'ur',
    'uz-Arab',
    'uz-Cyrl',
    'uz-Latn',
    'uz',
    'vai-Latn',
    'vai-Vaii',
    'vai',
    'vi',
    'vo',
    'vun',
    'wae',
    'xog',
    'yav',
    'yi',
    'yo-BJ',
    'yo',
    'yue',
    'zgh',
    'zh-Hans-HK',
    'zh-Hans-MO',
    'zh-Hans-SG',
    'zh-Hans',
    'zh-Hant-HK',
    'zh-Hant-MO',
    'zh-Hant',
    'zh',
    'zu'
];
/* harmony default export */ __webpack_exports__["default"] = (localesList);


/***/ }),

/***/ "./node_modules/@dojo/framework/i18n/i18n.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/framework/i18n/i18n.mjs ***!
  \****************************************************/
/*! exports provided: useDefault, formatMessage, getCachedMessages, getMessageFormatter, default, invalidate, observeLocale, setLocaleMessages, switchLocale, systemLocale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useDefault", function() { return useDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatMessage", function() { return formatMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCachedMessages", function() { return getCachedMessages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMessageFormatter", function() { return getMessageFormatter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invalidate", function() { return invalidate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "observeLocale", function() { return observeLocale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setLocaleMessages", function() { return setLocaleMessages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchLocale", function() { return switchLocale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "systemLocale", function() { return systemLocale; });
/* harmony import */ var _shim_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _shim_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shim/iterator */ "./node_modules/@dojo/framework/shim/iterator.mjs");
/* harmony import */ var _shim_Map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var _core_Evented__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
/* harmony import */ var _core_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/util */ "./node_modules/@dojo/framework/core/util.mjs");
/* harmony import */ var globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! globalize/dist/globalize/message */ "./node_modules/globalize/dist/globalize/message.js");
/* harmony import */ var globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _cldr_load__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cldr/load */ "./node_modules/@dojo/framework/i18n/cldr/load.mjs");
/* harmony import */ var _util_main__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util/main */ "./node_modules/@dojo/framework/i18n/util/main.mjs");
/* tslint:disable:interface-name */









function useDefault(modules) {
    if (Object(_shim_iterator__WEBPACK_IMPORTED_MODULE_1__["isArrayLike"])(modules)) {
        let processedModules = [];
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            processedModules.push(module.__esModule && module.default ? module.default : module);
        }
        return processedModules;
    }
    else if (Object(_shim_iterator__WEBPACK_IMPORTED_MODULE_1__["isIterable"])(modules)) {
        let processedModules = [];
        for (const module of modules) {
            processedModules.push(module.__esModule && module.default ? module.default : module);
        }
        return processedModules;
    }
    else {
        return modules.__esModule && modules.default ? modules.default : modules;
    }
}
const TOKEN_PATTERN = /\{([a-z0-9_]+)\}/gi;
const bundleMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_2__["default"]();
const formatterMap = new _shim_Map__WEBPACK_IMPORTED_MODULE_2__["default"]();
const localeProducer = new _core_Evented__WEBPACK_IMPORTED_MODULE_3__["default"]();
let rootLocale;
/**
 * Return the bundle's unique identifier, creating one if it does not already exist.
 *
 * @param bundle A message bundle
 * @return The bundle's unique identifier
 */
function getBundleId(bundle) {
    if (bundle.id) {
        return bundle.id;
    }
    const id = Object(_core_util__WEBPACK_IMPORTED_MODULE_5__["uuid"])();
    Object.defineProperty(bundle, 'id', {
        value: id
    });
    return id;
}
/**
 * @private
 * Return a function that formats an ICU-style message, and takes an optional value for token replacement.
 *
 * Usage:
 * const formatter = getMessageFormatter(bundle, 'guestInfo', 'fr');
 * const message = formatter({
 *   host: 'Miles',
 *   gender: 'male',
 *   guest: 'Oscar',
 *   guestCount: '15'
 * });
 *
 * @param id
 * The message's bundle id.
 *
 * @param key
 * The message's key.
 *
 * @param locale
 * An optional locale for the formatter. If no locale is supplied, or if the locale is not supported, the
 * default locale is used.
 *
 * @return
 * The message formatter.
 */
function getIcuMessageFormatter(id, key, locale) {
    locale = Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["normalizeLocale"])(locale || getRootLocale());
    const formatterKey = `${locale}:${id}:${key}`;
    let formatter = formatterMap.get(formatterKey);
    if (formatter) {
        return formatter;
    }
    const globalize = locale !== getRootLocale() ? new globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__(Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["normalizeLocale"])(locale)) : globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__;
    formatter = globalize.messageFormatter(`${id}/${key}`);
    const cached = bundleMap.get(id);
    if (cached && cached.get(locale)) {
        formatterMap.set(formatterKey, formatter);
    }
    return formatter;
}
/**
 * @private
 * Load the specified locale-specific bundles, mapping the default exports to simple `Messages` objects.
 */
function loadLocaleBundles(locales, supported) {
    return Promise.all(supported.map((locale) => locales[locale]())).then((bundles) => {
        return bundles.map((bundle) => useDefault(bundle));
    });
}
/**
 * @private
 * Return the root locale. Defaults to the system locale.
 */
function getRootLocale() {
    return rootLocale || systemLocale;
}
/**
 * @private
 * Retrieve a list of supported locales that can provide messages for the specified locale.
 *
 * @param locale
 * The target locale.
 *
 * @param supported
 * The locales that are supported by the bundle.
 *
 * @return
 * A list of supported locales that match the target locale.
 */
function getSupportedLocales(locale, supported = []) {
    return Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["generateLocales"])(locale).filter((locale) => supported.indexOf(locale) > -1);
}
/**
 * @private
 * Inject messages for the specified locale into the i18n system.
 *
 * @param id
 * The bundle's unique identifier
 *
 * @param messages
 * The messages to inject
 *
 * @param locale
 * An optional locale. If not specified, then it is assumed that the messages are the defaults for the given
 * bundle path.
 */
function loadMessages(id, messages, locale = 'root') {
    let cached = bundleMap.get(id);
    if (!cached) {
        cached = new _shim_Map__WEBPACK_IMPORTED_MODULE_2__["default"]();
        bundleMap.set(id, cached);
    }
    cached.set(locale, messages);
    globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__["loadMessages"]({
        [locale]: {
            [id]: messages
        }
    });
}
/**
 * Return a formatted message.
 *
 * If both the "supplemental/likelySubtags" and "supplemental/plurals-type-cardinal" CLDR data have been loaded, then
 * the ICU message format is supported. Otherwise, a simple token-replacement mechanism is used.
 *
 * Usage:
 * formatMessage(bundle, 'guestInfo', {
 *   host: 'Bill',
 *   guest: 'John'
 * }, 'fr');
 *
 * @param bundle
 * The bundle containing the target message.
 *
 * @param key
 * The message's key.
 *
 * @param options
 * An optional value used by the formatter to replace tokens with values.
 *
 * @param locale
 * An optional locale for the formatter. If no locale is supplied, or if the locale is not supported, the
 * default locale is used.
 *
 * @return
 * The formatted message.
 */
function formatMessage(bundle, key, options, locale) {
    return getMessageFormatter(bundle, key, locale)(options);
}
/**
 * Return the cached messages for the specified bundle and locale. If messages have not been previously loaded for the
 * specified locale, no value will be returned.
 *
 * @param bundle
 * The default bundle that is used to determine where the locale-specific bundles are located.
 *
 * @param locale
 * The locale of the desired messages.
 *
 * @return The cached messages object, if it exists.
 */
function getCachedMessages(bundle, locale) {
    const { id = getBundleId(bundle), locales, messages } = bundle;
    const cached = bundleMap.get(id);
    if (!cached) {
        loadMessages(id, messages);
    }
    else {
        const localeMessages = cached.get(locale);
        if (localeMessages) {
            return localeMessages;
        }
    }
    const supportedLocales = getSupportedLocales(locale, locales && Object.keys(locales));
    if (!supportedLocales.length) {
        return messages;
    }
    if (cached) {
        return cached.get(supportedLocales[supportedLocales.length - 1]);
    }
}
/**
 * Return a function that formats a specific message, and takes an optional value for token replacement.
 *
 * If both the "supplemental/likelySubtags" and "supplemental/plurals-type-cardinal" CLDR data have been loaded, then
 * the returned function will have ICU message format support. Otherwise, the returned function will perform a simple
 * token replacement on the message string.
 *
 * Usage:
 * const formatter = getMessageFormatter(bundle, 'guestInfo', 'fr');
 * const message = formatter({
 *   host: 'Miles',
 *   gender: 'male',
 *   guest: 'Oscar',
 *   guestCount: '15'
 * });
 *
 * @param bundle
 * The bundle containing the target message.
 *
 * @param key
 * The message's key.
 *
 * @param locale
 * An optional locale for the formatter. If no locale is supplied, or if the locale is not supported, the
 * default locale is used.
 *
 * @return
 * The message formatter.
 */
function getMessageFormatter(bundle, key, locale) {
    const { id = getBundleId(bundle) } = bundle;
    if (Object(_cldr_load__WEBPACK_IMPORTED_MODULE_7__["isLoaded"])('supplemental', 'likelySubtags') && Object(_cldr_load__WEBPACK_IMPORTED_MODULE_7__["isLoaded"])('supplemental', 'plurals-type-cardinal')) {
        return getIcuMessageFormatter(id, key, locale);
    }
    const cached = bundleMap.get(id);
    const messages = cached ? cached.get(locale || getRootLocale()) || cached.get('root') : null;
    if (!messages) {
        throw new Error(`The bundle has not been registered.`);
    }
    return function (options = Object.create(null)) {
        return messages[key].replace(TOKEN_PATTERN, (token, property) => {
            const value = options[property];
            if (typeof value === 'undefined') {
                throw new Error(`Missing property ${property}`);
            }
            return value;
        });
    };
}
/**
 * Load locale-specific messages for the specified bundle and locale.
 *
 * @param bundle
 * The default bundle that is used to determine where the locale-specific bundles are located.
 *
 * @param locale
 * An optional locale. If no locale is provided, then the current locale is assumed.
 *
 * @return A promise to the locale-specific messages.
 */
async function i18n(bundle, locale) {
    const currentLocale = locale ? Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["normalizeLocale"])(locale) : getRootLocale();
    const cachedMessages = getCachedMessages(bundle, currentLocale);
    if (cachedMessages) {
        return cachedMessages;
    }
    const locales = bundle.locales;
    const supportedLocales = getSupportedLocales(currentLocale, Object.keys(locales));
    const bundles = await loadLocaleBundles(locales, supportedLocales);
    return bundles.reduce((previous, partial) => {
        const localeMessages = Object.assign({}, previous, partial);
        loadMessages(getBundleId(bundle), Object.freeze(localeMessages), currentLocale);
        return localeMessages;
    }, bundle.messages);
}
Object.defineProperty(i18n, 'locale', {
    get: getRootLocale
});
/* harmony default export */ __webpack_exports__["default"] = (i18n);
/**
 * Invalidate the cache for a particular bundle, or invalidate the entire cache. Note that cached messages for all
 * locales for a given bundle will be cleared.
 *
 * @param bundle
 * An optional bundle to invalidate. If no bundle is provided, then the cache is cleared for all bundles.
 */
function invalidate(bundle) {
    if (bundle) {
        bundle.id && bundleMap.delete(bundle.id);
    }
    else {
        bundleMap.clear();
    }
}
/**
 * Register an observer to be notified when the root locale changes.
 *
 * @param callback
 * A callback function which will receive the updated locale string on updates.
 *
 * @return
 * A handle object that can be used to unsubscribe from updates.
 */
const observeLocale = function (callback) {
    return localeProducer.on('change', (event) => {
        callback(event.target);
    });
};
/**
 * Pre-load locale-specific messages into the i18n system.
 *
 * @param bundle
 * The default bundle that is used to merge locale-specific messages with the default messages.
 *
 * @param messages
 * The messages to cache.
 *
 * @param locale
 * The locale for the messages
 */
function setLocaleMessages(bundle, localeMessages, locale) {
    const messages = Object.assign({}, bundle.messages, localeMessages);
    loadMessages(getBundleId(bundle), Object.freeze(messages), locale);
}
/**
 * Change the root locale, and notify any registered observers.
 *
 * @param locale
 * The new locale.
 */
function switchLocale(locale) {
    const previous = rootLocale;
    rootLocale = locale ? Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["normalizeLocale"])(locale) : '';
    if (previous !== rootLocale) {
        if (Object(_cldr_load__WEBPACK_IMPORTED_MODULE_7__["isLoaded"])('supplemental', 'likelySubtags')) {
            globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__["load"]({
                main: {
                    [rootLocale]: {}
                }
            });
            globalize_dist_globalize_message__WEBPACK_IMPORTED_MODULE_6__["locale"](rootLocale);
        }
        localeProducer.emit({ type: 'change', target: rootLocale });
    }
}
/**
 * The default environment locale.
 *
 * It should be noted that while the system locale will be normalized to a single
 * format when loading message bundles, this value represents the unaltered
 * locale returned directly by the environment.
 */
const systemLocale = (function () {
    let systemLocale = 'en';
    if (true) {
        const navigator = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].navigator;
        systemLocale = navigator.language || navigator.userLanguage;
    }
    else {}
    return Object(_util_main__WEBPACK_IMPORTED_MODULE_8__["normalizeLocale"])(systemLocale);
})();


/***/ }),

/***/ "./node_modules/@dojo/framework/i18n/util/main.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@dojo/framework/i18n/util/main.mjs ***!
  \*********************************************************/
/*! exports provided: generateLocales, normalizeLocale, validateLocale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateLocales", function() { return generateLocales; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeLocale", function() { return normalizeLocale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateLocale", function() { return validateLocale; });
// Matches an ISO 639.1/639.2 compatible language, followed by optional subtags.
const VALID_LOCALE_PATTERN = /^[a-z]{2,3}(-[a-z0-9\-\_]+)?$/i;
/**
 * Retrieve a list of locales that can provide substitute for the specified locale
 * (including itself).
 *
 * For example, if 'fr-CA' is specified, then `[ 'fr', 'fr-CA' ]` is returned.
 *
 * @param locale
 * The target locale.
 *
 * @return
 * A list of locales that match the target locale.
 */
function generateLocales(locale) {
    const normalized = normalizeLocale(locale);
    const parts = normalized.split('-');
    let current = parts[0];
    const result = [current];
    for (let i = 0; i < parts.length - 1; i += 1) {
        current += '-' + parts[i + 1];
        result.push(current);
    }
    return result;
}
/**
 * Normalize a locale so that it can be converted to a bundle path.
 *
 * @param locale
 * The target locale.
 *
 * @return The normalized locale.
 */
const normalizeLocale = (function () {
    function removeTrailingSeparator(value) {
        return value.replace(/(\-|_)$/, '');
    }
    function normalize(locale) {
        if (locale.indexOf('.') === -1) {
            return removeTrailingSeparator(locale);
        }
        return locale
            .split('.')
            .slice(0, -1)
            .map((part) => {
            return removeTrailingSeparator(part).replace(/_/g, '-');
        })
            .join('-');
    }
    return function (locale) {
        const normalized = normalize(locale);
        if (!validateLocale(normalized)) {
            throw new Error(`${normalized} is not a valid locale.`);
        }
        return normalized;
    };
})();
/**
 * Validates that the provided locale at least begins with a ISO 639.1/639.2 comptabile language subtag,
 * and that any additional subtags contain only valid characters.
 *
 * While locales should adhere to the guidelines set forth by RFC 5646 (https://tools.ietf.org/html/rfc5646),
 * only the language subtag is strictly enforced.
 *
 * @param locale
 * The locale to validate.
 *
 * @return
 * `true` if the locale is valid; `false` otherwise.
 */
function validateLocale(locale) {
    return VALID_LOCALE_PATTERN.test(locale);
}


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Link.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Link.mjs ***!
  \*******************************************************/
/*! exports provided: Link, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
/* harmony import */ var _core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _core_middleware_injector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.mjs");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};


const factory = Object(_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ injector: _core_middleware_injector__WEBPACK_IMPORTED_MODULE_1__["default"] }).properties();
const Link = factory(function Link({ middleware: { injector }, properties, children }) {
    let _a = properties(), { routerKey = 'router', to, isOutlet = true, target, params = {}, onClick } = _a, props = __rest(_a, ["routerKey", "to", "isOutlet", "target", "params", "onClick"]);
    const router = injector.get(routerKey);
    let href = to;
    let linkProps;
    if (router) {
        if (isOutlet) {
            href = router.link(href, params);
        }
        const onclick = (event) => {
            onClick && onClick(event);
            if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !target) {
                event.preventDefault();
                href !== undefined && router.setPath(href);
            }
        };
        linkProps = Object.assign({}, props, { onclick, href });
    }
    else {
        linkProps = Object.assign({}, props, { href });
    }
    return Object(_core_vdom__WEBPACK_IMPORTED_MODULE_0__["v"])('a', linkProps, children());
});
/* harmony default export */ __webpack_exports__["default"] = (Link);


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Outlet.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Outlet.mjs ***!
  \*********************************************************/
/*! exports provided: Outlet, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Outlet", function() { return Outlet; });
/* harmony import */ var _core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _core_middleware_injector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.mjs");
/* harmony import */ var _core_middleware_cache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/middleware/cache */ "./node_modules/@dojo/framework/core/middleware/cache.mjs");



const factory = Object(_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ cache: _core_middleware_cache__WEBPACK_IMPORTED_MODULE_2__["default"], injector: _core_middleware_injector__WEBPACK_IMPORTED_MODULE_1__["default"], diffProperty: _core_vdom__WEBPACK_IMPORTED_MODULE_0__["diffProperty"], invalidator: _core_vdom__WEBPACK_IMPORTED_MODULE_0__["invalidator"] }).properties();
const Outlet = factory(function Outlet({ middleware: { cache, injector, diffProperty, invalidator }, properties }) {
    const { renderer, id, routerKey = 'router' } = properties();
    const currentHandle = cache.get('handle');
    if (!currentHandle) {
        const handle = injector.subscribe(routerKey);
        if (handle) {
            cache.set('handle', handle);
        }
    }
    diffProperty('routerKey', (current, next) => {
        const { routerKey: currentRouterKey = 'router' } = current;
        const { routerKey = 'router' } = next;
        if (routerKey !== currentRouterKey) {
            const currentHandle = cache.get('handle');
            if (currentHandle) {
                currentHandle();
            }
            const handle = injector.subscribe(routerKey);
            if (handle) {
                cache.set('handle', handle);
            }
        }
        invalidator();
    });
    const router = injector.get(routerKey);
    if (router) {
        const outletContext = router.getOutlet(id);
        if (outletContext) {
            const { queryParams, params, type, isError, isExact } = outletContext;
            const result = renderer({ queryParams, params, type, isError, isExact, router });
            if (result) {
                return result;
            }
        }
    }
    return null;
});
/* harmony default export */ __webpack_exports__["default"] = (Outlet);


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Router.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Router.mjs ***!
  \*********************************************************/
/*! exports provided: Router, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony import */ var _core_Evented__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.mjs");
/* harmony import */ var _history_HashHistory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./history/HashHistory */ "./node_modules/@dojo/framework/routing/history/HashHistory.mjs");


const PARAM = '__PARAM__';
const paramRegExp = new RegExp(/^{.+}$/);
const ROUTE_SEGMENT_SCORE = 7;
const DYNAMIC_SEGMENT_PENALTY = 2;
function matchingParams({ params: previousParams }, { params }) {
    const matching = Object.keys(previousParams).every((key) => previousParams[key] === params[key]);
    if (!matching) {
        return false;
    }
    return Object.keys(params).every((key) => previousParams[key] === params[key]);
}
class Router extends _core_Evented__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(config, options = {}) {
        super();
        this._routes = [];
        this._outletMap = Object.create(null);
        this._matchedOutlets = Object.create(null);
        this._currentParams = {};
        this._currentQueryParams = {};
        /**
         * Called on change of the route by the the registered history manager. Matches the path against
         * the registered outlets.
         *
         * @param requestedPath The path of the requested route
         */
        this._onChange = (requestedPath) => {
            requestedPath = this._stripLeadingSlash(requestedPath);
            const previousMatchedOutlets = this._matchedOutlets;
            this._matchedOutlets = Object.create(null);
            const [path, queryParamString] = requestedPath.split('?');
            this._currentQueryParams = this._getQueryParams(queryParamString);
            const segments = path.split('/');
            let routeConfigs = this._routes.map((route) => ({
                route,
                segments: [...segments],
                parent: undefined,
                params: {}
            }));
            let routeConfig;
            let matchedRoutes = [];
            while ((routeConfig = routeConfigs.pop())) {
                const { route, parent, segments, params } = routeConfig;
                let segmentIndex = 0;
                let type = 'index';
                let paramIndex = 0;
                let routeMatch = true;
                if (segments.length < route.segments.length) {
                    routeMatch = false;
                }
                else {
                    while (segments.length > 0) {
                        if (route.segments[segmentIndex] === undefined) {
                            type = 'partial';
                            break;
                        }
                        const segment = segments.shift();
                        if (route.segments[segmentIndex] === PARAM) {
                            params[route.params[paramIndex++]] = segment;
                            this._currentParams = Object.assign({}, this._currentParams, params);
                        }
                        else if (route.segments[segmentIndex] !== segment) {
                            routeMatch = false;
                            break;
                        }
                        segmentIndex++;
                    }
                }
                if (routeMatch) {
                    routeConfig.type = type;
                    matchedRoutes.push({ route, parent, type, params, segments: [] });
                    if (segments.length) {
                        routeConfigs = [
                            ...routeConfigs,
                            ...route.children.map((childRoute) => ({
                                route: childRoute,
                                segments: [...segments],
                                parent: routeConfig,
                                type,
                                params: Object.assign({}, params)
                            }))
                        ];
                    }
                }
            }
            let matchedOutletName = undefined;
            let matchedRoute = matchedRoutes.reduce((match, matchedRoute) => {
                if (!match) {
                    return matchedRoute;
                }
                if (match.route.score > matchedRoute.route.score) {
                    return match;
                }
                return matchedRoute;
            }, undefined);
            if (matchedRoute) {
                if (matchedRoute.type === 'partial') {
                    matchedRoute.type = 'error';
                }
                matchedOutletName = matchedRoute.route.outlet;
                while (matchedRoute) {
                    let { type, params, parent, route } = matchedRoute;
                    const matchedOutlet = {
                        id: route.outlet,
                        queryParams: this._currentQueryParams,
                        params,
                        type,
                        isError: () => type === 'error',
                        isExact: () => type === 'index'
                    };
                    const previousMatchedOutlet = previousMatchedOutlets[route.outlet];
                    this._matchedOutlets[route.outlet] = matchedOutlet;
                    if (!previousMatchedOutlet || !matchingParams(previousMatchedOutlet, matchedOutlet)) {
                        this.emit({ type: 'outlet', outlet: matchedOutlet, action: 'enter' });
                    }
                    matchedRoute = parent;
                }
            }
            else {
                this._matchedOutlets.errorOutlet = {
                    id: 'errorOutlet',
                    queryParams: {},
                    params: {},
                    isError: () => true,
                    isExact: () => false,
                    type: 'error'
                };
            }
            const previousMatchedOutletKeys = Object.keys(previousMatchedOutlets);
            for (let i = 0; i < previousMatchedOutletKeys.length; i++) {
                const key = previousMatchedOutletKeys[i];
                const matchedOutlet = this._matchedOutlets[key];
                if (!matchedOutlet || !matchingParams(previousMatchedOutlets[key], matchedOutlet)) {
                    this.emit({ type: 'outlet', outlet: previousMatchedOutlets[key], action: 'exit' });
                }
            }
            this.emit({
                type: 'nav',
                outlet: matchedOutletName,
                context: matchedOutletName ? this._matchedOutlets[matchedOutletName] : undefined
            });
        };
        this._options = options;
        this._register(config);
        const autostart = options.autostart === undefined ? true : options.autostart;
        if (autostart) {
            this.start();
        }
    }
    /**
     * Sets the path against the registered history manager
     *
     * @param path The path to set on the history manager
     */
    setPath(path) {
        this._history.set(path);
    }
    start() {
        const { HistoryManager = _history_HashHistory__WEBPACK_IMPORTED_MODULE_1__["HashHistory"], base, window } = this._options;
        this._history = new HistoryManager({ onChange: this._onChange, base, window });
        if (this._matchedOutlets.errorOutlet && this._defaultOutlet) {
            const path = this.link(this._defaultOutlet);
            if (path) {
                this.setPath(path);
            }
        }
    }
    /**
     * Generate a link for a given outlet identifier and optional params.
     *
     * @param outlet The outlet to generate a link for
     * @param params Optional Params for the generated link
     */
    link(outlet, params = {}) {
        const { _outletMap, _currentParams, _currentQueryParams } = this;
        let route = _outletMap[outlet];
        if (route === undefined) {
            return;
        }
        let linkPath = route.fullPath;
        if (route.fullQueryParams.length > 0) {
            let queryString = route.fullQueryParams.reduce((queryParamString, param, index) => {
                if (index > 0) {
                    return `${queryParamString}&${param}={${param}}`;
                }
                return `?${param}={${param}}`;
            }, '');
            linkPath = `${linkPath}${queryString}`;
        }
        params = Object.assign({}, route.defaultParams, _currentQueryParams, _currentParams, params);
        if (Object.keys(params).length === 0 && route.fullParams.length > 0) {
            return undefined;
        }
        const fullParams = [...route.fullParams, ...route.fullQueryParams];
        for (let i = 0; i < fullParams.length; i++) {
            const param = fullParams[i];
            if (params[param]) {
                linkPath = linkPath.replace(`{${param}}`, params[param]);
            }
            else {
                return undefined;
            }
        }
        return this._history.prefix(linkPath);
    }
    /**
     * Returns the outlet context for the outlet identifier if one has been matched
     *
     * @param outletIdentifier The outlet identifer
     */
    getOutlet(outletIdentifier) {
        return this._matchedOutlets[outletIdentifier];
    }
    /**
     * Returns all the params for the current matched outlets
     */
    get currentParams() {
        return this._currentParams;
    }
    /**
     * Strips the leading slash on a path if one exists
     *
     * @param path The path to strip a leading slash
     */
    _stripLeadingSlash(path) {
        if (path[0] === '/') {
            return path.slice(1);
        }
        return path;
    }
    /**
     * Registers the routing configuration
     *
     * @param config The configuration
     * @param routes The routes
     * @param parentRoute The parent route
     */
    _register(config, routes, parentRoute) {
        routes = routes ? routes : this._routes;
        for (let i = 0; i < config.length; i++) {
            let { path, outlet, children, defaultRoute = false, defaultParams = {} } = config[i];
            let [parsedPath, queryParamString] = path.split('?');
            let queryParams = [];
            parsedPath = this._stripLeadingSlash(parsedPath);
            const segments = parsedPath.split('/');
            const route = {
                params: [],
                outlet,
                path: parsedPath,
                segments,
                defaultParams: parentRoute ? Object.assign({}, parentRoute.defaultParams, defaultParams) : defaultParams,
                children: [],
                fullPath: parentRoute ? `${parentRoute.fullPath}/${parsedPath}` : parsedPath,
                fullParams: [],
                fullQueryParams: [],
                score: parentRoute ? parentRoute.score : 0
            };
            if (defaultRoute) {
                this._defaultOutlet = outlet;
            }
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                route.score += ROUTE_SEGMENT_SCORE;
                if (paramRegExp.test(segment)) {
                    route.score -= DYNAMIC_SEGMENT_PENALTY;
                    route.params.push(segment.replace('{', '').replace('}', ''));
                    segments[i] = PARAM;
                }
            }
            if (queryParamString) {
                queryParams = queryParamString.split('&').map((queryParam) => {
                    return queryParam.replace('{', '').replace('}', '');
                });
            }
            route.fullQueryParams = parentRoute ? [...parentRoute.fullQueryParams, ...queryParams] : queryParams;
            route.fullParams = parentRoute ? [...parentRoute.fullParams, ...route.params] : route.params;
            if (children && children.length > 0) {
                this._register(children, route.children, route);
            }
            this._outletMap[outlet] = route;
            routes.push(route);
        }
    }
    /**
     * Returns an object of query params
     *
     * @param queryParamString The string of query params, e.g `paramOne=one&paramTwo=two`
     */
    _getQueryParams(queryParamString) {
        const queryParams = {};
        if (queryParamString) {
            const queryParameters = queryParamString.split('&');
            for (let i = 0; i < queryParameters.length; i++) {
                const [key, value] = queryParameters[i].split('=');
                queryParams[key] = value;
            }
        }
        return queryParams;
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Router);


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/RouterInjector.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/RouterInjector.mjs ***!
  \*****************************************************************/
/*! exports provided: registerRouterInjector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerRouterInjector", function() { return registerRouterInjector; });
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ "./node_modules/@dojo/framework/routing/Router.mjs");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};

/**
 * Creates a router instance for a specific History manager (default is `HashHistory`) and registers
 * the route configuration.
 *
 * @param config The route config to register for the router
 * @param registry An optional registry that defaults to the global registry
 * @param options The router injector options
 */
function registerRouterInjector(config, registry, options = {}) {
    const { key = 'router' } = options, routerOptions = __rest(options, ["key"]);
    if (registry.hasInjector(key)) {
        throw new Error('Router has already been defined');
    }
    const router = new _Router__WEBPACK_IMPORTED_MODULE_0__["Router"](config, routerOptions);
    registry.defineInjector(key, (invalidator) => {
        router.on('nav', () => invalidator());
        return () => router;
    });
    return router;
}


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/history/HashHistory.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/history/HashHistory.mjs ***!
  \**********************************************************************/
/*! exports provided: HashHistory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HashHistory", function() { return HashHistory; });
/* harmony import */ var _shim_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");

class HashHistory {
    constructor({ window = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].window, onChange }) {
        this._onChange = () => {
            const path = this.normalizePath(this._window.location.hash);
            if (path !== this._current) {
                this._current = path;
                this._onChangeFunction(this._current);
            }
        };
        this._onChangeFunction = onChange;
        this._window = window;
        this._window.addEventListener('hashchange', this._onChange, false);
        this._current = this.normalizePath(this._window.location.hash);
        this._onChangeFunction(this._current);
    }
    normalizePath(path) {
        return path.replace('#', '');
    }
    prefix(path) {
        if (path[0] !== '#') {
            return `#${path}`;
        }
        return path;
    }
    set(path) {
        this._window.location.hash = this.prefix(path);
        this._onChange();
    }
    get current() {
        return this._current;
    }
    destroy() {
        this._window.removeEventListener('hashchange', this._onChange);
    }
}
/* harmony default export */ __webpack_exports__["default"] = (HashHistory);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/Map.mjs":
/*!***************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/Map.mjs ***!
  \***************************************************/
/*! exports provided: Map, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return Map; });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./object */ "./node_modules/@dojo/framework/shim/object.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
var _a;
var isArrayLike = undefined, ShimIterator = undefined;
// !has('es6-iterator')
// elided: import './iterator'



// !has('es6-symbol')
// elided: import './Symbol'
let Map = _global__WEBPACK_IMPORTED_MODULE_0__["default"].Map;
if (false) {}
/* harmony default export */ __webpack_exports__["default"] = (Map);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/Set.mjs":
/*!***************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/Set.mjs ***!
  \***************************************************/
/*! exports provided: Set, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Set", function() { return Set; });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
var _a;

var isArrayLike = undefined, ShimIterator = undefined;
// !has('es6-iterator')
// elided: import './iterator'

// !has('es6-symbol')
// elided: import './Symbol'
let Set = _global__WEBPACK_IMPORTED_MODULE_0__["default"].Set;
if (false) {}
/* harmony default export */ __webpack_exports__["default"] = (Set);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/WeakMap.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/WeakMap.mjs ***!
  \*******************************************************/
/*! exports provided: WeakMap, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WeakMap", function() { return WeakMap; });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");

var isArrayLike = undefined;
// !has('es6-iterator')
// elided: import './iterator'

// !has('es6-symbol')
// elided: import './Symbol'
let WeakMap = _global__WEBPACK_IMPORTED_MODULE_0__["default"].WeakMap;
if (false) {}
/* harmony default export */ __webpack_exports__["default"] = (WeakMap);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/iterator.mjs":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/iterator.mjs ***!
  \********************************************************/
/*! exports provided: ShimIterator, isIterable, isArrayLike, get, forOf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShimIterator", function() { return ShimIterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIterable", function() { return isIterable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArrayLike", function() { return isArrayLike; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forOf", function() { return forOf; });
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./string */ "./node_modules/@dojo/framework/shim/string.mjs");
// !has('es6-symbol')
// elided: import './Symbol'

const staticDone = { done: true, value: undefined };
class ShimIterator {
    constructor(list) {
        this._nextIndex = -1;
        if (isIterable(list)) {
            this._nativeIterator = list[Symbol.iterator]();
        }
        else {
            this._list = list;
        }
    }
    /**
     * Return the next iteration result for the Iterator
     */
    next() {
        if (this._nativeIterator) {
            return this._nativeIterator.next();
        }
        if (!this._list) {
            return staticDone;
        }
        if (++this._nextIndex < this._list.length) {
            return {
                done: false,
                value: this._list[this._nextIndex]
            };
        }
        return staticDone;
    }
    [Symbol.iterator]() {
        return this;
    }
}
function isIterable(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
function get(iterable) {
    if (isIterable(iterable)) {
        return iterable[Symbol.iterator]();
    }
    else if (isArrayLike(iterable)) {
        return new ShimIterator(iterable);
    }
}
function forOf(iterable, callback, thisArg) {
    let broken = false;
    function doBreak() {
        broken = true;
    }
    /* We need to handle iteration of double byte strings properly */
    if (isArrayLike(iterable) && typeof iterable === 'string') {
        const l = iterable.length;
        for (let i = 0; i < l; ++i) {
            let char = iterable[i];
            if (i + 1 < l) {
                const code = char.charCodeAt(0);
                if (code >= _string__WEBPACK_IMPORTED_MODULE_0__["HIGH_SURROGATE_MIN"] && code <= _string__WEBPACK_IMPORTED_MODULE_0__["HIGH_SURROGATE_MAX"]) {
                    char += iterable[++i];
                }
            }
            callback.call(thisArg, char, iterable, doBreak);
            if (broken) {
                return;
            }
        }
    }
    else {
        const iterator = get(iterable);
        if (iterator) {
            let result = iterator.next();
            while (!result.done) {
                callback.call(thisArg, result.value, iterable, doBreak);
                if (broken) {
                    return;
                }
                result = iterator.next();
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/object.mjs":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/object.mjs ***!
  \******************************************************/
/*! exports provided: assign, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, is, keys, getOwnPropertyDescriptors, entries, values, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOwnPropertyDescriptor", function() { return getOwnPropertyDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOwnPropertyNames", function() { return getOwnPropertyNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOwnPropertySymbols", function() { return getOwnPropertySymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "is", function() { return is; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return keys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOwnPropertyDescriptors", function() { return getOwnPropertyDescriptors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "entries", function() { return entries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "values", function() { return values; });
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");

let assign;
/**
 * Gets the own property descriptor of the specified object.
 * An own property descriptor is one that is defined directly on the object and is not
 * inherited from the object's prototype.
 * @param o Object that contains the property.
 * @param p Name of the property.
 */
let getOwnPropertyDescriptor;
/**
 * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
 * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
 * @param o Object that contains the own properties.
 */
let getOwnPropertyNames;
/**
 * Returns an array of all symbol properties found directly on object o.
 * @param o Object to retrieve the symbols from.
 */
let getOwnPropertySymbols;
/**
 * Returns true if the values are the same value, false otherwise.
 * @param value1 The first value.
 * @param value2 The second value.
 */
let is;
/**
 * Returns the names of the enumerable properties and methods of an object.
 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
let keys;
/* ES7 Object static methods */
let getOwnPropertyDescriptors;
let entries;
let values;
if (false) {}
if (false) {}
assign = Object.assign;
getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
getOwnPropertyNames = Object.getOwnPropertyNames;
getOwnPropertySymbols = Object.getOwnPropertySymbols;
is = Object.is;
keys = Object.keys;
getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
entries = Object.entries;
values = Object.values;
/* harmony default export */ __webpack_exports__["default"] = (Object);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/string.mjs":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/string.mjs ***!
  \******************************************************/
/*! exports provided: HIGH_SURROGATE_MIN, HIGH_SURROGATE_MAX, LOW_SURROGATE_MIN, LOW_SURROGATE_MAX, fromCodePoint, raw, codePointAt, endsWith, includes, normalize, repeat, startsWith, padEnd, padStart, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGH_SURROGATE_MIN", function() { return HIGH_SURROGATE_MIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGH_SURROGATE_MAX", function() { return HIGH_SURROGATE_MAX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOW_SURROGATE_MIN", function() { return LOW_SURROGATE_MIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOW_SURROGATE_MAX", function() { return LOW_SURROGATE_MAX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromCodePoint", function() { return fromCodePoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "raw", function() { return raw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "codePointAt", function() { return codePointAt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "endsWith", function() { return endsWith; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "includes", function() { return includes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "repeat", function() { return repeat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "startsWith", function() { return startsWith; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "padEnd", function() { return padEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "padStart", function() { return padStart; });
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
/* harmony import */ var _support_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./support/util */ "./node_modules/@dojo/framework/shim/support/util.mjs");


/**
 * The minimum location of high surrogates
 */
const HIGH_SURROGATE_MIN = 0xd800;
/**
 * The maximum location of high surrogates
 */
const HIGH_SURROGATE_MAX = 0xdbff;
/**
 * The minimum location of low surrogates
 */
const LOW_SURROGATE_MIN = 0xdc00;
/**
 * The maximum location of low surrogates
 */
const LOW_SURROGATE_MAX = 0xdfff;
/* ES6 static methods */
/**
 * Return the String value whose elements are, in order, the elements in the List elements.
 * If length is 0, the empty string is returned.
 * @param codePoints The code points to generate the string
 */
let fromCodePoint;
/**
 * `raw` is intended for use as a tag function of a Tagged Template String. When called
 * as such the first argument will be a well formed template call site object and the rest
 * parameter will contain the substitution values.
 * @param template A well-formed template string call site representation.
 * @param substitutions A set of substitution values.
 */
let raw;
/* ES6 instance methods */
/**
 * Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
 * value of the UTF-16 encoded code point starting at the string element at position pos in
 * the String resulting from converting this object to a String.
 * If there is no element at that position, the result is undefined.
 * If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.
 */
let codePointAt;
/**
 * Returns true if the sequence of elements of searchString converted to a String is the
 * same as the corresponding elements of this object (converted to a String) starting at
 * endPosition – length(this). Otherwise returns false.
 */
let endsWith;
/**
 * Returns true if searchString appears as a substring of the result of converting this
 * object to a String, at one or more positions that are
 * greater than or equal to position; otherwise, returns false.
 * @param target The target string
 * @param searchString search string
 * @param position If position is undefined, 0 is assumed, so as to search all of the String.
 */
let includes;
/**
 * Returns the String value result of normalizing the string into the normalization form
 * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
 * @param target The target string
 * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
 * is "NFC"
 */
let normalize;
/**
 * Returns a String value that is made from count copies appended together. If count is 0,
 * T is the empty String is returned.
 * @param count number of copies to append
 */
let repeat;
/**
 * Returns true if the sequence of elements of searchString converted to a String is the
 * same as the corresponding elements of this object (converted to a String) starting at
 * position. Otherwise returns false.
 */
let startsWith;
/* ES7 instance methods */
/**
 * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
 * The padding is applied from the end (right) of the current string.
 *
 * @param target The target string
 * @param maxLength The length of the resulting string once the current string has been padded.
 *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
 *
 * @param fillString The string to pad the current string with.
 *        If this string is too long, it will be truncated and the left-most part will be applied.
 *        The default value for this parameter is " " (U+0020).
 */
let padEnd;
/**
 * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
 * The padding is applied from the start (left) of the current string.
 *
 * @param target The target string
 * @param maxLength The length of the resulting string once the current string has been padded.
 *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
 *
 * @param fillString The string to pad the current string with.
 *        If this string is too long, it will be truncated and the left-most part will be applied.
 *        The default value for this parameter is " " (U+0020).
 */
let padStart;
if (false) {}
if (false) {}
if (false) {}
fromCodePoint = String.fromCodePoint;
raw = String.raw;
codePointAt = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.codePointAt);
endsWith = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.endsWith);
includes = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.includes);
normalize = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.normalize);
repeat = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.repeat);
startsWith = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.startsWith);
padEnd = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.padEnd);
padStart = Object(_support_util__WEBPACK_IMPORTED_MODULE_1__["wrapNative"])(String.prototype.padStart);
/* harmony default export */ __webpack_exports__["default"] = (String);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/support/util.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/support/util.mjs ***!
  \************************************************************/
/*! exports provided: getValueDescriptor, wrapNative */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValueDescriptor", function() { return getValueDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapNative", function() { return wrapNative; });
/**
 * Helper function to generate a value property descriptor
 *
 * @param value        The value the property descriptor should be set to
 * @param enumerable   If the property should be enumberable, defaults to false
 * @param writable     If the property should be writable, defaults to true
 * @param configurable If the property should be configurable, defaults to true
 * @return             The property descriptor object
 */
function getValueDescriptor(value, enumerable = false, writable = true, configurable = true) {
    return {
        value: value,
        enumerable: enumerable,
        writable: writable,
        configurable: configurable
    };
}
function wrapNative(nativeFunction) {
    return function (target, ...args) {
        return nativeFunction.apply(target, args);
    };
}


/***/ }),

/***/ "./node_modules/@dojo/themes/dojo/index.css":
/*!**************************************************!*\
  !*** ./node_modules/@dojo/themes/dojo/index.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/themes/dojo/index.js":
/*!*************************************************!*\
  !*** ./node_modules/@dojo/themes/dojo/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(_,o){ true?module.exports=o():undefined}(this,function(){return function(_){var o={};function e(t){if(o[t])return o[t].exports;var i=o[t]={i:t,l:!1,exports:{}};return _[t].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=_,e.c=o,e.d=function(_,o,t){e.o(_,o)||Object.defineProperty(_,o,{configurable:!1,enumerable:!0,get:t})},e.n=function(_){var o=_&&_.__esModule?function(){return _.default}:function(){return _};return e.d(o,"a",o),o},e.o=function(_,o){return Object.prototype.hasOwnProperty.call(_,o)},e.p="",e(e.s=0)}([function(_,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var t=e(1),i=e(2),r=e(3),n=e(4),d=e(5),a=e(6),l=e(7),c=e(8),m=e(9),s=e(10),p=e(11),u=e(12),b=e(13),g=e(14),h=e(15),x=e(16),f=e(17),y=e(18),k=e(19),j=e(20),I=e(21),v=e(22),w=e(23),T=e(24),B=e(25),L=e(26),O=e(27),A=e(28),R=e(29),G=e(30),F=e(31),Q=e(32),z=e(33);o.default={"@dojo/widgets/accordion-pane":t,"@dojo/widgets/button":i,"@dojo/widgets/calendar":r,"@dojo/widgets/card":n,"@dojo/widgets/checkbox":d,"@dojo/widgets/combobox":a,"@dojo/widgets/dialog":l,"@dojo/widgets/grid-body":m,"@dojo/widgets/grid-cell":s,"@dojo/widgets/grid-footer":p,"@dojo/widgets/grid-header":u,"@dojo/widgets/grid-placeholder-row":b,"@dojo/widgets/grid-row":g,"@dojo/widgets/grid":c,"@dojo/widgets/helper-text":h,"@dojo/widgets/icon":x,"@dojo/widgets/label":f,"@dojo/widgets/listbox":y,"@dojo/widgets/progress":k,"@dojo/widgets/radio":j,"@dojo/widgets/range-slider":I,"@dojo/widgets/select":v,"@dojo/widgets/slide-pane":w,"@dojo/widgets/slider":T,"@dojo/widgets/snackbar":B,"@dojo/widgets/split-pane":L,"@dojo/widgets/tab-controller":O,"@dojo/widgets/text-area":A,"@dojo/widgets/text-input":R,"@dojo/widgets/time-picker":G,"@dojo/widgets/title-pane":F,"@dojo/widgets/toolbar":Q,"@dojo/widgets/tooltip":z}},function(_,o){_.exports={" _key":"@dojo/themes/accordion-pane",root:"accordion-pane-m__root__bM7L-"}},function(_,o){_.exports={" _key":"@dojo/themes/button",root:"button-m__root__12yR4",addon:"button-m__addon__1vLjS",pressed:"button-m__pressed__25bT9",popup:"button-m__popup__3TLBT",disabled:"button-m__disabled__2g1Eh"}},function(_,o){_.exports={" _key":"@dojo/themes/calendar",root:"calendar-m__root__8g8XM",dateGrid:"calendar-m__dateGrid__1fGQc",weekday:"calendar-m__weekday__2pA6h",date:"calendar-m__date__3YFf3",todayDate:"calendar-m__todayDate__d0AjQ",inactiveDate:"calendar-m__inactiveDate__2tjvq",selectedDate:"calendar-m__selectedDate__37_5N",topMatter:"calendar-m__topMatter__1IRSP",monthTrigger:"calendar-m__monthTrigger__cY71W",yearTrigger:"calendar-m__yearTrigger__28wTL",previous:"calendar-m__previous__2xwjK",next:"calendar-m__next__2LzTA",monthTriggerActive:"calendar-m__monthTriggerActive__3Qfvx",yearTriggerActive:"calendar-m__yearTriggerActive__3fD7T",monthGrid:"calendar-m__monthGrid__mZE0B",yearGrid:"calendar-m__yearGrid__3z6tZ",monthFields:"calendar-m__monthFields__343XA",yearFields:"calendar-m__yearFields__2ulJ9",monthRadio:"calendar-m__monthRadio__2CPSG",yearRadio:"calendar-m__yearRadio__2w-dx",monthRadioLabel:"calendar-m__monthRadioLabel__3oTer",yearRadioLabel:"calendar-m__yearRadioLabel__2IkO4",monthRadioChecked:"calendar-m__monthRadioChecked__3pYfv",yearRadioChecked:"calendar-m__yearRadioChecked__2b05y",monthRadioInput:"calendar-m__monthRadioInput__wTydQ",yearRadioInput:"calendar-m__yearRadioInput__1b6Vu"}},function(_,o){_.exports={" _key":"@dojo/themes/card",root:"card-m__root__1yMhc",actions:"card-m__actions__2E9_6",actionButtons:"card-m__actionButtons__3fHvP",actionIcons:"card-m__actionIcons__197N0",primaryAction:"card-m__primaryAction__3_ItV",media:"card-m__media__1gw5G",mediaContent:"card-m__mediaContent__JlkwP",mediaSquare:"card-m__mediaSquare__3mnEe",media16by9:"card-m__media16by9__3wn5q",primary:"card-m__primary__G8Ln6",secondary:"card-m__secondary__2h1tR"}},function(_,o){_.exports={" _key":"@dojo/themes/checkbox",root:"checkbox-m__root__2mazd",input:"checkbox-m__input__1R4a3",inputWrapper:"checkbox-m__inputWrapper__2n2Je icon-m__checkIcon__Qkzz_ icon-m__icon__29Rvx",checked:"checkbox-m__checked__36C34",toggle:"checkbox-m__toggle__zLu9M",toggleSwitch:"checkbox-m__toggleSwitch__1mp-p",onLabel:"checkbox-m__onLabel__3XdpR",offLabel:"checkbox-m__offLabel__2G79d",focused:"checkbox-m__focused__1XkzL",disabled:"checkbox-m__disabled__3De6r",readonly:"checkbox-m__readonly__1bP6U",invalid:"checkbox-m__invalid__3CVcp",valid:"checkbox-m__valid__1Sz1d"}},function(_,o){_.exports={" _key":"@dojo/themes/combobox",root:"combobox-m__root__1Ll10",clearable:"combobox-m__clearable__2vbMC",trigger:"combobox-m__trigger__2eaaN",dropdown:"combobox-m__dropdown__3RBvx",open:"combobox-m__open__ks_mj",fadeInOpacity:"combobox-m__fadeInOpacity__3EJ36",option:"combobox-m__option__2bV5j",selected:"combobox-m__selected__agfWS",invalid:"combobox-m__invalid__1Tpl5",valid:"combobox-m__valid__8WTtx",clear:"combobox-m__clear__2afgf"}},function(_,o){_.exports={" _key":"@dojo/themes/dialog",root:"dialog-m__root__3AJLL",main:"dialog-m__main__JQSA6",underlayVisible:"dialog-m__underlayVisible__1UOuO",title:"dialog-m__title__2ikv3",content:"dialog-m__content__34Znr",close:"dialog-m__close__jzTjA"}},function(_,o){_.exports={" _key":"@dojo/themes/grid",root:"grid-m__root__2K83D",header:"grid-m__header__3hUdG",filterGroup:"grid-m__filterGroup__AQQ0d"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-body",root:"grid-body-m__root__JP88A"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-cell",root:"grid-cell-m__root__2bSUs",input:"grid-cell-m__input__KUuUA",edit:"grid-cell-m__edit__1CjFq"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-footer",root:"grid-footer-m__root__2Ijyk"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-header",root:"grid-header-m__root__2dIwu",cell:"grid-header-m__cell__1te9J",sortable:"grid-header-m__sortable__4znER",sorted:"grid-header-m__sorted__1K99V",sort:"grid-header-m__sort__YGGb-",filter:"grid-header-m__filter__1g3i5"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-placeholder-row",root:"grid-placeholder-row-m__root__1wxj1 grid-row-m__root__36_XU",loading:"grid-placeholder-row-m__loading__1-LX1",spin:"grid-placeholder-row-m__spin__FCJF0"}},function(_,o){_.exports={" _key":"@dojo/themes/grid-row",root:"grid-row-m__root__36_XU"}},function(_,o){_.exports={" _key":"@dojo/themes/helper-text",root:"helper-text-m__root__Kexbc",text:"helper-text-m__text__25wBK",valid:"helper-text-m__valid__3TXlV",invalid:"helper-text-m__invalid__3pDuU"}},function(_,o){_.exports={" _key":"@dojo/themes/icon",icon:"icon-m__icon__29Rvx",plusIcon:"icon-m__plusIcon__3FXI0",minusIcon:"icon-m__minusIcon__Zo76x",checkIcon:"icon-m__checkIcon__Qkzz_",closeIcon:"icon-m__closeIcon__2ON_e",leftIcon:"icon-m__leftIcon__uPd4-",rightIcon:"icon-m__rightIcon__3AdyL",upIcon:"icon-m__upIcon__dNdUa",downIcon:"icon-m__downIcon__3IYHD",upAltIcon:"icon-m__upAltIcon__2uO_H",downAltIcon:"icon-m__downAltIcon__1v0n4",searchIcon:"icon-m__searchIcon__3GJXc",barsIcon:"icon-m__barsIcon__1ESjA",settingsIcon:"icon-m__settingsIcon__3v3Yu",alertIcon:"icon-m__alertIcon__UDaN8",helpIcon:"icon-m__helpIcon__3N5SV",infoIcon:"icon-m__infoIcon__1Cyl0",phoneIcon:"icon-m__phoneIcon__1IoIV",editIcon:"icon-m__editIcon__3kKJu",dateIcon:"icon-m__dateIcon__RzS7O",linkIcon:"icon-m__linkIcon__2dV4J",locationIcon:"icon-m__locationIcon__3QiGp",secureIcon:"icon-m__secureIcon__1Bn76",mailIcon:"icon-m__mailIcon__3oHWt"}},function(_,o){_.exports={" _key":"@dojo/themes/label",root:"label-m__root__IUInj",secondary:"label-m__secondary__3CX03",required:"label-m__required__UvKrc"}},function(_,o){_.exports={" _key":"@dojo/themes/listbox",root:"listbox-m__root__HcZvV",option:"listbox-m__option__KnxUU",focused:"listbox-m__focused__2CirT",activeOption:"listbox-m__activeOption__3l1VA",disabledOption:"listbox-m__disabledOption__222BT",selectedOption:"listbox-m__selectedOption__eEoO_ icon-m__checkIcon__Qkzz_"}},function(_,o){_.exports={" _key":"@dojo/themes/progress",output:"progress-m__output__1S6I1",bar:"progress-m__bar__2WdiU",progress:"progress-m__progress__27qhP"}},function(_,o){_.exports={" _key":"@dojo/themes/radio",root:"radio-m__root__3IL-l",input:"radio-m__input__2Jz8g",inputWrapper:"radio-m__inputWrapper__1dlq4",radioBackground:"radio-m__radioBackground__2zes3",radioOuter:"radio-m__radioOuter__1xIub",radioInner:"radio-m__radioInner__1SWnQ",focused:"radio-m__focused__2XTkW",checked:"radio-m__checked__36l7N",disabled:"radio-m__disabled__R3Lzk",readonly:"radio-m__readonly__1cp5u",required:"radio-m__required__vN9sq",invalid:"radio-m__invalid__-yZCT",valid:"radio-m__valid__1QF-n"}},function(_,o){_.exports={" _key":"@dojo/themes/range-slider",root:"range-slider-m__root__3YTMP",inputWrapper:"range-slider-m__inputWrapper__Wxdu8",filled:"range-slider-m__filled__1eseq",thumb:"range-slider-m__thumb__jp_yW",input:"range-slider-m__input__VKeZp",focused:"range-slider-m__focused__28vL2",hasOutput:"range-slider-m__hasOutput__QORMJ",outputTooltip:"range-slider-m__outputTooltip__19xMO",output:"range-slider-m__output__1Fj1P",disabled:"range-slider-m__disabled__3lTQ_",readonly:"range-slider-m__readonly__2GxMc",invalid:"range-slider-m__invalid__3-06_"}},function(_,o){_.exports={" _key":"@dojo/themes/select",root:"select-m__root__26Kq_",inputWrapper:"select-m__inputWrapper__2BMKU",trigger:"select-m__trigger__2s_Ja",placeholder:"select-m__placeholder__2GUfD",arrow:"select-m__arrow__2x1Fv",dropdown:"select-m__dropdown__1Bwjz",open:"select-m__open__1cgTL",fadeInOpacity:"select-m__fadeInOpacity__198JF",input:"select-m__input__2FjBi",disabled:"select-m__disabled__jq5IA",readonly:"select-m__readonly__3W31j",invalid:"select-m__invalid__1ptBm",valid:"select-m__valid__3Aknn"}},function(_,o){_.exports={" _key":"@dojo/themes/slide-pane",root:"slide-pane-m__root__1EHLR",underlayVisible:"slide-pane-m__underlayVisible__ArceX",pane:"slide-pane-m__pane__1bSbK",content:"slide-pane-m__content__1IFp8",title:"slide-pane-m__title__15zoz",close:"slide-pane-m__close__2VdzM",left:"slide-pane-m__left__15D6J",right:"slide-pane-m__right__2B-4A",top:"slide-pane-m__top__2YMft",bottom:"slide-pane-m__bottom__2AKwb",slideIn:"slide-pane-m__slideIn__2Lp8d",slideOut:"slide-pane-m__slideOut__2OjVj",open:"slide-pane-m__open__3SMPY"}},function(_,o){_.exports={" _key":"@dojo/themes/slider",root:"slider-m__root__1RGAu",inputWrapper:"slider-m__inputWrapper__2YSMI",track:"slider-m__track__3AQ0b",fill:"slider-m__fill__2oeLf",thumb:"slider-m__thumb__Ugyi1",input:"slider-m__input__2oQNc",outputTooltip:"slider-m__outputTooltip__1Xl0A",output:"slider-m__output__3uXPM",vertical:"slider-m__vertical__GdaBF",disabled:"slider-m__disabled__2IKl_",readonly:"slider-m__readonly__2pqiY",invalid:"slider-m__invalid__2EM0U",valid:"slider-m__valid__2okjY"}},function(_,o){_.exports={" _key":"@dojo/themes/snackbar",root:"snackbar-m__root__3IT2o",content:"snackbar-m__content__4q0Dm",label:"snackbar-m__label__3aGyE",actions:"snackbar-m__actions__3iIao",open:"snackbar-m__open__3G0MV",success:"snackbar-m__success__34Ja6",error:"snackbar-m__error__uVBQ5",leading:"snackbar-m__leading__Lhf3s",stacked:"snackbar-m__stacked__3-S_K"}},function(_,o){_.exports={" _key":"@dojo/themes/split-pane",root:"split-pane-m__root__31jlU",divider:"split-pane-m__divider__3BweO",row:"split-pane-m__row__2MC6H",column:"split-pane-m__column__cnVlo"}},function(_,o){_.exports={" _key":"@dojo/themes/tab-controller",root:"tab-controller-m__root__2_aGQ",tabButtons:"tab-controller-m__tabButtons__3LfvE",tabButton:"tab-controller-m__tabButton__EnWBC",disabledTabButton:"tab-controller-m__disabledTabButton__2KI7e",activeTabButton:"tab-controller-m__activeTabButton__XObce",close:"tab-controller-m__close__rEsae",closeable:"tab-controller-m__closeable__10d6O",tab:"tab-controller-m__tab__1l0fc",alignLeft:"tab-controller-m__alignLeft__aSEjU",tabs:"tab-controller-m__tabs__2UZtw",alignRight:"tab-controller-m__alignRight__VIwmx",alignBottom:"tab-controller-m__alignBottom__iK1Ie"}},function(_,o){_.exports={" _key":"@dojo/themes/text-area",root:"text-area-m__root__1sG4A",input:"text-area-m__input__2jXv4",disabled:"text-area-m__disabled__3FFoi",readonly:"text-area-m__readonly__2k5Qt",invalid:"text-area-m__invalid__3skJE",valid:"text-area-m__valid__pXrLF"}},function(_,o){_.exports={" _key":"@dojo/themes/text-input",root:"text-input-m__root__32FMV",input:"text-input-m__input__3w7ig",inputWrapper:"text-input-m__inputWrapper__2QZvb",focused:"text-input-m__focused__2dbPF",disabled:"text-input-m__disabled__3g9Iy",readonly:"text-input-m__readonly__D8rTe",invalid:"text-input-m__invalid__2kJsD",valid:"text-input-m__valid__YQsgJ",leading:"text-input-m__leading__3G3nB",trailing:"text-input-m__trailing__1L2gL"}},function(_,o){_.exports={" _key":"@dojo/themes/time-picker",root:"time-picker-m__root__3ErGo",input:"time-picker-m__input__Zvi8j",disabled:"time-picker-m__disabled__8SmXq",readonly:"time-picker-m__readonly__22nOd",invalid:"time-picker-m__invalid__1w_rb",valid:"time-picker-m__valid__3AKOy"}},function(_,o){_.exports={" _key":"@dojo/themes/title-pane",root:"title-pane-m__root__YjYfy",titleButton:"title-pane-m__titleButton__slFPn",content:"title-pane-m__content__12qlc",contentTransition:"title-pane-m__contentTransition__3sB3r",open:"title-pane-m__open__1Jisn",arrow:"title-pane-m__arrow__1S3QP"}},function(_,o){_.exports={" _key":"@dojo/themes/toolbar",root:"toolbar-m__root__zQuGH",title:"toolbar-m__title__3F385",menuButton:"toolbar-m__menuButton__1-lsg"}},function(_,o){_.exports={" _key":"@dojo/themes/tooltip",root:"tooltip-m__root__2i3mJ",content:"tooltip-m__content__38GZB",bottom:"tooltip-m__bottom__kAxkX",top:"tooltip-m__top__1KcTt",left:"tooltip-m__left__hfN_F",right:"tooltip-m__right__2oqgn"}}])});


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/i18n-plugin/templates/setLocaleData.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/i18n-plugin/templates/setLocaleData.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// tslint:disable
var i18n = __webpack_require__(/*! @dojo/framework/i18n/i18n */ "./node_modules/@dojo/framework/i18n/i18n.mjs");
var loadCldrData = __webpack_require__(/*! @dojo/framework/i18n/cldr/load */ "./node_modules/@dojo/framework/i18n/cldr/load.mjs").default;
var systemLocale = i18n.systemLocale;
var userLocale = systemLocale.replace(/^([a-z]{2}).*/i, '$1');
var isUserLocaleSupported = userLocale === 'en' ||
    ["de","es","fr"].some(function (locale) {
        return locale === systemLocale || locale === userLocale;
    });
loadCldrData({"supplemental":{"version":{"_unicodeVersion":"12.1.0","_cldrVersion":"36"},"plurals-type-cardinal":{"af":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ak":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"am":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"an":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ar":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …","pluralRule-count-many":"n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …","pluralRule-count-other":" @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ars":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …","pluralRule-count-many":"n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …","pluralRule-count-other":" @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"as":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"asa":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ast":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"az":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"be":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …","pluralRule-count-few":"n % 10 = 2..4 and n % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 2.0, 3.0, 4.0, 22.0, 23.0, 24.0, 32.0, 33.0, 102.0, 1002.0, …","pluralRule-count-many":"n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":"   @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …"},"bem":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bez":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bho":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bm":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bn":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"br":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11,71,91 @integer 1, 21, 31, 41, 51, 61, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 81.0, 101.0, 1001.0, …","pluralRule-count-two":"n % 10 = 2 and n % 100 != 12,72,92 @integer 2, 22, 32, 42, 52, 62, 82, 102, 1002, … @decimal 2.0, 22.0, 32.0, 42.0, 52.0, 62.0, 82.0, 102.0, 1002.0, …","pluralRule-count-few":"n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99 @integer 3, 4, 9, 23, 24, 29, 33, 34, 39, 43, 44, 49, 103, 1003, … @decimal 3.0, 4.0, 9.0, 23.0, 24.0, 29.0, 33.0, 34.0, 103.0, 1003.0, …","pluralRule-count-many":"n != 0 and n % 1000000 = 0 @integer 1000000, … @decimal 1000000.0, 1000000.00, 1000000.000, …","pluralRule-count-other":" @integer 0, 5~8, 10~20, 100, 1000, 10000, 100000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, …"},"brx":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bs":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ca":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ce":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ceb":{"pluralRule-count-one":"v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …"},"cgg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"chr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ckb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"cs":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"i = 2..4 and v = 0 @integer 2~4","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"cy":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n = 3 @integer 3 @decimal 3.0, 3.00, 3.000, 3.0000","pluralRule-count-many":"n = 6 @integer 6 @decimal 6.0, 6.00, 6.000, 6.0000","pluralRule-count-other":" @integer 4, 5, 7~20, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"da":{"pluralRule-count-one":"n = 1 or t != 0 and i = 0,1 @integer 1 @decimal 0.1~1.6","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0~3.4, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"de":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dsb":{"pluralRule-count-one":"v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-two":"v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dv":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dz":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ee":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"el":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"en":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"eo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"es":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"et":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"eu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fa":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ff":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fi":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fil":{"pluralRule-count-one":"v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …"},"fo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fr":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fur":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fy":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ga":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n = 3..6 @integer 3~6 @decimal 3.0, 4.0, 5.0, 6.0, 3.00, 4.00, 5.00, 6.00, 3.000, 4.000, 5.000, 6.000, 3.0000, 4.0000, 5.0000, 6.0000","pluralRule-count-many":"n = 7..10 @integer 7~10 @decimal 7.0, 8.0, 9.0, 10.0, 7.00, 8.00, 9.00, 10.00, 7.000, 8.000, 9.000, 10.000, 7.0000, 8.0000, 9.0000, 10.0000","pluralRule-count-other":" @integer 0, 11~25, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gd":{"pluralRule-count-one":"n = 1,11 @integer 1, 11 @decimal 1.0, 11.0, 1.00, 11.00, 1.000, 11.000, 1.0000","pluralRule-count-two":"n = 2,12 @integer 2, 12 @decimal 2.0, 12.0, 2.00, 12.00, 2.000, 12.000, 2.0000","pluralRule-count-few":"n = 3..10,13..19 @integer 3~10, 13~19 @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 3.00","pluralRule-count-other":" @integer 0, 20~34, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gsw":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gu":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"guw":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gv":{"pluralRule-count-one":"v = 0 and i % 10 = 1 @integer 1, 11, 21, 31, 41, 51, 61, 71, 101, 1001, …","pluralRule-count-two":"v = 0 and i % 10 = 2 @integer 2, 12, 22, 32, 42, 52, 62, 72, 102, 1002, …","pluralRule-count-few":"v = 0 and i % 100 = 0,20,40,60,80 @integer 0, 20, 40, 60, 80, 100, 120, 140, 1000, 10000, 100000, 1000000, …","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 3~10, 13~19, 23, 103, 1003, …"},"ha":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"haw":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"he":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-two":"i = 2 and v = 0 @integer 2","pluralRule-count-many":"v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":" @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hi":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hr":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hsb":{"pluralRule-count-one":"v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-two":"v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hy":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ia":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"id":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ig":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ii":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"in":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"io":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"is":{"pluralRule-count-one":"t = 0 and i % 10 = 1 and i % 100 != 11 or t != 0 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1~1.6, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"it":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"iu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"iw":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-two":"i = 2 and v = 0 @integer 2","pluralRule-count-many":"v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":" @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ja":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jbo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jgo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ji":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jmc":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jv":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jw":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ka":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kab":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kaj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kcg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kde":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kea":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kkj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kl":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"km":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kn":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ko":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ks":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ksb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ksh":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ku":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kw":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n % 100 = 2,22,42,62,82 or n % 1000 = 0 and n % 100000 = 1000..20000,40000,60000,80000 or n != 0 and n % 1000000 = 100000 @integer 2, 22, 42, 62, 82, 102, 122, 142, 1000, 10000, 100000, … @decimal 2.0, 22.0, 42.0, 62.0, 82.0, 102.0, 122.0, 142.0, 1000.0, 10000.0, 100000.0, …","pluralRule-count-few":"n % 100 = 3,23,43,63,83 @integer 3, 23, 43, 63, 83, 103, 123, 143, 1003, … @decimal 3.0, 23.0, 43.0, 63.0, 83.0, 103.0, 123.0, 143.0, 1003.0, …","pluralRule-count-many":"n != 1 and n % 100 = 1,21,41,61,81 @integer 21, 41, 61, 81, 101, 121, 141, 161, 1001, … @decimal 21.0, 41.0, 61.0, 81.0, 101.0, 121.0, 141.0, 161.0, 1001.0, …","pluralRule-count-other":" @integer 4~19, 100, 1004, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.1, 1000000.0, …"},"ky":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lag":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"i = 0,1 and n != 0 @integer 1 @decimal 0.1~1.6","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lkt":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ln":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lt":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11..19 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …","pluralRule-count-few":"n % 10 = 2..9 and n % 100 != 11..19 @integer 2~9, 22~29, 102, 1002, … @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 22.0, 102.0, 1002.0, …","pluralRule-count-many":"f != 0   @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lv":{"pluralRule-count-zero":"n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …"},"mas":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mg":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mgo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mk":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.2~1.0, 1.2~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ml":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mo":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v != 0 or n = 0 or n % 100 = 2..19 @integer 0, 2~16, 102, 1002, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, …"},"mr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ms":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mt":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-few":"n = 0 or n % 100 = 2..10 @integer 0, 2~10, 102~107, 1002, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 102.0, 1002.0, …","pluralRule-count-many":"n % 100 = 11..19 @integer 11~19, 111~117, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"my":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nah":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"naq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nd":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ne":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nnh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"no":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nqo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nso":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ny":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nyn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"om":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"or":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"os":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"osa":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pa":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pap":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"prg":{"pluralRule-count-zero":"n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …"},"ps":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pt":{"pluralRule-count-one":"i = 0..1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pt-PT":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"rm":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ro":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v != 0 or n = 0 or n % 100 = 2..19 @integer 0, 2~16, 102, 1002, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, …"},"rof":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"root":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ru":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"rwk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sah":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"saq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sc":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"scn":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sd":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sdh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"se":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"seh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ses":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sg":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sh":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"shi":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-few":"n = 2..10 @integer 2~10 @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00","pluralRule-count-other":" @integer 11~26, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~1.9, 2.1~2.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"si":{"pluralRule-count-one":"n = 0,1 or i = 0 and f = 1 @integer 0, 1 @decimal 0.0, 0.1, 1.0, 0.00, 0.01, 1.00, 0.000, 0.001, 1.000, 0.0000, 0.0001, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.2~0.9, 1.1~1.8, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sk":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"i = 2..4 and v = 0 @integer 2~4","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"sl":{"pluralRule-count-one":"v = 0 and i % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, …","pluralRule-count-two":"v = 0 and i % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or v != 0 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"sma":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smi":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sms":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"so":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sr":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ss":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ssy":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"st":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"su":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sv":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sw":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"syr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ta":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"te":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"teo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"th":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ti":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tig":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tl":{"pluralRule-count-one":"v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …"},"tn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"to":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ts":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tzm":{"pluralRule-count-one":"n = 0..1 or n = 11..99 @integer 0, 1, 11~24 @decimal 0.0, 1.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0","pluralRule-count-other":" @integer 2~10, 100~106, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ug":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"uk":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ur":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"uz":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ve":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vi":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vun":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wa":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wae":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"xh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"xog":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"yi":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"yo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"yue":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"zh":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"zu":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"}},"likelySubtags":{"aa":"aa-Latn-ET","aai":"aai-Latn-ZZ","aak":"aak-Latn-ZZ","aau":"aau-Latn-ZZ","ab":"ab-Cyrl-GE","abi":"abi-Latn-ZZ","abq":"abq-Cyrl-ZZ","abr":"abr-Latn-GH","abt":"abt-Latn-ZZ","aby":"aby-Latn-ZZ","acd":"acd-Latn-ZZ","ace":"ace-Latn-ID","ach":"ach-Latn-UG","ada":"ada-Latn-GH","ade":"ade-Latn-ZZ","adj":"adj-Latn-ZZ","adp":"adp-Tibt-BT","ady":"ady-Cyrl-RU","adz":"adz-Latn-ZZ","ae":"ae-Avst-IR","aeb":"aeb-Arab-TN","aey":"aey-Latn-ZZ","af":"af-Latn-ZA","agc":"agc-Latn-ZZ","agd":"agd-Latn-ZZ","agg":"agg-Latn-ZZ","agm":"agm-Latn-ZZ","ago":"ago-Latn-ZZ","agq":"agq-Latn-CM","aha":"aha-Latn-ZZ","ahl":"ahl-Latn-ZZ","aho":"aho-Ahom-IN","ajg":"ajg-Latn-ZZ","ak":"ak-Latn-GH","akk":"akk-Xsux-IQ","ala":"ala-Latn-ZZ","ali":"ali-Latn-ZZ","aln":"aln-Latn-XK","alt":"alt-Cyrl-RU","am":"am-Ethi-ET","amm":"amm-Latn-ZZ","amn":"amn-Latn-ZZ","amo":"amo-Latn-NG","amp":"amp-Latn-ZZ","an":"an-Latn-ES","anc":"anc-Latn-ZZ","ank":"ank-Latn-ZZ","ann":"ann-Latn-ZZ","any":"any-Latn-ZZ","aoj":"aoj-Latn-ZZ","aom":"aom-Latn-ZZ","aoz":"aoz-Latn-ID","apc":"apc-Arab-ZZ","apd":"apd-Arab-TG","ape":"ape-Latn-ZZ","apr":"apr-Latn-ZZ","aps":"aps-Latn-ZZ","apz":"apz-Latn-ZZ","ar":"ar-Arab-EG","arc":"arc-Armi-IR","arc-Nbat":"arc-Nbat-JO","arc-Palm":"arc-Palm-SY","arh":"arh-Latn-ZZ","arn":"arn-Latn-CL","aro":"aro-Latn-BO","arq":"arq-Arab-DZ","ars":"ars-Arab-SA","ary":"ary-Arab-MA","arz":"arz-Arab-EG","as":"as-Beng-IN","asa":"asa-Latn-TZ","ase":"ase-Sgnw-US","asg":"asg-Latn-ZZ","aso":"aso-Latn-ZZ","ast":"ast-Latn-ES","ata":"ata-Latn-ZZ","atg":"atg-Latn-ZZ","atj":"atj-Latn-CA","auy":"auy-Latn-ZZ","av":"av-Cyrl-RU","avl":"avl-Arab-ZZ","avn":"avn-Latn-ZZ","avt":"avt-Latn-ZZ","avu":"avu-Latn-ZZ","awa":"awa-Deva-IN","awb":"awb-Latn-ZZ","awo":"awo-Latn-ZZ","awx":"awx-Latn-ZZ","ay":"ay-Latn-BO","ayb":"ayb-Latn-ZZ","az":"az-Latn-AZ","az-Arab":"az-Arab-IR","az-IQ":"az-Arab-IQ","az-IR":"az-Arab-IR","az-RU":"az-Cyrl-RU","ba":"ba-Cyrl-RU","bal":"bal-Arab-PK","ban":"ban-Latn-ID","bap":"bap-Deva-NP","bar":"bar-Latn-AT","bas":"bas-Latn-CM","bav":"bav-Latn-ZZ","bax":"bax-Bamu-CM","bba":"bba-Latn-ZZ","bbb":"bbb-Latn-ZZ","bbc":"bbc-Latn-ID","bbd":"bbd-Latn-ZZ","bbj":"bbj-Latn-CM","bbp":"bbp-Latn-ZZ","bbr":"bbr-Latn-ZZ","bcf":"bcf-Latn-ZZ","bch":"bch-Latn-ZZ","bci":"bci-Latn-CI","bcm":"bcm-Latn-ZZ","bcn":"bcn-Latn-ZZ","bco":"bco-Latn-ZZ","bcq":"bcq-Ethi-ZZ","bcu":"bcu-Latn-ZZ","bdd":"bdd-Latn-ZZ","be":"be-Cyrl-BY","bef":"bef-Latn-ZZ","beh":"beh-Latn-ZZ","bej":"bej-Arab-SD","bem":"bem-Latn-ZM","bet":"bet-Latn-ZZ","bew":"bew-Latn-ID","bex":"bex-Latn-ZZ","bez":"bez-Latn-TZ","bfd":"bfd-Latn-CM","bfq":"bfq-Taml-IN","bft":"bft-Arab-PK","bfy":"bfy-Deva-IN","bg":"bg-Cyrl-BG","bgc":"bgc-Deva-IN","bgn":"bgn-Arab-PK","bgx":"bgx-Grek-TR","bhb":"bhb-Deva-IN","bhg":"bhg-Latn-ZZ","bhi":"bhi-Deva-IN","bhl":"bhl-Latn-ZZ","bho":"bho-Deva-IN","bhy":"bhy-Latn-ZZ","bi":"bi-Latn-VU","bib":"bib-Latn-ZZ","big":"big-Latn-ZZ","bik":"bik-Latn-PH","bim":"bim-Latn-ZZ","bin":"bin-Latn-NG","bio":"bio-Latn-ZZ","biq":"biq-Latn-ZZ","bjh":"bjh-Latn-ZZ","bji":"bji-Ethi-ZZ","bjj":"bjj-Deva-IN","bjn":"bjn-Latn-ID","bjo":"bjo-Latn-ZZ","bjr":"bjr-Latn-ZZ","bjt":"bjt-Latn-SN","bjz":"bjz-Latn-ZZ","bkc":"bkc-Latn-ZZ","bkm":"bkm-Latn-CM","bkq":"bkq-Latn-ZZ","bku":"bku-Latn-PH","bkv":"bkv-Latn-ZZ","blt":"blt-Tavt-VN","bm":"bm-Latn-ML","bmh":"bmh-Latn-ZZ","bmk":"bmk-Latn-ZZ","bmq":"bmq-Latn-ML","bmu":"bmu-Latn-ZZ","bn":"bn-Beng-BD","bng":"bng-Latn-ZZ","bnm":"bnm-Latn-ZZ","bnp":"bnp-Latn-ZZ","bo":"bo-Tibt-CN","boj":"boj-Latn-ZZ","bom":"bom-Latn-ZZ","bon":"bon-Latn-ZZ","bpy":"bpy-Beng-IN","bqc":"bqc-Latn-ZZ","bqi":"bqi-Arab-IR","bqp":"bqp-Latn-ZZ","bqv":"bqv-Latn-CI","br":"br-Latn-FR","bra":"bra-Deva-IN","brh":"brh-Arab-PK","brx":"brx-Deva-IN","brz":"brz-Latn-ZZ","bs":"bs-Latn-BA","bsj":"bsj-Latn-ZZ","bsq":"bsq-Bass-LR","bss":"bss-Latn-CM","bst":"bst-Ethi-ZZ","bto":"bto-Latn-PH","btt":"btt-Latn-ZZ","btv":"btv-Deva-PK","bua":"bua-Cyrl-RU","buc":"buc-Latn-YT","bud":"bud-Latn-ZZ","bug":"bug-Latn-ID","buk":"buk-Latn-ZZ","bum":"bum-Latn-CM","buo":"buo-Latn-ZZ","bus":"bus-Latn-ZZ","buu":"buu-Latn-ZZ","bvb":"bvb-Latn-GQ","bwd":"bwd-Latn-ZZ","bwr":"bwr-Latn-ZZ","bxh":"bxh-Latn-ZZ","bye":"bye-Latn-ZZ","byn":"byn-Ethi-ER","byr":"byr-Latn-ZZ","bys":"bys-Latn-ZZ","byv":"byv-Latn-CM","byx":"byx-Latn-ZZ","bza":"bza-Latn-ZZ","bze":"bze-Latn-ML","bzf":"bzf-Latn-ZZ","bzh":"bzh-Latn-ZZ","bzw":"bzw-Latn-ZZ","ca":"ca-Latn-ES","can":"can-Latn-ZZ","cbj":"cbj-Latn-ZZ","cch":"cch-Latn-NG","ccp":"ccp-Cakm-BD","ce":"ce-Cyrl-RU","ceb":"ceb-Latn-PH","cfa":"cfa-Latn-ZZ","cgg":"cgg-Latn-UG","ch":"ch-Latn-GU","chk":"chk-Latn-FM","chm":"chm-Cyrl-RU","cho":"cho-Latn-US","chp":"chp-Latn-CA","chr":"chr-Cher-US","cic":"cic-Latn-US","cja":"cja-Arab-KH","cjm":"cjm-Cham-VN","cjv":"cjv-Latn-ZZ","ckb":"ckb-Arab-IQ","ckl":"ckl-Latn-ZZ","cko":"cko-Latn-ZZ","cky":"cky-Latn-ZZ","cla":"cla-Latn-ZZ","cme":"cme-Latn-ZZ","cmg":"cmg-Soyo-MN","co":"co-Latn-FR","cop":"cop-Copt-EG","cps":"cps-Latn-PH","cr":"cr-Cans-CA","crh":"crh-Cyrl-UA","crj":"crj-Cans-CA","crk":"crk-Cans-CA","crl":"crl-Cans-CA","crm":"crm-Cans-CA","crs":"crs-Latn-SC","cs":"cs-Latn-CZ","csb":"csb-Latn-PL","csw":"csw-Cans-CA","ctd":"ctd-Pauc-MM","cu":"cu-Cyrl-RU","cu-Glag":"cu-Glag-BG","cv":"cv-Cyrl-RU","cy":"cy-Latn-GB","da":"da-Latn-DK","dad":"dad-Latn-ZZ","daf":"daf-Latn-ZZ","dag":"dag-Latn-ZZ","dah":"dah-Latn-ZZ","dak":"dak-Latn-US","dar":"dar-Cyrl-RU","dav":"dav-Latn-KE","dbd":"dbd-Latn-ZZ","dbq":"dbq-Latn-ZZ","dcc":"dcc-Arab-IN","ddn":"ddn-Latn-ZZ","de":"de-Latn-DE","ded":"ded-Latn-ZZ","den":"den-Latn-CA","dga":"dga-Latn-ZZ","dgh":"dgh-Latn-ZZ","dgi":"dgi-Latn-ZZ","dgl":"dgl-Arab-ZZ","dgr":"dgr-Latn-CA","dgz":"dgz-Latn-ZZ","dia":"dia-Latn-ZZ","dje":"dje-Latn-NE","dnj":"dnj-Latn-CI","dob":"dob-Latn-ZZ","doi":"doi-Arab-IN","dop":"dop-Latn-ZZ","dow":"dow-Latn-ZZ","drh":"drh-Mong-CN","dri":"dri-Latn-ZZ","drs":"drs-Ethi-ZZ","dsb":"dsb-Latn-DE","dtm":"dtm-Latn-ML","dtp":"dtp-Latn-MY","dts":"dts-Latn-ZZ","dty":"dty-Deva-NP","dua":"dua-Latn-CM","duc":"duc-Latn-ZZ","dud":"dud-Latn-ZZ","dug":"dug-Latn-ZZ","dv":"dv-Thaa-MV","dva":"dva-Latn-ZZ","dww":"dww-Latn-ZZ","dyo":"dyo-Latn-SN","dyu":"dyu-Latn-BF","dz":"dz-Tibt-BT","dzg":"dzg-Latn-ZZ","ebu":"ebu-Latn-KE","ee":"ee-Latn-GH","efi":"efi-Latn-NG","egl":"egl-Latn-IT","egy":"egy-Egyp-EG","eka":"eka-Latn-ZZ","eky":"eky-Kali-MM","el":"el-Grek-GR","ema":"ema-Latn-ZZ","emi":"emi-Latn-ZZ","en":"en-Latn-US","en-Shaw":"en-Shaw-GB","enn":"enn-Latn-ZZ","enq":"enq-Latn-ZZ","eo":"eo-Latn-001","eri":"eri-Latn-ZZ","es":"es-Latn-ES","esg":"esg-Gonm-IN","esu":"esu-Latn-US","et":"et-Latn-EE","etr":"etr-Latn-ZZ","ett":"ett-Ital-IT","etu":"etu-Latn-ZZ","etx":"etx-Latn-ZZ","eu":"eu-Latn-ES","ewo":"ewo-Latn-CM","ext":"ext-Latn-ES","fa":"fa-Arab-IR","faa":"faa-Latn-ZZ","fab":"fab-Latn-ZZ","fag":"fag-Latn-ZZ","fai":"fai-Latn-ZZ","fan":"fan-Latn-GQ","ff":"ff-Latn-SN","ff-Adlm":"ff-Adlm-GN","ffi":"ffi-Latn-ZZ","ffm":"ffm-Latn-ML","fi":"fi-Latn-FI","fia":"fia-Arab-SD","fil":"fil-Latn-PH","fit":"fit-Latn-SE","fj":"fj-Latn-FJ","flr":"flr-Latn-ZZ","fmp":"fmp-Latn-ZZ","fo":"fo-Latn-FO","fod":"fod-Latn-ZZ","fon":"fon-Latn-BJ","for":"for-Latn-ZZ","fpe":"fpe-Latn-ZZ","fqs":"fqs-Latn-ZZ","fr":"fr-Latn-FR","frc":"frc-Latn-US","frp":"frp-Latn-FR","frr":"frr-Latn-DE","frs":"frs-Latn-DE","fub":"fub-Arab-CM","fud":"fud-Latn-WF","fue":"fue-Latn-ZZ","fuf":"fuf-Latn-GN","fuh":"fuh-Latn-ZZ","fuq":"fuq-Latn-NE","fur":"fur-Latn-IT","fuv":"fuv-Latn-NG","fuy":"fuy-Latn-ZZ","fvr":"fvr-Latn-SD","fy":"fy-Latn-NL","ga":"ga-Latn-IE","gaa":"gaa-Latn-GH","gaf":"gaf-Latn-ZZ","gag":"gag-Latn-MD","gah":"gah-Latn-ZZ","gaj":"gaj-Latn-ZZ","gam":"gam-Latn-ZZ","gan":"gan-Hans-CN","gaw":"gaw-Latn-ZZ","gay":"gay-Latn-ID","gba":"gba-Latn-ZZ","gbf":"gbf-Latn-ZZ","gbm":"gbm-Deva-IN","gby":"gby-Latn-ZZ","gbz":"gbz-Arab-IR","gcr":"gcr-Latn-GF","gd":"gd-Latn-GB","gde":"gde-Latn-ZZ","gdn":"gdn-Latn-ZZ","gdr":"gdr-Latn-ZZ","geb":"geb-Latn-ZZ","gej":"gej-Latn-ZZ","gel":"gel-Latn-ZZ","gez":"gez-Ethi-ET","gfk":"gfk-Latn-ZZ","ggn":"ggn-Deva-NP","ghs":"ghs-Latn-ZZ","gil":"gil-Latn-KI","gim":"gim-Latn-ZZ","gjk":"gjk-Arab-PK","gjn":"gjn-Latn-ZZ","gju":"gju-Arab-PK","gkn":"gkn-Latn-ZZ","gkp":"gkp-Latn-ZZ","gl":"gl-Latn-ES","glk":"glk-Arab-IR","gmm":"gmm-Latn-ZZ","gmv":"gmv-Ethi-ZZ","gn":"gn-Latn-PY","gnd":"gnd-Latn-ZZ","gng":"gng-Latn-ZZ","god":"god-Latn-ZZ","gof":"gof-Ethi-ZZ","goi":"goi-Latn-ZZ","gom":"gom-Deva-IN","gon":"gon-Telu-IN","gor":"gor-Latn-ID","gos":"gos-Latn-NL","got":"got-Goth-UA","grb":"grb-Latn-ZZ","grc":"grc-Cprt-CY","grc-Linb":"grc-Linb-GR","grt":"grt-Beng-IN","grw":"grw-Latn-ZZ","gsw":"gsw-Latn-CH","gu":"gu-Gujr-IN","gub":"gub-Latn-BR","guc":"guc-Latn-CO","gud":"gud-Latn-ZZ","gur":"gur-Latn-GH","guw":"guw-Latn-ZZ","gux":"gux-Latn-ZZ","guz":"guz-Latn-KE","gv":"gv-Latn-IM","gvf":"gvf-Latn-ZZ","gvr":"gvr-Deva-NP","gvs":"gvs-Latn-ZZ","gwc":"gwc-Arab-ZZ","gwi":"gwi-Latn-CA","gwt":"gwt-Arab-ZZ","gyi":"gyi-Latn-ZZ","ha":"ha-Latn-NG","ha-CM":"ha-Arab-CM","ha-SD":"ha-Arab-SD","hag":"hag-Latn-ZZ","hak":"hak-Hans-CN","ham":"ham-Latn-ZZ","haw":"haw-Latn-US","haz":"haz-Arab-AF","hbb":"hbb-Latn-ZZ","hdy":"hdy-Ethi-ZZ","he":"he-Hebr-IL","hhy":"hhy-Latn-ZZ","hi":"hi-Deva-IN","hia":"hia-Latn-ZZ","hif":"hif-Latn-FJ","hig":"hig-Latn-ZZ","hih":"hih-Latn-ZZ","hil":"hil-Latn-PH","hla":"hla-Latn-ZZ","hlu":"hlu-Hluw-TR","hmd":"hmd-Plrd-CN","hmt":"hmt-Latn-ZZ","hnd":"hnd-Arab-PK","hne":"hne-Deva-IN","hnj":"hnj-Hmng-LA","hnn":"hnn-Latn-PH","hno":"hno-Arab-PK","ho":"ho-Latn-PG","hoc":"hoc-Deva-IN","hoj":"hoj-Deva-IN","hot":"hot-Latn-ZZ","hr":"hr-Latn-HR","hsb":"hsb-Latn-DE","hsn":"hsn-Hans-CN","ht":"ht-Latn-HT","hu":"hu-Latn-HU","hui":"hui-Latn-ZZ","hy":"hy-Armn-AM","hz":"hz-Latn-NA","ia":"ia-Latn-001","ian":"ian-Latn-ZZ","iar":"iar-Latn-ZZ","iba":"iba-Latn-MY","ibb":"ibb-Latn-NG","iby":"iby-Latn-ZZ","ica":"ica-Latn-ZZ","ich":"ich-Latn-ZZ","id":"id-Latn-ID","idd":"idd-Latn-ZZ","idi":"idi-Latn-ZZ","idu":"idu-Latn-ZZ","ife":"ife-Latn-TG","ig":"ig-Latn-NG","igb":"igb-Latn-ZZ","ige":"ige-Latn-ZZ","ii":"ii-Yiii-CN","ijj":"ijj-Latn-ZZ","ik":"ik-Latn-US","ikk":"ikk-Latn-ZZ","ikt":"ikt-Latn-CA","ikw":"ikw-Latn-ZZ","ikx":"ikx-Latn-ZZ","ilo":"ilo-Latn-PH","imo":"imo-Latn-ZZ","in":"in-Latn-ID","inh":"inh-Cyrl-RU","io":"io-Latn-001","iou":"iou-Latn-ZZ","iri":"iri-Latn-ZZ","is":"is-Latn-IS","it":"it-Latn-IT","iu":"iu-Cans-CA","iw":"iw-Hebr-IL","iwm":"iwm-Latn-ZZ","iws":"iws-Latn-ZZ","izh":"izh-Latn-RU","izi":"izi-Latn-ZZ","ja":"ja-Jpan-JP","jab":"jab-Latn-ZZ","jam":"jam-Latn-JM","jbo":"jbo-Latn-001","jbu":"jbu-Latn-ZZ","jen":"jen-Latn-ZZ","jgk":"jgk-Latn-ZZ","jgo":"jgo-Latn-CM","ji":"ji-Hebr-UA","jib":"jib-Latn-ZZ","jmc":"jmc-Latn-TZ","jml":"jml-Deva-NP","jra":"jra-Latn-ZZ","jut":"jut-Latn-DK","jv":"jv-Latn-ID","jw":"jw-Latn-ID","ka":"ka-Geor-GE","kaa":"kaa-Cyrl-UZ","kab":"kab-Latn-DZ","kac":"kac-Latn-MM","kad":"kad-Latn-ZZ","kai":"kai-Latn-ZZ","kaj":"kaj-Latn-NG","kam":"kam-Latn-KE","kao":"kao-Latn-ML","kbd":"kbd-Cyrl-RU","kbm":"kbm-Latn-ZZ","kbp":"kbp-Latn-ZZ","kbq":"kbq-Latn-ZZ","kbx":"kbx-Latn-ZZ","kby":"kby-Arab-NE","kcg":"kcg-Latn-NG","kck":"kck-Latn-ZW","kcl":"kcl-Latn-ZZ","kct":"kct-Latn-ZZ","kde":"kde-Latn-TZ","kdh":"kdh-Arab-TG","kdl":"kdl-Latn-ZZ","kdt":"kdt-Thai-TH","kea":"kea-Latn-CV","ken":"ken-Latn-CM","kez":"kez-Latn-ZZ","kfo":"kfo-Latn-CI","kfr":"kfr-Deva-IN","kfy":"kfy-Deva-IN","kg":"kg-Latn-CD","kge":"kge-Latn-ID","kgf":"kgf-Latn-ZZ","kgp":"kgp-Latn-BR","kha":"kha-Latn-IN","khb":"khb-Talu-CN","khn":"khn-Deva-IN","khq":"khq-Latn-ML","khs":"khs-Latn-ZZ","kht":"kht-Mymr-IN","khw":"khw-Arab-PK","khz":"khz-Latn-ZZ","ki":"ki-Latn-KE","kij":"kij-Latn-ZZ","kiu":"kiu-Latn-TR","kiw":"kiw-Latn-ZZ","kj":"kj-Latn-NA","kjd":"kjd-Latn-ZZ","kjg":"kjg-Laoo-LA","kjs":"kjs-Latn-ZZ","kjy":"kjy-Latn-ZZ","kk":"kk-Cyrl-KZ","kk-AF":"kk-Arab-AF","kk-Arab":"kk-Arab-CN","kk-CN":"kk-Arab-CN","kk-IR":"kk-Arab-IR","kk-MN":"kk-Arab-MN","kkc":"kkc-Latn-ZZ","kkj":"kkj-Latn-CM","kl":"kl-Latn-GL","kln":"kln-Latn-KE","klq":"klq-Latn-ZZ","klt":"klt-Latn-ZZ","klx":"klx-Latn-ZZ","km":"km-Khmr-KH","kmb":"kmb-Latn-AO","kmh":"kmh-Latn-ZZ","kmo":"kmo-Latn-ZZ","kms":"kms-Latn-ZZ","kmu":"kmu-Latn-ZZ","kmw":"kmw-Latn-ZZ","kn":"kn-Knda-IN","knf":"knf-Latn-GW","knp":"knp-Latn-ZZ","ko":"ko-Kore-KR","koi":"koi-Cyrl-RU","kok":"kok-Deva-IN","kol":"kol-Latn-ZZ","kos":"kos-Latn-FM","koz":"koz-Latn-ZZ","kpe":"kpe-Latn-LR","kpf":"kpf-Latn-ZZ","kpo":"kpo-Latn-ZZ","kpr":"kpr-Latn-ZZ","kpx":"kpx-Latn-ZZ","kqb":"kqb-Latn-ZZ","kqf":"kqf-Latn-ZZ","kqs":"kqs-Latn-ZZ","kqy":"kqy-Ethi-ZZ","kr":"kr-Latn-ZZ","krc":"krc-Cyrl-RU","kri":"kri-Latn-SL","krj":"krj-Latn-PH","krl":"krl-Latn-RU","krs":"krs-Latn-ZZ","kru":"kru-Deva-IN","ks":"ks-Arab-IN","ksb":"ksb-Latn-TZ","ksd":"ksd-Latn-ZZ","ksf":"ksf-Latn-CM","ksh":"ksh-Latn-DE","ksj":"ksj-Latn-ZZ","ksr":"ksr-Latn-ZZ","ktb":"ktb-Ethi-ZZ","ktm":"ktm-Latn-ZZ","kto":"kto-Latn-ZZ","ktr":"ktr-Latn-MY","ku":"ku-Latn-TR","ku-Arab":"ku-Arab-IQ","ku-LB":"ku-Arab-LB","kub":"kub-Latn-ZZ","kud":"kud-Latn-ZZ","kue":"kue-Latn-ZZ","kuj":"kuj-Latn-ZZ","kum":"kum-Cyrl-RU","kun":"kun-Latn-ZZ","kup":"kup-Latn-ZZ","kus":"kus-Latn-ZZ","kv":"kv-Cyrl-RU","kvg":"kvg-Latn-ZZ","kvr":"kvr-Latn-ID","kvx":"kvx-Arab-PK","kw":"kw-Latn-GB","kwj":"kwj-Latn-ZZ","kwo":"kwo-Latn-ZZ","kwq":"kwq-Latn-ZZ","kxa":"kxa-Latn-ZZ","kxc":"kxc-Ethi-ZZ","kxe":"kxe-Latn-ZZ","kxm":"kxm-Thai-TH","kxp":"kxp-Arab-PK","kxw":"kxw-Latn-ZZ","kxz":"kxz-Latn-ZZ","ky":"ky-Cyrl-KG","ky-Arab":"ky-Arab-CN","ky-CN":"ky-Arab-CN","ky-Latn":"ky-Latn-TR","ky-TR":"ky-Latn-TR","kye":"kye-Latn-ZZ","kyx":"kyx-Latn-ZZ","kzj":"kzj-Latn-MY","kzr":"kzr-Latn-ZZ","kzt":"kzt-Latn-MY","la":"la-Latn-VA","lab":"lab-Lina-GR","lad":"lad-Hebr-IL","lag":"lag-Latn-TZ","lah":"lah-Arab-PK","laj":"laj-Latn-UG","las":"las-Latn-ZZ","lb":"lb-Latn-LU","lbe":"lbe-Cyrl-RU","lbu":"lbu-Latn-ZZ","lbw":"lbw-Latn-ID","lcm":"lcm-Latn-ZZ","lcp":"lcp-Thai-CN","ldb":"ldb-Latn-ZZ","led":"led-Latn-ZZ","lee":"lee-Latn-ZZ","lem":"lem-Latn-ZZ","lep":"lep-Lepc-IN","leq":"leq-Latn-ZZ","leu":"leu-Latn-ZZ","lez":"lez-Cyrl-RU","lg":"lg-Latn-UG","lgg":"lgg-Latn-ZZ","li":"li-Latn-NL","lia":"lia-Latn-ZZ","lid":"lid-Latn-ZZ","lif":"lif-Deva-NP","lif-Limb":"lif-Limb-IN","lig":"lig-Latn-ZZ","lih":"lih-Latn-ZZ","lij":"lij-Latn-IT","lis":"lis-Lisu-CN","ljp":"ljp-Latn-ID","lki":"lki-Arab-IR","lkt":"lkt-Latn-US","lle":"lle-Latn-ZZ","lln":"lln-Latn-ZZ","lmn":"lmn-Telu-IN","lmo":"lmo-Latn-IT","lmp":"lmp-Latn-ZZ","ln":"ln-Latn-CD","lns":"lns-Latn-ZZ","lnu":"lnu-Latn-ZZ","lo":"lo-Laoo-LA","loj":"loj-Latn-ZZ","lok":"lok-Latn-ZZ","lol":"lol-Latn-CD","lor":"lor-Latn-ZZ","los":"los-Latn-ZZ","loz":"loz-Latn-ZM","lrc":"lrc-Arab-IR","lt":"lt-Latn-LT","ltg":"ltg-Latn-LV","lu":"lu-Latn-CD","lua":"lua-Latn-CD","luo":"luo-Latn-KE","luy":"luy-Latn-KE","luz":"luz-Arab-IR","lv":"lv-Latn-LV","lwl":"lwl-Thai-TH","lzh":"lzh-Hans-CN","lzz":"lzz-Latn-TR","mad":"mad-Latn-ID","maf":"maf-Latn-CM","mag":"mag-Deva-IN","mai":"mai-Deva-IN","mak":"mak-Latn-ID","man":"man-Latn-GM","man-GN":"man-Nkoo-GN","man-Nkoo":"man-Nkoo-GN","mas":"mas-Latn-KE","maw":"maw-Latn-ZZ","maz":"maz-Latn-MX","mbh":"mbh-Latn-ZZ","mbo":"mbo-Latn-ZZ","mbq":"mbq-Latn-ZZ","mbu":"mbu-Latn-ZZ","mbw":"mbw-Latn-ZZ","mci":"mci-Latn-ZZ","mcp":"mcp-Latn-ZZ","mcq":"mcq-Latn-ZZ","mcr":"mcr-Latn-ZZ","mcu":"mcu-Latn-ZZ","mda":"mda-Latn-ZZ","mde":"mde-Arab-ZZ","mdf":"mdf-Cyrl-RU","mdh":"mdh-Latn-PH","mdj":"mdj-Latn-ZZ","mdr":"mdr-Latn-ID","mdx":"mdx-Ethi-ZZ","med":"med-Latn-ZZ","mee":"mee-Latn-ZZ","mek":"mek-Latn-ZZ","men":"men-Latn-SL","mer":"mer-Latn-KE","met":"met-Latn-ZZ","meu":"meu-Latn-ZZ","mfa":"mfa-Arab-TH","mfe":"mfe-Latn-MU","mfn":"mfn-Latn-ZZ","mfo":"mfo-Latn-ZZ","mfq":"mfq-Latn-ZZ","mg":"mg-Latn-MG","mgh":"mgh-Latn-MZ","mgl":"mgl-Latn-ZZ","mgo":"mgo-Latn-CM","mgp":"mgp-Deva-NP","mgy":"mgy-Latn-TZ","mh":"mh-Latn-MH","mhi":"mhi-Latn-ZZ","mhl":"mhl-Latn-ZZ","mi":"mi-Latn-NZ","mif":"mif-Latn-ZZ","min":"min-Latn-ID","mis":"mis-Hatr-IQ","mis-Medf":"mis-Medf-NG","miw":"miw-Latn-ZZ","mk":"mk-Cyrl-MK","mki":"mki-Arab-ZZ","mkl":"mkl-Latn-ZZ","mkp":"mkp-Latn-ZZ","mkw":"mkw-Latn-ZZ","ml":"ml-Mlym-IN","mle":"mle-Latn-ZZ","mlp":"mlp-Latn-ZZ","mls":"mls-Latn-SD","mmo":"mmo-Latn-ZZ","mmu":"mmu-Latn-ZZ","mmx":"mmx-Latn-ZZ","mn":"mn-Cyrl-MN","mn-CN":"mn-Mong-CN","mn-Mong":"mn-Mong-CN","mna":"mna-Latn-ZZ","mnf":"mnf-Latn-ZZ","mni":"mni-Beng-IN","mnw":"mnw-Mymr-MM","mo":"mo-Latn-RO","moa":"moa-Latn-ZZ","moe":"moe-Latn-CA","moh":"moh-Latn-CA","mos":"mos-Latn-BF","mox":"mox-Latn-ZZ","mpp":"mpp-Latn-ZZ","mps":"mps-Latn-ZZ","mpt":"mpt-Latn-ZZ","mpx":"mpx-Latn-ZZ","mql":"mql-Latn-ZZ","mr":"mr-Deva-IN","mrd":"mrd-Deva-NP","mrj":"mrj-Cyrl-RU","mro":"mro-Mroo-BD","ms":"ms-Latn-MY","ms-CC":"ms-Arab-CC","ms-ID":"ms-Arab-ID","mt":"mt-Latn-MT","mtc":"mtc-Latn-ZZ","mtf":"mtf-Latn-ZZ","mti":"mti-Latn-ZZ","mtr":"mtr-Deva-IN","mua":"mua-Latn-CM","mur":"mur-Latn-ZZ","mus":"mus-Latn-US","mva":"mva-Latn-ZZ","mvn":"mvn-Latn-ZZ","mvy":"mvy-Arab-PK","mwk":"mwk-Latn-ML","mwr":"mwr-Deva-IN","mwv":"mwv-Latn-ID","mww":"mww-Hmnp-US","mxc":"mxc-Latn-ZW","mxm":"mxm-Latn-ZZ","my":"my-Mymr-MM","myk":"myk-Latn-ZZ","mym":"mym-Ethi-ZZ","myv":"myv-Cyrl-RU","myw":"myw-Latn-ZZ","myx":"myx-Latn-UG","myz":"myz-Mand-IR","mzk":"mzk-Latn-ZZ","mzm":"mzm-Latn-ZZ","mzn":"mzn-Arab-IR","mzp":"mzp-Latn-ZZ","mzw":"mzw-Latn-ZZ","mzz":"mzz-Latn-ZZ","na":"na-Latn-NR","nac":"nac-Latn-ZZ","naf":"naf-Latn-ZZ","nak":"nak-Latn-ZZ","nan":"nan-Hans-CN","nap":"nap-Latn-IT","naq":"naq-Latn-NA","nas":"nas-Latn-ZZ","nb":"nb-Latn-NO","nca":"nca-Latn-ZZ","nce":"nce-Latn-ZZ","ncf":"ncf-Latn-ZZ","nch":"nch-Latn-MX","nco":"nco-Latn-ZZ","ncu":"ncu-Latn-ZZ","nd":"nd-Latn-ZW","ndc":"ndc-Latn-MZ","nds":"nds-Latn-DE","ne":"ne-Deva-NP","neb":"neb-Latn-ZZ","new":"new-Deva-NP","nex":"nex-Latn-ZZ","nfr":"nfr-Latn-ZZ","ng":"ng-Latn-NA","nga":"nga-Latn-ZZ","ngb":"ngb-Latn-ZZ","ngl":"ngl-Latn-MZ","nhb":"nhb-Latn-ZZ","nhe":"nhe-Latn-MX","nhw":"nhw-Latn-MX","nif":"nif-Latn-ZZ","nii":"nii-Latn-ZZ","nij":"nij-Latn-ID","nin":"nin-Latn-ZZ","niu":"niu-Latn-NU","niy":"niy-Latn-ZZ","niz":"niz-Latn-ZZ","njo":"njo-Latn-IN","nkg":"nkg-Latn-ZZ","nko":"nko-Latn-ZZ","nl":"nl-Latn-NL","nmg":"nmg-Latn-CM","nmz":"nmz-Latn-ZZ","nn":"nn-Latn-NO","nnf":"nnf-Latn-ZZ","nnh":"nnh-Latn-CM","nnk":"nnk-Latn-ZZ","nnm":"nnm-Latn-ZZ","nnp":"nnp-Wcho-IN","no":"no-Latn-NO","nod":"nod-Lana-TH","noe":"noe-Deva-IN","non":"non-Runr-SE","nop":"nop-Latn-ZZ","nou":"nou-Latn-ZZ","nqo":"nqo-Nkoo-GN","nr":"nr-Latn-ZA","nrb":"nrb-Latn-ZZ","nsk":"nsk-Cans-CA","nsn":"nsn-Latn-ZZ","nso":"nso-Latn-ZA","nss":"nss-Latn-ZZ","ntm":"ntm-Latn-ZZ","ntr":"ntr-Latn-ZZ","nui":"nui-Latn-ZZ","nup":"nup-Latn-ZZ","nus":"nus-Latn-SS","nuv":"nuv-Latn-ZZ","nux":"nux-Latn-ZZ","nv":"nv-Latn-US","nwb":"nwb-Latn-ZZ","nxq":"nxq-Latn-CN","nxr":"nxr-Latn-ZZ","ny":"ny-Latn-MW","nym":"nym-Latn-TZ","nyn":"nyn-Latn-UG","nzi":"nzi-Latn-GH","oc":"oc-Latn-FR","ogc":"ogc-Latn-ZZ","okr":"okr-Latn-ZZ","okv":"okv-Latn-ZZ","om":"om-Latn-ET","ong":"ong-Latn-ZZ","onn":"onn-Latn-ZZ","ons":"ons-Latn-ZZ","opm":"opm-Latn-ZZ","or":"or-Orya-IN","oro":"oro-Latn-ZZ","oru":"oru-Arab-ZZ","os":"os-Cyrl-GE","osa":"osa-Osge-US","ota":"ota-Arab-ZZ","otk":"otk-Orkh-MN","ozm":"ozm-Latn-ZZ","pa":"pa-Guru-IN","pa-Arab":"pa-Arab-PK","pa-PK":"pa-Arab-PK","pag":"pag-Latn-PH","pal":"pal-Phli-IR","pal-Phlp":"pal-Phlp-CN","pam":"pam-Latn-PH","pap":"pap-Latn-AW","pau":"pau-Latn-PW","pbi":"pbi-Latn-ZZ","pcd":"pcd-Latn-FR","pcm":"pcm-Latn-NG","pdc":"pdc-Latn-US","pdt":"pdt-Latn-CA","ped":"ped-Latn-ZZ","peo":"peo-Xpeo-IR","pex":"pex-Latn-ZZ","pfl":"pfl-Latn-DE","phl":"phl-Arab-ZZ","phn":"phn-Phnx-LB","pil":"pil-Latn-ZZ","pip":"pip-Latn-ZZ","pka":"pka-Brah-IN","pko":"pko-Latn-KE","pl":"pl-Latn-PL","pla":"pla-Latn-ZZ","pms":"pms-Latn-IT","png":"png-Latn-ZZ","pnn":"pnn-Latn-ZZ","pnt":"pnt-Grek-GR","pon":"pon-Latn-FM","ppa":"ppa-Deva-IN","ppo":"ppo-Latn-ZZ","pra":"pra-Khar-PK","prd":"prd-Arab-IR","prg":"prg-Latn-001","ps":"ps-Arab-AF","pss":"pss-Latn-ZZ","pt":"pt-Latn-BR","ptp":"ptp-Latn-ZZ","puu":"puu-Latn-GA","pwa":"pwa-Latn-ZZ","qu":"qu-Latn-PE","quc":"quc-Latn-GT","qug":"qug-Latn-EC","rai":"rai-Latn-ZZ","raj":"raj-Deva-IN","rao":"rao-Latn-ZZ","rcf":"rcf-Latn-RE","rej":"rej-Latn-ID","rel":"rel-Latn-ZZ","res":"res-Latn-ZZ","rgn":"rgn-Latn-IT","rhg":"rhg-Arab-MM","ria":"ria-Latn-IN","rif":"rif-Tfng-MA","rif-NL":"rif-Latn-NL","rjs":"rjs-Deva-NP","rkt":"rkt-Beng-BD","rm":"rm-Latn-CH","rmf":"rmf-Latn-FI","rmo":"rmo-Latn-CH","rmt":"rmt-Arab-IR","rmu":"rmu-Latn-SE","rn":"rn-Latn-BI","rna":"rna-Latn-ZZ","rng":"rng-Latn-MZ","ro":"ro-Latn-RO","rob":"rob-Latn-ID","rof":"rof-Latn-TZ","roo":"roo-Latn-ZZ","rro":"rro-Latn-ZZ","rtm":"rtm-Latn-FJ","ru":"ru-Cyrl-RU","rue":"rue-Cyrl-UA","rug":"rug-Latn-SB","rw":"rw-Latn-RW","rwk":"rwk-Latn-TZ","rwo":"rwo-Latn-ZZ","ryu":"ryu-Kana-JP","sa":"sa-Deva-IN","saf":"saf-Latn-GH","sah":"sah-Cyrl-RU","saq":"saq-Latn-KE","sas":"sas-Latn-ID","sat":"sat-Latn-IN","sav":"sav-Latn-SN","saz":"saz-Saur-IN","sba":"sba-Latn-ZZ","sbe":"sbe-Latn-ZZ","sbp":"sbp-Latn-TZ","sc":"sc-Latn-IT","sck":"sck-Deva-IN","scl":"scl-Arab-ZZ","scn":"scn-Latn-IT","sco":"sco-Latn-GB","scs":"scs-Latn-CA","sd":"sd-Arab-PK","sd-Deva":"sd-Deva-IN","sd-Khoj":"sd-Khoj-IN","sd-Sind":"sd-Sind-IN","sdc":"sdc-Latn-IT","sdh":"sdh-Arab-IR","se":"se-Latn-NO","sef":"sef-Latn-CI","seh":"seh-Latn-MZ","sei":"sei-Latn-MX","ses":"ses-Latn-ML","sg":"sg-Latn-CF","sga":"sga-Ogam-IE","sgs":"sgs-Latn-LT","sgw":"sgw-Ethi-ZZ","sgz":"sgz-Latn-ZZ","shi":"shi-Tfng-MA","shk":"shk-Latn-ZZ","shn":"shn-Mymr-MM","shu":"shu-Arab-ZZ","si":"si-Sinh-LK","sid":"sid-Latn-ET","sig":"sig-Latn-ZZ","sil":"sil-Latn-ZZ","sim":"sim-Latn-ZZ","sjr":"sjr-Latn-ZZ","sk":"sk-Latn-SK","skc":"skc-Latn-ZZ","skr":"skr-Arab-PK","sks":"sks-Latn-ZZ","sl":"sl-Latn-SI","sld":"sld-Latn-ZZ","sli":"sli-Latn-PL","sll":"sll-Latn-ZZ","sly":"sly-Latn-ID","sm":"sm-Latn-WS","sma":"sma-Latn-SE","smj":"smj-Latn-SE","smn":"smn-Latn-FI","smp":"smp-Samr-IL","smq":"smq-Latn-ZZ","sms":"sms-Latn-FI","sn":"sn-Latn-ZW","snc":"snc-Latn-ZZ","snk":"snk-Latn-ML","snp":"snp-Latn-ZZ","snx":"snx-Latn-ZZ","sny":"sny-Latn-ZZ","so":"so-Latn-SO","sog":"sog-Sogd-UZ","sok":"sok-Latn-ZZ","soq":"soq-Latn-ZZ","sou":"sou-Thai-TH","soy":"soy-Latn-ZZ","spd":"spd-Latn-ZZ","spl":"spl-Latn-ZZ","sps":"sps-Latn-ZZ","sq":"sq-Latn-AL","sr":"sr-Cyrl-RS","sr-ME":"sr-Latn-ME","sr-RO":"sr-Latn-RO","sr-RU":"sr-Latn-RU","sr-TR":"sr-Latn-TR","srb":"srb-Sora-IN","srn":"srn-Latn-SR","srr":"srr-Latn-SN","srx":"srx-Deva-IN","ss":"ss-Latn-ZA","ssd":"ssd-Latn-ZZ","ssg":"ssg-Latn-ZZ","ssy":"ssy-Latn-ER","st":"st-Latn-ZA","stk":"stk-Latn-ZZ","stq":"stq-Latn-DE","su":"su-Latn-ID","sua":"sua-Latn-ZZ","sue":"sue-Latn-ZZ","suk":"suk-Latn-TZ","sur":"sur-Latn-ZZ","sus":"sus-Latn-GN","sv":"sv-Latn-SE","sw":"sw-Latn-TZ","swb":"swb-Arab-YT","swc":"swc-Latn-CD","swg":"swg-Latn-DE","swp":"swp-Latn-ZZ","swv":"swv-Deva-IN","sxn":"sxn-Latn-ID","sxw":"sxw-Latn-ZZ","syl":"syl-Beng-BD","syr":"syr-Syrc-IQ","szl":"szl-Latn-PL","ta":"ta-Taml-IN","taj":"taj-Deva-NP","tal":"tal-Latn-ZZ","tan":"tan-Latn-ZZ","taq":"taq-Latn-ZZ","tbc":"tbc-Latn-ZZ","tbd":"tbd-Latn-ZZ","tbf":"tbf-Latn-ZZ","tbg":"tbg-Latn-ZZ","tbo":"tbo-Latn-ZZ","tbw":"tbw-Latn-PH","tbz":"tbz-Latn-ZZ","tci":"tci-Latn-ZZ","tcy":"tcy-Knda-IN","tdd":"tdd-Tale-CN","tdg":"tdg-Deva-NP","tdh":"tdh-Deva-NP","tdu":"tdu-Latn-MY","te":"te-Telu-IN","ted":"ted-Latn-ZZ","tem":"tem-Latn-SL","teo":"teo-Latn-UG","tet":"tet-Latn-TL","tfi":"tfi-Latn-ZZ","tg":"tg-Cyrl-TJ","tg-Arab":"tg-Arab-PK","tg-PK":"tg-Arab-PK","tgc":"tgc-Latn-ZZ","tgo":"tgo-Latn-ZZ","tgu":"tgu-Latn-ZZ","th":"th-Thai-TH","thl":"thl-Deva-NP","thq":"thq-Deva-NP","thr":"thr-Deva-NP","ti":"ti-Ethi-ET","tif":"tif-Latn-ZZ","tig":"tig-Ethi-ER","tik":"tik-Latn-ZZ","tim":"tim-Latn-ZZ","tio":"tio-Latn-ZZ","tiv":"tiv-Latn-NG","tk":"tk-Latn-TM","tkl":"tkl-Latn-TK","tkr":"tkr-Latn-AZ","tkt":"tkt-Deva-NP","tl":"tl-Latn-PH","tlf":"tlf-Latn-ZZ","tlx":"tlx-Latn-ZZ","tly":"tly-Latn-AZ","tmh":"tmh-Latn-NE","tmy":"tmy-Latn-ZZ","tn":"tn-Latn-ZA","tnh":"tnh-Latn-ZZ","to":"to-Latn-TO","tof":"tof-Latn-ZZ","tog":"tog-Latn-MW","toq":"toq-Latn-ZZ","tpi":"tpi-Latn-PG","tpm":"tpm-Latn-ZZ","tpz":"tpz-Latn-ZZ","tqo":"tqo-Latn-ZZ","tr":"tr-Latn-TR","tru":"tru-Latn-TR","trv":"trv-Latn-TW","trw":"trw-Arab-ZZ","ts":"ts-Latn-ZA","tsd":"tsd-Grek-GR","tsf":"tsf-Deva-NP","tsg":"tsg-Latn-PH","tsj":"tsj-Tibt-BT","tsw":"tsw-Latn-ZZ","tt":"tt-Cyrl-RU","ttd":"ttd-Latn-ZZ","tte":"tte-Latn-ZZ","ttj":"ttj-Latn-UG","ttr":"ttr-Latn-ZZ","tts":"tts-Thai-TH","ttt":"ttt-Latn-AZ","tuh":"tuh-Latn-ZZ","tul":"tul-Latn-ZZ","tum":"tum-Latn-MW","tuq":"tuq-Latn-ZZ","tvd":"tvd-Latn-ZZ","tvl":"tvl-Latn-TV","tvu":"tvu-Latn-ZZ","twh":"twh-Latn-ZZ","twq":"twq-Latn-NE","txg":"txg-Tang-CN","ty":"ty-Latn-PF","tya":"tya-Latn-ZZ","tyv":"tyv-Cyrl-RU","tzm":"tzm-Latn-MA","ubu":"ubu-Latn-ZZ","udm":"udm-Cyrl-RU","ug":"ug-Arab-CN","ug-Cyrl":"ug-Cyrl-KZ","ug-KZ":"ug-Cyrl-KZ","ug-MN":"ug-Cyrl-MN","uga":"uga-Ugar-SY","uk":"uk-Cyrl-UA","uli":"uli-Latn-FM","umb":"umb-Latn-AO","und":"en-Latn-US","und-002":"en-Latn-NG","und-003":"en-Latn-US","und-005":"pt-Latn-BR","und-009":"en-Latn-AU","und-011":"en-Latn-NG","und-013":"es-Latn-MX","und-014":"sw-Latn-TZ","und-015":"ar-Arab-EG","und-017":"sw-Latn-CD","und-018":"en-Latn-ZA","und-019":"en-Latn-US","und-021":"en-Latn-US","und-029":"es-Latn-CU","und-030":"zh-Hans-CN","und-034":"hi-Deva-IN","und-035":"id-Latn-ID","und-039":"it-Latn-IT","und-053":"en-Latn-AU","und-054":"en-Latn-PG","und-057":"en-Latn-GU","und-061":"sm-Latn-WS","und-142":"zh-Hans-CN","und-143":"uz-Latn-UZ","und-145":"ar-Arab-SA","und-150":"ru-Cyrl-RU","und-151":"ru-Cyrl-RU","und-154":"en-Latn-GB","und-155":"de-Latn-DE","und-202":"en-Latn-NG","und-419":"es-Latn-419","und-AD":"ca-Latn-AD","und-Adlm":"ff-Adlm-GN","und-AE":"ar-Arab-AE","und-AF":"fa-Arab-AF","und-Aghb":"lez-Aghb-RU","und-Ahom":"aho-Ahom-IN","und-AL":"sq-Latn-AL","und-AM":"hy-Armn-AM","und-AO":"pt-Latn-AO","und-AQ":"und-Latn-AQ","und-AR":"es-Latn-AR","und-Arab":"ar-Arab-EG","und-Arab-CC":"ms-Arab-CC","und-Arab-CN":"ug-Arab-CN","und-Arab-GB":"ks-Arab-GB","und-Arab-ID":"ms-Arab-ID","und-Arab-IN":"ur-Arab-IN","und-Arab-KH":"cja-Arab-KH","und-Arab-MM":"rhg-Arab-MM","und-Arab-MN":"kk-Arab-MN","und-Arab-MU":"ur-Arab-MU","und-Arab-NG":"ha-Arab-NG","und-Arab-PK":"ur-Arab-PK","und-Arab-TG":"apd-Arab-TG","und-Arab-TH":"mfa-Arab-TH","und-Arab-TJ":"fa-Arab-TJ","und-Arab-TR":"az-Arab-TR","und-Arab-YT":"swb-Arab-YT","und-Armi":"arc-Armi-IR","und-Armn":"hy-Armn-AM","und-AS":"sm-Latn-AS","und-AT":"de-Latn-AT","und-Avst":"ae-Avst-IR","und-AW":"nl-Latn-AW","und-AX":"sv-Latn-AX","und-AZ":"az-Latn-AZ","und-BA":"bs-Latn-BA","und-Bali":"ban-Bali-ID","und-Bamu":"bax-Bamu-CM","und-Bass":"bsq-Bass-LR","und-Batk":"bbc-Batk-ID","und-BD":"bn-Beng-BD","und-BE":"nl-Latn-BE","und-Beng":"bn-Beng-BD","und-BF":"fr-Latn-BF","und-BG":"bg-Cyrl-BG","und-BH":"ar-Arab-BH","und-Bhks":"sa-Bhks-IN","und-BI":"rn-Latn-BI","und-BJ":"fr-Latn-BJ","und-BL":"fr-Latn-BL","und-BN":"ms-Latn-BN","und-BO":"es-Latn-BO","und-Bopo":"zh-Bopo-TW","und-BQ":"pap-Latn-BQ","und-BR":"pt-Latn-BR","und-Brah":"pka-Brah-IN","und-Brai":"fr-Brai-FR","und-BT":"dz-Tibt-BT","und-Bugi":"bug-Bugi-ID","und-Buhd":"bku-Buhd-PH","und-BV":"und-Latn-BV","und-BY":"be-Cyrl-BY","und-Cakm":"ccp-Cakm-BD","und-Cans":"cr-Cans-CA","und-Cari":"xcr-Cari-TR","und-CD":"sw-Latn-CD","und-CF":"fr-Latn-CF","und-CG":"fr-Latn-CG","und-CH":"de-Latn-CH","und-Cham":"cjm-Cham-VN","und-Cher":"chr-Cher-US","und-CI":"fr-Latn-CI","und-CL":"es-Latn-CL","und-CM":"fr-Latn-CM","und-CN":"zh-Hans-CN","und-CO":"es-Latn-CO","und-Copt":"cop-Copt-EG","und-CP":"und-Latn-CP","und-Cprt":"grc-Cprt-CY","und-CR":"es-Latn-CR","und-CU":"es-Latn-CU","und-CV":"pt-Latn-CV","und-CW":"pap-Latn-CW","und-CY":"el-Grek-CY","und-Cyrl":"ru-Cyrl-RU","und-Cyrl-AL":"mk-Cyrl-AL","und-Cyrl-BA":"sr-Cyrl-BA","und-Cyrl-GE":"ab-Cyrl-GE","und-Cyrl-GR":"mk-Cyrl-GR","und-Cyrl-MD":"uk-Cyrl-MD","und-Cyrl-RO":"bg-Cyrl-RO","und-Cyrl-SK":"uk-Cyrl-SK","und-Cyrl-TR":"kbd-Cyrl-TR","und-Cyrl-XK":"sr-Cyrl-XK","und-CZ":"cs-Latn-CZ","und-DE":"de-Latn-DE","und-Deva":"hi-Deva-IN","und-Deva-BT":"ne-Deva-BT","und-Deva-FJ":"hif-Deva-FJ","und-Deva-MU":"bho-Deva-MU","und-Deva-PK":"btv-Deva-PK","und-DJ":"aa-Latn-DJ","und-DK":"da-Latn-DK","und-DO":"es-Latn-DO","und-Dogr":"doi-Dogr-IN","und-Dupl":"fr-Dupl-FR","und-DZ":"ar-Arab-DZ","und-EA":"es-Latn-EA","und-EC":"es-Latn-EC","und-EE":"et-Latn-EE","und-EG":"ar-Arab-EG","und-Egyp":"egy-Egyp-EG","und-EH":"ar-Arab-EH","und-Elba":"sq-Elba-AL","und-Elym":"arc-Elym-IR","und-ER":"ti-Ethi-ER","und-ES":"es-Latn-ES","und-ET":"am-Ethi-ET","und-Ethi":"am-Ethi-ET","und-EU":"en-Latn-GB","und-EZ":"de-Latn-EZ","und-FI":"fi-Latn-FI","und-FO":"fo-Latn-FO","und-FR":"fr-Latn-FR","und-GA":"fr-Latn-GA","und-GE":"ka-Geor-GE","und-Geor":"ka-Geor-GE","und-GF":"fr-Latn-GF","und-GH":"ak-Latn-GH","und-GL":"kl-Latn-GL","und-Glag":"cu-Glag-BG","und-GN":"fr-Latn-GN","und-Gong":"wsg-Gong-IN","und-Gonm":"esg-Gonm-IN","und-Goth":"got-Goth-UA","und-GP":"fr-Latn-GP","und-GQ":"es-Latn-GQ","und-GR":"el-Grek-GR","und-Gran":"sa-Gran-IN","und-Grek":"el-Grek-GR","und-Grek-TR":"bgx-Grek-TR","und-GS":"und-Latn-GS","und-GT":"es-Latn-GT","und-Gujr":"gu-Gujr-IN","und-Guru":"pa-Guru-IN","und-GW":"pt-Latn-GW","und-Hanb":"zh-Hanb-TW","und-Hang":"ko-Hang-KR","und-Hani":"zh-Hani-CN","und-Hano":"hnn-Hano-PH","und-Hans":"zh-Hans-CN","und-Hant":"zh-Hant-TW","und-Hatr":"mis-Hatr-IQ","und-Hebr":"he-Hebr-IL","und-Hebr-CA":"yi-Hebr-CA","und-Hebr-GB":"yi-Hebr-GB","und-Hebr-SE":"yi-Hebr-SE","und-Hebr-UA":"yi-Hebr-UA","und-Hebr-US":"yi-Hebr-US","und-Hira":"ja-Hira-JP","und-HK":"zh-Hant-HK","und-Hluw":"hlu-Hluw-TR","und-HM":"und-Latn-HM","und-Hmng":"hnj-Hmng-LA","und-Hmnp":"mww-Hmnp-US","und-HN":"es-Latn-HN","und-HR":"hr-Latn-HR","und-HT":"ht-Latn-HT","und-HU":"hu-Latn-HU","und-Hung":"hu-Hung-HU","und-IC":"es-Latn-IC","und-ID":"id-Latn-ID","und-IL":"he-Hebr-IL","und-IN":"hi-Deva-IN","und-IQ":"ar-Arab-IQ","und-IR":"fa-Arab-IR","und-IS":"is-Latn-IS","und-IT":"it-Latn-IT","und-Ital":"ett-Ital-IT","und-Jamo":"ko-Jamo-KR","und-Java":"jv-Java-ID","und-JO":"ar-Arab-JO","und-JP":"ja-Jpan-JP","und-Jpan":"ja-Jpan-JP","und-Kali":"eky-Kali-MM","und-Kana":"ja-Kana-JP","und-KE":"sw-Latn-KE","und-KG":"ky-Cyrl-KG","und-KH":"km-Khmr-KH","und-Khar":"pra-Khar-PK","und-Khmr":"km-Khmr-KH","und-Khoj":"sd-Khoj-IN","und-KM":"ar-Arab-KM","und-Knda":"kn-Knda-IN","und-Kore":"ko-Kore-KR","und-KP":"ko-Kore-KP","und-KR":"ko-Kore-KR","und-Kthi":"bho-Kthi-IN","und-KW":"ar-Arab-KW","und-KZ":"ru-Cyrl-KZ","und-LA":"lo-Laoo-LA","und-Lana":"nod-Lana-TH","und-Laoo":"lo-Laoo-LA","und-Latn-AF":"tk-Latn-AF","und-Latn-AM":"ku-Latn-AM","und-Latn-CN":"za-Latn-CN","und-Latn-CY":"tr-Latn-CY","und-Latn-DZ":"fr-Latn-DZ","und-Latn-ET":"en-Latn-ET","und-Latn-GE":"ku-Latn-GE","und-Latn-IR":"tk-Latn-IR","und-Latn-KM":"fr-Latn-KM","und-Latn-MA":"fr-Latn-MA","und-Latn-MK":"sq-Latn-MK","und-Latn-MM":"kac-Latn-MM","und-Latn-MO":"pt-Latn-MO","und-Latn-MR":"fr-Latn-MR","und-Latn-RU":"krl-Latn-RU","und-Latn-SY":"fr-Latn-SY","und-Latn-TN":"fr-Latn-TN","und-Latn-TW":"trv-Latn-TW","und-Latn-UA":"pl-Latn-UA","und-LB":"ar-Arab-LB","und-Lepc":"lep-Lepc-IN","und-LI":"de-Latn-LI","und-Limb":"lif-Limb-IN","und-Lina":"lab-Lina-GR","und-Linb":"grc-Linb-GR","und-Lisu":"lis-Lisu-CN","und-LK":"si-Sinh-LK","und-LS":"st-Latn-LS","und-LT":"lt-Latn-LT","und-LU":"fr-Latn-LU","und-LV":"lv-Latn-LV","und-LY":"ar-Arab-LY","und-Lyci":"xlc-Lyci-TR","und-Lydi":"xld-Lydi-TR","und-MA":"ar-Arab-MA","und-Mahj":"hi-Mahj-IN","und-Maka":"mak-Maka-ID","und-Mand":"myz-Mand-IR","und-Mani":"xmn-Mani-CN","und-Marc":"bo-Marc-CN","und-MC":"fr-Latn-MC","und-MD":"ro-Latn-MD","und-ME":"sr-Latn-ME","und-Medf":"mis-Medf-NG","und-Mend":"men-Mend-SL","und-Merc":"xmr-Merc-SD","und-Mero":"xmr-Mero-SD","und-MF":"fr-Latn-MF","und-MG":"mg-Latn-MG","und-MK":"mk-Cyrl-MK","und-ML":"bm-Latn-ML","und-Mlym":"ml-Mlym-IN","und-MM":"my-Mymr-MM","und-MN":"mn-Cyrl-MN","und-MO":"zh-Hant-MO","und-Modi":"mr-Modi-IN","und-Mong":"mn-Mong-CN","und-MQ":"fr-Latn-MQ","und-MR":"ar-Arab-MR","und-Mroo":"mro-Mroo-BD","und-MT":"mt-Latn-MT","und-Mtei":"mni-Mtei-IN","und-MU":"mfe-Latn-MU","und-Mult":"skr-Mult-PK","und-MV":"dv-Thaa-MV","und-MX":"es-Latn-MX","und-MY":"ms-Latn-MY","und-Mymr":"my-Mymr-MM","und-Mymr-IN":"kht-Mymr-IN","und-Mymr-TH":"mnw-Mymr-TH","und-MZ":"pt-Latn-MZ","und-NA":"af-Latn-NA","und-Nand":"sa-Nand-IN","und-Narb":"xna-Narb-SA","und-Nbat":"arc-Nbat-JO","und-NC":"fr-Latn-NC","und-NE":"ha-Latn-NE","und-Newa":"new-Newa-NP","und-NI":"es-Latn-NI","und-Nkoo":"man-Nkoo-GN","und-NL":"nl-Latn-NL","und-NO":"nb-Latn-NO","und-NP":"ne-Deva-NP","und-Nshu":"zhx-Nshu-CN","und-Ogam":"sga-Ogam-IE","und-Olck":"sat-Olck-IN","und-OM":"ar-Arab-OM","und-Orkh":"otk-Orkh-MN","und-Orya":"or-Orya-IN","und-Osge":"osa-Osge-US","und-Osma":"so-Osma-SO","und-PA":"es-Latn-PA","und-Palm":"arc-Palm-SY","und-Pauc":"ctd-Pauc-MM","und-PE":"es-Latn-PE","und-Perm":"kv-Perm-RU","und-PF":"fr-Latn-PF","und-PG":"tpi-Latn-PG","und-PH":"fil-Latn-PH","und-Phag":"lzh-Phag-CN","und-Phli":"pal-Phli-IR","und-Phlp":"pal-Phlp-CN","und-Phnx":"phn-Phnx-LB","und-PK":"ur-Arab-PK","und-PL":"pl-Latn-PL","und-Plrd":"hmd-Plrd-CN","und-PM":"fr-Latn-PM","und-PR":"es-Latn-PR","und-Prti":"xpr-Prti-IR","und-PS":"ar-Arab-PS","und-PT":"pt-Latn-PT","und-PW":"pau-Latn-PW","und-PY":"gn-Latn-PY","und-QA":"ar-Arab-QA","und-QO":"en-Latn-DG","und-RE":"fr-Latn-RE","und-Rjng":"rej-Rjng-ID","und-RO":"ro-Latn-RO","und-Rohg":"rhg-Rohg-MM","und-RS":"sr-Cyrl-RS","und-RU":"ru-Cyrl-RU","und-Runr":"non-Runr-SE","und-RW":"rw-Latn-RW","und-SA":"ar-Arab-SA","und-Samr":"smp-Samr-IL","und-Sarb":"xsa-Sarb-YE","und-Saur":"saz-Saur-IN","und-SC":"fr-Latn-SC","und-SD":"ar-Arab-SD","und-SE":"sv-Latn-SE","und-Sgnw":"ase-Sgnw-US","und-Shaw":"en-Shaw-GB","und-Shrd":"sa-Shrd-IN","und-SI":"sl-Latn-SI","und-Sidd":"sa-Sidd-IN","und-Sind":"sd-Sind-IN","und-Sinh":"si-Sinh-LK","und-SJ":"nb-Latn-SJ","und-SK":"sk-Latn-SK","und-SM":"it-Latn-SM","und-SN":"fr-Latn-SN","und-SO":"so-Latn-SO","und-Sogd":"sog-Sogd-UZ","und-Sogo":"sog-Sogo-UZ","und-Sora":"srb-Sora-IN","und-Soyo":"cmg-Soyo-MN","und-SR":"nl-Latn-SR","und-ST":"pt-Latn-ST","und-Sund":"su-Sund-ID","und-SV":"es-Latn-SV","und-SY":"ar-Arab-SY","und-Sylo":"syl-Sylo-BD","und-Syrc":"syr-Syrc-IQ","und-Tagb":"tbw-Tagb-PH","und-Takr":"doi-Takr-IN","und-Tale":"tdd-Tale-CN","und-Talu":"khb-Talu-CN","und-Taml":"ta-Taml-IN","und-Tang":"txg-Tang-CN","und-Tavt":"blt-Tavt-VN","und-TD":"fr-Latn-TD","und-Telu":"te-Telu-IN","und-TF":"fr-Latn-TF","und-Tfng":"zgh-Tfng-MA","und-TG":"fr-Latn-TG","und-Tglg":"fil-Tglg-PH","und-TH":"th-Thai-TH","und-Thaa":"dv-Thaa-MV","und-Thai":"th-Thai-TH","und-Thai-CN":"lcp-Thai-CN","und-Thai-KH":"kdt-Thai-KH","und-Thai-LA":"kdt-Thai-LA","und-Tibt":"bo-Tibt-CN","und-Tirh":"mai-Tirh-IN","und-TJ":"tg-Cyrl-TJ","und-TK":"tkl-Latn-TK","und-TL":"pt-Latn-TL","und-TM":"tk-Latn-TM","und-TN":"ar-Arab-TN","und-TO":"to-Latn-TO","und-TR":"tr-Latn-TR","und-TV":"tvl-Latn-TV","und-TW":"zh-Hant-TW","und-TZ":"sw-Latn-TZ","und-UA":"uk-Cyrl-UA","und-UG":"sw-Latn-UG","und-Ugar":"uga-Ugar-SY","und-UY":"es-Latn-UY","und-UZ":"uz-Latn-UZ","und-VA":"it-Latn-VA","und-Vaii":"vai-Vaii-LR","und-VE":"es-Latn-VE","und-VN":"vi-Latn-VN","und-VU":"bi-Latn-VU","und-Wara":"hoc-Wara-IN","und-Wcho":"nnp-Wcho-IN","und-WF":"fr-Latn-WF","und-WS":"sm-Latn-WS","und-XK":"sq-Latn-XK","und-Xpeo":"peo-Xpeo-IR","und-Xsux":"akk-Xsux-IQ","und-YE":"ar-Arab-YE","und-Yiii":"ii-Yiii-CN","und-YT":"fr-Latn-YT","und-Zanb":"cmg-Zanb-MN","und-ZW":"sn-Latn-ZW","unr":"unr-Beng-IN","unr-Deva":"unr-Deva-NP","unr-NP":"unr-Deva-NP","unx":"unx-Beng-IN","uok":"uok-Latn-ZZ","ur":"ur-Arab-PK","uri":"uri-Latn-ZZ","urt":"urt-Latn-ZZ","urw":"urw-Latn-ZZ","usa":"usa-Latn-ZZ","utr":"utr-Latn-ZZ","uvh":"uvh-Latn-ZZ","uvl":"uvl-Latn-ZZ","uz":"uz-Latn-UZ","uz-AF":"uz-Arab-AF","uz-Arab":"uz-Arab-AF","uz-CN":"uz-Cyrl-CN","vag":"vag-Latn-ZZ","vai":"vai-Vaii-LR","van":"van-Latn-ZZ","ve":"ve-Latn-ZA","vec":"vec-Latn-IT","vep":"vep-Latn-RU","vi":"vi-Latn-VN","vic":"vic-Latn-SX","viv":"viv-Latn-ZZ","vls":"vls-Latn-BE","vmf":"vmf-Latn-DE","vmw":"vmw-Latn-MZ","vo":"vo-Latn-001","vot":"vot-Latn-RU","vro":"vro-Latn-EE","vun":"vun-Latn-TZ","vut":"vut-Latn-ZZ","wa":"wa-Latn-BE","wae":"wae-Latn-CH","waj":"waj-Latn-ZZ","wal":"wal-Ethi-ET","wan":"wan-Latn-ZZ","war":"war-Latn-PH","wbp":"wbp-Latn-AU","wbq":"wbq-Telu-IN","wbr":"wbr-Deva-IN","wci":"wci-Latn-ZZ","wer":"wer-Latn-ZZ","wgi":"wgi-Latn-ZZ","whg":"whg-Latn-ZZ","wib":"wib-Latn-ZZ","wiu":"wiu-Latn-ZZ","wiv":"wiv-Latn-ZZ","wja":"wja-Latn-ZZ","wji":"wji-Latn-ZZ","wls":"wls-Latn-WF","wmo":"wmo-Latn-ZZ","wnc":"wnc-Latn-ZZ","wni":"wni-Arab-KM","wnu":"wnu-Latn-ZZ","wo":"wo-Latn-SN","wob":"wob-Latn-ZZ","wos":"wos-Latn-ZZ","wrs":"wrs-Latn-ZZ","wsg":"wsg-Gong-IN","wsk":"wsk-Latn-ZZ","wtm":"wtm-Deva-IN","wuu":"wuu-Hans-CN","wuv":"wuv-Latn-ZZ","wwa":"wwa-Latn-ZZ","xav":"xav-Latn-BR","xbi":"xbi-Latn-ZZ","xcr":"xcr-Cari-TR","xes":"xes-Latn-ZZ","xh":"xh-Latn-ZA","xla":"xla-Latn-ZZ","xlc":"xlc-Lyci-TR","xld":"xld-Lydi-TR","xmf":"xmf-Geor-GE","xmn":"xmn-Mani-CN","xmr":"xmr-Merc-SD","xna":"xna-Narb-SA","xnr":"xnr-Deva-IN","xog":"xog-Latn-UG","xon":"xon-Latn-ZZ","xpr":"xpr-Prti-IR","xrb":"xrb-Latn-ZZ","xsa":"xsa-Sarb-YE","xsi":"xsi-Latn-ZZ","xsm":"xsm-Latn-ZZ","xsr":"xsr-Deva-NP","xwe":"xwe-Latn-ZZ","yam":"yam-Latn-ZZ","yao":"yao-Latn-MZ","yap":"yap-Latn-FM","yas":"yas-Latn-ZZ","yat":"yat-Latn-ZZ","yav":"yav-Latn-CM","yay":"yay-Latn-ZZ","yaz":"yaz-Latn-ZZ","yba":"yba-Latn-ZZ","ybb":"ybb-Latn-CM","yby":"yby-Latn-ZZ","yer":"yer-Latn-ZZ","ygr":"ygr-Latn-ZZ","ygw":"ygw-Latn-ZZ","yi":"yi-Hebr-001","yko":"yko-Latn-ZZ","yle":"yle-Latn-ZZ","ylg":"ylg-Latn-ZZ","yll":"yll-Latn-ZZ","yml":"yml-Latn-ZZ","yo":"yo-Latn-NG","yon":"yon-Latn-ZZ","yrb":"yrb-Latn-ZZ","yre":"yre-Latn-ZZ","yrl":"yrl-Latn-BR","yss":"yss-Latn-ZZ","yua":"yua-Latn-MX","yue":"yue-Hant-HK","yue-CN":"yue-Hans-CN","yue-Hans":"yue-Hans-CN","yuj":"yuj-Latn-ZZ","yut":"yut-Latn-ZZ","yuw":"yuw-Latn-ZZ","za":"za-Latn-CN","zag":"zag-Latn-SD","zdj":"zdj-Arab-KM","zea":"zea-Latn-NL","zgh":"zgh-Tfng-MA","zh":"zh-Hans-CN","zh-AU":"zh-Hant-AU","zh-BN":"zh-Hant-BN","zh-Bopo":"zh-Bopo-TW","zh-GB":"zh-Hant-GB","zh-GF":"zh-Hant-GF","zh-Hanb":"zh-Hanb-TW","zh-Hant":"zh-Hant-TW","zh-HK":"zh-Hant-HK","zh-ID":"zh-Hant-ID","zh-MO":"zh-Hant-MO","zh-MY":"zh-Hant-MY","zh-PA":"zh-Hant-PA","zh-PF":"zh-Hant-PF","zh-PH":"zh-Hant-PH","zh-SR":"zh-Hant-SR","zh-TH":"zh-Hant-TH","zh-TW":"zh-Hant-TW","zh-US":"zh-Hant-US","zh-VN":"zh-Hant-VN","zhx":"zhx-Nshu-CN","zia":"zia-Latn-ZZ","zlm":"zlm-Latn-TG","zmi":"zmi-Latn-MY","zne":"zne-Latn-ZZ","zu":"zu-Latn-ZA","zza":"zza-Latn-TR"}}});
i18n.switchLocale(isUserLocaleSupported ? systemLocale : 'en');


/***/ }),

/***/ "./node_modules/cldrjs/dist/cldr.js":
/*!******************************************!*\
  !*** ./node_modules/cldrjs/dist/cldr.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * CLDR JavaScript Library v0.5.0
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-08-11T11:52Z
 */
/*!
 * CLDR JavaScript Library v0.5.0 2017-08-11T11:52Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
(function( root, factory ) {

	if ( true ) {
		// AMD.
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}( this, function() {


	var arrayIsArray = Array.isArray || function( obj ) {
		return Object.prototype.toString.call( obj ) === "[object Array]";
	};




	var pathNormalize = function( path, attributes ) {
		if ( arrayIsArray( path ) ) {
			path = path.join( "/" );
		}
		if ( typeof path !== "string" ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}
		// 1: Ignore leading slash `/`
		// 2: Ignore leading `cldr/`
		path = path
			.replace( /^\// , "" ) /* 1 */
			.replace( /^cldr\// , "" ); /* 2 */

		// Replace {attribute}'s
		path = path.replace( /{[a-zA-Z]+}/g, function( name ) {
			name = name.replace( /^{([^}]*)}$/, "$1" );
			return attributes[ name ];
		});

		return path.split( "/" );
	};




	var arraySome = function( array, callback ) {
		var i, length;
		if ( array.some ) {
			return array.some( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( callback( array[ i ], i, array ) ) {
				return true;
			}
		}
		return false;
	};




	/**
	 * Return the maximized language id as defined in
	 * http://www.unicode.org/reports/tr35/#Likely_Subtags
	 * 1. Canonicalize.
	 * 1.1 Make sure the input locale is in canonical form: uses the right
	 * separator, and has the right casing.
	 * TODO Right casing? What df? It seems languages are lowercase, scripts are
	 * Capitalized, territory is uppercase. I am leaving this as an exercise to
	 * the user.
	 *
	 * 1.2 Replace any deprecated subtags with their canonical values using the
	 * <alias> data in supplemental metadata. Use the first value in the
	 * replacement list, if it exists. Language tag replacements may have multiple
	 * parts, such as "sh" ➞ "sr_Latn" or mo" ➞ "ro_MD". In such a case, the
	 * original script and/or region are retained if there is one. Thus
	 * "sh_Arab_AQ" ➞ "sr_Arab_AQ", not "sr_Latn_AQ".
	 * TODO What <alias> data?
	 *
	 * 1.3 If the tag is grandfathered (see <variable id="$grandfathered"
	 * type="choice"> in the supplemental data), then return it.
	 * TODO grandfathered?
	 *
	 * 1.4 Remove the script code 'Zzzz' and the region code 'ZZ' if they occur.
	 * 1.5 Get the components of the cleaned-up source tag (languages, scripts,
	 * and regions), plus any variants and extensions.
	 * 2. Lookup. Lookup each of the following in order, and stop on the first
	 * match:
	 * 2.1 languages_scripts_regions
	 * 2.2 languages_regions
	 * 2.3 languages_scripts
	 * 2.4 languages
	 * 2.5 und_scripts
	 * 3. Return
	 * 3.1 If there is no match, either return an error value, or the match for
	 * "und" (in APIs where a valid language tag is required).
	 * 3.2 Otherwise there is a match = languagem_scriptm_regionm
	 * 3.3 Let xr = xs if xs is not empty, and xm otherwise.
	 * 3.4 Return the language tag composed of languager _ scriptr _ regionr +
	 * variants + extensions.
	 *
	 * @subtags [Array] normalized language id subtags tuple (see init.js).
	 */
	var coreLikelySubtags = function( Cldr, cldr, subtags, options ) {
		var match, matchFound,
			language = subtags[ 0 ],
			script = subtags[ 1 ],
			sep = Cldr.localeSep,
			territory = subtags[ 2 ],
			variants = subtags.slice( 3, 4 );
		options = options || {};

		// Skip if (language, script, territory) is not empty [3.3]
		if ( language !== "und" && script !== "Zzzz" && territory !== "ZZ" ) {
			return [ language, script, territory ].concat( variants );
		}

		// Skip if no supplemental likelySubtags data is present
		if ( typeof cldr.get( "supplemental/likelySubtags" ) === "undefined" ) {
			return;
		}

		// [2]
		matchFound = arraySome([
			[ language, script, territory ],
			[ language, territory ],
			[ language, script ],
			[ language ],
			[ "und", script ]
		], function( test ) {
			return match = !(/\b(Zzzz|ZZ)\b/).test( test.join( sep ) ) /* [1.4] */ && cldr.get( [ "supplemental/likelySubtags", test.join( sep ) ] );
		});

		// [3]
		if ( matchFound ) {
			// [3.2 .. 3.4]
			match = match.split( sep );
			return [
				language !== "und" ? language : match[ 0 ],
				script !== "Zzzz" ? script : match[ 1 ],
				territory !== "ZZ" ? territory : match[ 2 ]
			].concat( variants );
		} else if ( options.force ) {
			// [3.1.2]
			return cldr.get( "supplemental/likelySubtags/und" ).split( sep );
		} else {
			// [3.1.1]
			return;
		}
	};



	/**
	 * Given a locale, remove any fields that Add Likely Subtags would add.
	 * http://www.unicode.org/reports/tr35/#Likely_Subtags
	 * 1. First get max = AddLikelySubtags(inputLocale). If an error is signaled,
	 * return it.
	 * 2. Remove the variants from max.
	 * 3. Then for trial in {language, language _ region, language _ script}. If
	 * AddLikelySubtags(trial) = max, then return trial + variants.
	 * 4. If you do not get a match, return max + variants.
	 * 
	 * @maxLanguageId [Array] maxLanguageId tuple (see init.js).
	 */
	var coreRemoveLikelySubtags = function( Cldr, cldr, maxLanguageId ) {
		var match, matchFound,
			language = maxLanguageId[ 0 ],
			script = maxLanguageId[ 1 ],
			territory = maxLanguageId[ 2 ],
			variants = maxLanguageId[ 3 ];

		// [3]
		matchFound = arraySome([
			[ [ language, "Zzzz", "ZZ" ], [ language ] ],
			[ [ language, "Zzzz", territory ], [ language, territory ] ],
			[ [ language, script, "ZZ" ], [ language, script ] ]
		], function( test ) {
			var result = coreLikelySubtags( Cldr, cldr, test[ 0 ] );
			match = test[ 1 ];
			return result && result[ 0 ] === maxLanguageId[ 0 ] &&
				result[ 1 ] === maxLanguageId[ 1 ] &&
				result[ 2 ] === maxLanguageId[ 2 ];
		});

		if ( matchFound ) {
			if ( variants ) {
				match.push( variants );
			}
			return match;
		}

		// [4]
		return maxLanguageId;
	};




	/**
	 * subtags( locale )
	 *
	 * @locale [String]
	 */
	var coreSubtags = function( locale ) {
		var aux, unicodeLanguageId,
			subtags = [];

		locale = locale.replace( /_/, "-" );

		// Unicode locale extensions.
		aux = locale.split( "-u-" );
		if ( aux[ 1 ] ) {
			aux[ 1 ] = aux[ 1 ].split( "-t-" );
			locale = aux[ 0 ] + ( aux[ 1 ][ 1 ] ? "-t-" + aux[ 1 ][ 1 ] : "");
			subtags[ 4 /* unicodeLocaleExtensions */ ] = aux[ 1 ][ 0 ];
		}

		// TODO normalize transformed extensions. Currently, skipped.
		// subtags[ x ] = locale.split( "-t-" )[ 1 ];
		unicodeLanguageId = locale.split( "-t-" )[ 0 ];

		// unicode_language_id = "root"
		//   | unicode_language_subtag         
		//     (sep unicode_script_subtag)? 
		//     (sep unicode_region_subtag)?
		//     (sep unicode_variant_subtag)* ;
		//
		// Although unicode_language_subtag = alpha{2,8}, I'm using alpha{2,3}. Because, there's no language on CLDR lengthier than 3.
		aux = unicodeLanguageId.match( /^(([a-z]{2,3})(-([A-Z][a-z]{3}))?(-([A-Z]{2}|[0-9]{3}))?)((-([a-zA-Z0-9]{5,8}|[0-9][a-zA-Z0-9]{3}))*)$|^(root)$/ );
		if ( aux === null ) {
			return [ "und", "Zzzz", "ZZ" ];
		}
		subtags[ 0 /* language */ ] = aux[ 10 ] /* root */ || aux[ 2 ] || "und";
		subtags[ 1 /* script */ ] = aux[ 4 ] || "Zzzz";
		subtags[ 2 /* territory */ ] = aux[ 6 ] || "ZZ";
		if ( aux[ 7 ] && aux[ 7 ].length ) {
			subtags[ 3 /* variant */ ] = aux[ 7 ].slice( 1 ) /* remove leading "-" */;
		}

		// 0: language
		// 1: script
		// 2: territory (aka region)
		// 3: variant
		// 4: unicodeLocaleExtensions
		return subtags;
	};




	var arrayForEach = function( array, callback ) {
		var i, length;
		if ( array.forEach ) {
			return array.forEach( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			callback( array[ i ], i, array );
		}
	};




	/**
	 * bundleLookup( minLanguageId )
	 *
	 * @Cldr [Cldr class]
	 *
	 * @cldr [Cldr instance]
	 *
	 * @minLanguageId [String] requested languageId after applied remove likely subtags.
	 */
	var bundleLookup = function( Cldr, cldr, minLanguageId ) {
		var availableBundleMap = Cldr._availableBundleMap,
			availableBundleMapQueue = Cldr._availableBundleMapQueue;

		if ( availableBundleMapQueue.length ) {
			arrayForEach( availableBundleMapQueue, function( bundle ) {
				var existing, maxBundle, minBundle, subtags;
				subtags = coreSubtags( bundle );
				maxBundle = coreLikelySubtags( Cldr, cldr, subtags );
				minBundle = coreRemoveLikelySubtags( Cldr, cldr, maxBundle );
				minBundle = minBundle.join( Cldr.localeSep );
				existing = availableBundleMapQueue[ minBundle ];
				if ( existing && existing.length < bundle.length ) {
					return;
				}
				availableBundleMap[ minBundle ] = bundle;
			});
			Cldr._availableBundleMapQueue = [];
		}

		return availableBundleMap[ minLanguageId ] || null;
	};




	var objectKeys = function( object ) {
		var i,
			result = [];

		if ( Object.keys ) {
			return Object.keys( object );
		}

		for ( i in object ) {
			result.push( i );
		}

		return result;
	};




	var createError = function( code, attributes ) {
		var error, message;

		message = code + ( attributes && JSON ? ": " + JSON.stringify( attributes ) : "" );
		error = new Error( message );
		error.code = code;

		// extend( error, attributes );
		arrayForEach( objectKeys( attributes ), function( attribute ) {
			error[ attribute ] = attributes[ attribute ];
		});

		return error;
	};




	var validate = function( code, check, attributes ) {
		if ( !check ) {
			throw createError( code, attributes );
		}
	};




	var validatePresence = function( value, name ) {
		validate( "E_MISSING_PARAMETER", typeof value !== "undefined", {
			name: name
		});
	};




	var validateType = function( value, name, check, expected ) {
		validate( "E_INVALID_PAR_TYPE", check, {
			expected: expected,
			name: name,
			value: value
		});
	};




	var validateTypePath = function( value, name ) {
		validateType( value, name, typeof value === "string" || arrayIsArray( value ), "String or Array" );
	};




	/**
	 * Function inspired by jQuery Core, but reduced to our use case.
	 */
	var isPlainObject = function( obj ) {
		return obj !== null && "" + obj === "[object Object]";
	};




	var validateTypePlainObject = function( value, name ) {
		validateType( value, name, typeof value === "undefined" || isPlainObject( value ), "Plain Object" );
	};




	var validateTypeString = function( value, name ) {
		validateType( value, name, typeof value === "string", "a string" );
	};




	// @path: normalized path
	var resourceGet = function( data, path ) {
		var i,
			node = data,
			length = path.length;

		for ( i = 0; i < length - 1; i++ ) {
			node = node[ path[ i ] ];
			if ( !node ) {
				return undefined;
			}
		}
		return node[ path[ i ] ];
	};




	/**
	 * setAvailableBundles( Cldr, json )
	 *
	 * @Cldr [Cldr class]
	 *
	 * @json resolved/unresolved cldr data.
	 *
	 * Set available bundles queue based on passed json CLDR data. Considers a bundle as any String at /main/{bundle}.
	 */
	var coreSetAvailableBundles = function( Cldr, json ) {
		var bundle,
			availableBundleMapQueue = Cldr._availableBundleMapQueue,
			main = resourceGet( json, [ "main" ] );

		if ( main ) {
			for ( bundle in main ) {
				if ( main.hasOwnProperty( bundle ) && bundle !== "root" &&
							availableBundleMapQueue.indexOf( bundle ) === -1 ) {
					availableBundleMapQueue.push( bundle );
				}
			}
		}
	};



	var alwaysArray = function( somethingOrArray ) {
		return arrayIsArray( somethingOrArray ) ?  somethingOrArray : [ somethingOrArray ];
	};


	var jsonMerge = (function() {

	// Returns new deeply merged JSON.
	//
	// Eg.
	// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
	// -> { a: { b: 3, c: 2, d: 4 } }
	//
	// @arguments JSON's
	// 
	var merge = function() {
		var destination = {},
			sources = [].slice.call( arguments, 0 );
		arrayForEach( sources, function( source ) {
			var prop;
			for ( prop in source ) {
				if ( prop in destination && typeof destination[ prop ] === "object" && !arrayIsArray( destination[ prop ] ) ) {

					// Merge Objects
					destination[ prop ] = merge( destination[ prop ], source[ prop ] );

				} else {

					// Set new values
					destination[ prop ] = source[ prop ];

				}
			}
		});
		return destination;
	};

	return merge;

}());


	/**
	 * load( Cldr, source, jsons )
	 *
	 * @Cldr [Cldr class]
	 *
	 * @source [Object]
	 *
	 * @jsons [arguments]
	 */
	var coreLoad = function( Cldr, source, jsons ) {
		var i, j, json;

		validatePresence( jsons[ 0 ], "json" );

		// Support arbitrary parameters, e.g., `Cldr.load({...}, {...})`.
		for ( i = 0; i < jsons.length; i++ ) {

			// Support array parameters, e.g., `Cldr.load([{...}, {...}])`.
			json = alwaysArray( jsons[ i ] );

			for ( j = 0; j < json.length; j++ ) {
				validateTypePlainObject( json[ j ], "json" );
				source = jsonMerge( source, json[ j ] );
				coreSetAvailableBundles( Cldr, json[ j ] );
			}
		}

		return source;
	};



	var itemGetResolved = function( Cldr, path, attributes ) {
		// Resolve path
		var normalizedPath = pathNormalize( path, attributes );

		return resourceGet( Cldr._resolved, normalizedPath );
	};




	/**
	 * new Cldr()
	 */
	var Cldr = function( locale ) {
		this.init( locale );
	};

	// Build optimization hack to avoid duplicating functions across modules.
	Cldr._alwaysArray = alwaysArray;
	Cldr._coreLoad = coreLoad;
	Cldr._createError = createError;
	Cldr._itemGetResolved = itemGetResolved;
	Cldr._jsonMerge = jsonMerge;
	Cldr._pathNormalize = pathNormalize;
	Cldr._resourceGet = resourceGet;
	Cldr._validatePresence = validatePresence;
	Cldr._validateType = validateType;
	Cldr._validateTypePath = validateTypePath;
	Cldr._validateTypePlainObject = validateTypePlainObject;

	Cldr._availableBundleMap = {};
	Cldr._availableBundleMapQueue = [];
	Cldr._resolved = {};

	// Allow user to override locale separator "-" (default) | "_". According to http://www.unicode.org/reports/tr35/#Unicode_language_identifier, both "-" and "_" are valid locale separators (eg. "en_GB", "en-GB"). According to http://unicode.org/cldr/trac/ticket/6786 its usage must be consistent throughout the data set.
	Cldr.localeSep = "-";

	/**
	 * Cldr.load( json [, json, ...] )
	 *
	 * @json [JSON] CLDR data or [Array] Array of @json's.
	 *
	 * Load resolved cldr data.
	 */
	Cldr.load = function() {
		Cldr._resolved = coreLoad( Cldr, Cldr._resolved, arguments );
	};

	/**
	 * .init() automatically run on instantiation/construction.
	 */
	Cldr.prototype.init = function( locale ) {
		var attributes, language, maxLanguageId, minLanguageId, script, subtags, territory, unicodeLocaleExtensions, variant,
			sep = Cldr.localeSep,
			unicodeLocaleExtensionsRaw = "";

		validatePresence( locale, "locale" );
		validateTypeString( locale, "locale" );

		subtags = coreSubtags( locale );

		if ( subtags.length === 5 ) {
			unicodeLocaleExtensions = subtags.pop();
			unicodeLocaleExtensionsRaw = sep + "u" + sep + unicodeLocaleExtensions;
			// Remove trailing null when there is unicodeLocaleExtensions but no variants.
			if ( !subtags[ 3 ] ) {
				subtags.pop();
			}
		}
		variant = subtags[ 3 ];

		// Normalize locale code.
		// Get (or deduce) the "triple subtags": language, territory (also aliased as region), and script subtags.
		// Get the variant subtags (calendar, collation, currency, etc).
		// refs:
		// - http://www.unicode.org/reports/tr35/#Field_Definitions
		// - http://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
		// - http://www.unicode.org/reports/tr35/#Unicode_locale_identifier

		// When a locale id does not specify a language, or territory (region), or script, they are obtained by Likely Subtags.
		maxLanguageId = coreLikelySubtags( Cldr, this, subtags, { force: true } ) || subtags;
		language = maxLanguageId[ 0 ];
		script = maxLanguageId[ 1 ];
		territory = maxLanguageId[ 2 ];

		minLanguageId = coreRemoveLikelySubtags( Cldr, this, maxLanguageId ).join( sep );

		// Set attributes
		this.attributes = attributes = {
			bundle: bundleLookup( Cldr, this, minLanguageId ),

			// Unicode Language Id
			minLanguageId: minLanguageId + unicodeLocaleExtensionsRaw,
			maxLanguageId: maxLanguageId.join( sep ) + unicodeLocaleExtensionsRaw,

			// Unicode Language Id Subtabs
			language: language,
			script: script,
			territory: territory,
			region: territory, /* alias */
			variant: variant
		};

		// Unicode locale extensions.
		unicodeLocaleExtensions && ( "-" + unicodeLocaleExtensions ).replace( /-[a-z]{3,8}|(-[a-z]{2})-([a-z]{3,8})/g, function( attribute, key, type ) {

			if ( key ) {

				// Extension is in the `keyword` form.
				attributes[ "u" + key ] = type;
			} else {

				// Extension is in the `attribute` form.
				attributes[ "u" + attribute ] = true;
			}
		});

		this.locale = locale;
	};

	/**
	 * .get()
	 */
	Cldr.prototype.get = function( path ) {

		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		return itemGetResolved( Cldr, path, this.attributes );
	};

	/**
	 * .main()
	 */
	Cldr.prototype.main = function( path ) {
		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		validate( "E_MISSING_BUNDLE", this.attributes.bundle !== null, {
			locale: this.locale
		});

		path = alwaysArray( path );
		return this.get( [ "main/{bundle}" ].concat( path ) );
	};

	return Cldr;




}));


/***/ }),

/***/ "./node_modules/cldrjs/dist/cldr/event.js":
/*!************************************************!*\
  !*** ./node_modules/cldrjs/dist/cldr/event.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * CLDR JavaScript Library v0.5.0
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-08-11T11:52Z
 */
/*!
 * CLDR JavaScript Library v0.5.0 2017-08-11T11:52Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
(function( factory ) {

	if ( true ) {
		// AMD.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(/*! ../cldr */ "./node_modules/cldrjs/dist/cldr.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(function( Cldr ) {

	// Build optimization hack to avoid duplicating functions across modules.
	var pathNormalize = Cldr._pathNormalize,
		validatePresence = Cldr._validatePresence,
		validateType = Cldr._validateType;

/*!
 * EventEmitter v4.2.7 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

var EventEmitter;
/* jshint ignore:start */
EventEmitter = (function () {


	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = {};
	

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (evt instanceof RegExp) {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (evt instanceof RegExp) {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	return EventEmitter;
}());
/* jshint ignore:end */



	var validateTypeFunction = function( value, name ) {
		validateType( value, name, typeof value === "undefined" || typeof value === "function", "Function" );
	};




	var superGet, superInit,
		globalEe = new EventEmitter();

	function validateTypeEvent( value, name ) {
		validateType( value, name, typeof value === "string" || value instanceof RegExp, "String or RegExp" );
	}

	function validateThenCall( method, self ) {
		return function( event, listener ) {
			validatePresence( event, "event" );
			validateTypeEvent( event, "event" );

			validatePresence( listener, "listener" );
			validateTypeFunction( listener, "listener" );

			return self[ method ].apply( self, arguments );
		};
	}

	function off( self ) {
		return validateThenCall( "off", self );
	}

	function on( self ) {
		return validateThenCall( "on", self );
	}

	function once( self ) {
		return validateThenCall( "once", self );
	}

	Cldr.off = off( globalEe );
	Cldr.on = on( globalEe );
	Cldr.once = once( globalEe );

	/**
	 * Overload Cldr.prototype.init().
	 */
	superInit = Cldr.prototype.init;
	Cldr.prototype.init = function() {
		var ee;
		this.ee = ee = new EventEmitter();
		this.off = off( ee );
		this.on = on( ee );
		this.once = once( ee );
		superInit.apply( this, arguments );
	};

	/**
	 * getOverload is encapsulated, because of cldr/unresolved. If it's loaded
	 * after cldr/event (and note it overwrites .get), it can trigger this
	 * overload again.
	 */
	function getOverload() {

		/**
		 * Overload Cldr.prototype.get().
		 */
		superGet = Cldr.prototype.get;
		Cldr.prototype.get = function( path ) {
			var value = superGet.apply( this, arguments );
			path = pathNormalize( path, this.attributes ).join( "/" );
			globalEe.trigger( "get", [ path, value ] );
			this.ee.trigger( "get", [ path, value ] );
			return value;
		};
	}

	Cldr._eventInit = getOverload;
	getOverload();

	return Cldr;




}));


/***/ }),

/***/ "./node_modules/cldrjs/dist/cldr/supplemental.js":
/*!*******************************************************!*\
  !*** ./node_modules/cldrjs/dist/cldr/supplemental.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * CLDR JavaScript Library v0.5.0
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-08-11T11:52Z
 */
/*!
 * CLDR JavaScript Library v0.5.0 2017-08-11T11:52Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
(function( factory ) {

	if ( true ) {
		// AMD.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(/*! ../cldr */ "./node_modules/cldrjs/dist/cldr.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(function( Cldr ) {

	// Build optimization hack to avoid duplicating functions across modules.
	var alwaysArray = Cldr._alwaysArray;



	var supplementalMain = function( cldr ) {

		var prepend, supplemental;
		
		prepend = function( prepend ) {
			return function( path ) {
				path = alwaysArray( path );
				return cldr.get( [ prepend ].concat( path ) );
			};
		};

		supplemental = prepend( "supplemental" );

		// Week Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Week_Data
		supplemental.weekData = prepend( "supplemental/weekData" );

		supplemental.weekData.firstDay = function() {
			return cldr.get( "supplemental/weekData/firstDay/{territory}" ) ||
				cldr.get( "supplemental/weekData/firstDay/001" );
		};

		supplemental.weekData.minDays = function() {
			var minDays = cldr.get( "supplemental/weekData/minDays/{territory}" ) ||
				cldr.get( "supplemental/weekData/minDays/001" );
			return parseInt( minDays, 10 );
		};

		// Time Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
		supplemental.timeData = prepend( "supplemental/timeData" );

		supplemental.timeData.allowed = function() {
			return cldr.get( "supplemental/timeData/{territory}/_allowed" ) ||
				cldr.get( "supplemental/timeData/001/_allowed" );
		};

		supplemental.timeData.preferred = function() {
			return cldr.get( "supplemental/timeData/{territory}/_preferred" ) ||
				cldr.get( "supplemental/timeData/001/_preferred" );
		};

		return supplemental;

	};




	var initSuper = Cldr.prototype.init;

	/**
	 * .init() automatically ran on construction.
	 *
	 * Overload .init().
	 */
	Cldr.prototype.init = function() {
		initSuper.apply( this, arguments );
		this.supplemental = supplementalMain( this );
	};

	return Cldr;




}));


/***/ }),

/***/ "./node_modules/cldrjs/dist/cldr/unresolved.js":
/*!*****************************************************!*\
  !*** ./node_modules/cldrjs/dist/cldr/unresolved.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * CLDR JavaScript Library v0.5.0
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-08-11T11:52Z
 */
/*!
 * CLDR JavaScript Library v0.5.0 2017-08-11T11:52Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
(function( factory ) {

	if ( true ) {
		// AMD.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(/*! ../cldr */ "./node_modules/cldrjs/dist/cldr.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(function( Cldr ) {

	// Build optimization hack to avoid duplicating functions across modules.
	var coreLoad = Cldr._coreLoad;
	var jsonMerge = Cldr._jsonMerge;
	var pathNormalize = Cldr._pathNormalize;
	var resourceGet = Cldr._resourceGet;
	var validatePresence = Cldr._validatePresence;
	var validateTypePath = Cldr._validateTypePath;



	var bundleParentLookup = function( Cldr, locale ) {
		var normalizedPath, parent;

		if ( locale === "root" ) {
			return;
		}

		// First, try to find parent on supplemental data.
		normalizedPath = pathNormalize( [ "supplemental/parentLocales/parentLocale", locale ] );
		parent = resourceGet( Cldr._resolved, normalizedPath ) || resourceGet( Cldr._raw, normalizedPath );
		if ( parent ) {
			return parent;
		}

		// Or truncate locale.
		parent = locale.substr( 0, locale.lastIndexOf( Cldr.localeSep ) );
		if ( !parent ) {
			return "root";
		}

		return parent;
	};




	// @path: normalized path
	var resourceSet = function( data, path, value ) {
		var i,
			node = data,
			length = path.length;

		for ( i = 0; i < length - 1; i++ ) {
			if ( !node[ path[ i ] ] ) {
				node[ path[ i ] ] = {};
			}
			node = node[ path[ i ] ];
		}
		node[ path[ i ] ] = value;
	};


	var itemLookup = (function() {

	var lookup;

	lookup = function( Cldr, locale, path, attributes, childLocale ) {
		var normalizedPath, parent, value;

		// 1: Finish recursion
		// 2: Avoid infinite loop
		if ( typeof locale === "undefined" /* 1 */ || locale === childLocale /* 2 */ ) {
			return;
		}

		// Resolve path
		normalizedPath = pathNormalize( path, attributes );

		// Check resolved (cached) data first
		// 1: Due to #16, never use the cached resolved non-leaf nodes. It may not
		//    represent its leafs in its entirety.
		value = resourceGet( Cldr._resolved, normalizedPath );
		if ( value !== undefined && typeof value !== "object" /* 1 */ ) {
			return value;
		}

		// Check raw data
		value = resourceGet( Cldr._raw, normalizedPath );

		if ( value === undefined ) {
			// Or, lookup at parent locale
			parent = bundleParentLookup( Cldr, locale );
			value = lookup( Cldr, parent, path, jsonMerge( attributes, { bundle: parent }), locale );
		}

		if ( value !== undefined ) {
			// Set resolved (cached)
			resourceSet( Cldr._resolved, normalizedPath, value );
		}

		return value;
	};

	return lookup;

}());


	Cldr._raw = {};

	/**
	 * Cldr.load( json [, json, ...] )
	 *
	 * @json [JSON] CLDR data or [Array] Array of @json's.
	 *
	 * Load resolved or unresolved cldr data.
	 * Overwrite Cldr.load().
	 */
	Cldr.load = function() {
		Cldr._raw = coreLoad( Cldr, Cldr._raw, arguments );
	};

	/**
	 * Overwrite Cldr.prototype.get().
	 */
	Cldr.prototype.get = function( path ) {
		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		// 1: use bundle as locale on item lookup for simplification purposes, because no other extended subtag is used anyway on bundle parent lookup.
		// 2: during init(), this method is called, but bundle is yet not defined. Use "" as a workaround in this very specific scenario.
		return itemLookup( Cldr, this.attributes && this.attributes.bundle /* 1 */ || "" /* 2 */, path, this.attributes );
	};

	// In case cldr/unresolved is loaded after cldr/event, we trigger its overloads again. Because, .get is overwritten in here.
	if ( Cldr._eventInit ) {
		Cldr._eventInit();
	}

	return Cldr;




}));


/***/ }),

/***/ "./node_modules/cldrjs/dist/node_main.js":
/*!***********************************************!*\
  !*** ./node_modules/cldrjs/dist/node_main.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * CLDR JavaScript Library v0.5.0
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-08-11T11:52Z
 */
/*!
 * CLDR JavaScript Library v0.5.0 2017-08-11T11:52Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */

// Cldr
module.exports = __webpack_require__( /*! ./cldr */ "./node_modules/cldrjs/dist/cldr.js" );

// Extent Cldr with the following modules
__webpack_require__( /*! ./cldr/event */ "./node_modules/cldrjs/dist/cldr/event.js" );
__webpack_require__( /*! ./cldr/supplemental */ "./node_modules/cldrjs/dist/cldr/supplemental.js" );
__webpack_require__( /*! ./cldr/unresolved */ "./node_modules/cldrjs/dist/cldr/unresolved.js" );


/***/ }),

/***/ "./node_modules/globalize/dist/globalize.js":
/*!**************************************************!*\
  !*** ./node_modules/globalize/dist/globalize.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var define = false;

/**
 * Globalize v1.4.0
 *
 * http://github.com/jquery/globalize
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2018-07-17T20:38Z
 */
/*!
 * Globalize v1.4.0 2018-07-17T20:38Z Released under the MIT license
 * http://git.io/TrdQbw
 */
(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define([
			"cldr",
			"cldr/event"
		], factory );
	} else if ( true ) {

		// Node, CommonJS
		module.exports = factory( __webpack_require__( /*! cldrjs */ "./node_modules/cldrjs/dist/node_main.js" ) );
	} else {}
}( this, function( Cldr ) {


/**
 * A toString method that outputs meaningful values for objects or arrays and
 * still performs as fast as a plain string in case variable is string, or as
 * fast as `"" + number` in case variable is a number.
 * Ref: http://jsperf.com/my-stringify
 */
var toString = function( variable ) {
	return typeof variable === "string" ? variable : ( typeof variable === "number" ? "" +
		variable : JSON.stringify( variable ) );
};




/**
 * formatMessage( message, data )
 *
 * @message [String] A message with optional {vars} to be replaced.
 *
 * @data [Array or JSON] Object with replacing-variables content.
 *
 * Return the formatted message. For example:
 *
 * - formatMessage( "{0} second", [ 1 ] ); // 1 second
 *
 * - formatMessage( "{0}/{1}", ["m", "s"] ); // m/s
 *
 * - formatMessage( "{name} <{email}>", {
 *     name: "Foo",
 *     email: "bar@baz.qux"
 *   }); // Foo <bar@baz.qux>
 */
var formatMessage = function( message, data ) {

	// Replace {attribute}'s
	message = message.replace( /{[0-9a-zA-Z-_. ]+}/g, function( name ) {
		name = name.replace( /^{([^}]*)}$/, "$1" );
		return toString( data[ name ] );
	});

	return message;
};




var objectExtend = function() {
	var destination = arguments[ 0 ],
		sources = [].slice.call( arguments, 1 );

	sources.forEach(function( source ) {
		var prop;
		for ( prop in source ) {
			destination[ prop ] = source[ prop ];
		}
	});

	return destination;
};




var createError = function( code, message, attributes ) {
	var error;

	message = code + ( message ? ": " + formatMessage( message, attributes ) : "" );
	error = new Error( message );
	error.code = code;

	objectExtend( error, attributes );

	return error;
};




var runtimeStringify = function( args ) {
	return JSON.stringify( args, function( key, value ) {
		if ( value && value.runtimeKey ) {
			return value.runtimeKey;
		}
		return value;
	} );
};




// Based on http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
var stringHash = function( str ) {
	return [].reduce.call( str, function( hash, i ) {
		var chr = i.charCodeAt( 0 );
		hash = ( ( hash << 5 ) - hash ) + chr;
		return hash | 0;
	}, 0 );
};




var runtimeKey = function( fnName, locale, args, argsStr ) {
	var hash;
	argsStr = argsStr || runtimeStringify( args );
	hash = stringHash( fnName + locale + argsStr );
	return hash > 0 ? "a" + hash : "b" + Math.abs( hash );
};




var functionName = function( fn ) {
	if ( fn.name !== undefined ) {
		return fn.name;
	}

	// fn.name is not supported by IE.
	var matches = /^function\s+([\w\$]+)\s*\(/.exec( fn.toString() );

	if ( matches && matches.length > 0 ) {
		return matches[ 1 ];
	}
};




var runtimeBind = function( args, cldr, fn, runtimeArgs ) {

	var argsStr = runtimeStringify( args ),
		fnName = functionName( fn ),
		locale = cldr.locale;

	// If name of the function is not available, this is most likely due to uglification,
	// which most likely means we are in production, and runtimeBind here is not necessary.
	if ( !fnName ) {
		return fn;
	}

	fn.runtimeKey = runtimeKey( fnName, locale, null, argsStr );

	fn.generatorString = function() {
		return "Globalize(\"" + locale + "\")." + fnName + "(" + argsStr.slice( 1, -1 ) + ")";
	};

	fn.runtimeArgs = runtimeArgs;

	return fn;
};




var validate = function( code, message, check, attributes ) {
	if ( !check ) {
		throw createError( code, message, attributes );
	}
};




var alwaysArray = function( stringOrArray ) {
	return Array.isArray( stringOrArray ) ? stringOrArray : stringOrArray ? [ stringOrArray ] : [];
};




var validateCldr = function( path, value, options ) {
	var skipBoolean;
	options = options || {};

	skipBoolean = alwaysArray( options.skip ).some(function( pathRe ) {
		return pathRe.test( path );
	});

	validate( "E_MISSING_CLDR", "Missing required CLDR content `{path}`.", value || skipBoolean, {
		path: path
	});
};




var validateDefaultLocale = function( value ) {
	validate( "E_DEFAULT_LOCALE_NOT_DEFINED", "Default locale has not been defined.",
		value !== undefined, {} );
};




var validateParameterPresence = function( value, name ) {
	validate( "E_MISSING_PARAMETER", "Missing required parameter `{name}`.",
		value !== undefined, { name: name });
};




/**
 * range( value, name, minimum, maximum )
 *
 * @value [Number].
 *
 * @name [String] name of variable.
 *
 * @minimum [Number]. The lowest valid value, inclusive.
 *
 * @maximum [Number]. The greatest valid value, inclusive.
 */
var validateParameterRange = function( value, name, minimum, maximum ) {
	validate(
		"E_PAR_OUT_OF_RANGE",
		"Parameter `{name}` has value `{value}` out of range [{minimum}, {maximum}].",
		value === undefined || value >= minimum && value <= maximum,
		{
			maximum: maximum,
			minimum: minimum,
			name: name,
			value: value
		}
	);
};




var validateParameterType = function( value, name, check, expected ) {
	validate(
		"E_INVALID_PAR_TYPE",
		"Invalid `{name}` parameter ({value}). {expected} expected.",
		check,
		{
			expected: expected,
			name: name,
			value: value
		}
	);
};




var validateParameterTypeLocale = function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || typeof value === "string" || value instanceof Cldr,
		"String or Cldr instance"
	);
};




/**
 * Function inspired by jQuery Core, but reduced to our use case.
 */
var isPlainObject = function( obj ) {
	return obj !== null && "" + obj === "[object Object]";
};




var validateParameterTypePlainObject = function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || isPlainObject( value ),
		"Plain Object"
	);
};




var alwaysCldr = function( localeOrCldr ) {
	return localeOrCldr instanceof Cldr ? localeOrCldr : new Cldr( localeOrCldr );
};




// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FRegular_Expressions
var regexpEscape = function( string ) {
	return string.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );
};




var stringPad = function( str, count, right ) {
	var length;
	if ( typeof str !== "string" ) {
		str = String( str );
	}
	for ( length = str.length; length < count; length += 1 ) {
		str = ( right ? ( str + "0" ) : ( "0" + str ) );
	}
	return str;
};




function validateLikelySubtags( cldr ) {
	cldr.once( "get", validateCldr );
	cldr.get( "supplemental/likelySubtags" );
}

/**
 * [new] Globalize( locale|cldr )
 *
 * @locale [String]
 *
 * @cldr [Cldr instance]
 *
 * Create a Globalize instance.
 */
function Globalize( locale ) {
	if ( !( this instanceof Globalize ) ) {
		return new Globalize( locale );
	}

	validateParameterPresence( locale, "locale" );
	validateParameterTypeLocale( locale, "locale" );

	this.cldr = alwaysCldr( locale );

	validateLikelySubtags( this.cldr );
}

/**
 * Globalize.load( json, ... )
 *
 * @json [JSON]
 *
 * Load resolved or unresolved cldr data.
 * Somewhat equivalent to previous Globalize.addCultureInfo(...).
 */
Globalize.load = function() {

	// validations are delegated to Cldr.load().
	Cldr.load.apply( Cldr, arguments );
};

/**
 * Globalize.locale( [locale|cldr] )
 *
 * @locale [String]
 *
 * @cldr [Cldr instance]
 *
 * Set default Cldr instance if locale or cldr argument is passed.
 *
 * Return the default Cldr instance.
 */
Globalize.locale = function( locale ) {
	validateParameterTypeLocale( locale, "locale" );

	if ( arguments.length ) {
		this.cldr = alwaysCldr( locale );
		validateLikelySubtags( this.cldr );
	}
	return this.cldr;
};

/**
 * Optimization to avoid duplicating some internal functions across modules.
 */
Globalize._alwaysArray = alwaysArray;
Globalize._createError = createError;
Globalize._formatMessage = formatMessage;
Globalize._isPlainObject = isPlainObject;
Globalize._objectExtend = objectExtend;
Globalize._regexpEscape = regexpEscape;
Globalize._runtimeBind = runtimeBind;
Globalize._stringPad = stringPad;
Globalize._validate = validate;
Globalize._validateCldr = validateCldr;
Globalize._validateDefaultLocale = validateDefaultLocale;
Globalize._validateParameterPresence = validateParameterPresence;
Globalize._validateParameterRange = validateParameterRange;
Globalize._validateParameterTypePlainObject = validateParameterTypePlainObject;
Globalize._validateParameterType = validateParameterType;

return Globalize;




}));



/***/ }),

/***/ "./node_modules/globalize/dist/globalize/message.js":
/*!**********************************************************!*\
  !*** ./node_modules/globalize/dist/globalize/message.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var define = false;

/**
 * Globalize v1.4.0
 *
 * http://github.com/jquery/globalize
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2018-07-17T20:38Z
 */
/*!
 * Globalize v1.4.0 2018-07-17T20:38Z Released under the MIT license
 * http://git.io/TrdQbw
 */
(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define([
			"cldr",
			"../globalize",
			"cldr/event"
		], factory );
	} else if ( true ) {

		// Node, CommonJS
		module.exports = factory( __webpack_require__( /*! cldrjs */ "./node_modules/cldrjs/dist/node_main.js" ), __webpack_require__( /*! ../globalize */ "./node_modules/globalize/dist/globalize.js" ) );
	} else {}
}(this, function( Cldr, Globalize ) {

var alwaysArray = Globalize._alwaysArray,
	createError = Globalize._createError,
	isPlainObject = Globalize._isPlainObject,
	runtimeBind = Globalize._runtimeBind,
	validateDefaultLocale = Globalize._validateDefaultLocale,
	validate = Globalize._validate,
	validateParameterPresence = Globalize._validateParameterPresence,
	validateParameterType = Globalize._validateParameterType,
	validateParameterTypePlainObject = Globalize._validateParameterTypePlainObject;
var MessageFormat;
/* jshint ignore:start */
MessageFormat = (function() {
MessageFormat._parse = (function() {

  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function(st) {
              return { type: 'messageFormatPattern', statements: st };
            },
        peg$c2 = peg$FAILED,
        peg$c3 = "{",
        peg$c4 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c5 = null,
        peg$c6 = ",",
        peg$c7 = { type: "literal", value: ",", description: "\",\"" },
        peg$c8 = "}",
        peg$c9 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c10 = function(argIdx, efmt) {
              var res = {
                type: "messageFormatElement",
                argumentIndex: argIdx
              };
              if (efmt && efmt.length) {
                res.elementFormat = efmt[1];
              } else {
                res.output = true;
              }
              return res;
            },
        peg$c11 = "plural",
        peg$c12 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c13 = function(t, s) {
              return { type: "elementFormat", key: t, val: s };
            },
        peg$c14 = "selectordinal",
        peg$c15 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c16 = "select",
        peg$c17 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c18 = function(t, p) {
              return { type: "elementFormat", key: t, val: p };
            },
        peg$c19 = function(op, pf) {
              return { type: "pluralFormatPattern", pluralForms: pf, offset: op || 0 };
            },
        peg$c20 = "offset",
        peg$c21 = { type: "literal", value: "offset", description: "\"offset\"" },
        peg$c22 = ":",
        peg$c23 = { type: "literal", value: ":", description: "\":\"" },
        peg$c24 = function(d) { return d; },
        peg$c25 = function(k, mfp) {
              return { key: k, val: mfp };
            },
        peg$c26 = function(i) { return i; },
        peg$c27 = "=",
        peg$c28 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c29 = function(pf) { return { type: "selectFormatPattern", pluralForms: pf }; },
        peg$c30 = function(p) { return p; },
        peg$c31 = "#",
        peg$c32 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c33 = function() { return {type: 'octothorpe'}; },
        peg$c34 = function(s) { return { type: "string", val: s.join('') }; },
        peg$c35 = { type: "other", description: "identifier" },
        peg$c36 = /^[0-9a-zA-Z$_]/,
        peg$c37 = { type: "class", value: "[0-9a-zA-Z$_]", description: "[0-9a-zA-Z$_]" },
        peg$c38 = /^[^ \t\n\r,.+={}]/,
        peg$c39 = { type: "class", value: "[^ \\t\\n\\r,.+={}]", description: "[^ \\t\\n\\r,.+={}]" },
        peg$c40 = function(s) { return s; },
        peg$c41 = function(chars) { return chars.join(''); },
        peg$c42 = /^[^{}#\\\0-\x1F \t\n\r]/,
        peg$c43 = { type: "class", value: "[^{}#\\\\\\0-\\x1F \\t\\n\\r]", description: "[^{}#\\\\\\0-\\x1F \\t\\n\\r]" },
        peg$c44 = function(x) { return x; },
        peg$c45 = "\\\\",
        peg$c46 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c47 = function() { return "\\"; },
        peg$c48 = "\\#",
        peg$c49 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c50 = function() { return "#"; },
        peg$c51 = "\\{",
        peg$c52 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c53 = function() { return "\u007B"; },
        peg$c54 = "\\}",
        peg$c55 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c56 = function() { return "\u007D"; },
        peg$c57 = "\\u",
        peg$c58 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c59 = function(h1, h2, h3, h4) {
              return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
            },
        peg$c60 = /^[0-9]/,
        peg$c61 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c62 = function(ds) {
            //the number might start with 0 but must not be interpreted as an octal number
            //Hence, the base is passed to parseInt explicitely
            return parseInt((ds.join('')), 10);
          },
        peg$c63 = /^[0-9a-fA-F]/,
        peg$c64 = { type: "class", value: "[0-9a-fA-F]", description: "[0-9a-fA-F]" },
        peg$c65 = { type: "other", description: "whitespace" },
        peg$c66 = function(w) { return w.join(''); },
        peg$c67 = /^[ \t\n\r]/,
        peg$c68 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      if (s2 === peg$FAILED) {
        s2 = peg$parsestring();
        if (s2 === peg$FAILED) {
          s2 = peg$parseoctothorpe();
        }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
        if (s2 === peg$FAILED) {
          s2 = peg$parsestring();
          if (s2 === peg$FAILED) {
            s2 = peg$parseoctothorpe();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseid();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c6;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c7); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseelementFormat();
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c2;
            }
            if (s4 === peg$FAILED) {
              s4 = peg$c5;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s6 = peg$c8;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c9); }
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c10(s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c11) {
          s2 = peg$c11;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c12); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c6;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c7); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsepluralFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c13(s2, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          if (input.substr(peg$currPos, 13) === peg$c14) {
            s2 = peg$c14;
            peg$currPos += 13;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c15); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s4 = peg$c6;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c7); }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsepluralFormatPattern();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c13(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c16) {
              s2 = peg$c16;
              peg$currPos += 6;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s4 = peg$c6;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c7); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseselectFormatPattern();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c13(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseid();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseargStylePattern();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseargStylePattern();
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c18(s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          }
        }
      }

      return s0;
    }

    function peg$parsepluralFormatPattern() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseoffsetPattern();
      if (s1 === peg$FAILED) {
        s1 = peg$c5;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsepluralForm();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsepluralForm();
          }
        } else {
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c19(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoffsetPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c20) {
          s2 = peg$c20;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c21); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c22;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c23); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsedigits();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c24(s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralForm() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsepluralKey();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c8;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c9); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c25(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralKey() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s1 = peg$c27;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsedigits();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c24(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      return s0;
    }

    function peg$parseselectFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseselectForm();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseselectForm();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c29(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseselectForm() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseid();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c8;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c9); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c25(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseargStylePattern() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c6;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c7); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseid();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c30(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoctothorpe() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c31;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c33();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechars();
      if (s2 === peg$FAILED) {
        s2 = peg$parsewhitespace();
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechars();
          if (s2 === peg$FAILED) {
            s2 = peg$parsewhitespace();
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c34(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseid() {
      var s0, s1, s2, s3, s4, s5, s6;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        if (peg$c36.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c37); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c38.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c39); }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c38.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c39); }
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        if (s3 !== peg$FAILED) {
          s3 = input.substring(s2, peg$currPos);
        }
        s2 = s3;
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c40(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c41(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (peg$c42.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c44(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c45) {
          s1 = peg$c45;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c47();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c48) {
            s1 = peg$c48;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c49); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c50();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c51) {
              s1 = peg$c51;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c52); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c53();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c54) {
                s1 = peg$c54;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c55); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c56();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c57) {
                  s1 = peg$c57;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c58); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsehexDigit();
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parsehexDigit();
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parsehexDigit();
                      if (s4 !== peg$FAILED) {
                        s5 = peg$parsehexDigit();
                        if (s5 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c59(s2, s3, s4, s5);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c2;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsedigits() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c60.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c61); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c60.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c61); }
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c62(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c63.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsewhitespace();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsewhitespace();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c66(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }

      return s0;
    }

    function peg$parsewhitespace() {
      var s0;

      if (peg$c67.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
}()).parse;


/** @file messageformat.js - ICU PluralFormat + SelectFormat for JavaScript
 *  @author Alex Sexton - @SlexAxton
 *  @version 0.3.0-1
 *  @copyright 2012-2015 Alex Sexton, Eemeli Aro, and Contributors
 *  @license To use or fork, MIT. To contribute back, Dojo CLA  */


/** Utility function for quoting an Object's key value iff required
 *  @private  */
function propname(key, obj) {
  if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key)) {
    return obj ? obj + '.' + key : key;
  } else {
    var jkey = JSON.stringify(key);
    return obj ? obj + '[' + jkey + ']' : jkey;
  }
};


/** Create a new message formatter
 *
 *  @class
 *  @global
 *  @param {string|string[]} [locale="en"] - The locale to use, with fallbacks
 *  @param {function} [pluralFunc] - Optional custom pluralization function
 *  @param {function[]} [formatters] - Optional custom formatting functions  */
function MessageFormat(locale, pluralFunc, formatters) {
  this.lc = [locale];  
  this.runtime.pluralFuncs = {};
  this.runtime.pluralFuncs[this.lc[0]] = pluralFunc;
  this.runtime.fmt = {};
  if (formatters) for (var f in formatters) {
    this.runtime.fmt[f] = formatters[f];
  }
}




/** Parse an input string to its AST
 *
 *  Precompiled from `lib/messageformat-parser.pegjs` by
 *  {@link http://pegjs.org/ PEG.js}. Included in MessageFormat object
 *  to enable testing.
 *
 *  @private  */



/** Pluralization functions from
 *  {@link http://github.com/eemeli/make-plural.js make-plural}
 *
 *  @memberof MessageFormat
 *  @type Object.<string,function>  */
MessageFormat.plurals = {};


/** Default number formatting functions in the style of ICU's
 *  {@link http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html simpleArg syntax}
 *  implemented using the
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl Intl}
 *  object defined by ECMA-402.
 *
 *  **Note**: Intl is not defined in default Node until 0.11.15 / 0.12.0, so
 *  earlier versions require a {@link https://www.npmjs.com/package/intl polyfill}.
 *  Therefore {@link MessageFormat.withIntlSupport} needs to be true for these
 *  functions to be available for inclusion in the output.
 *
 *  @see MessageFormat#setIntlSupport
 *
 *  @namespace
 *  @memberof MessageFormat
 *  @property {function} number - Represent a number as an integer, percent or currency value
 *  @property {function} date - Represent a date as a full/long/default/short string
 *  @property {function} time - Represent a time as a full/long/default/short string
 *
 *  @example
 *  > var MessageFormat = require('messageformat');
 *  > var mf = (new MessageFormat('en')).setIntlSupport(true);
 *  > mf.currency = 'EUR';
 *  > var mfunc = mf.compile("The total is {V,number,currency}.");
 *  > mfunc({V:5.5})
 *  "The total is €5.50."
 *
 *  @example
 *  > var MessageFormat = require('messageformat');
 *  > var mf = new MessageFormat('en', null, {number: MessageFormat.number});
 *  > mf.currency = 'EUR';
 *  > var mfunc = mf.compile("The total is {V,number,currency}.");
 *  > mfunc({V:5.5})
 *  "The total is €5.50."  */
MessageFormat.formatters = {};

/** Enable or disable support for the default formatters, which require the
 *  `Intl` object. Note that this can't be autodetected, as the environment
 *  in which the formatted text is compiled into Javascript functions is not
 *  necessarily the same environment in which they will get executed.
 *
 *  @see MessageFormat.formatters
 *
 *  @memberof MessageFormat
 *  @param {boolean} [enable=true]
 *  @returns {Object} The MessageFormat instance, to allow for chaining
 *  @example
 *  > var Intl = require('intl');
 *  > var MessageFormat = require('messageformat');
 *  > var mf = (new MessageFormat('en')).setIntlSupport(true);
 *  > mf.currency = 'EUR';
 *  > mf.compile("The total is {V,number,currency}.")({V:5.5});
 *  "The total is €5.50."  */



/** A set of utility functions that are called by the compiled Javascript
 *  functions, these are included locally in the output of {@link
 *  MessageFormat#compile compile()}.
 *
 *  @namespace
 *  @memberof MessageFormat  */
MessageFormat.prototype.runtime = {

  /** Utility function for `#` in plural rules
   *
   *  @param {number} value - The value to operate on
   *  @param {number} [offset=0] - An optional offset, set by the surrounding context  */
  number: function(value, offset) {
    if (isNaN(value)) throw new Error("'" + value + "' isn't a number.");
    return value - (offset || 0);
  },

  /** Utility function for `{N, plural|selectordinal, ...}`
   *
   *  @param {number} value - The key to use to find a pluralization rule
   *  @param {number} offset - An offset to apply to `value`
   *  @param {function} lcfunc - A locale function from `pluralFuncs`
   *  @param {Object.<string,string>} data - The object from which results are looked up
   *  @param {?boolean} isOrdinal - If true, use ordinal rather than cardinal rules
   *  @returns {string} The result of the pluralization  */
  plural: function(value, offset, lcfunc, data, isOrdinal) {
    if ({}.hasOwnProperty.call(data, value)) return data[value]();
    if (offset) value -= offset;
    var key = lcfunc(value, isOrdinal);
    if (key in data) return data[key]();
    return data.other();
  },

  /** Utility function for `{N, select, ...}`
   *
   *  @param {number} value - The key to use to find a selection
   *  @param {Object.<string,string>} data - The object from which results are looked up
   *  @returns {string} The result of the select statement  */
  select: function(value, data) {
    if ({}.hasOwnProperty.call(data, value)) return data[value]();
    return data.other()
  },

  /** Pluralization functions included in compiled output
   *  @instance
   *  @type Object.<string,function>  */
  pluralFuncs: {},

  /** Custom formatting functions called by `{var, fn[, args]*}` syntax
   *
   *  For examples, see {@link MessageFormat.formatters}
   *
   *  @instance
   *  @see MessageFormat.formatters
   *  @type Object.<string,function>  */
  fmt: {},

  /** Custom stringifier to clean up browser inconsistencies
   *  @instance  */
  toString: function () {
    var _stringify = function(o, level) {
      if (typeof o != 'object') {
        var funcStr = o.toString().replace(/^(function )\w*/, '$1');
        var indent = /([ \t]*)\S.*$/.exec(funcStr);
        return indent ? funcStr.replace(new RegExp('^' + indent[1], 'mg'), '') : funcStr;
      }
      var s = [];
      for (var i in o) if (i != 'toString') {
        if (level == 0) s.push('var ' + i + ' = ' + _stringify(o[i], level + 1) + ';\n');
        else s.push(propname(i) + ': ' + _stringify(o[i], level + 1));
      }
      if (level == 0) return s.join('');
      if (s.length == 0) return '{}';
      var indent = '  '; while (--level) indent += '  ';
      return '{\n' + s.join(',\n').replace(/^/gm, indent) + '\n}';
    };
    return _stringify(this, 0);
  }
};


/** Recursively map an AST to its resulting string
 *
 *  @memberof MessageFormat
 *
 *  @param ast - the Ast node for which the JS code should be generated
 *
 *  @private  */
MessageFormat.prototype._precompile = function(ast, data) {
  data = data || { keys: {}, offset: {} };
  var r = [], i, tmp, args = [];

  switch ( ast.type ) {
    case 'messageFormatPattern':
      for ( i = 0; i < ast.statements.length; ++i ) {
        r.push(this._precompile( ast.statements[i], data ));
      }
      tmp = r.join(' + ') || '""';
      return data.pf_count ? tmp : 'function(d) { return ' + tmp + '; }';

    case 'messageFormatElement':
      data.pf_count = data.pf_count || 0;
      if ( ast.output ) {
        return propname(ast.argumentIndex, 'd');
      }
      else {
        data.keys[data.pf_count] = ast.argumentIndex;
        return this._precompile( ast.elementFormat, data );
      }
      return '';

    case 'elementFormat':
      args = [ propname(data.keys[data.pf_count], 'd') ];
      switch (ast.key) {
        case 'select':
          args.push(this._precompile(ast.val, data));
          return 'select(' + args.join(', ') + ')';
        case 'selectordinal':
          args = args.concat([ 0, propname(this.lc[0], 'pluralFuncs'), this._precompile(ast.val, data), 1 ]);
          return 'plural(' + args.join(', ') + ')';
        case 'plural':
          data.offset[data.pf_count || 0] = ast.val.offset || 0;
          args = args.concat([ data.offset[data.pf_count] || 0, propname(this.lc[0], 'pluralFuncs'), this._precompile(ast.val, data) ]);
          return 'plural(' + args.join(', ') + ')';
        default:
          if (this.withIntlSupport && !(ast.key in this.runtime.fmt) && (ast.key in MessageFormat.formatters)) {
            tmp = MessageFormat.formatters[ast.key];
            this.runtime.fmt[ast.key] = (typeof tmp(this) == 'function') ? tmp(this) : tmp;
          }
          args.push(JSON.stringify(this.lc));
          if (ast.val && ast.val.length) args.push(JSON.stringify(ast.val.length == 1 ? ast.val[0] : ast.val));
          return 'fmt.' + ast.key + '(' + args.join(', ') + ')';
      }

    case 'pluralFormatPattern':
    case 'selectFormatPattern':
      data.pf_count = data.pf_count || 0;
      if (ast.type == 'selectFormatPattern') data.offset[data.pf_count] = 0;
      var needOther = true;
      for (i = 0; i < ast.pluralForms.length; ++i) {
        var key = ast.pluralForms[i].key;
        if (key === 'other') needOther = false;
        var data_copy = JSON.parse(JSON.stringify(data));
        data_copy.pf_count++;
        r.push(propname(key) + ': function() { return ' + this._precompile(ast.pluralForms[i].val, data_copy) + ';}');
      }
      if (needOther) throw new Error("No 'other' form found in " + ast.type + " " + data.pf_count);
      return '{ ' + r.join(', ') + ' }';

    case 'string':
      return JSON.stringify(ast.val || "");

    case 'octothorpe':
      if (!data.pf_count) return '"#"';
      args = [ propname(data.keys[data.pf_count-1], 'd') ];
      if (data.offset[data.pf_count-1]) args.push(data.offset[data.pf_count-1]);
      return 'number(' + args.join(', ') + ')';

    default:
      throw new Error( 'Bad AST type: ' + ast.type );
  }
};

/** Compile messages into an executable function with clean string
 *  representation.
 *
 *  If `messages` is a single string including ICU MessageFormat declarations,
 *  `opt` is ignored and the returned function takes a single Object parameter
 *  `d` representing each of the input's defined variables. The returned
 *  function will be defined in a local scope that includes all the required
 *  runtime variables.
 *
 *  If `messages` is a map of keys to strings, or a map of namespace keys to
 *  such key/string maps, the returned function will fill the specified global
 *  with javascript functions matching the structure of the input. In such use,
 *  the output of `compile()` is expected to be serialized using `.toString()`,
 *  and will include definitions of the runtime functions. If `opt.global` is
 *  null, calling the output function will return the object itself.
 *
 *  Together, the input parameters should match the following patterns:
 *  ```js
 *  messages = "string" || { key0: "string0", key1: "string1", ... } || {
 *    ns0: { key0: "string0", key1: "string1", ...  },
 *    ns1: { key0: "string0", key1: "string1", ...  },
 *    ...
 *  }
 *
 *  opt = null || {
 *    locale: null || {
 *      ns0: "lc0" || [ "lc0", ... ],
 *      ns1: "lc1" || [ "lc1", ... ],
 *      ...
 *    },
 *    global: null || "module.exports" || "exports" || "i18n" || ...
 *  }
 *  ```
 *
 *  @memberof MessageFormat
 *  @param {string|Object}
 *      messages - The input message(s) to be compiled, in ICU MessageFormat
 *  @param {Object} [opt={}] - Options controlling output for non-simple intput
 *  @param {Object} [opt.locale] - The locales to use for the messages, with a
 *      structure matching that of `messages`
 *  @param {string} [opt.global=""] - The global variable that the output
 *      function should use, or a null string for none. "exports" and
 *      "module.exports" are recognised as special cases.
 *  @returns {function} The first match found for the given locale(s)
 *
 *  @example
 * > var MessageFormat = require('messageformat'),
 * ...   mf = new MessageFormat('en'),
 * ...   mfunc0 = mf.compile('A {TYPE} example.');
 * > mfunc0({TYPE:'simple'})
 * 'A simple example.'
 * > mfunc0.toString()
 * 'function (d) { return "A " + d.TYPE + " example."; }'
 *
 *  @example
 * > var msgSet = { a: 'A {TYPE} example.',
 * ...              b: 'This has {COUNT, plural, one{one member} other{# members}}.' },
 * ...   mfuncSet = mf.compile(msgSet);
 * > mfuncSet().a({TYPE:'more complex'})
 * 'A more complex example.'
 * > mfuncSet().b({COUNT:2})
 * 'This has 2 members.'
 *
 * > console.log(mfuncSet.toString())
 * function anonymous() {
 * var number = function (value, offset) {
 *   if (isNaN(value)) throw new Error("'" + value + "' isn't a number.");
 *   return value - (offset || 0);
 * };
 * var plural = function (value, offset, lcfunc, data, isOrdinal) {
 *   if ({}.hasOwnProperty.call(data, value)) return data[value]();
 *   if (offset) value -= offset;
 *   var key = lcfunc(value, isOrdinal);
 *   if (key in data) return data[key]();
 *   return data.other();
 * };
 * var select = function (value, data) {
 *   if ({}.hasOwnProperty.call(data, value)) return data[value]();
 *   return data.other()
 * };
 * var pluralFuncs = {
 *   en: function (n, ord) {
 *     var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
 *         n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
 *     if (ord) return (n10 == 1 && n100 != 11) ? 'one'
 *         : (n10 == 2 && n100 != 12) ? 'two'
 *         : (n10 == 3 && n100 != 13) ? 'few'
 *         : 'other';
 *     return (n == 1 && v0) ? 'one' : 'other';
 *   }
 * };
 * var fmt = {};
 *
 * return {
 *   a: function(d) { return "A " + d.TYPE + " example."; },
 *   b: function(d) { return "This has " + plural(d.COUNT, 0, pluralFuncs.en, { one: function() { return "one member";}, other: function() { return number(d.COUNT)+" members";} }) + "."; }
 * }
 * }
 *
 *  @example
 * > mf.runtime.pluralFuncs.fi = MessageFormat.plurals.fi;
 * > var multiSet = { en: { a: 'A {TYPE} example.',
 * ...                      b: 'This is the {COUNT, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} example.' },
 * ...                fi: { a: '{TYPE} esimerkki.',
 * ...                      b: 'Tämä on {COUNT, selectordinal, other{#.}} esimerkki.' } },
 * ...   multiSetLocales = { en: 'en', fi: 'fi' },
 * ...   mfuncSet = mf.compile(multiSet, { locale: multiSetLocales, global: 'i18n' });
 * > mfuncSet(this);
 * > i18n.en.b({COUNT:3})
 * 'This is the 3rd example.'
 * > i18n.fi.b({COUNT:3})
 * 'Tämä on 3. esimerkki.'  */
MessageFormat.prototype.compile = function ( messages, opt ) {
  var r = {}, lc0 = this.lc,
      compileMsg = function(self, msg) {
        try {
          var ast = MessageFormat._parse(msg);
          return self._precompile(ast);
        } catch (e) {
          throw new Error((ast ? 'Precompiler' : 'Parser') + ' error: ' + e.toString());
        }
      },
      stringify = function(r, level) {
        if (!level) level = 0;
        if (typeof r != 'object') return r;
        var o = [], indent = '';
        for (var i = 0; i < level; ++i) indent += '  ';
        for (var k in r) o.push('\n' + indent + '  ' + propname(k) + ': ' + stringify(r[k], level + 1));
        return '{' + o.join(',') + '\n' + indent + '}';
      };

  if (typeof messages == 'string') {
    var f = new Function(
        'number, plural, select, pluralFuncs, fmt',
        'return ' + compileMsg(this, messages));
    return f(this.runtime.number, this.runtime.plural, this.runtime.select,
        this.runtime.pluralFuncs, this.runtime.fmt);
  }

  opt = opt || {};

  for (var ns in messages) {
    if (opt.locale) this.lc = opt.locale[ns] && [].concat(opt.locale[ns]) || lc0;
    if (typeof messages[ns] == 'string') {
      try { r[ns] = compileMsg(this, messages[ns]); }
      catch (e) { e.message = e.message.replace(':', ' with `' + ns + '`:'); throw e; }
    } else {
      r[ns] = {};
      for (var key in messages[ns]) {
        try { r[ns][key] = compileMsg(this, messages[ns][key]); }
        catch (e) { e.message = e.message.replace(':', ' with `' + key + '` in `' + ns + '`:'); throw e; }
      }
    }
  }

  this.lc = lc0;
  var s = this.runtime.toString() + '\n';
  switch (opt.global || '') {
    case 'exports':
      var o = [];
      for (var k in r) o.push(propname(k, 'exports') + ' = ' + stringify(r[k]));
      return new Function(s + o.join(';\n'));
    case 'module.exports':
      return new Function(s + 'module.exports = ' + stringify(r));
    case '':
      return new Function(s + 'return ' + stringify(r));
    default:
      return new Function('G', s + propname(opt.global, 'G') + ' = ' + stringify(r));
  }
};


return MessageFormat;
}());
/* jshint ignore:end */


var createErrorPluralModulePresence = function() {
	return createError( "E_MISSING_PLURAL_MODULE", "Plural module not loaded." );
};




var validateMessageBundle = function( cldr ) {
	validate(
		"E_MISSING_MESSAGE_BUNDLE",
		"Missing message bundle for locale `{locale}`.",
		cldr.attributes.bundle && cldr.get( "globalize-messages/{bundle}" ) !== undefined,
		{
			locale: cldr.locale
		}
	);
};




var validateMessagePresence = function( path, value ) {
	path = path.join( "/" );
	validate( "E_MISSING_MESSAGE", "Missing required message content `{path}`.",
		value !== undefined, { path: path } );
};




var validateMessageType = function( path, value ) {
	path = path.join( "/" );
	validate(
		"E_INVALID_MESSAGE",
		"Invalid message content `{path}`. {expected} expected.",
		typeof value === "string",
		{
			expected: "a string",
			path: path
		}
	);
};




var validateParameterTypeMessageVariables = function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || isPlainObject( value ) || Array.isArray( value ),
		"Array or Plain Object"
	);
};




var messageFormatterFn = function( formatter ) {
	return function messageFormatter( variables ) {
		if ( typeof variables === "number" || typeof variables === "string" ) {
			variables = [].slice.call( arguments, 0 );
		}
		validateParameterTypeMessageVariables( variables, "variables" );
		return formatter( variables );
	};
};




var messageFormatterRuntimeBind = function( cldr, messageformatter ) {
	var locale = cldr.locale,
		origToString = messageformatter.toString;

	messageformatter.toString = function() {
		var argNames, argValues, output,
			args = {};

		// Properly adjust SlexAxton/messageformat.js compiled variables with Globalize variables:
		output = origToString.call( messageformatter );

		if ( /number\(/.test( output ) ) {
			args.number = "messageFormat.number";
		}

		if ( /plural\(/.test( output ) ) {
			args.plural = "messageFormat.plural";
		}

		if ( /select\(/.test( output ) ) {
			args.select = "messageFormat.select";
		}

		output.replace( /pluralFuncs(\[([^\]]+)\]|\.([a-zA-Z]+))/, function( match ) {
			args.pluralFuncs = "{" +
				"\"" + locale + "\": Globalize(\"" + locale + "\").pluralGenerator()" +
				"}";
			return match;
		});

		argNames = Object.keys( args ).join( ", " );
		argValues = Object.keys( args ).map(function( key ) {
			return args[ key ];
		}).join( ", " );

		return "(function( " + argNames + " ) {\n" +
			"  return " + output + "\n" +
			"})(" + argValues + ")";
	};

	return messageformatter;
};




var slice = [].slice;

/**
 * .loadMessages( json )
 *
 * @json [JSON]
 *
 * Load translation data.
 */
Globalize.loadMessages = function( json ) {
	var locale,
		customData = {
			"globalize-messages": json,
			"main": {}
		};

	validateParameterPresence( json, "json" );
	validateParameterTypePlainObject( json, "json" );

	// Set available bundles by populating customData main dataset.
	for ( locale in json ) {
		if ( json.hasOwnProperty( locale ) ) {
			customData.main[ locale ] = {};
		}
	}

	Cldr.load( customData );
};

/**
 * .messageFormatter( path )
 *
 * @path [String or Array]
 *
 * Format a message given its path.
 */
Globalize.messageFormatter =
Globalize.prototype.messageFormatter = function( path ) {
	var cldr, formatter, message, pluralGenerator, returnFn,
		args = slice.call( arguments, 0 );

	validateParameterPresence( path, "path" );
	validateParameterType( path, "path", typeof path === "string" || Array.isArray( path ),
		"a String nor an Array" );

	path = alwaysArray( path );
	cldr = this.cldr;

	validateDefaultLocale( cldr );
	validateMessageBundle( cldr );

	message = cldr.get( [ "globalize-messages/{bundle}" ].concat( path ) );
	validateMessagePresence( path, message );

	// If message is an Array, concatenate it.
	if ( Array.isArray( message ) ) {
		message = message.join( " " );
	}
	validateMessageType( path, message );

	// Is plural module present? Yes, use its generator. Nope, use an error generator.
	pluralGenerator = this.plural !== undefined ?
		this.pluralGenerator() :
		createErrorPluralModulePresence;

	formatter = new MessageFormat( cldr.locale, pluralGenerator ).compile( message );

	returnFn = messageFormatterFn( formatter );

	runtimeBind( args, cldr, returnFn,
		[ messageFormatterRuntimeBind( cldr, formatter ), pluralGenerator ] );

	return returnFn;
};

/**
 * .formatMessage( path [, variables] )
 *
 * @path [String or Array]
 *
 * @variables [Number, String, Array or Object]
 *
 * Format a message given its path.
 */
Globalize.formatMessage =
Globalize.prototype.formatMessage = function( path /* , variables */ ) {
	return this.messageFormatter( path ).apply( {}, slice.call( arguments, 1 ) );
};

return Globalize;




}));



/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./src/App.m.css":
/*!***********************!*\
  !*** ./src/App.m.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"i18n-issues/App","root":"App-m__root__d4ae14LaFAR","content":"App-m__content__d4ae14fDu6I"};

/***/ }),

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/middleware/theme */ "./node_modules/@dojo/framework/core/middleware/theme.mjs");
/* harmony import */ var _dojo_framework_routing_Outlet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dojo/framework/routing/Outlet */ "./node_modules/@dojo/framework/routing/Outlet.mjs");
/* harmony import */ var _dojo_themes_dojo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dojo/themes/dojo */ "./node_modules/@dojo/themes/dojo/index.js");
/* harmony import */ var _dojo_themes_dojo__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dojo_themes_dojo__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _widgets_header_Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./widgets/header/Header */ "./src/widgets/header/Header.tsx");
/* harmony import */ var _widgets_footer_Footer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./widgets/footer/Footer */ "./src/widgets/footer/Footer.tsx");
/* harmony import */ var _App_m_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./App.m.css */ "./src/App.m.css");
/* harmony import */ var _App_m_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_App_m_css__WEBPACK_IMPORTED_MODULE_6__);







var Loadable__ = { type: "registry" };
var __autoRegistryItems = { Home: () => __webpack_require__.e(/*! import() | src/widgets/home/Home */ "src/widgets/home/Home").then(__webpack_require__.bind(null, /*! ./widgets/home/Home */ "./src/widgets/home/Home.tsx")), About: () => __webpack_require__.e(/*! import() | src/widgets/About */ "src/widgets/About").then(__webpack_require__.bind(null, /*! ./widgets/About */ "./src/widgets/About.tsx")), Profile: () => __webpack_require__.e(/*! import() | src/widgets/Profile */ "src/widgets/Profile").then(__webpack_require__.bind(null, /*! ./widgets/Profile */ "./src/widgets/Profile.tsx")) };
const factory = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ theme: _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_1__["default"] });
/* harmony default export */ __webpack_exports__["default"] = (factory(function App({ middleware: { theme } }) {
    if (!theme.get()) {
        theme.set(_dojo_themes_dojo__WEBPACK_IMPORTED_MODULE_3___default.a);
    }
    return (Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: [_App_m_css__WEBPACK_IMPORTED_MODULE_6__["root"]] },
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_widgets_header_Header__WEBPACK_IMPORTED_MODULE_4__["default"], null),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", null,
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_dojo_framework_routing_Outlet__WEBPACK_IMPORTED_MODULE_2__["default"], { key: "home", id: "home", renderer: () => Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(Loadable__, { __autoRegistryItem: { label: "__autoRegistryItem_Home", registryItem: __autoRegistryItems.Home } }) }),
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_dojo_framework_routing_Outlet__WEBPACK_IMPORTED_MODULE_2__["default"], { key: "about", id: "about", renderer: () => Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(Loadable__, { __autoRegistryItem: { label: "__autoRegistryItem_About", registryItem: __autoRegistryItems.About } }) }),
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_dojo_framework_routing_Outlet__WEBPACK_IMPORTED_MODULE_2__["default"], { key: "profile", id: "profile", renderer: () => Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(Loadable__, { username: "Dojo User", __autoRegistryItem: { label: "__autoRegistryItem_Profile", registryItem: __autoRegistryItems.Profile } }) })),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_widgets_footer_Footer__WEBPACK_IMPORTED_MODULE_5__["default"], null)));
}));


/***/ }),

/***/ "./src/main.tsx":
/*!**********************!*\
  !*** ./src/main.tsx ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_Registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/Registry */ "./node_modules/@dojo/framework/core/Registry.mjs");
/* harmony import */ var _dojo_framework_routing_RouterInjector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dojo/framework/routing/RouterInjector */ "./node_modules/@dojo/framework/routing/RouterInjector.mjs");
/* harmony import */ var _dojo_themes_dojo_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dojo/themes/dojo/index.css */ "./node_modules/@dojo/themes/dojo/index.css");
/* harmony import */ var _dojo_themes_dojo_index_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dojo_themes_dojo_index_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routes */ "./src/routes.ts");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./App */ "./src/App.tsx");
__webpack_require__("./node_modules/@dojo/webpack-contrib/i18n-plugin/templates/setLocaleData.js");






const registry = new _dojo_framework_core_Registry__WEBPACK_IMPORTED_MODULE_1__["default"]();
Object(_dojo_framework_routing_RouterInjector__WEBPACK_IMPORTED_MODULE_2__["registerRouterInjector"])(_routes__WEBPACK_IMPORTED_MODULE_4__["default"], registry);
const r = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["default"])(() => Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_App__WEBPACK_IMPORTED_MODULE_5__["default"], null));
r.mount({ registry });


/***/ }),

/***/ "./src/nls/index.ts":
/*!**************************!*\
  !*** ./src/nls/index.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* conventions
Texts in '' MUST NOT exceed 150 characters
Texts in `` CAN be multiline or markdown
*/
const messages = {
    register: 'Register',
    login: 'Log In',
    enterIncident: 'Enter an incident',
    enterNeed: 'Enter request for help',
    enterOffer: 'Enter help offer',
    enterNeighbourhood: 'Enter a neigbourhood',
    counter: `{count, plural,
	=1 {item left}
	other {items left}}`,
    about: 'about',
    dashboards: 'dashboards',
    docs: 'docs',
    community: 'community',
    versions: 'versions',
    languages: 'languages',
    regionLabel: 'Region',
    region_de: 'Germany, Switzerland, AT, NL',
    region_it: 'Italy',
    region_fr: 'France, Belgium',
    region_es: 'Spain, Portugal',
    region_us_west: 'USA west',
    region_us: 'USA center',
    region_us_east: 'USA east',
    region_en: 'United Kingdom',
    region_cn: 'China east',
    region_pk: 'Pakistan, India',
    region_za: 'South Africa',
    region_dz: 'Algeria, Tunisia الجزائر تونس',
    region_ng: 'Nigeria, Cameroon',
    region_eg: 'Egypt مصر',
    region_ve: 'Venezuela',
    region_br: 'Brasil',
    region_mx: 'Mexico',
    seeLabel: 'Show',
    see_default: 'All',
    see_help: 'Help',
    see_needshelp: 'Demand for Help',
    see_incidents: 'Incidents',
    see_info: 'Official Information',
    toolOverview: 'Overview',
    blogpost: 'Blog post',
    codeOfConduct: 'Code of Conduct',
    heroTitle: `Crisis Response to COVID-19 :
Help, Solidarity, Information.`,
    heroContent1: `**Young people help high-risk groups through the COVID-19-time.**
An exceptional situation calls for exceptional measures.`,
    heroContent2: `The new type of corona virus has turned our society upside down.
**Now it is mobilizing our community.**`,
    heroButtonText: 'Open the app',
    helpTeaser: 'Finding help',
    helpTitle: 'I need help',
    helpText: `### Map and List
  [Look for your place on the map](https://redaktor.ushahidi.io/savedsearches/12/map).
  If you couldn't find any assistance in the map or [list](https://redaktor.ushahidi.io/savedsearches/12/data) :
  ## I need help
  **[Register](https://redaktor.ushahidi.io/register)** to be contacted without revealing your data.

  **[Tell people what you need.](https://redaktor.ushahidi.io/posts/create/2)**

  Scroll down for country-specific information.`,
    offerTeaser: 'Help',
    offerTitle: 'I can offer',
    offerText: `*Use this option if you do NOT belong to a risk group.*
  [Read the guide by the WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)
  [See the flyer of BZgA](https://www.infektionsschutz.de/fileadmin/infektionsschutz.de/Downloads/200326_BZgA_Atemwegsinfektion-Hygiene_schuetzt_A4_EN_RZ_Ansicht.pdf)

  [Look for a place to help on the map](https://redaktor.ushahidi.io/savedsearches/13/map)
  and search unsolved support.

  ### I can offer help:
  **[Tell people what you can give.](https://redaktor.ushahidi.io/posts/create/3)**

  **[Enter solidary neighbourhoods and local initiatives.](https://redaktor.ushahidi.io/posts/create/6)**
  `,
    infoTeaser: 'Inform',
    infoTitle: 'Info',
    infoText: `Research [**informations and experts**](https://redaktor.ushahidi.io/savedsearches/35/data) in the list.
  Find [restrictions](https://redaktor.ushahidi.io/savedsearches/22/map) and [incidents](https://redaktor.ushahidi.io/savedsearches/14/map) on the map.
  `,
    /* <p>questions? <span class="nospace_m">suggestion redaktor.me</span></p> */
    countryDefault: 'US',
    countryTitle: 'Country specific infos',
    country1: 'USA United States',
    country1Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)
**Official US Links** [are here](https://redaktor.ushahidi.io/posts/5059)

For a network overview visit the site [COVID-19 Mutual Aid](https://itsgoingdown.org/c19-mutual-aid/).
We are desperately looking for more neighbourhood networks in South- and Northamerica.`,
    country2: 'UK United Kingdom',
    country2Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)
**Official UK Links** [are here](https://redaktor.ushahidi.io/posts/5066)

For a network overview visit the site [COVID-19 Mutual Aid](https://covidmutualaid.org)
`,
    country3: 'Spain',
    country3Text: `[See also](https://redaktor.ushahidi.io/posts/1317)
**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)

Visit [the neighbourhood App of Frena la curva Maps](https://es.mapa.frenalacurva.net/views/map).

[Apps](https://frenalacurva.net)`,
    country4: 'Italy',
    country4Text: `[See also](https://redaktor.ushahidi.io/posts/1315)

Visit [the neighbourhood App of ANPAS](https://anpas.ushahidi.io/views/map)
or call **+39 055303821** or inform at [Ministero della Salute](http://www.salute.gov.it/nuovocoronavirus).
The public utility phone number **1500** of the Ministry of Health is also active.
`,
    country5: 'India',
    country5Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313).
  **Official India Info** [are here](https://www.mohfw.gov.in) --- [cache](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=2ahUKEwjB3vKkg8LoAhX-QEEAHfMxCV4Qi-8BKAEwAXoECGYQAg&url=https%3A%2F%2Fwebcache.googleusercontent.com%2Fsearch%3Fq%3Dcache%3AQ7S18eyhhpgJ%3Ahttps%3A%2F%2Fwww.mohfw.gov.in%2F&usg=AOvVaw1Sb1EVUgbJejU4Y5_2-uY0)
  [Situation Reports](https://www.who.int/india/emergencies/india-situation-report)`,
    moreCountries: `Find more countries by changing the language or [here](https://redaktor.ushahidi.io/savedsearches/36/data).`,
    infoTextMain1: `### COVID-19
COVID-19 is the infectious disease caused by the most recently discovered coronavirus. This new virus and disease were unknown before the outbreak began in Dec. 2019.
The most common symptoms of COVID-19 are fever, tiredness, and dry cough.
[Q&A](https://www.who.int/news-room/q-a-detail/q-a-coronaviruses)
`,
    infoTextMain2: `### Spreading
People can catch COVID-19 from others who have the virus. The disease can spread from person to person through small droplets from the nose or mouth which are spread when a person with COVID-19 coughs or exhales.

This is why it is important to wash hands and stay more than 1 meter (3 feet) away from people.`,
    infoTextMain3: `### Contributions
Let us tinker **a map of solidarity and creativity** together

We are now looking for
- Suggestions
- Moderators
- Translators
`
};
const locales = {
    en: () => messages,
    de: () => __webpack_require__.e(/*! import() | src/nls/de/index */ "src/nls/de/index").then(__webpack_require__.bind(null, /*! ./de/ */ "./src/nls/de/index.ts")),
    es: () => __webpack_require__.e(/*! import() | src/nls/es/index */ "src/nls/es/index").then(__webpack_require__.bind(null, /*! ./es/ */ "./src/nls/es/index.ts")),
    fr: () => __webpack_require__.e(/*! import() | src/nls/fr/index */ "src/nls/fr/index").then(__webpack_require__.bind(null, /*! ./fr/ */ "./src/nls/fr/index.ts"))
};
/* harmony default export */ __webpack_exports__["default"] = ({ messages, locales });


/***/ }),

/***/ "./src/routes.ts":
/*!***********************!*\
  !*** ./src/routes.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([
    {
        path: 'home',
        outlet: 'home',
        defaultRoute: true
    },
    {
        path: 'about',
        outlet: 'about'
    },
    {
        path: 'profile',
        outlet: 'profile'
    }
]);


/***/ }),

/***/ "./src/widgets/assets/external-link.svg":
/*!**********************************************!*\
  !*** ./src/widgets/assets/external-link.svg ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "external-link.3kZKpMEU.svg";

/***/ }),

/***/ "./src/widgets/assets/logo.svg":
/*!*************************************!*\
  !*** ./src/widgets/assets/logo.svg ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo.68GgKC6m.svg";

/***/ }),

/***/ "./src/widgets/assets/redaktorlogo.svg":
/*!*********************************************!*\
  !*** ./src/widgets/assets/redaktorlogo.svg ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "redaktorlogo.3WALTSm0.svg";

/***/ }),

/***/ "./src/widgets/footer/Footer.m.css":
/*!*****************************************!*\
  !*** ./src/widgets/footer/Footer.m.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"i18n-issues/Footer","root":"Footer-m__root__d4ae141zPMX","logo":"Footer-m__logo__d4ae142kD38","title":"Footer-m__title__d4ae143Gc_e","contentRow":"Footer-m__contentRow__d4ae141x_4x","linksRow":"Footer-m__linksRow__d4ae14hb-nE","content":"Footer-m__content__d4ae14vRa5M","links":"Footer-m__links__d4ae14opHrD","copyright":"Footer-m__copyright__d4ae143xzJw","linksWrapper":"Footer-m__linksWrapper__d4ae14ESv3t","linksLast":"Footer-m__linksLast__d4ae141PR0d","link":"Footer-m__link__d4ae143-JoA","inactive":"Footer-m__inactive__d4ae14cHv6C","externalLink":"Footer-m__externalLink__d4ae1437B7s","wrapper":"Footer-m__wrapper__d4ae14Xxres"};

/***/ }),

/***/ "./src/widgets/footer/Footer.tsx":
/*!***************************************!*\
  !*** ./src/widgets/footer/Footer.tsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_middleware_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/middleware/i18n */ "./node_modules/@dojo/framework/core/middleware/i18n.mjs");
/* harmony import */ var _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dojo/framework/core/middleware/theme */ "./node_modules/@dojo/framework/core/middleware/theme.mjs");
/* harmony import */ var _dojo_framework_routing_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dojo/framework/routing/Link */ "./node_modules/@dojo/framework/routing/Link.mjs");
/* harmony import */ var _nls___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../nls/ */ "./src/nls/index.ts");
/* harmony import */ var _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Footer.m.css */ "./src/widgets/footer/Footer.m.css");
/* harmony import */ var _Footer_m_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Footer_m_css__WEBPACK_IMPORTED_MODULE_5__);






const rLogo = __webpack_require__(/*! ../assets/redaktorlogo.svg */ "./src/widgets/assets/redaktorlogo.svg");
const externalLink = __webpack_require__(/*! ../assets/external-link.svg */ "./src/widgets/assets/external-link.svg");
const factory = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ theme: _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_2__["default"], i18n: _dojo_framework_core_middleware_i18n__WEBPACK_IMPORTED_MODULE_1__["default"] });
/* harmony default export */ __webpack_exports__["default"] = (factory(function Footer({ middleware: { theme, i18n } }) {
    const { messages } = i18n.localize(_nls___WEBPACK_IMPORTED_MODULE_4__["default"]);
    const themedCss = theme.classes(_Footer_m_css__WEBPACK_IMPORTED_MODULE_5__);
    const lang = (locale) => (e) => { e.preventDefault(); i18n.set({ locale }); };
    return (Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("footer", { classes: themedCss.root },
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.wrapper },
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.content },
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.contentRow },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.copyright },
                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: [themedCss.logo], alt: "logo", src: rLogo }),
                        `© ${new Date().getFullYear()} redaktor & contributors`),
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.linksWrapper },
                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.linksRow },
                            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.links },
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.title }, messages.docs),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.ushahidi.com/features", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    messages.toolOverview,
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://redaktor.ushahidi.io/posts/5005", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    messages.blogpost,
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://redaktor.me", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    "Home",
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink }))),
                            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.links },
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.title }, messages.community),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.contributor-covenant.org/version/1/4/code-of-conduct/", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    messages.codeOfConduct,
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://github.com/redaktor/", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    "GitHub",
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://socialhub.activitypub.rocks/c/software/redaktor-me/22", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    "Discourse",
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://chaos.social/web/accounts/235880", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { class: 'color-ap' },
                                        "ActivityPub",
                                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("br", null),
                                        "@sl007@mastodon.social @redaktor@chaos.social",
                                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink }))),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://twitter.com/sl007", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { class: 'color-twitter' },
                                        "Twitter",
                                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("br", null),
                                        " sl007@twitter.com",
                                        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink }))),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_dojo_framework_routing_Link__WEBPACK_IMPORTED_MODULE_3__["default"], { to: "examples", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] }, "Discord: contact us")),
                            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: [themedCss.links, themedCss.linksLast] },
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.title }, messages.versions),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { target: "_blank", rel: "noopener noreferrer", href: "https://github.com/redaktor/COVID19", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"] },
                                    "v0.9",
                                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: themedCss.externalLink, alt: "externalLink", src: externalLink })),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.title }, messages.languages),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"], onclick: lang('en') }, "English"),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"], onclick: lang('fr') }, "Francais"),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: [_Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"], _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["inactive"]], onclick: lang('es') }, "Espa\u00F1ol"),
                                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: _Footer_m_css__WEBPACK_IMPORTED_MODULE_5__["link"], onclick: lang('en') }, "Deutsch")))))))));
}));


/***/ }),

/***/ "./src/widgets/header/Header.m.css":
/*!*****************************************!*\
  !*** ./src/widgets/header/Header.m.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"i18n-issues/Header","root":"Header-m__root__d4ae1415XcQ","menu":"Header-m__menu__d4ae141Ab96","menuList":"Header-m__menuList__d4ae143LK4c","menuItem":"Header-m__menuItem__d4ae142eo10","menuLink":"Header-m__menuLink__d4ae143bjO0","inactive":"Header-m__inactive__d4ae1410t-E","left":"Header-m__left__d4ae142fuD9","link":"Header-m__link__d4ae142GEKH","lang":"Header-m__lang__d4ae142aLi8","selected":"Header-m__selected__d4ae1412TDn","homeLink":"Header-m__homeLink__d4ae14264Lm","logo":"Header-m__logo__d4ae142RWjx","leftContainer":"Header-m__leftContainer__d4ae141rx9H","centerContainer":"Header-m__centerContainer__d4ae143uf21","toggleButton":"Header-m__toggleButton__d4ae143oOQY","toggleBar":"Header-m__toggleBar__d4ae143VP_B","srOnly":"Header-m__srOnly__d4ae14EObom","rightContainer":"Header-m__rightContainer__d4ae142tNsP","mainMenuToggle":"Header-m__mainMenuToggle__d4ae141qxl5","playgroundMenuItem":"Header-m__playgroundMenuItem__d4ae141JBwS","iconLink":"Header-m__iconLink__d4ae1427FN_"};

/***/ }),

/***/ "./src/widgets/header/Header.tsx":
/*!***************************************!*\
  !*** ./src/widgets/header/Header.tsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_middleware_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/middleware/i18n */ "./node_modules/@dojo/framework/core/middleware/i18n.mjs");
/* harmony import */ var _dojo_framework_i18n_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dojo/framework/i18n/i18n */ "./node_modules/@dojo/framework/i18n/i18n.mjs");
/* harmony import */ var _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dojo/framework/core/middleware/theme */ "./node_modules/@dojo/framework/core/middleware/theme.mjs");
/* harmony import */ var _dojo_framework_core_middleware_icache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dojo/framework/core/middleware/icache */ "./node_modules/@dojo/framework/core/middleware/icache.mjs");
/* harmony import */ var _link_ActiveLink__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../link/ActiveLink */ "./src/widgets/link/ActiveLink.tsx");
/* harmony import */ var _Header_m_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Header.m.css */ "./src/widgets/header/Header.m.css");
/* harmony import */ var _Header_m_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Header_m_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _nls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../nls */ "./src/nls/index.ts");






const logo = __webpack_require__(/*! ../assets/logo.svg */ "./src/widgets/assets/logo.svg");


const factory = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ theme: _dojo_framework_core_middleware_theme__WEBPACK_IMPORTED_MODULE_3__["default"], icache: _dojo_framework_core_middleware_icache__WEBPACK_IMPORTED_MODULE_4__["default"], i18n: _dojo_framework_core_middleware_i18n__WEBPACK_IMPORTED_MODULE_1__["default"] });
/* harmony default export */ __webpack_exports__["default"] = (factory(function Header({ middleware: { theme, icache, i18n } }) {
    const { messages } = i18n.localize(_nls__WEBPACK_IMPORTED_MODULE_7__["default"]);
    const themedCss = theme.classes(_Header_m_css__WEBPACK_IMPORTED_MODULE_6__);
    const open = icache.get('open') || false;
    const lang = (locale) => (e) => {
        e.preventDefault();
        i18n.set({ locale });
    };
    const langClass = (lang) => {
        const { locale = _dojo_framework_i18n_i18n__WEBPACK_IMPORTED_MODULE_2__["systemLocale"] } = i18n.get() || { locale: _dojo_framework_i18n_i18n__WEBPACK_IMPORTED_MODULE_2__["systemLocale"] };
        return locale.indexOf(lang) === 0 ? themedCss.selected : '';
    };
    return (Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("header", { key: "root", classes: themedCss.root },
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("input", { id: "mainMenuToggle", onclick: () => {
                icache.set('open', true);
            }, classes: themedCss.mainMenuToggle, type: "checkbox", checked: open }),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: [themedCss.left] },
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { classes: themedCss.leftContainer },
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("label", { for: "mainMenuToggle", key: "toggleButton", classes: themedCss.toggleButton },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { classes: themedCss.srOnly }, "Menu"),
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", { classes: themedCss.toggleBar }))),
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { classes: [themedCss.centerContainer] },
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])(_link_ActiveLink__WEBPACK_IMPORTED_MODULE_5__["default"], { key: "homeLink", to: "home", onClick: () => {
                        icache.set('open', false);
                    }, classes: [themedCss.homeLink], matchParams: {}, activeClasses: [themedCss.selected] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("img", { classes: [themedCss.logo], alt: "redaktor logo", src: logo }))),
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("span", { classes: [themedCss.rightContainer] })),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("nav", { role: "navigation", classes: [themedCss.menu], "aria-label": "Main Menu" },
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("ul", { classes: themedCss.menuList },
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("li", { classes: [themedCss.menuItem] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: [_Header_m_css__WEBPACK_IMPORTED_MODULE_6__["link"], _Header_m_css__WEBPACK_IMPORTED_MODULE_6__["lang"], langClass('en')], onclick: lang('en') }, "English")),
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("li", { classes: [themedCss.menuItem] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: [_Header_m_css__WEBPACK_IMPORTED_MODULE_6__["link"], _Header_m_css__WEBPACK_IMPORTED_MODULE_6__["lang"], langClass('fr')], onclick: lang('fr') }, "Fran\u00E7ais")),
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("li", { classes: [themedCss.menuItem] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "#", classes: [_Header_m_css__WEBPACK_IMPORTED_MODULE_6__["link"], _Header_m_css__WEBPACK_IMPORTED_MODULE_6__["lang"], langClass('de')], onclick: lang('de') }, "Deutsch")),
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("li", { classes: [themedCss.menuItem] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { classes: _Header_m_css__WEBPACK_IMPORTED_MODULE_6__["link"], rel: "noopener noreferrer", target: "_blank", href: "https://redaktor.ushahidi.io/posts/5005" }, messages.about)),
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("li", { classes: [themedCss.menuItem] },
                    Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { classes: _Header_m_css__WEBPACK_IMPORTED_MODULE_6__["link"], rel: "noopener noreferrer", target: "_blank", href: "https://redaktor.ushahidi.io/posts/5080" }, messages.dashboards)))),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("a", { href: "https://github.com/redaktor/COVID19", target: "_blank", rel: "noopener noreferrer", "aria-label": "Github", classes: themedCss.iconLink },
            Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("svg", { style: "fill: white;", height: "28px", viewBox: "0 0 16 16", version: "1.1", width: "28", "aria-hidden": "true" },
                Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("path", { "fill-rule": "evenodd", d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" })))));
}));


/***/ }),

/***/ "./src/widgets/link/ActiveLink.tsx":
/*!*****************************************!*\
  !*** ./src/widgets/link/ActiveLink.tsx ***!
  \*****************************************/
/*! exports provided: ActiveLink, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActiveLink", function() { return ActiveLink; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_middleware_injector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dojo/framework/core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.mjs");
/* harmony import */ var _dojo_framework_core_middleware_icache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dojo/framework/core/middleware/icache */ "./node_modules/@dojo/framework/core/middleware/icache.mjs");
/* harmony import */ var _dojo_framework_routing_Link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dojo/framework/routing/Link */ "./node_modules/@dojo/framework/routing/Link.mjs");





function paramsEqual(linkParams = {}, contextParams) {
    return Object.keys(linkParams).every((key) => linkParams[key] === contextParams[key]);
}
const factory = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_1__["create"])({ injector: _dojo_framework_core_middleware_injector__WEBPACK_IMPORTED_MODULE_2__["default"], diffProperty: _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_1__["diffProperty"], icache: _dojo_framework_core_middleware_icache__WEBPACK_IMPORTED_MODULE_3__["default"], invalidator: _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_1__["invalidator"] }).properties();
const ActiveLink = factory(function ActiveLink({ middleware: { diffProperty, injector, icache, invalidator }, properties, children }) {
    const { to, routerKey = 'router', params, matchParams = params } = properties();
    let _a = properties(), { activeClasses, classes = [] } = _a, props = tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"](_a, ["activeClasses", "classes"]);
    diffProperty('to', (current, next) => {
        if (current.to !== next.to) {
            const router = injector.get(routerKey);
            const currentHandle = icache.get('handle');
            if (currentHandle) {
                currentHandle.destroy();
            }
            if (router) {
                const handle = router.on('outlet', ({ outlet }) => {
                    if (outlet.id === to) {
                        invalidator();
                    }
                });
                icache.set('handle', handle);
            }
            invalidator();
        }
    });
    const router = injector.get(routerKey);
    if (router) {
        if (!icache.get('handle')) {
            const handle = router.on('outlet', ({ outlet }) => {
                if (outlet.id === to) {
                    invalidator();
                }
            });
            icache.set('handle', handle);
        }
        const context = router.getOutlet(to);
        const isActive = context && paramsEqual(matchParams, context.params);
        classes = Array.isArray(classes) ? classes : [classes];
        if (isActive) {
            classes = [...classes, ...activeClasses];
        }
        props = Object.assign({}, props, { classes });
    }
    return Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_1__["w"])(_dojo_framework_routing_Link__WEBPACK_IMPORTED_MODULE_4__["default"], props, children());
});
/* harmony default export */ __webpack_exports__["default"] = (ActiveLink);


/***/ })

}]);
//# sourceMappingURL=main.js.map