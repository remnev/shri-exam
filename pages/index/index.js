/**
 * Inheritance plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.3.3
 */

(function($) {

var hasIntrospection = (function(){_}).toString().indexOf('_') > -1,
    needCheckProps = $.browser.msie, // fucking ie hasn't toString, valueOf in for
    specProps = needCheckProps? ['toString', 'valueOf'] : null,
    emptyBase = function() {};

function override(base, result, add) {

    var hasSpecProps = false;
    if(needCheckProps) {
        var addList = [];
        $.each(specProps, function() {
            add.hasOwnProperty(this) && (hasSpecProps = true) && addList.push({
                name : this,
                val  : add[this]
            });
        });
        if(hasSpecProps) {
            $.each(add, function(name) {
                addList.push({
                    name : name,
                    val  : this
                });
            });
            add = addList;
        }
    }

    $.each(add, function(name, prop) {
        if(hasSpecProps) {
            name = prop.name;
            prop = prop.val;
        }
        if($.isFunction(prop) &&
           (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {

            var baseMethod = base[name] || function() {};
            result[name] = function() {
                var baseSaved = this.__base;
                this.__base = baseMethod;
                var result = prop.apply(this, arguments);
                this.__base = baseSaved;
                return result;
            };

        }
        else {
            result[name] = prop;
        }

    });

}

$.inherit = function() {

    var args = arguments,
        hasBase = $.isFunction(args[0]),
        base = hasBase? args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        result = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } : function() {};

    if(!hasBase) {
        result.prototype = props;
        result.prototype.__self = result.prototype.constructor = result;
        return $.extend(result, staticProps);
    }

    $.extend(result, base);

    var inheritance = function() {},
        basePtp = inheritance.prototype = base.prototype,
        resultPtp = result.prototype = new inheritance();

    resultPtp.__self = resultPtp.constructor = result;

    override(basePtp, resultPtp, props);
    staticProps && override(base, result, staticProps);

    return result;

};

$.inheritSelf = function(base, props, staticProps) {

    var basePtp = base.prototype;

    override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;

};

})(jQuery);;
/**
 * Identify plugin
 *
 * @version 1.0.0
 */

(function($) {

var counter = 0,
    expando = '__' + (+new Date),
    get = function() {
        return 'uniq' + ++counter;
    };

/**
 * Makes unique ID
 * @param {Object} [obj] Object that needs to be identified
 * @param {Boolean} [onlyGet=false] Return a unique value only if it had already been assigned before
 * @returns {String} ID
 */
$.identify = function(obj, onlyGet) {

    if(!obj) return get();

    var key = 'uniqueID' in obj? 'uniqueID' : expando; // Use when possible. native uniqueID for elements in IE

    return onlyGet || key in obj?
        obj[key] :
        obj[key] = get();

};

})(jQuery);;
(function($) {

$.isEmptyObject || ($.isEmptyObject = function(obj) {
        for(var i in obj) return false;
        return true;
    });

})(jQuery);
;
/**
 * Debounce and throttle function's decorator plugin 1.0.6
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

    debounce : function(fn, timeout, invokeAsap, ctx) {

        if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;

        return function() {

            var args = arguments;
            ctx = ctx || this;

            invokeAsap && !timer && fn.apply(ctx, args);

            clearTimeout(timer);

            timer = setTimeout(function() {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);

        };

    },

    throttle : function(fn, timeout, ctx) {

        var timer, args, needInvoke;

        return function() {

            args = arguments;
            needInvoke = true;
            ctx = ctx || this;

            timer || (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();

        };

    }

});

})(jQuery);;
/**
 * Observable plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 * @requires $.identify
 * @requires $.inherit
 */

(function($) {

var storageExpando = '__' + +new Date + 'storage',
    getFnId = function(fn, ctx) {
        return $.identify(fn) + (ctx? $.identify(ctx) : '');
    },
    Observable = /** @lends $.observable.prototype */{

        /**
         * Builds full event name
         * @protected
         * @param {String} e Event type
         * @returns {String}
         */
        buildEventName : function(e) {

            return e;

        },

        /**
         * Adding event handler
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        on : function(e, data, fn, ctx, _special) {

            if(typeof e == 'string') {
                if($.isFunction(data)) {
                    ctx = fn;
                    fn = data;
                    data = undefined;
                }

                var id = getFnId(fn, ctx),
                    storage = this[storageExpando] || (this[storageExpando] = {}),
                    eList = e.split(' '),
                    i = 0,
                    eStorage;

                while(e = eList[i++]) {
                    e = this.buildEventName(e);
                    eStorage = storage[e] || (storage[e] = { ids : {}, list : {} });

                    if(!(id in eStorage.ids)) {
                        var list = eStorage.list,
                            item = { fn : fn, data : data, ctx : ctx, special : _special };
                        if(list.last) {
                            list.last.next = item;
                            item.prev = list.last;
                        } else {
                            list.first = item;
                        }

                        eStorage.ids[id] = list.last = item;
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.on(e, fn, data, _special);
                });
            }

            return this;

        },

        onFirst : function(e, data, fn, ctx) {

            return this.on(e, data, fn, ctx, { one : true });

        },

        /**
         * Removing event handler(s)
         * @param {String} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        un : function(e, fn, ctx) {

            if(typeof e == 'string' || typeof e == 'undefined') {
                var storage = this[storageExpando];
                if(storage) {
                    if(e) { // if event type was passed
                        var eList = e.split(' '),
                            i = 0,
                            eStorage;
                        while(e = eList[i++]) {
                            e = this.buildEventName(e);
                            if(eStorage = storage[e]) {
                                if(fn) {  // if specific handler was passed
                                    var id = getFnId(fn, ctx),
                                        ids = eStorage.ids;
                                    if(id in ids) {
                                        var list = eStorage.list,
                                            item = ids[id],
                                            prev = item.prev,
                                            next = item.next;

                                        if(prev) {
                                            prev.next = next;
                                        }
                                        else if(item === list.first) {
                                            list.first = next;
                                        }

                                        if(next) {
                                            next.prev = prev;
                                        }
                                        else if(item === list.last) {
                                            list.last = prev;
                                        }

                                        delete ids[id];
                                    }
                                } else {
                                    delete this[storageExpando][e];
                                }
                            }
                        }
                    } else {
                        delete this[storageExpando];
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.un(e, fn, ctx);
                });
            }

            return this;

        },

        /**
         * Fires event handlers
         * @param {String|$.Event} e Event
         * @param {Object} [data] Additional data
         * @returns {$.observable}
         */
        trigger : function(e, data) {

            var _this = this,
                storage = _this[storageExpando],
                rawType;

            typeof e === 'string'?
                e = $.Event(_this.buildEventName(rawType = e)) :
                e.type = _this.buildEventName(rawType = e.type);

            e.target || (e.target = _this);

            if(storage && (storage = storage[e.type])) {
                var item = storage.list.first,
                    ret;
                while(item) {
                    e.data = item.data;
                    ret = item.fn.call(item.ctx || _this, e, data);
                    if(typeof ret !== 'undefined') {
                        e.result = ret;
                        if(ret === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }

                    item.special && item.special.one &&
                        _this.un(rawType, item.fn, item.ctx);
                    item = item.next;
                }
            }

            return this;

        }

    };

$.observable = $.inherit(Observable, Observable);

})(jQuery);;
/** @requires jquery.inherit */
/** @requires jquery.isEmptyObject */
/** @requires jquery.identify */
/** @requires jquery.observable */

(function($, undefined) {

/**
 * Storage for deferred functions
 * @private
 * @type Array
 */
var afterCurrentEventFns = [],

/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
    blocks = {},

/**
 * Communication channels
 * @static
 * @private
 * @type Object
 */
    channels = {};

/**
 * Builds the name of the handler method for setting a modifier
 * @static
 * @private
 * @param {String} elemName Element name
 * @param {String} modName Modifier name
 * @param {String} modVal Modifier value
 * @returns {String}
 */
function buildModFnName(elemName, modName, modVal) {

    return (elemName? '__elem_' + elemName : '') +
           '__mod' +
           (modName? '_' + modName : '') +
           (modVal? '_' + modVal : '');

}

/**
 * Transforms a hash of modifier handlers to methods
 * @static
 * @private
 * @param {Object} modFns
 * @param {Object} props
 * @param {String} [elemName]
 */
function modFnsToProps(modFns, props, elemName) {

    $.isFunction(modFns)?
        (props[buildModFnName(elemName, '*', '*')] = modFns) :
        $.each(modFns, function(modName, modFn) {
            $.isFunction(modFn)?
                (props[buildModFnName(elemName, modName, '*')] = modFn) :
                $.each(modFn, function(modVal, modFn) {
                    props[buildModFnName(elemName, modName, modVal)] = modFn;
                });
        });

}

function buildCheckMod(modName, modVal) {

    return modVal?
        Array.isArray(modVal)?
            function(block) {
                var i = 0, len = modVal.length;
                while(i < len)
                    if(block.hasMod(modName, modVal[i++]))
                        return true;
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };

}

/** @namespace */
this.BEM = $.inherit($.observable, /** @lends BEM.prototype */ {

    /**
     * @class Base block for creating BEM blocks
     * @constructs
     * @private
     * @param {Object} mods Block modifiers
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(mods, params, initImmediately) {

        var _this = this;

        /**
         * Cache of block modifiers
         * @private
         * @type Object
         */
        _this._modCache = mods || {};

        /**
         * Current modifiers in the stack
         * @private
         * @type Object
         */
        _this._processingMods = {};

        /**
         * The block's parameters, taking into account the defaults
         * @protected
         * @type Object
         */
        _this._params = params; // это нужно для правильной сборки параметров у блока из нескольких нод
        _this.params = null;

        initImmediately !== false?
            _this._init() :
            _this.afterCurrentEvent(function() {
                _this._init();
            });

    },

    /**
     * Initializes the block
     * @private
     */
    _init : function() {

        if(!this._initing && !this.hasMod('js', 'inited')) {
            this._initing = true;

            this.params = $.extend(this.getDefaultParams(), this._params);
            delete this._params;

            this.setMod('js', 'inited');
            delete this._initing;
            this.trigger('init');
        }

        return this;

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx=this] Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Executes the function in the context of the block, after the "current event"
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx] Context
     */
    afterCurrentEvent : function(fn, ctx) {

        this.__self.afterCurrentEvent(this.changeThis(fn, ctx));

    },

    /**
     * Executes the block's event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .__self.trigger(e, data);

        return this;

    },

    buildEvent : function(e) {

        typeof e == 'string' && (e = $.Event(e));
        e.block = this;

        return e;

    },

    /**
     * Checks whether a block or nested element has a modifier
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {Boolean}
     */
    hasMod : function(elem, modName, modVal) {

        var len = arguments.length,
            invert = false;

        if(len == 1) {
            modVal = '';
            modName = elem;
            elem = undefined;
            invert = true;
        }
        else if(len == 2) {
            if(typeof elem == 'string') {
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
            else {
                modVal = '';
                invert = true;
            }
        }

        var res = this.getMod(elem, modName) === modVal;
        return invert? !res : res;

    },

    /**
     * Returns the value of the modifier of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {

        var type = typeof elem;
        if(type === 'string' || type === 'undefined') { // elem either omitted or undefined
            modName = elem || modName;
            var modCache = this._modCache;
            return modName in modCache?
                modCache[modName] :
                modCache[modName] = this._extractModVal(modName);
        }

        return this._getElemMod(modName, elem);

    },

    /**
     * Returns the value of the modifier of the nested element
     * @private
     * @param {String} modName Modifier name
     * @param {Object} elem Nested element
     * @param {Object} [elem] Nested element name
     * @returns {String} Modifier value
     */
    _getElemMod : function(modName, elem, elemName) {

        return this._extractModVal(modName, elem, elemName);

    },

    /**
     * Returns values of modifiers of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} [modName1, ..., modNameN] Modifier names
     * @returns {Object} Hash of modifier values
     */
    getMods : function(elem) {

        var hasElem = elem && typeof elem != 'string',
            _this = this,
            modNames = [].slice.call(arguments, hasElem? 1 : 0),
            res = _this._extractMods(modNames, hasElem? elem : undefined);

        if(!hasElem) { // caching
            modNames.length?
                modNames.forEach(function(name) {
                    _this._modCache[name] = res[name];
                }):
                _this._modCache = res;
        }

        return res;

    },

    /**
     * Sets the modifier for a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(typeof modVal == 'undefined') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        }

        var _this = this;

        if(!elem || elem[0]) {

            var modId = (elem && elem[0]? $.identify(elem[0]) : '') + '_' + modName;

            if(this._processingMods[modId]) return _this;

            var elemName,
                curModVal = elem?
                    _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
                    _this.getMod(modName);

            if(curModVal === modVal) return _this;

            this._processingMods[modId] = true;

            var needSetMod = true,
                modFnParams = [modName, modVal, curModVal];

            elem && modFnParams.unshift(elem);

            [['*', '*'], [modName, '*'], [modName, modVal]].forEach(function(mod) {
                needSetMod = _this._callModFn(elemName, mod[0], mod[1], modFnParams) !== false && needSetMod;
            });

            !elem && needSetMod && (_this._modCache[modName] = modVal);

            needSetMod && _this._afterSetMod(modName, modVal, curModVal, elem, elemName);

            delete this._processingMods[modId];
        }

        return _this;

    },

    /**
     * Function after successfully changing the modifier of the block/nested element
     * @protected
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {Object} [elem] Nested element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {},

    /**
     * Sets a modifier for a block/nested element, depending on conditions.
     * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
     * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal1 First modifier value
     * @param {String} [modVal2] Second modifier value
     * @param {Boolean} [condition] Condition
     * @returns {BEM}
     */
    toggleMod : function(elem, modName, modVal1, modVal2, condition) {

        if(typeof elem == 'string') { // if this is a block
            condition = modVal2;
            modVal2 = modVal1;
            modVal1 = modName;
            modName = elem;
            elem = undefined;
        }
        if(typeof modVal2 == 'undefined') {
            modVal2 = '';
        } else if(typeof modVal2 == 'boolean') {
            condition = modVal2;
            modVal2 = '';
        }

        var modVal = this.getMod(elem, modName);
        (modVal == modVal1 || modVal == modVal2) &&
            this.setMod(
                elem,
                modName,
                typeof condition === 'boolean'?
                    (condition? modVal1 : modVal2) :
                    this.hasMod(elem, modName, modVal1)? modVal2 : modVal1);

        return this;

    },

    /**
     * Removes a modifier from a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {BEM}
     */
    delMod : function(elem, modName) {

        if(!modName) {
            modName = elem;
            elem = undefined;
        }

        return this.setMod(elem, modName, '');

    },

    /**
     * Executes handlers for setting modifiers
     * @private
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var modFnName = buildModFnName(elemName, modName, modVal);
        return this[modFnName]?
           this[modFnName].apply(this, modFnParams) :
           undefined;

    },

    /**
     * Retrieves the value of the modifier
     * @private
     * @param {String} modName Modifier name
     * @param {Object} [elem] Element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem) {

        return '';

    },

    /**
     * Retrieves name/value for a list of modifiers
     * @private
     * @param {Array} modNames Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by name
     */
    _extractMods : function(modNames, elem) {

        return {};

    },

    /**
     * Returns a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        return this.__self.channel(id, drop);

    },

    /**
     * Returns a block's default parameters
     * @returns {Object}
     */
    getDefaultParams : function() {

        return {};

    },

    /**
     * Helper for cleaning up block properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var args = [].slice.call(arguments);
        typeof obj == 'string' && args.unshift(this);
        this.__self.del.apply(this.__self, args);
        return this;

	},

    /**
     * Deletes a block
     */
    destruct : function() {}

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Storage for block declarations (hash by block name)
     * @static
     * @protected
     * @type Object
     */
    blocks : blocks,

    /**
     * Declares blocks and creates a block class
     * @static
     * @protected
     * @param {String|Object} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.modName] Modifier name
     * @param {String} [decl.modVal] Modifier value
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     */
    decl : function(decl, props, staticProps) {

        if(typeof decl == 'string')
            decl = { block : decl };
        else if(decl.name) {
            decl.block = decl.name;
        }

        if(decl.baseBlock && !blocks[decl.baseBlock])
            throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');

        props || (props = {});

        if(props.onSetMod) {
            modFnsToProps(props.onSetMod, props);
            delete props.onSetMod;
        }

        if(props.onElemSetMod) {
            $.each(props.onElemSetMod, function(elemName, modFns) {
                modFnsToProps(modFns, props, elemName);
            });
            delete props.onElemSetMod;
        }

        var baseBlock = blocks[decl.baseBlock || decl.block] || this;

        if(decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            $.each(props, function(name, prop) {
                $.isFunction(prop) &&
                    (props[name] = function() {
                        var method;
                        if(checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== props[name] &&
                                (method = this.__base);
                        }
                        return method?
                            method.apply(this, arguments) :
                            undefined;
                    });
            });
        }

        var block;
        decl.block == baseBlock._name?
            // makes a new "live" if the old one was already executed
            (block = $.inheritSelf(baseBlock, props, staticProps))._processLive(true) :
            (block = blocks[decl.block] = $.inherit(baseBlock, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        return false;

    },

    /**
     * Factory method for creating an instance of the block named
     * @static
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {BEM}
     */
    create : function(block, params) {

        typeof block == 'string' && (block = { block : block });

        return new blocks[block.block](block.mods, params);

    },

    /**
     * Returns the name of the current block
     * @static
     * @protected
     * @returns {String}
     */
    getName : function() {

        return this._name;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {Object} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {},

    /**
     * Adds a function to the queue for executing after the "current event"
     * @static
     * @protected
     * @param {Function} fn
     * @param {Object} ctx
     */
    afterCurrentEvent : function(fn, ctx) {

        afterCurrentEventFns.push({ fn : fn, ctx : ctx }) == 1 &&
            setTimeout(this._runAfterCurrentEventFns, 0);

    },

    /**
     * Executes the queue
     * @private
     */
    _runAfterCurrentEventFns : function() {

        var fnsLen = afterCurrentEventFns.length;
        if(fnsLen) {
            var fnObj,
                fnsCopy = afterCurrentEventFns.splice(0, fnsLen);

            while(fnObj = fnsCopy.shift()) fnObj.fn.call(fnObj.ctx || this);
        }

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} ctx Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Helper for cleaning out properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var delInThis = typeof obj == 'string',
            i = delInThis? 0 : 1,
            len = arguments.length;
        delInThis && (obj = this);

        while(i < len) delete obj[arguments[i++]];

        return this;

	},

    /**
     * Returns/destroys a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        if(typeof id == 'boolean') {
            drop = id;
            id = undefined;
        }

        id || (id = 'default');

        if(drop) {
            if(channels[id]) {
                channels[id].un();
                delete channels[id];
            }
            return;
        }

        return channels[id] || (channels[id] = new $.observable());

    }

});

})(jQuery);;
(function() {

/**
 * Возвращает массив свойств объекта
 * @param {Object} obj объект
 * @returns {Array}
 */
Object.keys || (Object.keys = function(obj) {
    var res = [];

    for(var i in obj) obj.hasOwnProperty(i) &&
        res.push(i);

    return res;
});

})();;
(function() {

var ptp = Array.prototype,
    toStr = Object.prototype.toString,
    methods = {

        /**
         * Finds the index of an element in an array
         * @param {Object} item
         * @param {Number} [fromIdx] Starting from index (length - 1 - fromIdx, if fromIdx < 0)
         * @returns {Number} Element index or -1, if not found
         */
        indexOf : function(item, fromIdx) {

            fromIdx = +(fromIdx || 0);

            var t = this, len = t.length;

            if(len > 0 && fromIdx < len) {
                fromIdx = fromIdx < 0? Math.ceil(fromIdx) : Math.floor(fromIdx);
                fromIdx < -len && (fromIdx = 0);
                fromIdx < 0 && (fromIdx = fromIdx + len);

                while(fromIdx < len) {
                    if(fromIdx in t && t[fromIdx] === item)
                        return fromIdx;
                    ++fromIdx;
                }
            }

            return -1;

        },

        /**
         * Calls the callback for each element
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         */
        forEach : function(callback, ctx) {

            var i = -1, t = this, len = t.length;
            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

        },

        /**
         * Creates array B from array A so that B[i] = callback(A[i])
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         * @returns {Array}
         */
        map : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = new Array(len);

            while(++i < len) i in t &&
                (res[i] = ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

            return res;

        },

        /**
         * Creates an array containing only the elements from the source array that the callback returns true for. 
         * @param {Function} callback Called for each element
         * @param {Object} [ctx] Callback context
         * @returns {Array}
         */
        filter : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = [];

            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)) && res.push(t[i]);

            return res;

        },

        /**
         * Wraps the array using an accumulator
         * @param {Function} callback Called for each element
         * @param {Object} [initialVal] Initial value of the accumulator
         * @returns {Object} Accumulator
         */
        reduce : function(callback, initialVal) {

            var i = -1, t = this, len = t.length,
                res;

            if(arguments.length < 2) {
                while(++i < len) {
                    if(i in t) {
                        res = t[i];
                        break;
                    }
                }
            }
            else {
                res = initialVal;
            }

            while(++i < len) i in t &&
                (res = callback(res, t[i], i, t));

            return res;

        },

        /**
         * Checks whether at least one element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Callback context
         * @returns {Boolean}
         */
        some : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && (ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return true;

            return false;

        },

        /**
         * Checks whether every element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Context of the callback call
         * @returns {Boolean}
         */
        every : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && !(ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return false;

            return true;

        }

    };

for(var name in methods)
    ptp[name] || (ptp[name] = methods[name]);

Array.isArray || (Array.isArray = function(obj) {
    return toStr.call(obj) === '[object Array]';
});

})();;
(function() {

var slice = Array.prototype.slice;

Function.prototype.bind || (Function.prototype.bind = function(ctx) {

    var fn = this,
        args = slice.call(arguments, 1);

    return function () {
        return fn.apply(ctx, args.concat(slice.call(arguments)));
    }

});

})();;
/** @fileOverview Module for internal BEM helpers */
/** @requires BEM */

(function(BEM, $, undefined) {

/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Separator between names of a block and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable element and modifier names
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function buildModPostfix(modName, modVal, buffer) {

    buffer.push(MOD_DELIM, modName, MOD_DELIM, modVal);

}

function buildBlockClass(name, modName, modVal, buffer) {

    buffer.push(name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

function buildElemClass(block, name, modName, modVal, buffer) {

    buildBlockClass(block, undefined, undefined, buffer);
    buffer.push(ELEM_DELIM, name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

BEM.INTERNAL = {

    NAME_PATTERN : NAME_PATTERN,

    MOD_DELIM : MOD_DELIM,
    ELEM_DELIM : ELEM_DELIM,

    buildModPostfix : function(modName, modVal, buffer) {

        var res = buffer || [];
        buildModPostfix(modName, modVal, res);
        return buffer? res : res.join('');

    },

    /**
     * Builds the class of a block or element with a modifier
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClass : function(block, elem, modName, modVal, buffer) {

        var typeOf = typeof modName;
        if(typeOf == 'string') {
            if(typeof modVal != 'string') {
                buffer = modVal;
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
        } else if(typeOf != 'undefined') {
            buffer = modName;
            modName = undefined;
        } else if(elem && typeof elem != 'string') {
            buffer = elem;
            elem = undefined;
        }

        if(!(elem || modName || buffer)) { // оптимизация для самого простого случая
            return block;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, modName, modVal, res) :
            buildBlockClass(block, modName, modVal, res);

        return buffer? res : res.join('');

    },

    /**
     * Builds full classes for a buffer or element with modifiers
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {Object} [mods] Modifiers
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClasses : function(block, elem, mods, buffer) {

        if(elem && typeof elem != 'string') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, undefined, undefined, res) :
            buildBlockClass(block, undefined, undefined, res);

        mods && $.each(mods, function(modName, modVal) {
            if(modVal) {
                res.push(' ');
                elem?
                    buildElemClass(block, elem, modName, modVal, res) :
                    buildBlockClass(block, modName, modVal, res);
            }
        });

        return buffer? res : res.join('');

        /*var typeOf = typeof elem;
        if(typeOf != 'string' && typeOf != 'undefined') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }
        if($.isArray(mods)) {
            buffer = mods;
            mods = undefined;
        }

        var res = buffer || [];
        buildClasses(block, elem, mods, res);
        return buffer? res : res.join('');*/

    }

}

})(BEM, jQuery);;
$(function() {
	$('.b-menu__addDay').click(function(e) {
		if (form.self.is(':visible'))
			return;

		if ($('.b-impExpForm').is(':visible')) {
			$('.b-impExpForm').hide();
		}

		form.toggle();
		$('.b-editDayForm').remove();
	});
});;
$(function() {
	var $impExpForm = $('.b-impExpForm'),
		daysArr;

	$('.b-menu__impExp').click(function(e) {
		if ($impExpForm.is(':visible'))
			return;

		$('.b-editDayForm').remove();
		if (form.self.is(':visible')) {
			form.toggle();
		}

		daysArr = days.getStorage();
		$impExpForm.slideDown(100)
				   .find('textarea').text(JSON.stringify(daysArr));
	});
});;
$(function() {
	$('.b-menu__print').click(function(e) {
		window.print();
	});
});;
$(function() {
	var $menuItems = $('.b-linksWrapper__item span');

	$menuItems.click(function(e) {
		var $trg = $(this);

		if ($trg.parent().is('.b-menu__print')) {
			return;
		};
		$trg.parent().addClass('b-linksWrapper__item_state_active')
					 .siblings().removeClass('b-linksWrapper__item_state_active');
	}).hover(function(e) {
		var $trg = $(this);

		$trg.parent().toggleClass('b-linksWrapper__item_state_hover');
	});
});
var form = {};
$(function() {
	form = {
		date: $('.b-addDayForm__date').datepicker({ dateFormat: 'd.m.yy', onSelect: function() { form.timeStartHour1[0].focus() } }),

		timeStartHour1: $('.b-addDayForm__timeStartHour1'),
		timeStartMin1: $('.b-addDayForm__timeStartMin1'),
		topic1: $('.b-addDayForm__topic1'),
		pdf1: $('.b-addDayForm__pdf1'),
		timeEndHour1: $('.b-addDayForm__timeEndHour1'),
		timeEndMin1: $('.b-addDayForm__timeEndMin1'),
		club1: $('.b-addDayForm__club1'),
		video1: $('.b-addDayForm__video1'),
		lectorName1: $('.b-addDayForm__lectorName1'),
		lectorPage1: $('.b-addDayForm__lectorPage1'),
		lectorAva1: $('.b-addDayForm__lectorAva1'),

		timeStartHour2: $('.b-addDayForm__timeStartHour2'),
		timeStartMin2: $('.b-addDayForm__timeStartMin2'),
		topic2: $('.b-addDayForm__topic2'),
		pdf2: $('.b-addDayForm__pdf2'),
		timeEndHour2: $('.b-addDayForm__timeEndHour2'),
		timeEndMin2: $('.b-addDayForm__timeEndMin2'),
		club2: $('.b-addDayForm__club2'),
		video2: $('.b-addDayForm__video2'),
		lectorName2: $('.b-addDayForm__lectorName2'),
		lectorPage2: $('.b-addDayForm__lectorPage2'),
		lectorAva2: $('.b-addDayForm__lectorAva2'),

		self: $('.b-addDayForm'),
		toggle: function() {
			this.self.slideToggle(100)
				.find('input').each(function() { this.value = ''; });
		}
	},

	daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

	$('.b-addDayForm .ok').live('click', function(e) {
		if (form.date.val() == '') {
			$('.b-addDayForm .cancel').click();
			return;
		}
		var dayObj = {
						date: {
								number: {
										month: form.date.val().split('.')[1] || '',
										number: form.date.val().split('.')[0] || ''
									},
								text: daysOfWeek[(new Date(form.date.val().split('.')[2], form.date.val().split('.')[1]-1, form.date.val().split('.')[0]).getDay())] || ''
							},
						lectures: [
									{
										time: {
											start: { h: form.timeStartHour1.val(), m: form.timeStartMin1.val() },
											end: { h: form.timeEndHour1.val(), m: form.timeEndMin1.val() }
										},
										topics: [
											{
												href: form.club1.val(),
												text: form.topic1.val(),
												pdf: form.pdf1.val(),
												video: form.video1.val()
											}
										],
										lector: {
											src: form.lectorAva1.val(),
											href: form.lectorPage1.val(),
											name: form.lectorName1.val()
										}
									},
									{
										time: {
											start: { h: form.timeStartHour2.val(), m: form.timeStartMin2.val() },
											end: { h: form.timeEndHour2.val(), m: form.timeEndMin2.val() }
										},
										topics: [
											{
												href: form.club2.val(),
												text: form.topic2.val(),
												pdf: form.pdf2.val(),
												video: form.video2.val()
											}
										],
										lector: {
											src: form.lectorAva2.val(),
											href: form.lectorPage2.val(),
											name: form.lectorName2.val()
										}
									}
						]
		};
		days.addToStorage(dayObj);
		days.buildDays(days.getStorage());
		form.toggle();
		$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
	});

	$('.b-addDayForm .cancel').live('click', function(e) {
		form.toggle();
		$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
	});
});;
$(function() {
	$('.b-impExpForm .cancel').bind('click', function(e) {
		$('.b-impExpForm').slideUp(100);
		$('.b-menu__impExp').removeClass('b-linksWrapper__item_state_active');
	});

	$('.b-impExpForm .ok').bind('click', function(e) {
		var schemaText = $('.b-impExpForm__field textarea').val(),
			schemaObj;

		try {
			schemaObj = JSON.parse(schemaText);
		} catch(e) {
			console.log(e);
			return;
		}

		days.setStorage(schemaObj);
		days.buildDays(schemaObj);

		$('.b-impExpForm').slideUp(100);
		$('.b-menu__impExp').removeClass('b-linksWrapper__item_state_active');
	});
});;
var $bDays,
	$bWorkDay,
	$bWeekend,

	days = {
		init: function() {
			var schema = this.getStorage();

			if (schema.length == 0) {
				$.getJSON('../schema/schema.js', function(data) {
					days.setStorage(data);
					days.buildDays(data);
				});
			}

			$bDays = $('.b-days');
			$bWorkDay = $('.b-templates__work').children('.b-day');
			$bWeekend = $('.b-templates__weekend').children('.b-day');

			this.buildDays(schema);
		},
		setStorage: function(data) {
			localStorage.setItem('schema', JSON.stringify(data));
		},
		getStorage: function() {
			return JSON.parse(localStorage.getItem('schema')) || [];
		},
		addToStorage: function(day) {
			var schema = this.getStorage();

			schema.push(day);
			schema.sort(function(a, b) {
				var aDate = new Date((new Date).getFullYear(), a.date.number.month-1, a.date.number.number),
					bDate = new Date((new Date).getFullYear(), b.date.number.month-1, b.date.number.number);

				return aDate - bDate;
			});

			this.setStorage(schema);
		},
		buildDays: function(schema) {
			var $dayCur,
				dayType;

			$bDays.empty();
			for (var i = 0; i < schema.length; i++) {
				dayType = schema[i].date.text;
				$dayCur = buildDay(schema[i], dayType);
				$bDays.append($dayCur);
			}

			function buildDay (block, dayType) {
				var $clone,
					month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
							 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

				if (dayType == 'суббота') {
					$clone = $bWeekend.clone();
				} else {
					$clone = $bWorkDay.clone();
				}

				  $clone.find('.b-date__number div.month').text(month[block.date.number.month-1]).end()
						.find('.b-date__number div.number').text(block.date.number.number).end()
						.find('.b-date__text').text(block.date.text).end()
						.find('.b-lecture__time:eq(0)').html(block.lectures[0].time.start.h ? (block.lectures[0].time.start.h+'<sup>'+block.lectures[0].time.start.m+'</sup> — '+
															 block.lectures[0].time.end.h+'<sup>'+block.lectures[0].time.end.m+'</sup>') : '').end()
						.find('.b-lecture__time:eq(1)').html(block.lectures[1].time.start.h ? (block.lectures[1].time.start.h+'<sup>'+block.lectures[1].time.start.m+'</sup> — '+
															 block.lectures[1].time.end.h+'<sup>'+block.lectures[1].time.end.m+'</sup>') : '').end()
						.find('.b-lecture__topic:eq(0)').html( buildTopic(block.lectures[0].topics) ).end()
						.find('.b-lecture__topic:eq(1)').html( buildTopic(block.lectures[1].topics) ).end()
						.find('.b-lecture__lector:eq(0)').html('<img src="'+block.lectures[0].lector.src+'"> '+
																'<a href="'+block.lectures[0].lector.href+'">'+block.lectures[0].lector.name+'</a>').end()
						.find('.b-lecture__lector:eq(1)').html('<img src="'+block.lectures[1].lector.src+'"> '+
																'<a href="'+block.lectures[1].lector.href+'">'+block.lectures[1].lector.name+'</a>');
				return $clone;
			}

			function buildTopic (topics) {
				var href,
					text,
					pdf,
					video,
					resultHtml = '';

				for (var i = 0; i < topics.length; i++) {
					href = topics[i].href;
					text = topics[i].text;
					pdf = topics[i].pdf;
					video = topics[i].video;

					resultHtml += text ? '<a href="'+href+'">'+text+'</a> '+(pdf ? '<sup class="green"><a href="'+pdf+'">pdf</a></sup> ' : '')+(video ? '<sup class="brown"><a href="'+video+'">video</a></sup>' : '')
									   : '';
					if (i != topics.length-1) resultHtml += ', ';
				}
				return resultHtml;
			}
		}
	};
$(function() {
	days.init();
});;
$(function() {
	$('.b-day').hover(function(e) {
		$(this).find('.b-day__edit').toggle();
	});
});;
$(function() {
	$('.b-day__edit').live('click', function(e) {
		var $trg = $(e.target),
			editObj,
			$editForm,
			month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
					 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
			dayList = days.getStorage(),
			dateVal = $trg.closest('.b-day').find('.b-date__number .number').text(),
			monthVal = $trg.closest('.b-day').find('.b-date__number .month').text();

		if ($trg.is('.delete')) {
			for (var i = 0; i < dayList.length; i++) {
				if (dayList[i].date.number.number == dateVal
				&&  dayList[i].date.number.month == month.indexOf(monthVal)+1) {
						dayList.splice(i, 1);

						days.setStorage(dayList);
						days.buildDays(dayList);
						return;
				}
				
			}
		} else if ($trg.is('.edit')) {
			if (form.self.is(':visible')) {
				$('.b-menu__addDay').removeClass('b-linksWrapper__item_state_active');
				form.toggle();
			}

			$('.b-editDayForm').remove();
			$editForm = form.self.clone(false).removeClass('b-addDayForm')
										 .addClass('b-editDayForm')
										 .insertAfter($trg.closest('.b-day'))
										 .slideDown(100);

			for (var i = 0; i < dayList.length; i++) {
				if (dayList[i].date.number.number == dateVal
				&&  dayList[i].date.number.month == month.indexOf(monthVal)+1) {
						editObj = dayList[i];

						$editForm.find('.b-addDayForm__date').val(editObj.date.number.number+'.'+editObj.date.number.month+'.'+(new Date).getFullYear()).end()
								 .find('.b-addDayForm__timeStartHour1').val(editObj.lectures[0].time.start.h).end()
								 .find('.b-addDayForm__timeStartMin1').val(editObj.lectures[0].time.start.m).end()
								 .find('.b-addDayForm__timeStartHour2').val(editObj.lectures[1].time.start.h).end()
								 .find('.b-addDayForm__timeStartMin2').val(editObj.lectures[1].time.start.m).end()
								 .find('.b-addDayForm__timeEndHour1').val(editObj.lectures[0].time.end.h).end()
								 .find('.b-addDayForm__timeEndMin1').val(editObj.lectures[0].time.end.m).end()
								 .find('.b-addDayForm__timeEndHour2').val(editObj.lectures[1].time.end.h).end()
								 .find('.b-addDayForm__timeEndMin2').val(editObj.lectures[1].time.end.m).end()
								 .find('.b-addDayForm__topic1').val(editObj.lectures[0].topics[0].text).end()
								 .find('.b-addDayForm__topic2').val(editObj.lectures[1].topics[0].text).end()
								 .find('.b-addDayForm__pdf1').val(editObj.lectures[0].topics[0].pdf).end()
								 .find('.b-addDayForm__pdf2').val(editObj.lectures[1].topics[0].pdf).end()
								 .find('.b-addDayForm__club1').val(editObj.lectures[0].topics[0].href).end()
								 .find('.b-addDayForm__club2').val(editObj.lectures[1].topics[0].href).end()
								 .find('.b-addDayForm__video1').val(editObj.lectures[0].topics[0].video).end()
								 .find('.b-addDayForm__video2').val(editObj.lectures[1].topics[0].video).end()
								 .find('.b-addDayForm__lectorName1').val(editObj.lectures[0].lector.name).end()
								 .find('.b-addDayForm__lectorName2').val(editObj.lectures[1].lector.name).end()
								 .find('.b-addDayForm__lectorPage1').val(editObj.lectures[0].lector.href).end()
								 .find('.b-addDayForm__lectorPage2').val(editObj.lectures[1].lector.href).end()
								 .find('.b-addDayForm__lectorAva1').val(editObj.lectures[0].lector.src).end()
								 .find('.b-addDayForm__lectorAva2').val(editObj.lectures[1].lector.src)
						return;
				}
				
			}
		}
	});

	$('.b-editDayForm .cancel').live('click', function(e) {
		$(this).closest('.b-editDayForm').remove();
	});

	$('.b-editDayForm .ok').live('click', function(e) {
		var form = $(this).closest('.b-editDayForm'),
			dayList = days.getStorage(),
			dayObj,
			dateVal = form.find('.b-addDayForm__date').val().split('.')[0],
			monthVal = form.find('.b-addDayForm__date').val().split('.')[1];

		if (form.find('.b-addDayForm__date').val() == '') {
			$('.b-editDayForm .cancel').click();
			return;
		}

		dayObj = {
					date: {
							number: {
									month: monthVal || '',
									number: form.find('.b-addDayForm__date').val().split('.')[0] || ''
								},
							text: daysOfWeek[(new Date(form.find('.b-addDayForm__date').val().split('.')[2], monthVal-1, dateVal).getDay())] || ''
						},
					lectures: [
								{
									time: {
										start: { h: form.find('.b-addDayForm__timeStartHour1').val(), m: form.find('.b-addDayForm__timeStartMin1').val() },
										end: { h: form.find('.b-addDayForm__timeEndHour1').val(), m: form.find('.b-addDayForm__timeEndMin1').val() }
									},
									topics: [
										{
											href: form.find('.b-addDayForm__club1').val(),
											text: form.find('.b-addDayForm__topic1').val(),
											pdf: form.find('.b-addDayForm__pdf1').val(),
											video: form.find('.b-addDayForm__video1').val()
										}
									],
									lector: {
										src: form.find('.b-addDayForm__lectorAva1').val(),
										href: form.find('.b-addDayForm__lectorPage1').val(),
										name: form.find('.b-addDayForm__lectorName1').val()
									}
								},
								{
									time: {
										start: { h: form.find('.b-addDayForm__timeStartHour2').val(), m: form.find('.b-addDayForm__timeStartMin2').val() },
										end: { h: form.find('.b-addDayForm__timeEndHour2').val(), m: form.find('.b-addDayForm__timeEndMin2').val() }
									},
									topics: [
										{
											href: form.find('.b-addDayForm__club2').val(),
											text: form.find('.b-addDayForm__topic2').val(),
											pdf: form.find('.b-addDayForm__pdf2').val(),
											video: form.find('.b-addDayForm__video2').val()
										}
									],
									lector: {
										src: form.find('.b-addDayForm__lectorAva2').val(),
										href: form.find('.b-addDayForm__lectorPage2').val(),
										name: form.find('.b-addDayForm__lectorName2').val()
									}
								}
					]
		};

		for (var i = 0; i < dayList.length; i++) {
			if (dayList[i].date.number.number == dateVal
			&&  dayList[i].date.number.month == monthVal) {
					dayList.splice(i, 1);

					days.setStorage(dayList);
					break;
			}
		}

		days.addToStorage(dayObj);
		days.buildDays(days.getStorage());
		form.remove();
	});
});;
