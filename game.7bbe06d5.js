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
})({"js/classes/healthbar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var HealthBar = /*#__PURE__*/function () {
  function HealthBar(scene, x, y, maxLife, width, height) {
    _classCallCheck(this, HealthBar);
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.maxLife = maxLife;
    this.currentHealth = maxLife;
    this.percent = 1;
    this.width = width || 80;
    this.height = height || 14;
    this.draw();
    scene.add.existing(this.bar);
  }
  _createClass(HealthBar, [{
    key: "decrease",
    value: function decrease(amount) {
      this.currentHealth -= amount;
      if (this.currentHealth < 0) {
        this.currentHealth = 0;
      }
      this.percent = this.currentHealth / this.maxLife;
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      this.bar.clear();

      // White BG
      this.bar.fillStyle(0xffffff);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);
      if (this.percent < 0.3) {
        this.bar.fillStyle(0xff0000);
      } else {
        this.bar.fillStyle(0x00ff00);
      }

      // Actual health bar
      var d = Math.floor(this.percent * this.width);
      this.bar.fillRect(this.x + 2, this.y + 2, d, this.height);
    }
  }]);
  return HealthBar;
}();
var _default = HealthBar;
exports.default = _default;
},{}],"js/classes/hearts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Hearts = /*#__PURE__*/function () {
  function Hearts(scene, x, y, maxLives) {
    _classCallCheck(this, Hearts);
    this.x = x;
    this.y = y;
    this.maxLives = maxLives;
    this.currentLives = maxLives;
    this.hearts = scene.add.group({
      key: "heart",
      repeat: this.maxLives - 1,
      setXY: {
        x: this.x,
        y: this.y,
        stepX: 32
      }
    });
  }
  _createClass(Hearts, [{
    key: "decrease",
    value: function decrease(amount) {
      var _this = this;
      this.currentLives -= amount;

      // Can't go below 0
      if (this.currentLives < 0) {
        this.currentLives = 0;
      }

      // Redraw hearts
      this.hearts.getChildren().forEach(function (heart, index) {
        heart.setVisible(index < _this.currentLives);
      });
    }
  }]);
  return Hearts;
}();
var _default = Hearts;
exports.default = _default;
},{}],"js/classes/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _hearts = _interopRequireDefault(require("./hearts.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Player = /*#__PURE__*/function () {
  function Player(scene, x, y, playerSpeed, playerWeapon, playerHealth) {
    var _this = this;
    _classCallCheck(this, Player);
    _defineProperty(this, "setSpeed", function (speed) {
      _this.speed = speed;
    });
    _defineProperty(this, "setWeapons", function (weapon) {
      _this.weapon = weapon;
    });
    _defineProperty(this, "setVelocityX", function (velocity) {
      _this.sprite.setVelocityX(velocity);
    });
    _defineProperty(this, "setVelocityY", function (velocity) {
      _this.sprite.setVelocityY(velocity);
    });
    this.speed = playerSpeed;
    this.weapon = playerWeapon;
    this.health = playerHealth;
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setCollideWorldBounds(true); // keeps the player within the game world
    this.sprite.player = this;
    this.hearts = new _hearts.default(scene, 30, 830, this.health);
  }
  _createClass(Player, [{
    key: "decreaseLife",
    value: function decreaseLife(amount) {
      this.health -= amount;
      this.hearts.decrease(amount);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.sprite.destroy();
    }
  }]);
  return Player;
}();
var _default = Player;
exports.default = _default;
},{"./hearts.js":"js/classes/hearts.js"}],"assets/player.png":[function(require,module,exports) {
module.exports = "/player.1beceb5b.png";
},{}],"assets/heart.png":[function(require,module,exports) {
module.exports = "/heart.70222f36.png";
},{}],"assets/bullet.png":[function(require,module,exports) {
module.exports = "/bullet.6a8026eb.png";
},{}],"assets/player-bullet.png":[function(require,module,exports) {
module.exports = "/player-bullet.a6a3d185.png";
},{}],"assets/boss-alien-bullet.png":[function(require,module,exports) {
module.exports = "/boss-alien-bullet.7be20ed0.png";
},{}],"assets/alien.png":[function(require,module,exports) {
module.exports = "/alien.8936a5f5.png";
},{}],"assets/boss-alien.png":[function(require,module,exports) {
module.exports = "/boss-alien.a1a3a959.png";
},{}],"assets/space.png":[function(require,module,exports) {
module.exports = "/space.89e3a46b.png";
},{}],"assets/sounds/explosion.wav":[function(require,module,exports) {
module.exports = "/explosion.b7b19f4c.wav";
},{}],"assets/sounds/shoot.wav":[function(require,module,exports) {
module.exports = "/shoot.96f494c9.wav";
},{}],"assets/sounds/impact-scream.wav":[function(require,module,exports) {
module.exports = "/impact-scream.3ce8e798.wav";
},{}],"assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav":[function(require,module,exports) {
module.exports = "/172_drum_n_bass_regal_heavy_electronic_drums.07c51c3d.wav";
},{}],"assets/player-1-explosion-sprite.png":[function(require,module,exports) {
module.exports = "/player-1-explosion-sprite.cdda1d34.png";
},{}],"assets/boss-alien-explosion-sprite.png":[function(require,module,exports) {
module.exports = "/boss-alien-explosion-sprite.f217b16a.png";
},{}],"assets/upgrades/x2.png":[function(require,module,exports) {
module.exports = "/x2.3d6827c5.png";
},{}],"game.js":[function(require,module,exports) {
"use strict";

var _healthbar = _interopRequireDefault(require("./js/classes/healthbar.js"));
var _player = _interopRequireDefault(require("./js/classes/player.js"));
var _player2 = _interopRequireDefault(require("./assets/player.png"));
var _heart = _interopRequireDefault(require("./assets/heart.png"));
var _bullet = _interopRequireDefault(require("./assets/bullet.png"));
var _playerBullet = _interopRequireDefault(require("./assets/player-bullet.png"));
var _bossAlienBullet = _interopRequireDefault(require("./assets/boss-alien-bullet.png"));
var _alien = _interopRequireDefault(require("./assets/alien.png"));
var _bossAlien = _interopRequireDefault(require("./assets/boss-alien.png"));
var _space = _interopRequireDefault(require("./assets/space.png"));
var _explosion = _interopRequireDefault(require("./assets/sounds/explosion.wav"));
var _shoot = _interopRequireDefault(require("./assets/sounds/shoot.wav"));
var _impactScream = _interopRequireDefault(require("./assets/sounds/impact-scream.wav"));
var _drum_n_bass_regal_heavy_electronic_drums = _interopRequireDefault(require("./assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav"));
var _player1ExplosionSprite = _interopRequireDefault(require("./assets/player-1-explosion-sprite.png"));
var _bossAlienExplosionSprite = _interopRequireDefault(require("./assets/boss-alien-explosion-sprite.png"));
var _x = _interopRequireDefault(require("./assets/upgrades/x2.png"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); } // Classes
// Images
// Sounds
// Music
// Sprites
// Upgrades
var config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 900,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var params = new URLSearchParams(window.location.search);
var gameSettings = {
  playerSpeed: 330,
  playerWeapon: "bullets",
  playerHealth: 3,
  regularAliens: params.get("regularAliens") ? params.get("regularAliens") : 11
};
var game = new Phaser.Game(config);
var player;
var cursors;
var alienBullets;
var playerBullets;
var upgrades;
var bg;
var explosionSound;
var shootSound;
var playerDeadSound;
var level1Music;
var bossAlien;
var allowRestart = false;
function preload() {
  this.load.image("player", _player2.default);
  this.load.image("heart", _heart.default);
  this.load.image("bullet", _bullet.default);
  this.load.image("playerBullet", _playerBullet.default);
  this.load.image("alien", _alien.default);
  this.load.image("bossAlien", _bossAlien.default);
  this.load.image("bossAlienBullet", _bossAlienBullet.default);
  this.load.image("space", _space.default);
  this.load.image("x2Upgrade", _x.default);
  this.load.audio("explosionSound", _explosion.default);
  this.load.audio("shootSound", _shoot.default);
  this.load.audio("impactScreamSound", _impactScream.default);
  this.load.audio("level1Music", _drum_n_bass_regal_heavy_electronic_drums.default);
  this.load.spritesheet("player-1-explosion", _player1ExplosionSprite.default, {
    frameWidth: 230,
    frameHeight: 125,
    endFrame: 9
  });
  this.load.spritesheet("boss-alien-explosion", _bossAlienExplosionSprite.default, {
    frameWidth: 600,
    frameHeight: 420,
    endFrame: 10
  });
}
function create() {
  /*
   * SCENE
   */
  bg = this.add.tileSprite(0, 0, 1500, 900, "space");
  bg.setOrigin(0, 0);
  player = new _player.default(this, config.width / 2, config.height - 150, gameSettings.playerSpeed, gameSettings.playerWeapon, gameSettings.playerHealth);

  /*
   * MISC SPRITES
   */
  cursors = this.input.keyboard.createCursorKeys();
  alienBullets = this.physics.add.group();
  playerBullets = this.physics.add.group();

  /*
   * ALIENS
   */
  var Alien = /*#__PURE__*/function (_Phaser$Physics$Arcad) {
    _inherits(Alien, _Phaser$Physics$Arcad);
    var _super = _createSuper(Alien);
    function Alien(scene, texture, shootDelay, movementSpeed, spawning) {
      var _this;
      _classCallCheck(this, Alien);
      _this = _super.call(this, scene, 0, 0, texture);
      _this.scene = scene;
      _this.shootDelay = shootDelay;
      _this.movementSpeed = movementSpeed;
      _this.spawning = spawning;
      // Add this to the physics system
      _this.scene.physics.world.enable(_assertThisInitialized(_this));
      // Initialize shooting and moving
      if (!_this.spawning) {
        _this.startShooting();
      }
      if (!_this.spawning) _this.startMoving();
      _this.dropUpgrade = {
        x2: function x2() {
          var upgrade = upgrades.create(_this.x, _this.y, "x2Upgrade");
          upgrade.enable = function (player) {
            player.setSpeed(gameSettings.playerSpeed * 1.5);
            player.setWeapons("double-bullets");
          };
          upgrade.expire = function (player) {
            player.setSpeed(gameSettings.playerSpeed);
            player.setWeapons("bullets");
          };
          upgrade.setVelocityY(200);
        }
      };
      return _this;
    }
    _createClass(Alien, [{
      key: "setup",
      value: function setup(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        //this.setCollideWorldBounds(true); TOOD: implement
      }
    }, {
      key: "startShooting",
      value: function startShooting() {
        var _this2 = this;
        if (params.get("noAlienShooting")) return;
        var shoot = function shoot() {
          var bullet = alienBullets.create(_this2.x, _this2.y + _this2.height / 2, "bullet");
          bullet.setVelocityY(300);
          if (_this2.active) {
            _this2.nextShootEvent = _this2.scene.time.delayedCall(Phaser.Math.Between(350, _this2.shootDelay), shoot, [], _this2);
          }
        };

        // Add an initial delay before the first shot
        var initialDelay = Phaser.Math.Between(0, this.shootDelay);
        this.nextShootEvent = this.scene.time.delayedCall(initialDelay, shoot, [], this);
      }
    }, {
      key: "startMoving",
      value: function startMoving() {
        var _this3 = this;
        var move = function move() {
          if (!_this3.active) return;
          var direction = Phaser.Math.Between(-1, 1);
          var distance = Phaser.Math.Between(0, 100);

          // calculate the target x position
          var target = _this3.x + direction * distance;
          if (target > _this3.scene.game.config.width - _this3.width || target < 0) {
            target = _this3.x;
          }
          var targets;
          if (_this3.healthBar) {
            targets = [_this3, _this3.healthBar.bar];
          } else {
            targets = [_this3];
          }

          // Create a tween that changes the x position of the alien
          _this3.scene.tweens.add({
            targets: targets,
            x: target,
            duration: _this3.movementSpeed,
            // random duration between 500ms and 1500ms
            ease: "Linear",
            // use linear easing
            onComplete: _this3.active ? move : null // call this function again once the tween completes
          });
        };

        var movementDelay = Phaser.Math.Between(0, this.movementSpeed);
        this.nextMoveEvent = this.scene.time.delayedCall(movementDelay, move, [], this);
      }
    }]);
    return Alien;
  }(Phaser.Physics.Arcade.Sprite);
  var RegularAlien = /*#__PURE__*/function (_Alien) {
    _inherits(RegularAlien, _Alien);
    var _super2 = _createSuper(RegularAlien);
    function RegularAlien(scene) {
      _classCallCheck(this, RegularAlien);
      return _super2.call(this, scene, "alien", 4300, 1200);
    }
    return _createClass(RegularAlien);
  }(Alien);
  var BossAlien = /*#__PURE__*/function (_Alien2) {
    _inherits(BossAlien, _Alien2);
    var _super3 = _createSuper(BossAlien);
    function BossAlien(scene) {
      var _this4;
      _classCallCheck(this, BossAlien);
      _this4 = _super3.call(this, scene, "bossAlien", 1800, 400, true);
      _this4.life = 20;
      _this4.healthBar = new _healthbar.default(_this4.scene, _this4.x - 41, _this4.y + 40, _this4.life);
      return _this4;
    }

    // Set the starting position of the boss alien
    _createClass(BossAlien, [{
      key: "setup",
      value: function setup(x, y) {
        var _this5 = this;
        this.setPosition(x, -100);
        this.spawning = true;
        // move the bossalien into position
        this.scene.tweens.add({
          targets: this,
          y: y,
          duration: 1300,
          ease: "Linear",
          // use linear easing
          onComplete: function onComplete() {
            _this5.startMoving();
            _this5.startShooting();
            _this5.spawning = false;
          }
        });
        this.setActive(true);
        this.setVisible(true);
      }
    }, {
      key: "setLife",
      value: function setLife(value) {
        this.healthBar.decrease(this.life - value);
        this.life = value;
      }
    }, {
      key: "startShooting",
      value: function startShooting() {
        var _this6 = this;
        if (params.get("noAlienShooting")) return;
        var shoot = function shoot() {
          if (!_this6.active) return;
          var bossAlienBullet = alienBullets.create(_this6.x, _this6.y + _this6.height / 2 - 70, "bossAlienBullet");

          // Determine the angle towards the target
          var angle = Phaser.Math.Angle.Between(_this6.x, _this6.y, player.sprite.x, player.sprite.y);

          // Determine the speed of movement
          var speed = 350;

          // Determine the x and y velocities
          var velocityX = speed * Math.cos(angle);
          var velocityY = speed * Math.sin(angle);

          // Set these velocities
          bossAlienBullet.setVelocity(velocityX, velocityY);
          if (_this6.active) {
            _this6.nextShootEvent = _this6.scene.time.delayedCall(Phaser.Math.Between(270, _this6.shootDelay), shoot, [], _this6);
          }
        };
        shoot();
      }
    }]);
    return BossAlien;
  }(Alien); // Create the aliens
  var regularAliens = this.physics.add.group({
    classType: RegularAlien
  });
  for (var i = 0; i < gameSettings.regularAliens; i++) {
    var alien = regularAliens.get();
    alien.setup(100 + 130 * i, 100);
  }

  /*
   * UPGRADES
   */

  upgrades = this.physics.add.group();

  /*
   * SOUNDS
   */
  explosionSound = this.sound.add("explosionSound");
  shootSound = this.sound.add("shootSound");
  playerDeadSound = this.sound.add("impactScreamSound");

  /*
   *
   * DEVELOPMENT TOOLS
   *
   * Enable these as query strings when needed
   * *
   */

  // Add music, unless the user said they don't want it
  if (params.get("noMusic") !== "true") {
    if (!level1Music) {
      level1Music = this.sound.add("level1Music");
      level1Music.setVolume(0.8);
      level1Music.play();
    }
  }
  if (params.get("dropUpgrades") === "true") {
    regularAliens.getChildren()[5].dropUpgrade.x2();
  }

  /*
   * ANIMATIONS
   */

  // Add animations
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("player-1-explosion", {
      start: 0,
      end: 8,
      first: 0
    }),
    frameRate: 23,
    repeat: 0,
    hideOnComplete: true
  });
  this.anims.create({
    key: "bossAlienExplode",
    frames: this.anims.generateFrameNumbers("boss-alien-explosion", {
      start: 0,
      end: 10,
      first: 0
    }),
    frameRate: 23,
    repeat: 0,
    hideOnComplete: true
  });

  /*
   * OVERLAPS
   */

  // When a player bullet hits an alien (or later, a boss alien)
  this.physics.add.overlap(playerBullets, regularAliens, function (playerBullet, alien) {
    playerBullet.destroy();
    explosionSound.play();
    if (alien.nextShootEvent) {
      alien.nextShootEvent.remove();
    }
    alien.destroy();

    // Drop an upgrade
    var dropUpgradeChance = Phaser.Math.Between(0, 100);
    if (dropUpgradeChance > 80) {
      alien.dropUpgrade.x2();
    }

    // Let's see if all regular aliens are dead
    var aliensAlive = false;
    regularAliens.getChildren().forEach(function (alien) {
      if (alien.active) {
        aliensAlive = true;
      }
    });
    if (aliensAlive === false && player.sprite.active) {
      var bossAlienGroup = this.physics.add.group({
        classType: BossAlien
      });
      bossAlien = bossAlienGroup.get();
      bossAlien.setup(config.width / 2, 170);

      // If the player hits the boss alien
      this.physics.add.overlap(bossAlien, playerBullets, function (bossAlien, playerBullet) {
        // Don't allow shooting the boss while it's spawning

        playerBullet.destroy();
        if (bossAlien.spawning) return;
        bossAlien.setLife(bossAlien.life - 1);
        if (bossAlien.life === 0 && player.sprite.active) {
          bossAlien.destroy();
          bossAlien.healthBar.bar.destroy();
          this.physics.add.sprite(bossAlien.x, bossAlien.y, "bossAlienExplode").play("bossAlienExplode");
          explosionSound.play();

          // Show "You win" text
          var text = this.add.text(0, 0, "You win!", {
            font: '64px "Arial Black"',
            fill: "#fff"
          }).setOrigin(0.5, 0.5).setPosition(config.width / 2, config.height / 2).setVisible(false);
          this.time.delayedCall(900, function () {
            text.setVisible(true); // after 300ms, the text becomes visible
          }, [], this);
        }
      }, null, this);
    }
  }, null, this);

  // When the player is hit by an alien bullet
  this.physics.add.overlap(player.sprite, alienBullets, function (playerSprite, alienBullet) {
    playerSprite.player.decreaseLife(1);
    alienBullet.destroy();
    playerDeadSound.play();
    if (player.health > 0) return;
    alienBullet.destroy();
    var explosion = this.physics.add.sprite(playerSprite.x, playerSprite.y, "explosion");
    explosion.play("explode");
    player.destroy();
    var youLoseText = this.add.text(0, 0, "You lose", {
      font: '64px "Arial Black"',
      fill: "#fff"
    }).setOrigin(0.5, 0.5).setPosition(config.width / 2, config.height / 2).setVisible(false);
    var spaceToRestartText = this.add.text(0, 0, "Hit <Space> to restart", {
      font: '34px "Arial Black"',
      fill: "#fff"
    }).setOrigin(0.5, 0.5).setPosition(config.width / 2, config.height / 2 + 100).setVisible(false);
    this.time.delayedCall(600, function () {
      youLoseText.setVisible(true);
    }, [], this);
    this.time.delayedCall(2100, function () {
      spaceToRestartText.setVisible(true);
      allowRestart = true;
    }, [], this);
  }, null, this);

  // When the player picks up an upgrade
  this.physics.add.overlap(player.sprite, upgrades, function (playerSprite, upgrade) {
    upgrade.enable(playerSprite.player);
    upgrade.destroy();
    this.time.delayedCall(3500, function () {
      upgrade.expire(playerSprite.player);
    }, [], this);
  }, null, this);
}
function update() {
  // Move using the arrow keys
  if (player.sprite.active) {
    if (cursors.left.isDown) {
      player.setVelocityX(-player.speed);
    } else if (cursors.right.isDown) {
      player.setVelocityX(player.speed);
    } else if (cursors.down.isDown) {
      player.setVelocityY(player.speed);
    } else if (cursors.up.isDown) {
      player.setVelocityY(-player.speed);
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
    }
  }

  // Shoot using the space bar
  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    if (player.sprite.active) {
      if (player.weapon === "bullets") {
        var playerBullet = playerBullets.create(player.sprite.x, player.sprite.y - player.sprite.height + 40, "playerBullet");
        playerBullet.setVelocityY(-player.speed);
        shootSound.play();
      } else if (player.weapon === "double-bullets") {
        var playerBullet1 = playerBullets.create(player.sprite.x - 20, player.sprite.y - player.sprite.height + 40, "playerBullet");
        playerBullet1.setVelocityY(-player.speed);
        var playerBullet2 = playerBullets.create(player.sprite.x + 20, player.sprite.y - player.sprite.height + 40, "playerBullet");
        playerBullet2.setVelocityY(-player.speed);
        shootSound.play();
      }
    } else {
      if (allowRestart) {
        // Restart the game
        allowRestart = false;
        this.scene.restart();
      }
    }
  }

  // Move the texture of the tile sprite upwards
  bg.tilePositionY -= 1.1;
}
},{"./js/classes/healthbar.js":"js/classes/healthbar.js","./js/classes/player.js":"js/classes/player.js","./assets/player.png":"assets/player.png","./assets/heart.png":"assets/heart.png","./assets/bullet.png":"assets/bullet.png","./assets/player-bullet.png":"assets/player-bullet.png","./assets/boss-alien-bullet.png":"assets/boss-alien-bullet.png","./assets/alien.png":"assets/alien.png","./assets/boss-alien.png":"assets/boss-alien.png","./assets/space.png":"assets/space.png","./assets/sounds/explosion.wav":"assets/sounds/explosion.wav","./assets/sounds/shoot.wav":"assets/sounds/shoot.wav","./assets/sounds/impact-scream.wav":"assets/sounds/impact-scream.wav","./assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav":"assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav","./assets/player-1-explosion-sprite.png":"assets/player-1-explosion-sprite.png","./assets/boss-alien-explosion-sprite.png":"assets/boss-alien-explosion-sprite.png","./assets/upgrades/x2.png":"assets/upgrades/x2.png"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54132" + '/');
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
      });

      // Enable HMR for CSS by default.
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
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.js"], null)
//# sourceMappingURL=/game.7bbe06d5.js.map