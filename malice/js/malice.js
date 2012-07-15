// Generated by CoffeeScript 1.3.3

/*
Useful Utilities
*/


(function() {
  var Board, BoardView, Card, CardView, Pairing, PairingView, RemoteModel, Stack, StackView, chatter, openChannel, showDebugColors, util,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = util != null ? util : {};

  util.assertion = function(condition, err_msg) {
    if (!condition) {
      alert(err_msg);
      throw new Error(err_msg);
    }
  };

  util.flip = function(func) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return func.apply(null, args.slice(0).reverse());
    };
  };

  util.later = function() {
    var args, func, ms, _ref, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1) {
      _ref = [args[0], 1], func = _ref[0], ms = _ref[1];
    } else if (args.length === 2) {
      _ref1 = [args[1], args[0]], func = _ref1[0], ms = _ref1[1];
    } else {
      throw new Error('util.later takes 1 or 2 arguments only.');
    }
    return setTimeout(func, ms);
  };

  util.titleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  util.prettyUsername = function(name) {
    var at_index;
    at_index = name.indexOf('@');
    if (at_index > 0) {
      return name.slice(0, at_index);
    } else {
      return name;
    }
  };

  util.mash = function(array) {
    var dict, key, key_value, value, _i, _len;
    dict = {};
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      key_value = array[_i];
      key = key_value[0], value = key_value[1];
      dict[key] = value;
    }
    return dict;
  };

  util.isInteger = function(obj) {
    return _.isNumber(obj) && (obj % 1 === 0);
  };

  util.typeName = function(obj) {
    if (!(obj != null)) {
      return 'undefined';
    }
    return obj.__proto__.constructor.name;
  };

  util.setCollectionAsAttribute = function(model, collection_name, initial_elts) {
    var collection,
      _this = this;
    if (initial_elts == null) {
      initial_elts = [];
    }
    collection = new Backbone.Collection(initial_elts);
    model[collection_name] = collection;
    model.set(collection_name, collection.models);
    collection.on('add remove change', function() {
      console.log(" --- updating " + (util.typeName(model)) + " based on collection change");
      return model.attributes[collection_name] = collection.models;
    });
    model.on("change:" + collection_name, function() {
      console.log(" --- updating collection based on " + (util.typeName(model)) + " change");
      return collection.reset(model.attributes[collection_name]);
    });
    return collection.on('all', function() {
      var args, type;
      type = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return model.trigger.apply(model, ["" + collection_name + ":" + type].concat(__slice.call(args)));
    });
  };

  util.timeStr = function(hour) {
    var suf, _ref;
    if (hour === 12) {
      return 'noon';
    }
    _ref = hour < 12 ? [hour, 'am'] : hour < 13 ? [hour, 'pm'] : [hour - 12, 'pm'], hour = _ref[0], suf = _ref[1];
    if (util.isInteger(hour)) {
      return "" + hour + suf;
    } else {
      return "" + (Math.floor(hour)) + ":30" + suf;
    }
  };

  util.WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  util.randInt = function(max) {
    return Math.floor(Math.random() * max);
  };

  util.choose = function(array, exclude) {
    var elt;
    if (exclude == null) {
      exclude = [];
    }
    while (true) {
      elt = array[util.randInt(array.length)];
      if (__indexOf.call(exclude, elt) < 0) {
        return elt;
      }
    }
  };

  util.uid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r;
      r = util.randInt(16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
  };

  /*
    Performs each action with a given probability, e.g.
  
      util.withProbability [
        0.25, -> action A
        0.50, -> action B
        null, -> action C
      ]
  
    performs action A with probability 0.25, action B with
    probability 0.5 and action C with the remaining 0.25
    probability.
  */


  util.withProbability = function(actions) {
    var action, ii, prob, random, _i, _ref, _ref1;
    random = Math.random();
    for (ii = _i = 0, _ref = actions.length; _i < _ref; ii = _i += 2) {
      _ref1 = actions.slice(ii, (ii + 1) + 1 || 9e9), prob = _ref1[0], action = _ref1[1];
      if (!(prob != null) || (random -= prob) < 0) {
        return action();
      }
    }
  };

  /*
    Appends an element to a div assuming all elements are laid
    out as follows:
  
      ELT   height
      SPACE vertical_margin
      ELT   height
      SPACE vertical_margin
      ELT   height
  
    Also, resizes the containing div.
  */


  util.verticalAppend = function(elt, container, height, vertical_margin) {
    var n_children;
    n_children = container.children().length;
    elt.css({
      height: height,
      top: n_children * (height + vertical_margin)
    });
    container.css({
      height: height * (n_children + 1) + vertical_margin * n_children
    });
    return container.append(elt);
  };

  /*
    Opens a channel to the server and delegates message calls to the
    delegate object.
  */


  openChannel = function(token, delegate) {
    var channel;
    channel = new goog.appengine.Channel(token);
    return channel.open({
      onopen: function() {
        return typeof delegate.channel_open === "function" ? delegate.channel_open() : void 0;
      },
      onclose: function() {
        return typeof delegate.channel_close === "function" ? delegate.channel_close() : void 0;
      },
      onerror: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof delegate.channel_error === "function" ? delegate.channel_error.apply(delegate, args) : void 0;
      },
      onmessage: function(message) {
        var args, method, _ref;
        _ref = chatter.unwrap(JSON.parse(message.data)), method = _ref[0], args = _ref[1];
        console.log('ONMESSAGE');
        console.log(method);
        console.log(args);
        console.log(_.keys(delegate));
        return delegate[method](args);
      }
    });
  };

  /*
  Enables serialization (wrapping) and deserialization (unwrapping) of
  arbitrary objects according to the chatter protocol.
  */


  chatter = chatter != null ? chatter : {};

  chatter.unwrap_table = {};

  chatter.register = function(type) {
    return chatter.unwrap_table[type.name] = type;
  };

  chatter.wrap = function(obj) {
    var key, value, x;
    if (_.isFunction(obj != null ? obj.wrap : void 0)) {
      return obj.wrap();
    } else if (_.isUndefined(obj)) {
      return ['NoneType', ''];
    } else if (_.isNull(obj)) {
      return ['NoneType', ''];
    } else if (_.isBoolean(obj)) {
      return ['bool', obj];
    } else if (util.isInteger(obj)) {
      return ['int', obj];
    } else if (_.isNumber(obj)) {
      return ['float', obj];
    } else if (_.isString(obj)) {
      return ['str', obj];
    } else if (_.isArray(obj)) {
      return [
        'list', (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = obj.length; _i < _len; _i++) {
            x = obj[_i];
            _results.push(chatter.wrap(x));
          }
          return _results;
        })()
      ];
    } else if (_.isObject(obj)) {
      console.log("wrapping object keys: " + (_.keys(obj)));
      return [
        'dict', chatter.wrap((function() {
          var _results;
          _results = [];
          for (key in obj) {
            value = obj[key];
            _results.push([key, value]);
          }
          return _results;
        })())
      ];
    } else {
      throw new Error("cannot wrap " + obj);
    }
  };

  chatter.unwrap = function(obj) {
    var attribs, data, key, type, type_name, value, x, _i, _len, _results;
    type_name = obj[0], data = obj[1];
    type = chatter.unwrap_table[type_name];
    if (type != null) {
      attribs = util.mash((function() {
        var _results;
        _results = [];
        for (key in data) {
          value = data[key];
          _results.push([key, chatter.unwrap(value)]);
        }
        return _results;
      })());
      console.log("unwrapping!!! " + type.name);
      return new type(attribs);
    } else {
      switch (type_name) {
        case 'list':
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            x = data[_i];
            _results.push(chatter.unwrap(x));
          }
          return _results;
        case 'dict':
          return util.mash(chatter.unwrap(data));
        case 'int':
        case 'long':
        case 'unicode':
        case 'str':
        case 'float':
          return data;
        case 'NoneType':
          return void 0;
        default:
          throw new Error("type_name \"" + type_name + "\" not understood");
      }
    }
  };

  /*
  Enables serialization (wrapping) and deserialization (unwrapping) of
  arbitrary objects according to the chatter protocol.
  */


  /*
  Enables entities and methods to be serialized across the internet.
  */


  RemoteModel = (function(_super) {
    var _this = this;

    __extends(RemoteModel, _super);

    function RemoteModel() {
      return RemoteModel.__super__.constructor.apply(this, arguments);
    }

    RemoteModel.prototype.urlRoot = function() {
      return "" + this.__proto__.constructor.name + "/datastore";
    };

    RemoteModel.prototype.parse = function(obj) {
      var data, key, my_name, type_name, value;
      my_name = this.__proto__.constructor.name;
      type_name = obj[0], data = obj[1];
      util.assertion(my_name === type_name, "" + my_name + " cannot parse " + type_name);
      return util.mash((function() {
        var _results;
        _results = [];
        for (key in data) {
          value = data[key];
          _results.push([key, chatter.unwrap(value)]);
        }
        return _results;
      })());
    };

    RemoteModel.prototype.toJSON = function() {
      var key, my_name, value, wrapped_attribs;
      my_name = this.__proto__.constructor.name;
      console.log("RemoteModel wrapping " + my_name + " attribs: " + (_.keys(this.attributes)));
      if (this.attributes.calEvents != null) {
        console.log("HAS calEvents, length:" + this.attributes.calEvents.length);
      }
      wrapped_attribs = (function() {
        var _ref, _results;
        _ref = this.attributes;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push([key, chatter.wrap(value)]);
        }
        return _results;
      }).call(this);
      return [my_name, util.mash(wrapped_attribs)];
    };

    RemoteModel.prototype.wrap = function() {
      return this.toJSON();
    };

    /*
      To declare a remote static method:
        @funcName: RemoteModel.remoteStaticMethod 'funcName'
      To catch errors, bind an object to the "ajaxError" event.
    */


    RemoteModel.remoteStaticMethod = function(name) {
      return function() {
        var args, done, method_args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = (function() {
          switch (args.length) {
            case 0:
              return [{}, function() {}];
            case 1:
              if (_.isFunction(args[0])) {
                return [{}, args[0]];
              } else {
                return [args[0], function() {}];
              }
            case 2:
              return args;
            default:
              throw new Error('Too many arguements.');
          }
        })(), method_args = _ref[0], done = _ref[1];
        return $.post("" + this.prototype.constructor.name + "/method/" + name, JSON.stringify(chatter.wrap({
          args: method_args
        })), function(response) {
          return done(chatter.unwrap(response).return_val);
        });
      };
    };

    /*
      To declare a remote instance method:
    
        funcName: RemoteModel.remoteInstanceMethod 'funcName', options
    
      Options:
      
        sync_before (default=false) : save to server before remote method invocation
        sync_after (default=false)  : fetch from server after remote method invocation
    
      To catch errors, bind an object to the "ajaxError" event.
    */


    RemoteModel.remoteInstanceMethod = function(name, options) {
      if (options == null) {
        options = {};
      }
      return function() {
        var args, done, method_args, request, _ref, _ref1, _ref2,
          _this = this;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = (function() {
          switch (args.length) {
            case 0:
              return [{}, function() {}];
            case 1:
              if (_.isFunction(args[0])) {
                return [{}, args[0]];
              } else {
                return [args[0], function() {}];
              }
            case 2:
              return args;
            default:
              throw new Error('Too many arguements.');
          }
        })(), method_args = _ref[0], done = _ref[1];
        request = {
          args: method_args,
          sync_before: (_ref1 = options.sync_before) != null ? _ref1 : false,
          sync_after: (_ref2 = options.sync_after) != null ? _ref2 : false
        };
        if (request.sync_before) {
          request.self = this;
        }
        return $.post("" + this.__proto__.constructor.name + "/method/" + name + "/" + this.id, JSON.stringify(chatter.wrap(request)), function(response) {
          response = chatter.unwrap(response);
          if (request.sync_after) {
            util.assertion(response.self.id === _this.id, 'ID cannot be reset.');
            _this.set(response.self.attributes);
          }
          return done(response.return_val);
        });
      };
    };

    return RemoteModel;

  }).call(this, Backbone.Model);

  Board = (function(_super) {

    __extends(Board, _super);

    chatter.register(Board);

    Board.STACKS = ['build1', 'build2', 'build3', 'build4'];

    function Board(attribs) {
      var stack, _i, _len, _ref;
      if (attribs == null) {
        attribs = {};
      }
      _ref = Board.STACKS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        if (__indexOf.call(attribs, stack) < 0) {
          attribs[stack] = new Stack({
            type: stack
          });
        }
      }
      console.log('CREATED A STACK');
      console.log(attribs.build1);
      Board.__super__.constructor.call(this, attribs);
    }

    Board.prototype.initialize = function(attribs) {
      var stack, _i, _len, _ref;
      console.log("CHECKING STACKS");
      _ref = Board.STACKS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        console.log(stack);
        console.log(this.get(stack));
      }
      return this.view = new BoardView({
        model: this
      });
    };

    return Board;

  })(RemoteModel);

  BoardView = (function(_super) {

    __extends(BoardView, _super);

    function BoardView(args) {
      args.el = $('#prototypes .boardView').clone()[0];
      BoardView.__super__.constructor.call(this, args);
    }

    BoardView.prototype.initialize = function() {
      var stack, stack_container, _i, _len, _ref, _results;
      console.log("BoardView -- initialize");
      console.log(this.el);
      console.log(this.model);
      stack_container = this.$el.find('#stackContainer');
      _ref = Board.STACKS;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        console.log("about to append stack");
        console.log(this.model.get(stack));
        _results.push(stack_container.append(this.model.get(stack).view.el));
      }
      return _results;
    };

    return BoardView;

  })(Backbone.View);

  Card = (function(_super) {

    __extends(Card, _super);

    chatter.register(Card);

    Card.prototype.defaults = {
      facing: 'front'
    };

    Card.SUITS = ['S', 'H', 'D', 'C'];

    Card.NUMBERS = {
      1: 'A',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: 'J',
      12: 'Q',
      13: 'K'
    };

    function Card(attribs) {
      var _ref, _ref1;
      if (attribs == null) {
        attribs = {};
      }
      util.assertion((_ref = attribs != null ? attribs.suit : void 0, __indexOf.call(Card.SUITS, _ref) >= 0), "Incorrect suit: " + attribs.suit + ".");
      util.assertion((_ref1 = "" + (attribs != null ? attribs.number : void 0), __indexOf.call(_.keys(Card.NUMBERS), _ref1) >= 0), "Incorrect number: " + attribs.number + ".");
      Card.__super__.constructor.call(this, attribs);
    }

    Card.prototype.initialize = function(attribs) {
      console.log("creating new card");
      console.log(this.attributes);
      console.log("about to construct view");
      this.view = new CardView({
        model: this
      });
      return console.log("created view");
    };

    Card.prototype.validate = function(attribs) {
      if (__indexOf.call(attribs, 'suit') >= 0 || __indexOf.call(attribs, 'number') >= 0) {
        return 'Cards are immutable.';
      }
      if (__indexOf.call(attribs, 'facing') >= 0) {
        throw new Error('user changing which way the card is facing');
      }
    };

    return Card;

  })(RemoteModel);

  CardView = (function(_super) {

    __extends(CardView, _super);

    function CardView(args) {
      args.el = $('#prototypes .cardView').clone()[0];
      CardView.__super__.constructor.call(this, args);
    }

    CardView.prototype.initialize = function() {
      var _this = this;
      this.$el.draggable({
        containment: 'parent',
        start: function() {
          return _this.trigger('drag:start', _this.model);
        },
        drag: function() {
          return _this.trigger('drag:dragging', _this.model);
        },
        stop: function() {
          return _this.trigger('drag:stop', _this.model);
        }
      });
      this.on('drag:start', CardView.prototype.onDragStart, this);
      this.on('drag:stop', CardView.prototype.onDragStop, this);
      return this.render();
    };

    CardView.prototype.render = function() {
      var number_str, suit_str;
      return this.$el.css({
        backgroundImage: (function() {
          switch (this.model.get('facing')) {
            case 'front':
              number_str = Card.NUMBERS["" + (this.model.get('number'))];
              suit_str = this.model.get('suit');
              return "url('/imgs/cards/" + number_str + suit_str + ".png')";
            case 'back':
              return "url('/imgs/cards/back.png')";
            default:
              throw new Error('Card not facing properly.');
          }
        }).call(this)
      });
    };

    CardView.prototype.onDragStart = function(card) {
      util.assertion(card.cid === this.model.cid, "Drag CID mismatch: " + card.cid + " != " + this.model.cid + ".");
      this.$el.css({
        zIndex: 3000
      });
      return console.log("onDragStart");
    };

    CardView.prototype.onDragStop = function(card) {
      util.assertion(card.cid === this.model.cid, "Drag CID mismatch: " + card.cid + " != " + this.model.cid + ".");
      this.$el.css({
        zIndex: ''
      });
      return console.log("onDragStop");
    };

    return CardView;

  })(Backbone.View);

  $(function() {
    var b, c, p;
    b = new Board;
    $('#boardContainer').append(b.view.el);
    p = new Pairing;
    $('#gameArea').append(p.view.el);
    c = new Card({
      suit: 'S',
      number: 1
    });
    return b.view.$el.append(c.view.el);
  });

  showDebugColors = function() {
    var color, colors, _i, _len, _results;
    colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange'];
    _results = [];
    for (_i = 0, _len = colors.length; _i < _len; _i++) {
      color = colors[_i];
      _results.push($(".test-" + color).css({
        backgroundColor: color
      }));
    }
    return _results;
  };

  Pairing = (function(_super) {

    __extends(Pairing, _super);

    chatter.register(Pairing);

    function Pairing(attribs) {
      if (attribs == null) {
        attribs = {};
      }
      Pairing.__super__.constructor.call(this);
    }

    Pairing.prototype.initialize = function(attribs) {
      console.log("about to construct view");
      this.view = new PairingView({
        model: this
      });
      return console.log("created view");
    };

    return Pairing;

  })(RemoteModel);

  PairingView = (function(_super) {

    __extends(PairingView, _super);

    function PairingView(args) {
      args.el = $('#prototypes .pairingView').clone()[0];
      PairingView.__super__.constructor.call(this, args);
    }

    PairingView.prototype.initialize = function() {
      console.log("PairingView -- initialize");
      console.log(this.el);
      return console.log(this.model);
    };

    return PairingView;

  })(Backbone.View);

  Stack = (function(_super) {

    __extends(Stack, _super);

    chatter.register(Stack);

    function Stack(attribs) {
      switch (attribs.type) {
        case 'build1':
          void 0;
          break;
        case 'build2':
          void 0;
          break;
        case 'build3':
          void 0;
          break;
        case 'build4':
          void 0;
          break;
        default:
          throw new Error("Stack type " + (this.model.get('type')) + " invalid.");
      }
      console.log('consructing staCKCKCKC');
      console.log(attribs);
      Stack.__super__.constructor.call(this, attribs);
    }

    Stack.prototype.initialize = function(attribs) {
      var _ref;
      console.log("Stack initialize " + (this.get('type')) + ", attributes...");
      console.log(attribs);
      util.setCollectionAsAttribute(this, 'calEvents', (_ref = attribs.calEvents) != null ? _ref : []);
      this.calEvents.comparator = function(event) {
        return event.get('name');
      };
      return this.view = new StackView({
        model: this
      });
    };

    Stack.prototype.accepts = function(card) {
      return true;
    };

    return Stack;

  })(RemoteModel);

  StackView = (function(_super) {

    __extends(StackView, _super);

    function StackView(args) {
      args.el = $('#prototypes .stackView').clone()[0];
      StackView.__super__.constructor.call(this, args);
    }

    StackView.prototype.initialize = function() {
      var _this = this;
      switch (this.model.get('type')) {
        case 'build1':
          this.$el.css({
            left: 263,
            top: 301
          });
          break;
        case 'build2':
          this.$el.css({
            left: 346,
            top: 301
          });
          break;
        case 'build3':
          this.$el.css({
            left: 430,
            top: 301
          });
          break;
        case 'build4':
          this.$el.css({
            left: 514,
            top: 301
          });
          break;
        default:
          throw new Error("Stack type " + (this.model.get('type')) + " invalid.");
      }
      this.$el.attr({
        id: this.model.get('type')
      });
      this.card_drop = this.$el.find('#cardDrop');
      return this.card_drop.droppable({
        activeClass: 'card-drop-active',
        accept: '.cardView',
        addClasses: false,
        greedy: true,
        hoverClass: 'card-drop-hover',
        tolerance: 'intersect',
        activate: function() {
          return _this.onDropActivate();
        },
        deactivate: function() {
          return _this.onDropDeactivate();
        },
        over: function() {
          return console.log("droppable - over");
        },
        out: function() {
          return console.log("droppable - out");
        },
        drop: function() {
          return console.log("droppable - drop: " + (_this.model.get('type')));
        }
      });
    };

    StackView.prototype.onDropActivate = function() {
      console.log("onDropActivate");
      return this.card_drop.css({
        visibility: 'visible',
        pointerEvents: 'auto'
      });
    };

    StackView.prototype.onDropDeactivate = function() {
      console.log("onDropDeactivate");
      return this.card_drop.css({
        visibility: 'hidden',
        pointerEvents: 'none'
      });
    };

    return StackView;

  })(Backbone.View);

}).call(this);
