(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', './Table', './Row', './Cell', 'nodeproxy', 'element-resize-event'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('./Table'), require('./Row'), require('./Cell'), require('nodeproxy'), require('element-resize-event'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.Table, global.Row, global.Cell, global.nodeproxy, global.elementResizeEvent);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _Table, _Row, _Cell, proxy, elementResizeEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Cell = exports.Row = exports.Table = exports.StickyTable = undefined;

  var _react2 = _interopRequireDefault(_react);

  var _Table2 = _interopRequireDefault(_Table);

  var _Row2 = _interopRequireDefault(_Row);

  var _Cell2 = _interopRequireDefault(_Cell);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var StickyTable = function (_Component) {
    _inherits(StickyTable, _Component);

    function StickyTable(props) {
      _classCallCheck(this, StickyTable);

      var _this = _possibleConstructorReturn(this, (StickyTable.__proto__ || Object.getPrototypeOf(StickyTable)).call(this, props));

      _this.id = Math.floor(Math.random() * 1000000000) + '';

      _this.rowCount = 0;
      _this.columnCount = 0;

      _this.onResize = _this.onResize.bind(_this);
      _this.onColumnResize = _this.onColumnResize.bind(_this);
      _this.onScroll = _this.onScroll.bind(_this);
      return _this;
    }

    _createClass(StickyTable, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.table = document.getElementById('sticky-table-' + this.id);

        if (this.table) {
          this.table.querySelector('#sticky-table-x-wrapper').addEventListener('scroll', this.onScroll);

          elementResizeEvent(this.table.querySelector('#sticky-column'), this.onColumnResize);
          elementResizeEvent(this.table.querySelector('#sticky-table-x-wrapper').firstChild, this.onResize);

          this.setRowHeights();
          this.setColumnWidths();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.table) {
          this.table.querySelector('#sticky-table-x-wrapper').removeEventListener('scroll', this.handleScrollX);
        }
      }
    }, {
      key: 'onScroll',
      value: function onScroll() {
        var scrollLeft = this.table.querySelector('#sticky-table-x-wrapper').scrollLeft;

        this.table.querySelector('#sticky-header').style.left = -1 * scrollLeft + 'px';
      }
    }, {
      key: 'onResize',
      value: function onResize() {
        this.setRowHeights();
        this.setColumnWidths();
      }
    }, {
      key: 'onColumnResize',
      value: function onColumnResize() {
        var columnCell = this.table.querySelector('#sticky-column').firstChild.firstChild.childNodes[0];
        var cell = this.table.querySelector('#sticky-table-x-wrapper').firstChild.firstChild.firstChild;
        var dims = this.getSizeWithoutBoxSizing(columnCell);

        if (cell) {
          cell.style.width = dims.width + 'px';
          cell.style.minWidth = dims.width + 'px';
          //cell.style.height = dims.height + 'px';
          //cell.style.minHeight = dims.height + 'px';
        }

        this.onResize();
      }
    }, {
      key: 'setRowHeights',
      value: function setRowHeights() {
        var r, cellToCopy, height;

        for (r = 0; r < this.rowCount; r++) {
          cellToCopy = this.table.querySelector('#sticky-table-x-wrapper').firstChild.childNodes[r].firstChild;

          if (cellToCopy) {
            height = this.getSizeWithoutBoxSizing(cellToCopy).height;

            this.table.querySelector('#sticky-column').firstChild.childNodes[r].firstChild.style.height = height + 'px';
          }
        }
      }
    }, {
      key: 'setColumnWidths',
      value: function setColumnWidths() {
        var c, cellToCopy, cellStyle, width, cell;

        for (c = 0; c < this.columnCount; c++) {
          cellToCopy = this.table.querySelector('#sticky-table-x-wrapper').firstChild.firstChild.childNodes[c];

          if (cellToCopy) {
            width = this.getSizeWithoutBoxSizing(cellToCopy).width;
            cell = this.table.querySelector('#sticky-header-cell-' + c);

            cell.style.width = width + 'px';
            cell.style.minWidth = width + 'px';
          }
        }
      }
    }, {
      key: 'getStickyColumn',
      value: function getStickyColumn(rows) {
        var cells;
        var stickyRows = [];

        rows.forEach(proxy(function (row, r) {
          cells = row.props.children;

          stickyRows.push(_react2.default.createElement(
            _Row2.default,
            _extends({}, row.props, { id: '', key: r }),
            cells[0]
          ));
        }, this));

        return stickyRows;
      }
    }, {
      key: 'getStickyHeader',
      value: function getStickyHeader(rows) {
        var row = rows[0];
        var cells = [];

        row.props.children.forEach(function (cell, c) {
          cells.push(_react2.default.cloneElement(cell, { id: 'sticky-header-cell-' + c, style: {} }));
        });

        return _react2.default.createElement(
          _Row2.default,
          _extends({}, row.props, { id: 'sticky-header-row' }),
          cells
        );
      }
    }, {
      key: 'getStyle',
      value: function getStyle(node) {
        var browserSupportsComputedStyle = typeof getComputedStyle !== 'undefined';

        return browserSupportsComputedStyle ? getComputedStyle(node, null) : node.currentStyle;
      }
    }, {
      key: 'getSizeWithoutBoxSizing',
      value: function getSizeWithoutBoxSizing(node) {
        var nodeStyle = this.getStyle(node);
        var width = node.clientWidth - parseFloat(nodeStyle.paddingLeft) - parseFloat(nodeStyle.paddingRight);

        var height = node.clientHeight - parseFloat(nodeStyle.paddingTop) - parseFloat(nodeStyle.paddingBottom);

        return { width: width, height: height };
      }
    }, {
      key: 'render',
      value: function render() {
        var rows = _react2.default.Children.toArray(this.props.children);
        var stickyColumn, stickyHeader;

        this.rowCount = rows.length;
        this.columnCount = rows[0] && rows[0].props.children.length || 0;

        if (rows.length) {
          stickyColumn = this.getStickyColumn(rows);
          stickyHeader = this.getStickyHeader(rows);
        }

        return _react2.default.createElement(
          'div',
          { className: 'sticky-table ' + (this.props.className || ''), id: 'sticky-table-' + this.id },
          _react2.default.createElement(
            'div',
            { className: 'sticky-header', id: 'sticky-header' },
            _react2.default.createElement(
              _Table2.default,
              null,
              stickyHeader
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'sticky-table-y-wrapper', id: 'sticky-table-y-wrapper' },
            _react2.default.createElement(
              'div',
              { className: 'sticky-column', id: 'sticky-column' },
              _react2.default.createElement(
                _Table2.default,
                null,
                stickyColumn
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'sticky-table-x-wrapper', id: 'sticky-table-x-wrapper' },
              _react2.default.createElement(
                _Table2.default,
                null,
                rows
              )
            )
          )
        );
      }
    }]);

    return StickyTable;
  }(_react.Component);

  StickyTable.propTypes = {
    rowCount: _react.PropTypes.number, //Including header
    columnCount: _react.PropTypes.number
  };

  exports.StickyTable = StickyTable;
  exports.Table = _Table2.default;
  exports.Row = _Row2.default;
  exports.Cell = _Cell2.default;
});