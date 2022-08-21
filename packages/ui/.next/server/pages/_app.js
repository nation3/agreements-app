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

/***/ "./components/Nation3Wrapper.tsx":
/*!***************************************!*\
  !*** ./components/Nation3Wrapper.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @heroicons/react/outline */ \"@heroicons/react/outline\");\n/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _nation3_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nation3/components */ \"@nation3/components\");\n/* harmony import */ var _nation3_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nation3_components__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(wagmi__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction Nation3Wrapper({ children  }) {\n    const { address , connector  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useAccount)();\n    const { connect , connectors  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useConnect)();\n    const { disconnect  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useDisconnect)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_nation3_components__WEBPACK_IMPORTED_MODULE_2__.Nation3App, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_nation3_components__WEBPACK_IMPORTED_MODULE_2__.DefaultLayout, {\n            sidebar: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_nation3_components__WEBPACK_IMPORTED_MODULE_2__.DefaultSidebar, {\n                onConnect: (connector)=>{\n                    connect({\n                        connector: connectors.find((i)=>i.name === connector.name)\n                    });\n                },\n                logo: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                    src: \"/logo.svg\",\n                    alt: \"Nation3 Logo\"\n                }, void 0, false, void 0, void 0),\n                onRoute: console.log,\n                navLinks: [\n                    {\n                        route: \"/\",\n                        icon: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1__.ViewGridIcon, {\n                            className: \"w-5 h-5\"\n                        }, void 0, false, void 0, void 0),\n                        name: \"Start\",\n                        isActive: true\n                    }, \n                ],\n                connectors: connectors.map((connector)=>({\n                        ...connector\n                    })),\n                account: address && connector ? {\n                    address,\n                    connector\n                } : undefined,\n                onDisconnect: disconnect\n            }, void 0, false, void 0, void 0),\n            children: children\n        }, void 0, false, {\n            fileName: \"/Users/greg/Desktop/Nation3/court/packages/ui/components/Nation3Wrapper.tsx\",\n            lineNumber: 16,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/greg/Desktop/Nation3/court/packages/ui/components/Nation3Wrapper.tsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Nation3Wrapper);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL05hdGlvbjNXcmFwcGVyLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUF3RDtBQUN3QjtBQUNsQjtBQUU5RCxTQUFTTyxjQUFjLENBQUMsRUFDdEJDLFFBQVEsR0FHVCxFQUFFO0lBQ0QsTUFBTSxFQUFFQyxPQUFPLEdBQUVDLFNBQVMsR0FBRSxHQUFHTixpREFBVSxFQUFFO0lBQzNDLE1BQU0sRUFBRU8sT0FBTyxHQUFFQyxVQUFVLEdBQUUsR0FBR1AsaURBQVUsRUFBRTtJQUM1QyxNQUFNLEVBQUVRLFVBQVUsR0FBRSxHQUFHUCxvREFBYSxFQUFFO0lBRXRDLHFCQUNFLDhEQUFDTCwyREFBVTtrQkFDVCw0RUFBQ0MsOERBQWE7WUFDWlksT0FBTyxnQkFDTCw4REFBQ1gsK0RBQWM7Z0JBQ2JZLFNBQVMsRUFBRSxDQUFDTCxTQUFTLEdBQUs7b0JBQ3hCQyxPQUFPLENBQUM7d0JBQ05ELFNBQVMsRUFBRUUsVUFBVSxDQUFDSSxJQUFJLENBQUMsQ0FBQ0MsQ0FBQyxHQUFLQSxDQUFDLENBQUNDLElBQUksS0FBS1IsU0FBUyxDQUFDUSxJQUFJLENBQUM7cUJBQzdELENBQUMsQ0FBQztpQkFDSjtnQkFDREMsSUFBSSxnQkFBRSw4REFBQ0MsS0FBRztvQkFBQ0MsR0FBRyxFQUFDLFdBQVc7b0JBQUNDLEdBQUcsRUFBQyxjQUFjO2lEQUFHO2dCQUNoREMsT0FBTyxFQUFFQyxPQUFPLENBQUNDLEdBQUc7Z0JBQ3BCQyxRQUFRLEVBQUU7b0JBQ1I7d0JBQ0VDLEtBQUssRUFBRSxHQUFHO3dCQUNWQyxJQUFJLGdCQUFFLDhEQUFDNUIsa0VBQVk7NEJBQUM2QixTQUFTLEVBQUMsU0FBUzt5REFBRzt3QkFDMUNYLElBQUksRUFBRSxPQUFPO3dCQUNiWSxRQUFRLEVBQUUsSUFBSTtxQkFDZjtpQkFDRjtnQkFDRGxCLFVBQVUsRUFBRUEsVUFBVSxDQUFDbUIsR0FBRyxDQUFDLENBQUNyQixTQUFTLEdBQUssQ0FBQzt3QkFDekMsR0FBR0EsU0FBUztxQkFDYixDQUFDLENBQUM7Z0JBQ0hzQixPQUFPLEVBQ0x2QixPQUFPLElBQUlDLFNBQVMsR0FDaEI7b0JBQ0VELE9BQU87b0JBQ1BDLFNBQVM7aUJBQ1YsR0FDRHVCLFNBQVM7Z0JBRWZDLFlBQVksRUFBRXJCLFVBQVU7NkNBQ3hCO3NCQUdITCxRQUFROzs7OztnQkFDSzs7Ozs7WUFDTCxDQUNiO0NBQ0g7QUFFRCxpRUFBZUQsY0FBYyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmF0aW9uM2FwcC8uL2NvbXBvbmVudHMvTmF0aW9uM1dyYXBwZXIudHN4P2Y3MmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmlld0dyaWRJY29uIH0gZnJvbSBcIkBoZXJvaWNvbnMvcmVhY3Qvb3V0bGluZVwiO1xuaW1wb3J0IHsgTmF0aW9uM0FwcCwgRGVmYXVsdExheW91dCwgRGVmYXVsdFNpZGViYXIgfSBmcm9tIFwiQG5hdGlvbjMvY29tcG9uZW50c1wiO1xuaW1wb3J0IHsgdXNlQWNjb3VudCwgdXNlQ29ubmVjdCwgdXNlRGlzY29ubmVjdCB9IGZyb20gXCJ3YWdtaVwiO1xuXG5mdW5jdGlvbiBOYXRpb24zV3JhcHBlcih7XG4gIGNoaWxkcmVuLFxufToge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3RFbGVtZW50IHwgUmVhY3QuUmVhY3RFbGVtZW50W107XG59KSB7XG4gIGNvbnN0IHsgYWRkcmVzcywgY29ubmVjdG9yIH0gPSB1c2VBY2NvdW50KCk7XG4gIGNvbnN0IHsgY29ubmVjdCwgY29ubmVjdG9ycyB9ID0gdXNlQ29ubmVjdCgpO1xuICBjb25zdCB7IGRpc2Nvbm5lY3QgfSA9IHVzZURpc2Nvbm5lY3QoKTtcblxuICByZXR1cm4gKFxuICAgIDxOYXRpb24zQXBwPlxuICAgICAgPERlZmF1bHRMYXlvdXRcbiAgICAgICAgc2lkZWJhcj17XG4gICAgICAgICAgPERlZmF1bHRTaWRlYmFyXG4gICAgICAgICAgICBvbkNvbm5lY3Q9eyhjb25uZWN0b3IpID0+IHtcbiAgICAgICAgICAgICAgY29ubmVjdCh7XG4gICAgICAgICAgICAgICAgY29ubmVjdG9yOiBjb25uZWN0b3JzLmZpbmQoKGkpID0+IGkubmFtZSA9PT0gY29ubmVjdG9yLm5hbWUpLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBsb2dvPXs8aW1nIHNyYz1cIi9sb2dvLnN2Z1wiIGFsdD1cIk5hdGlvbjMgTG9nb1wiIC8+fVxuICAgICAgICAgICAgb25Sb3V0ZT17Y29uc29sZS5sb2d9XG4gICAgICAgICAgICBuYXZMaW5rcz17W1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcm91dGU6IFwiL1wiLFxuICAgICAgICAgICAgICAgIGljb246IDxWaWV3R3JpZEljb24gY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+LFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiU3RhcnRcIixcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgICBjb25uZWN0b3JzPXtjb25uZWN0b3JzLm1hcCgoY29ubmVjdG9yKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5jb25uZWN0b3IsXG4gICAgICAgICAgICB9KSl9XG4gICAgICAgICAgICBhY2NvdW50PXtcbiAgICAgICAgICAgICAgYWRkcmVzcyAmJiBjb25uZWN0b3JcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yLFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkRpc2Nvbm5lY3Q9e2Rpc2Nvbm5lY3R9XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L0RlZmF1bHRMYXlvdXQ+XG4gICAgPC9OYXRpb24zQXBwPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBOYXRpb24zV3JhcHBlcjtcbiJdLCJuYW1lcyI6WyJWaWV3R3JpZEljb24iLCJOYXRpb24zQXBwIiwiRGVmYXVsdExheW91dCIsIkRlZmF1bHRTaWRlYmFyIiwidXNlQWNjb3VudCIsInVzZUNvbm5lY3QiLCJ1c2VEaXNjb25uZWN0IiwiTmF0aW9uM1dyYXBwZXIiLCJjaGlsZHJlbiIsImFkZHJlc3MiLCJjb25uZWN0b3IiLCJjb25uZWN0IiwiY29ubmVjdG9ycyIsImRpc2Nvbm5lY3QiLCJzaWRlYmFyIiwib25Db25uZWN0IiwiZmluZCIsImkiLCJuYW1lIiwibG9nbyIsImltZyIsInNyYyIsImFsdCIsIm9uUm91dGUiLCJjb25zb2xlIiwibG9nIiwibmF2TGlua3MiLCJyb3V0ZSIsImljb24iLCJjbGFzc05hbWUiLCJpc0FjdGl2ZSIsIm1hcCIsImFjY291bnQiLCJ1bmRlZmluZWQiLCJvbkRpc2Nvbm5lY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/Nation3Wrapper.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ \"ethers\");\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(wagmi__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_Nation3Wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Nation3Wrapper */ \"./components/Nation3Wrapper.tsx\");\n\n\n\n\nconst client = (0,wagmi__WEBPACK_IMPORTED_MODULE_2__.createClient)({\n    autoConnect: true,\n    provider: (0,ethers__WEBPACK_IMPORTED_MODULE_1__.getDefaultProvider)()\n});\nfunction Nation3({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_2__.WagmiConfig, {\n        client: client,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Nation3Wrapper__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/greg/Desktop/Nation3/court/packages/ui/pages/_app.tsx\",\n                lineNumber: 15,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/greg/Desktop/Nation3/court/packages/ui/pages/_app.tsx\",\n            lineNumber: 14,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/greg/Desktop/Nation3/court/packages/ui/pages/_app.tsx\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Nation3);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQTRDO0FBRU07QUFDUTtBQUUxRCxNQUFNSSxNQUFNLEdBQUdILG1EQUFZLENBQUM7SUFDMUJJLFdBQVcsRUFBRSxJQUFJO0lBQ2pCQyxRQUFRLEVBQUVOLDBEQUFrQixFQUFFO0NBQy9CLENBQUM7QUFFRixTQUFTTyxPQUFPLENBQUMsRUFBRUMsU0FBUyxHQUFFQyxTQUFTLEdBQVksRUFBRTtJQUNuRCxxQkFDRSw4REFBQ1AsOENBQVc7UUFBQ0UsTUFBTSxFQUFFQSxNQUFNO2tCQUN6Qiw0RUFBQ0Qsa0VBQWM7c0JBQ2IsNEVBQUNLLFNBQVM7Z0JBQUUsR0FBR0MsU0FBUzs7Ozs7b0JBQUk7Ozs7O2dCQUNiOzs7OztZQUNMLENBQ2Q7Q0FDSDtBQUVELGlFQUFlRixPQUFPLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uYXRpb24zYXBwLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREZWZhdWx0UHJvdmlkZXIgfSBmcm9tIFwiZXRoZXJzXCI7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgeyBjcmVhdGVDbGllbnQsIFdhZ21pQ29uZmlnIH0gZnJvbSBcIndhZ21pXCI7XG5pbXBvcnQgTmF0aW9uM1dyYXBwZXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvTmF0aW9uM1dyYXBwZXJcIjtcblxuY29uc3QgY2xpZW50ID0gY3JlYXRlQ2xpZW50KHtcbiAgYXV0b0Nvbm5lY3Q6IHRydWUsXG4gIHByb3ZpZGVyOiBnZXREZWZhdWx0UHJvdmlkZXIoKSxcbn0pO1xuXG5mdW5jdGlvbiBOYXRpb24zKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8V2FnbWlDb25maWcgY2xpZW50PXtjbGllbnR9PlxuICAgICAgPE5hdGlvbjNXcmFwcGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L05hdGlvbjNXcmFwcGVyPlxuICAgIDwvV2FnbWlDb25maWc+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hdGlvbjM7XG4iXSwibmFtZXMiOlsiZ2V0RGVmYXVsdFByb3ZpZGVyIiwiY3JlYXRlQ2xpZW50IiwiV2FnbWlDb25maWciLCJOYXRpb24zV3JhcHBlciIsImNsaWVudCIsImF1dG9Db25uZWN0IiwicHJvdmlkZXIiLCJOYXRpb24zIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "@heroicons/react/outline":
/*!*******************************************!*\
  !*** external "@heroicons/react/outline" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@heroicons/react/outline");

/***/ }),

/***/ "@nation3/components":
/*!**************************************!*\
  !*** external "@nation3/components" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@nation3/components");

/***/ }),

/***/ "ethers":
/*!*************************!*\
  !*** external "ethers" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

module.exports = require("wagmi");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();