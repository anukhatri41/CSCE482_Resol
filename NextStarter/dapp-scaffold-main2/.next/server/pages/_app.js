"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./node_modules/next/dist/pages/_app.js":
/*!**********************************************!*\
  !*** ./node_modules/next/dist/pages/_app.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nObject.defineProperty(exports, \"AppInitialProps\", ({\n  enumerable: true,\n  get: function () {\n    return _utils.AppInitialProps;\n  }\n}));\nObject.defineProperty(exports, \"NextWebVitalsMetric\", ({\n  enumerable: true,\n  get: function () {\n    return _utils.NextWebVitalsMetric;\n  }\n}));\nexports[\"default\"] = void 0;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _utils = __webpack_require__(/*! ../shared/lib/utils */ \"../utils\");\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {\n  try {\n    var info = gen[key](arg);\n    var value = info.value;\n  } catch (error) {\n    reject(error);\n    return;\n  }\n\n  if (info.done) {\n    resolve(value);\n  } else {\n    Promise.resolve(value).then(_next, _throw);\n  }\n}\n\nfunction _asyncToGenerator(fn) {\n  return function () {\n    var self = this,\n        args = arguments;\n    return new Promise(function (resolve, reject) {\n      var gen = fn.apply(self, args);\n\n      function _next(value) {\n        asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value);\n      }\n\n      function _throw(err) {\n        asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err);\n      }\n\n      _next(undefined);\n    });\n  };\n}\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : {\n    default: obj\n  };\n}\n\nfunction appGetInitialProps(_) {\n  return _appGetInitialProps.apply(this, arguments);\n}\n\nfunction _appGetInitialProps() {\n  _appGetInitialProps =\n  /**\n  * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.\n  * This allows for keeping state between navigation, custom error handling, injecting additional data.\n  */\n  _asyncToGenerator(function* ({\n    Component,\n    ctx\n  }) {\n    const pageProps = yield (0, _utils).loadGetInitialProps(Component, ctx);\n    return {\n      pageProps\n    };\n  });\n  return _appGetInitialProps.apply(this, arguments);\n}\n\nclass App extends _react.default.Component {\n  render() {\n    const {\n      Component,\n      pageProps\n    } = this.props;\n    return /*#__PURE__*/_react.default.createElement(Component, Object.assign({}, pageProps));\n  }\n\n}\n\nexports[\"default\"] = App;\nApp.origGetInitialProps = appGetInitialProps;\nApp.getInitialProps = appGetInitialProps;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L3BhZ2VzL19hcHAuanMuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBQ2JBLDhDQUE2QztBQUN6Q0csRUFBQUEsS0FBSyxFQUFFO0FBRGtDLENBQTdDO0FBR0FILG1EQUFrRDtBQUM5Q0ksRUFBQUEsVUFBVSxFQUFFLElBRGtDO0FBRTlDQyxFQUFBQSxHQUFHLEVBQUUsWUFBVztBQUNaLFdBQU9DLE1BQU0sQ0FBQ0MsZUFBZDtBQUNIO0FBSjZDLENBQWxEO0FBTUFQLHVEQUFzRDtBQUNsREksRUFBQUEsVUFBVSxFQUFFLElBRHNDO0FBRWxEQyxFQUFBQSxHQUFHLEVBQUUsWUFBVztBQUNaLFdBQU9DLE1BQU0sQ0FBQ0UsbUJBQWQ7QUFDSDtBQUppRCxDQUF0RDtBQU1BTixrQkFBQSxHQUFrQixLQUFLLENBQXZCOztBQUNBLElBQUlRLE1BQU0sR0FBR0Msc0JBQXNCLENBQUNDLG1CQUFPLENBQUMsb0JBQUQsQ0FBUixDQUFuQzs7QUFDQSxJQUFJTixNQUFNLEdBQUdNLG1CQUFPLENBQUMscUNBQUQsQ0FBcEI7O0FBQ0EsU0FBU0Msa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxPQUFqQyxFQUEwQ0MsTUFBMUMsRUFBa0RDLEtBQWxELEVBQXlEQyxNQUF6RCxFQUFpRUMsR0FBakUsRUFBc0VDLEdBQXRFLEVBQTJFO0FBQ3ZFLE1BQUk7QUFDQSxRQUFJQyxJQUFJLEdBQUdQLEdBQUcsQ0FBQ0ssR0FBRCxDQUFILENBQVNDLEdBQVQsQ0FBWDtBQUNBLFFBQUlqQixLQUFLLEdBQUdrQixJQUFJLENBQUNsQixLQUFqQjtBQUNILEdBSEQsQ0FHRSxPQUFPbUIsS0FBUCxFQUFjO0FBQ1pOLElBQUFBLE1BQU0sQ0FBQ00sS0FBRCxDQUFOO0FBQ0E7QUFDSDs7QUFDRCxNQUFJRCxJQUFJLENBQUNFLElBQVQsRUFBZTtBQUNYUixJQUFBQSxPQUFPLENBQUNaLEtBQUQsQ0FBUDtBQUNILEdBRkQsTUFFTztBQUNIcUIsSUFBQUEsT0FBTyxDQUFDVCxPQUFSLENBQWdCWixLQUFoQixFQUF1QnNCLElBQXZCLENBQTRCUixLQUE1QixFQUFtQ0MsTUFBbkM7QUFDSDtBQUNKOztBQUNELFNBQVNRLGlCQUFULENBQTJCQyxFQUEzQixFQUErQjtBQUMzQixTQUFPLFlBQVc7QUFDZCxRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUFBLFFBQWlCQyxJQUFJLEdBQUdDLFNBQXhCO0FBQ0EsV0FBTyxJQUFJTixPQUFKLENBQVksVUFBU1QsT0FBVCxFQUFrQkMsTUFBbEIsRUFBMEI7QUFDekMsVUFBSUYsR0FBRyxHQUFHYSxFQUFFLENBQUNJLEtBQUgsQ0FBU0gsSUFBVCxFQUFlQyxJQUFmLENBQVY7O0FBQ0EsZUFBU1osS0FBVCxDQUFlZCxLQUFmLEVBQXNCO0FBQ2xCVSxRQUFBQSxrQkFBa0IsQ0FBQ0MsR0FBRCxFQUFNQyxPQUFOLEVBQWVDLE1BQWYsRUFBdUJDLEtBQXZCLEVBQThCQyxNQUE5QixFQUFzQyxNQUF0QyxFQUE4Q2YsS0FBOUMsQ0FBbEI7QUFDSDs7QUFDRCxlQUFTZSxNQUFULENBQWdCYyxHQUFoQixFQUFxQjtBQUNqQm5CLFFBQUFBLGtCQUFrQixDQUFDQyxHQUFELEVBQU1DLE9BQU4sRUFBZUMsTUFBZixFQUF1QkMsS0FBdkIsRUFBOEJDLE1BQTlCLEVBQXNDLE9BQXRDLEVBQStDYyxHQUEvQyxDQUFsQjtBQUNIOztBQUNEZixNQUFBQSxLQUFLLENBQUNnQixTQUFELENBQUw7QUFDSCxLQVRNLENBQVA7QUFVSCxHQVpEO0FBYUg7O0FBQ0QsU0FBU3RCLHNCQUFULENBQWdDdUIsR0FBaEMsRUFBcUM7QUFDakMsU0FBT0EsR0FBRyxJQUFJQSxHQUFHLENBQUNDLFVBQVgsR0FBd0JELEdBQXhCLEdBQThCO0FBQ2pDekIsSUFBQUEsT0FBTyxFQUFFeUI7QUFEd0IsR0FBckM7QUFHSDs7QUFDRCxTQUFTRSxrQkFBVCxDQUE0QkMsQ0FBNUIsRUFBK0I7QUFDM0IsU0FBT0MsbUJBQW1CLENBQUNQLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDRCxTQUFoQyxDQUFQO0FBQ0g7O0FBQ0QsU0FBU1EsbUJBQVQsR0FBK0I7QUFDM0JBLEVBQUFBLG1CQUFtQjtBQUFHO0FBQzFCO0FBQ0E7QUFDQTtBQUFJWixFQUFBQSxpQkFBaUIsQ0FBQyxXQUFVO0FBQUVhLElBQUFBLFNBQUY7QUFBY0MsSUFBQUE7QUFBZCxHQUFWLEVBQWdDO0FBQzlDLFVBQU1DLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBR25DLE1BQUosRUFBWW9DLG1CQUFaLENBQWdDSCxTQUFoQyxFQUEyQ0MsR0FBM0MsQ0FBeEI7QUFDQSxXQUFPO0FBQ0hDLE1BQUFBO0FBREcsS0FBUDtBQUdILEdBTGdCLENBSGpCO0FBU0EsU0FBT0gsbUJBQW1CLENBQUNQLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDRCxTQUFoQyxDQUFQO0FBQ0g7O0FBQ0QsTUFBTWEsR0FBTixTQUFrQmpDLE1BQU0sQ0FBQ0QsT0FBUCxDQUFlOEIsU0FBakMsQ0FBMkM7QUFDdkNLLEVBQUFBLE1BQU0sR0FBRztBQUNMLFVBQU07QUFBRUwsTUFBQUEsU0FBRjtBQUFjRSxNQUFBQTtBQUFkLFFBQTZCLEtBQUtJLEtBQXhDO0FBQ0EsV0FBTyxhQUFjbkMsTUFBTSxDQUFDRCxPQUFQLENBQWVxQyxhQUFmLENBQTZCUCxTQUE3QixFQUF3Q3ZDLE1BQU0sQ0FBQytDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTixTQUFsQixDQUF4QyxDQUFyQjtBQUNIOztBQUpzQzs7QUFNM0N2QyxrQkFBQSxHQUFrQnlDLEdBQWxCO0FBQ0FBLEdBQUcsQ0FBQ0ssbUJBQUosR0FBMEJaLGtCQUExQjtBQUNBTyxHQUFHLENBQUNNLGVBQUosR0FBc0JiLGtCQUF0QiIsInNvdXJjZXMiOlsid2VicGFjazovL3NvbGFuYS1kYXBwLW5leHQvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L3BhZ2VzL19hcHAuanM/OTYxZCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkFwcEluaXRpYWxQcm9wc1wiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3V0aWxzLkFwcEluaXRpYWxQcm9wcztcbiAgICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIk5leHRXZWJWaXRhbHNNZXRyaWNcIiwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5OZXh0V2ViVml0YWxzTWV0cmljO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xudmFyIF9yZWFjdCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcInJlYWN0XCIpKTtcbnZhciBfdXRpbHMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2xpYi91dGlsc1wiKTtcbmZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgICB9XG59XG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICAgIGRlZmF1bHQ6IG9ialxuICAgIH07XG59XG5mdW5jdGlvbiBhcHBHZXRJbml0aWFsUHJvcHMoXykge1xuICAgIHJldHVybiBfYXBwR2V0SW5pdGlhbFByb3BzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5mdW5jdGlvbiBfYXBwR2V0SW5pdGlhbFByb3BzKCkge1xuICAgIF9hcHBHZXRJbml0aWFsUHJvcHMgPSAvKipcbiAqIGBBcHBgIGNvbXBvbmVudCBpcyB1c2VkIGZvciBpbml0aWFsaXplIG9mIHBhZ2VzLiBJdCBhbGxvd3MgZm9yIG92ZXJ3cml0aW5nIGFuZCBmdWxsIGNvbnRyb2wgb2YgdGhlIGBwYWdlYCBpbml0aWFsaXphdGlvbi5cbiAqIFRoaXMgYWxsb3dzIGZvciBrZWVwaW5nIHN0YXRlIGJldHdlZW4gbmF2aWdhdGlvbiwgY3VzdG9tIGVycm9yIGhhbmRsaW5nLCBpbmplY3RpbmcgYWRkaXRpb25hbCBkYXRhLlxuICovIF9hc3luY1RvR2VuZXJhdG9yKGZ1bmN0aW9uKih7IENvbXBvbmVudCAsIGN0eCAgfSkge1xuICAgICAgICBjb25zdCBwYWdlUHJvcHMgPSB5aWVsZCAoMCwgX3V0aWxzKS5sb2FkR2V0SW5pdGlhbFByb3BzKENvbXBvbmVudCwgY3R4KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhZ2VQcm9wc1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBfYXBwR2V0SW5pdGlhbFByb3BzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5jbGFzcyBBcHAgZXh0ZW5kcyBfcmVhY3QuZGVmYXVsdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBDb21wb25lbnQgLCBwYWdlUHJvcHMgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgT2JqZWN0LmFzc2lnbih7fSwgcGFnZVByb3BzKSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFwcDtcbkFwcC5vcmlnR2V0SW5pdGlhbFByb3BzID0gYXBwR2V0SW5pdGlhbFByb3BzO1xuQXBwLmdldEluaXRpYWxQcm9wcyA9IGFwcEdldEluaXRpYWxQcm9wcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9X2FwcC5qcy5tYXAiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiX3V0aWxzIiwiQXBwSW5pdGlhbFByb3BzIiwiTmV4dFdlYlZpdGFsc01ldHJpYyIsImRlZmF1bHQiLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsImFzeW5jR2VuZXJhdG9yU3RlcCIsImdlbiIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV4dCIsIl90aHJvdyIsImtleSIsImFyZyIsImluZm8iLCJlcnJvciIsImRvbmUiLCJQcm9taXNlIiwidGhlbiIsIl9hc3luY1RvR2VuZXJhdG9yIiwiZm4iLCJzZWxmIiwiYXJncyIsImFyZ3VtZW50cyIsImFwcGx5IiwiZXJyIiwidW5kZWZpbmVkIiwib2JqIiwiX19lc01vZHVsZSIsImFwcEdldEluaXRpYWxQcm9wcyIsIl8iLCJfYXBwR2V0SW5pdGlhbFByb3BzIiwiQ29tcG9uZW50IiwiY3R4IiwicGFnZVByb3BzIiwibG9hZEdldEluaXRpYWxQcm9wcyIsIkFwcCIsInJlbmRlciIsInByb3BzIiwiY3JlYXRlRWxlbWVudCIsImFzc2lnbiIsIm9yaWdHZXRJbml0aWFsUHJvcHMiLCJnZXRJbml0aWFsUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/next/dist/pages/_app.js\n");

/***/ }),

/***/ "../utils":
/*!************************************************!*\
  !*** external "next/dist/shared/lib/utils.js" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./node_modules/next/dist/pages/_app.js"));
module.exports = __webpack_exports__;

})();