exports.id = "component---src-pages-categories-tsx";
exports.ids = ["component---src-pages-categories-tsx"];
exports.modules = {

/***/ "./src/components/PageHero/index.module.css":
/*!**************************************************!*\
  !*** ./src/components/PageHero/index.module.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "container": () => (/* binding */ container),
/* harmony export */   "inner": () => (/* binding */ inner),
/* harmony export */   "subTitle": () => (/* binding */ subTitle),
/* harmony export */   "title": () => (/* binding */ title)
/* harmony export */ });
// Exports
var container = "index-module--container--MsrZ9";
var inner = "index-module--inner--Qy-hx";
var title = "index-module--title--k4zZ7";
var subTitle = "index-module--subTitle--Sf0CJ";


/***/ }),

/***/ "./src/components/SideMenu/index.module.css":
/*!**************************************************!*\
  !*** ./src/components/SideMenu/index.module.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "baHamburgerMenu": () => (/* binding */ baHamburgerMenu),
/* harmony export */   "fullscreenBubbleInMenu": () => (/* binding */ fullscreenBubbleInMenu),
/* harmony export */   "mainMenu": () => (/* binding */ mainMenu),
/* harmony export */   "menu": () => (/* binding */ menu),
/* harmony export */   "menuButton": () => (/* binding */ menuButton),
/* harmony export */   "menuMain": () => (/* binding */ menuMain),
/* harmony export */   "menuTitle": () => (/* binding */ menuTitle),
/* harmony export */   "nav": () => (/* binding */ nav),
/* harmony export */   "navItem": () => (/* binding */ navItem),
/* harmony export */   "open": () => (/* binding */ open),
/* harmony export */   "sidemenuNavItem": () => (/* binding */ sidemenuNavItem),
/* harmony export */   "theme1": () => (/* binding */ theme1),
/* harmony export */   "theme2": () => (/* binding */ theme2),
/* harmony export */   "theme3": () => (/* binding */ theme3),
/* harmony export */   "theme4": () => (/* binding */ theme4),
/* harmony export */   "theme5": () => (/* binding */ theme5),
/* harmony export */   "theme6": () => (/* binding */ theme6),
/* harmony export */   "titleLink": () => (/* binding */ titleLink),
/* harmony export */   "visibleMenu": () => (/* binding */ visibleMenu)
/* harmony export */ });
// Exports
var menu = "index-module--menu--aNCkU";
var menuButton = "index-module--menu-button--Iv9-4";
var menuMain = "index-module--menu-main--dqZT6";
var open = "index-module--open--LEqU-";
var menuTitle = "index-module--menu-title--n-nNm";
var titleLink = "index-module--title-link--T5U9M";
var nav = "index-module--nav--nqC-X";
var navItem = "index-module--nav-item--8jKuC";
var theme1 = "index-module--theme-1--jQ2fg";
var theme2 = "index-module--theme-2--7nodg";
var theme3 = "index-module--theme-3--pka-p";
var theme4 = "index-module--theme-4--L3lP0";
var theme5 = "index-module--theme-5--zFBiY";
var theme6 = "index-module--theme-6--t9Ipa";
var sidemenuNavItem = "index-module--sidemenu-nav-item--3tmSg";
var fullscreenBubbleInMenu = "index-module--fullscreen-bubble-in-menu--fe12F";
var mainMenu = "index-module--main-menu--owoSn";
var visibleMenu = "index-module--visible-menu--i0GXs";
var baHamburgerMenu = "index-module--ba-hamburger-menu--ykJDi";


/***/ }),

/***/ "./src/components/PageHero/index.tsx":
/*!*******************************************!*\
  !*** ./src/components/PageHero/index.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageHero": () => (/* binding */ PageHero)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.module.css */ "./src/components/PageHero/index.module.css");


const PageHero = props => {
  const {
    title,
    subTitle
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_1__.container
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_1__.inner
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_1__.title
  }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_1__.subTitle
  }, subTitle)));
};

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham1.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham1.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham1": () => (/* binding */ Ham1)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham1({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham hamRotate ham1 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 30,50 h 40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham2.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham2.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham2": () => (/* binding */ Ham2)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham2({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham ham2 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 70,33 h -40 c -6.5909,0 -7.763966,-4.501509 -7.763966,-7.511428 0,-4.721448 3.376452,-9.583771 13.876919,-9.583771 14.786182,0 11.409257,14.896182 9.596449,21.970818 -1.812808,7.074636 -15.709402,12.124381 -15.709402,12.124381"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 30,50 h 40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 70,67 h -40 c -6.5909,0 -7.763966,4.501509 -7.763966,7.511428 0,4.721448 3.376452,9.583771 13.876919,9.583771 14.786182,0 11.409257,-14.896182 9.596449,-21.970818 -1.812808,-7.074636 -15.709402,-12.124381 -15.709402,-12.124381"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham3.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham3.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham3": () => (/* binding */ Ham3)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham3({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham ham3 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 70,33 h -40 c -11.092231,0 11.883874,13.496726 -3.420361,12.956839 -0.962502,-2.089471 -2.222071,-3.282996 -4.545687,-3.282996 -2.323616,0 -5.113897,2.622752 -5.113897,7.071068 0,4.448316 2.080609,7.007933 5.555839,7.007933 2.401943,0 2.96769,-1.283974 4.166879,-3.282995 2.209342,0.273823 4.031294,1.642466 5.857227,-0.252538 v -13.005715 16.288404 h 7.653568"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 70,50 h -40 c -5.6862,0 -8.534259,5.373483 -8.534259,11.551069 0,7.187738 3.499166,10.922274 13.131984,10.922274 11.021777,0 7.022787,-15.773343 15.531095,-15.773343 3.268142,0 5.177031,-2.159429 5.177031,-6.7 0,-4.540571 -1.766442,-7.33533 -5.087851,-7.326157 -3.321409,0.0092 -5.771288,2.789632 -5.771288,7.326157 0,4.536525 2.478983,6.805271 5.771288,6.7"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 70,67 h -40 c 0,0 -3.680675,0.737051 -3.660714,-3.517857 0.02541,-5.415597 3.391687,-10.357143 10.982142,-10.357143 4.048418,0 17.88928,0.178572 23.482143,0.178572 0,2.563604 2.451177,3.403635 4.642857,3.392857 2.19168,-0.01078 4.373905,-1.369814 4.375,-3.392857 0.0011,-2.023043 -1.924401,-2.589191 -4.553571,-4.107143 -2.62917,-1.517952 -4.196429,-1.799562 -4.196429,-3.660714 0,-1.861153 2.442181,-3.118811 4.196429,-3.035715 1.754248,0.0831 4.375,0.890841 4.375,3.125 2.628634,0 6.160714,0.267857 6.160714,0.267857 l -0.178571,-2.946428 10.178571,0 -10.178571,0 v 6.696428 l 8.928571,0 -8.928571,0 v 7.142858 l 10.178571,0 -10.178571,0"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham4.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham4.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham4": () => (/* binding */ Ham4)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham4({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham hamRotate ham4 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 70,50 h -40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham5.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham5.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham5": () => (/* binding */ Ham5)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham5({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham hamRotate180 ham5 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 70,50 h -40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham6.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham6.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham6": () => (/* binding */ Ham6)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham6({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham ham6 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 30,33 h 40 c 13.100415,0 14.380204,31.80258 6.899646,33.421777 -24.612039,5.327373 9.016154,-52.337577 -12.75751,-30.563913 l -28.284272,28.284272"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 70,50 c 0,0 -32.213436,0 -40,0 -7.786564,0 -6.428571,-4.640244 -6.428571,-8.571429 0,-5.895471 6.073743,-11.783399 12.286435,-5.570707 6.212692,6.212692 28.284272,28.284272 28.284272,28.284272"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 69.575405,67.073826 h -40 c -13.100415,0 -14.380204,-31.80258 -6.899646,-33.421777 24.612039,-5.327373 -9.016154,52.337577 12.75751,30.563913 l 28.284272,-28.284272"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham7.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham7.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham7": () => (/* binding */ Ham7)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham7({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham hamRotate ham7 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 70,33 h -40 c 0,0 -6,1.368796 -6,8.5 0,7.131204 6,8.5013 6,8.5013 l 20,-0.0013"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 70,50 h -40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 69.575405,67.073826 h -40 c -5.592752,0 -6.873604,-9.348582 1.371031,-9.348582 8.244634,0 19.053564,21.797129 19.053564,12.274756 l 0,-40"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/Ham8.tsx":
/*!******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/Ham8.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham8": () => (/* binding */ Ham8)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Ham8({
  active
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: `ham hamRotate ham8 ${active ? 'active' : ''}`,
    viewBox: "0 0 100 100",
    width: "80"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line top",
    d: "m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line middle",
    d: "m 30,50 h 40"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "line bottom",
    d: "m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
  }));
}

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/index.tsx":
/*!*******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/index.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ham1": () => (/* reexport safe */ _Ham1__WEBPACK_IMPORTED_MODULE_1__.Ham1),
/* harmony export */   "Ham2": () => (/* reexport safe */ _Ham2__WEBPACK_IMPORTED_MODULE_2__.Ham2),
/* harmony export */   "Ham3": () => (/* reexport safe */ _Ham3__WEBPACK_IMPORTED_MODULE_3__.Ham3),
/* harmony export */   "Ham4": () => (/* reexport safe */ _Ham4__WEBPACK_IMPORTED_MODULE_4__.Ham4),
/* harmony export */   "Ham5": () => (/* reexport safe */ _Ham5__WEBPACK_IMPORTED_MODULE_5__.Ham5),
/* harmony export */   "Ham6": () => (/* reexport safe */ _Ham6__WEBPACK_IMPORTED_MODULE_6__.Ham6),
/* harmony export */   "Ham7": () => (/* reexport safe */ _Ham7__WEBPACK_IMPORTED_MODULE_7__.Ham7),
/* harmony export */   "Ham8": () => (/* reexport safe */ _Ham8__WEBPACK_IMPORTED_MODULE_8__.Ham8)
/* harmony export */ });
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./src/components/SideMenu/MenuButtons/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Ham1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ham1 */ "./src/components/SideMenu/MenuButtons/Ham1.tsx");
/* harmony import */ var _Ham2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Ham2 */ "./src/components/SideMenu/MenuButtons/Ham2.tsx");
/* harmony import */ var _Ham3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Ham3 */ "./src/components/SideMenu/MenuButtons/Ham3.tsx");
/* harmony import */ var _Ham4__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Ham4 */ "./src/components/SideMenu/MenuButtons/Ham4.tsx");
/* harmony import */ var _Ham5__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Ham5 */ "./src/components/SideMenu/MenuButtons/Ham5.tsx");
/* harmony import */ var _Ham6__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Ham6 */ "./src/components/SideMenu/MenuButtons/Ham6.tsx");
/* harmony import */ var _Ham7__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Ham7 */ "./src/components/SideMenu/MenuButtons/Ham7.tsx");
/* harmony import */ var _Ham8__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Ham8 */ "./src/components/SideMenu/MenuButtons/Ham8.tsx");










/***/ }),

/***/ "./src/components/SideMenu/index.tsx":
/*!*******************************************!*\
  !*** ./src/components/SideMenu/index.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SideMenu": () => (/* binding */ SideMenu)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _MenuButtons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MenuButtons */ "./src/components/SideMenu/MenuButtons/index.tsx");
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.module.css */ "./src/components/SideMenu/index.module.css");




function SideMenu(props) {
  const {
    title,
    menu
  } = props;
  const {
    0: active,
    1: setActive
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  const handleToggleMenu = () => {
    setActive(!active);
  };

  const renderMenu = () => menu.map((item, idx) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
    className: `${_index_module_css__WEBPACK_IMPORTED_MODULE_3__.navItem} theme-${idx + 1}`,
    to: item.url,
    key: item.id
  }, item.name));

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.menu
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.menuButton,
    role: "button",
    "aria-hidden": "true",
    onClick: handleToggleMenu
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_MenuButtons__WEBPACK_IMPORTED_MODULE_2__.Ham4, {
    active: active
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: `${_index_module_css__WEBPACK_IMPORTED_MODULE_3__.menuMain} ${active ? _index_module_css__WEBPACK_IMPORTED_MODULE_3__.open : ''}`
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.menuTitle
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.titleLink,
    to: "/"
  }, title)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.nav
  }, renderMenu())));
}

/***/ }),

/***/ "./src/pages/categories.tsx":
/*!**********************************!*\
  !*** ./src/pages/categories.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/layout */ "./src/components/layout.js");
/* harmony import */ var _components_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/seo */ "./src/components/seo.js");
/* harmony import */ var _components_PageHero__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/PageHero */ "./src/components/PageHero/index.tsx");






function CategoryPage({
  data,
  location
}) {
  var _data$site$siteMetada, _data$site$siteMetada2, _data$site$siteMetada3;

  const siteTitle = ((_data$site$siteMetada = data.site.siteMetadata) === null || _data$site$siteMetada === void 0 ? void 0 : _data$site$siteMetada.title) || 'Title';
  const categoryGroup = data.allMarkdownRemark.group;
  const siteMenu = ((_data$site$siteMetada2 = data.site.siteMetadata) === null || _data$site$siteMetada2 === void 0 ? void 0 : _data$site$siteMetada2.menu) || [];
  const description = ((_data$site$siteMetada3 = data.site.siteMetadata) === null || _data$site$siteMetada3 === void 0 ? void 0 : _data$site$siteMetada3.description) || '';

  if (categoryGroup.length === 0) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_layout__WEBPACK_IMPORTED_MODULE_2__["default"], {
      location: location,
      title: siteTitle,
      menu: siteMenu,
      description: description
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_seo__WEBPACK_IMPORTED_MODULE_3__["default"], {
      title: "All posts"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "No category found. Add markdown posts to \"content/blog\" (or the directory you specified for the \"gatsby-source-filesystem\" plugin in gatsby-config.js)."));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_layout__WEBPACK_IMPORTED_MODULE_2__["default"], {
    location: location,
    title: siteTitle,
    menu: siteMenu,
    description: description
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_seo__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: "\u7EB8\u4E0A\u5F97\u6765\u7EC8\u89C9\u6D45\uFF0C\u7EDD\u77E5\u6B64\u4E8B\u8981\u8EAC\u884C\xB7Category\xB7\u5206\u7C7B"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", {
    className: "category-page"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_PageHero__WEBPACK_IMPORTED_MODULE_4__.PageHero, {
    title: "\u5206\u7C7B",
    subTitle: "\u7EB8\u4E0A\u5F97\u6765\u7EC8\u89C9\u6D45\uFF0C\u7EDD\u77E5\u6B64\u4E8B\u8981\u8EAC\u884C"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "category-list"
  }, categoryGroup.map(category => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: `/categories/${category.fieldValue}`,
    key: category.fieldValue,
    className: "category-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, "#", ' ', category.fieldValue), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, category.totalCount))))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CategoryPage);
const pageQuery = "2586227277";

/***/ }),

/***/ "./src/components/layout.js":
/*!**********************************!*\
  !*** ./src/components/layout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SideMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SideMenu */ "./src/components/SideMenu/index.tsx");



function Layout({
  location,
  children,
  title,
  menu,
  description
}) {
  const rootPath = `${""}/`;
  const isRootPath = location.pathname === rootPath;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: `global-wrapper ${isRootPath ? 'root' : ''}`,
    "data-is-root-path": isRootPath
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SideMenu__WEBPACK_IMPORTED_MODULE_1__.SideMenu, {
    title: title,
    menu: menu
  }), children);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ }),

/***/ "./src/components/seo.js":
/*!*******************************!*\
  !*** ./src/components/seo.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_2841359383_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/2841359383.json */ "./public/page-data/sq/d/2841359383.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-helmet */ "./node_modules/react-helmet/es/Helmet.js");


/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */




function Seo({
  description,
  lang,
  meta,
  title
}) {
  var _site$siteMetadata, _site$siteMetadata2, _site$siteMetadata2$s;

  const {
    site
  } = _public_page_data_sq_d_2841359383_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const metaDescription = description || site.siteMetadata.description;
  const defaultTitle = (_site$siteMetadata = site.siteMetadata) === null || _site$siteMetadata === void 0 ? void 0 : _site$siteMetadata.title;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_helmet__WEBPACK_IMPORTED_MODULE_2__.Helmet, {
    htmlAttributes: {
      lang
    },
    title: title,
    titleTemplate: defaultTitle ? `%s | ${defaultTitle}` : null,
    meta: [{
      name: 'description',
      content: metaDescription
    }, {
      property: 'og:title',
      content: title
    }, {
      property: 'og:description',
      content: metaDescription
    }, {
      property: 'og:type',
      content: 'website'
    }, {
      name: 'twitter:card',
      content: 'summary'
    }, {
      name: 'twitter:creator',
      content: ((_site$siteMetadata2 = site.siteMetadata) === null || _site$siteMetadata2 === void 0 ? void 0 : (_site$siteMetadata2$s = _site$siteMetadata2.social) === null || _site$siteMetadata2$s === void 0 ? void 0 : _site$siteMetadata2$s.twitter) || ''
    }, {
      name: 'twitter:title',
      content: title
    }, {
      name: 'twitter:description',
      content: metaDescription
    }].concat(meta)
  });
}

Seo.defaultProps = {
  lang: 'en',
  meta: [],
  description: ''
};
Seo.propTypes = {
  description: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  lang: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  meta: prop_types__WEBPACK_IMPORTED_MODULE_3___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_3___default().object)),
  title: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string.isRequired)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Seo);

/***/ }),

/***/ "./src/components/SideMenu/MenuButtons/index.css":
/*!*******************************************************!*\
  !*** ./src/components/SideMenu/MenuButtons/index.css ***!
  \*******************************************************/
/***/ (() => {



/***/ }),

/***/ "./public/page-data/sq/d/2841359383.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/2841359383.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"site":{"siteMetadata":{"title":"张小伦的网络日志","description":"欢迎来到张小伦的网络日志 \\n\\t\\t一个记录生活，分享心得的博客","social":{"twitter":"zhanglun1410"}}}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-categories-tsx.js.map