exports.id = "component---src-templates-blog-list-tsx";
exports.ids = ["component---src-templates-blog-list-tsx"];
exports.modules = {

/***/ "./src/components/CircleArrow/index.module.css":
/*!*****************************************************!*\
  !*** ./src/components/CircleArrow/index.module.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "circle": () => (/* binding */ circle),
/* harmony export */   "dark": () => (/* binding */ dark),
/* harmony export */   "light": () => (/* binding */ light)
/* harmony export */ });
// Exports
var circle = "index-module--circle--E91Mj";
var dark = "index-module--dark--aAIf4";
var light = "index-module--light--x7OKG";


/***/ }),

/***/ "./src/components/ListPagination/index.module.css":
/*!********************************************************!*\
  !*** ./src/components/ListPagination/index.module.css ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pagination": () => (/* binding */ pagination),
/* harmony export */   "paginationItem": () => (/* binding */ paginationItem),
/* harmony export */   "paginationItemNext": () => (/* binding */ paginationItemNext),
/* harmony export */   "paginationItemPrev": () => (/* binding */ paginationItemPrev)
/* harmony export */ });
// Exports
var pagination = "index-module--pagination--iWu7S";
var paginationItem = "index-module--paginationItem--ZgXus";
var paginationItemPrev = "index-module--paginationItemPrev--WtmXw";
var paginationItemNext = "index-module--paginationItemNext--nbZSQ";


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

/***/ "./src/components/Article/ArticleItem.tsx":
/*!************************************************!*\
  !*** ./src/components/Article/ArticleItem.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArticleItem": () => (/* binding */ ArticleItem)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");


function ArticleItem({
  post
}) {
  const title = post.frontmatter.title || post.fields.slug;
  const frontmatter = post.frontmatter || {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("article", {
    className: "article-list-item",
    itemScope: true,
    itemType: "http://schema.org/Article"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: post.fields.slug,
    itemProp: "url",
    className: "article-item-title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "article-item-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "article-item-category"
  }, frontmatter.categories), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "article-item-header__arrow"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    stroke: "currentColor",
    strokeWidth: "1.4",
    d: "M12 3v17M19 13l-7 7-7-7"
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    itemProp: "headline",
    className: "article-item__text"
  }, title))));
}

/***/ }),

/***/ "./src/components/Article/ArticleList.tsx":
/*!************************************************!*\
  !*** ./src/components/Article/ArticleList.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArticleList": () => (/* binding */ ArticleList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArticleItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArticleItem */ "./src/components/Article/ArticleItem.tsx");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.css */ "./src/components/Article/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_2__);




const useDebounce = (fn, wait, immediate = false, dep = []) => {
  const {
    current
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    fn,
    timer: null
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    current.fn = fn;
  }, [fn]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...args) => {
    if (current.timer) {
      clearTimeout(current.timer);
    }

    if (immediate && !current.timer) {
      current.fn.call(undefined, ...args);
    }

    current.timer = setTimeout(() => {
      current.fn.call(undefined, ...args);
    }, wait);
  }, dep);
};

function ArticleList({
  posts
}) {
  const articleListRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  const setTransformOffset = (elem, offset) => {
    const el = elem;
    el.style.transform = `translate3d(-${offset}px, 0, 0)`;
  };

  const handleScroll = () => {
    const yOffset = window.scrollY;
    setTransformOffset(articleListRef.current, yOffset);
  };

  const delayScroll = useDebounce(handleScroll, 50);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!articleListRef) {
      return;
    } // const height = articleListRef.current.offsetWidth;
    // document.body.style.height = `${height}px`;
    // window.addEventListener('scroll', delayScroll);
    // eslint-disable-next-line consistent-return


    return () => {
      document.body.style.height = null;
      window.removeEventListener('scroll', delayScroll);
    };
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: "article-list",
    ref: articleListRef
  }, posts.map(post => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ArticleItem__WEBPACK_IMPORTED_MODULE_1__.ArticleItem, {
    post: post,
    key: post.id
  })));
}

/***/ }),

/***/ "./src/components/BlogLayout.tsx":
/*!***************************************!*\
  !*** ./src/components/BlogLayout.tsx ***!
  \***************************************/
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
  // @ts-ignore
  const rootPath = `${""}/`;
  const isRootPath = location.pathname === rootPath;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "global-wrapper",
    "data-is-root-path": isRootPath
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SideMenu__WEBPACK_IMPORTED_MODULE_1__.SideMenu, {
    title: title,
    menu: menu
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "article-main"
  }, children));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ }),

/***/ "./src/components/CircleArrow/index.tsx":
/*!**********************************************!*\
  !*** ./src/components/CircleArrow/index.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CircleArrow": () => (/* binding */ CircleArrow),
/* harmony export */   "CircleArrowThemeEnum": () => (/* binding */ CircleArrowThemeEnum)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.module.css */ "./src/components/CircleArrow/index.module.css");
/* eslint-disable react/require-default-props */


let CircleArrowThemeEnum;

(function (CircleArrowThemeEnum) {
  CircleArrowThemeEnum["dark"] = "dark";
  CircleArrowThemeEnum["light"] = "light";
})(CircleArrowThemeEnum || (CircleArrowThemeEnum = {}));

function CircleArrow(props) {
  const {
    size = 24,
    rotate = 0,
    theme = 'dark'
  } = props;
  const style = {
    transform: `rotate(${rotate}deg)`,
    width: `${size}px`,
    height: `${size}px`
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: `${_index_module_css__WEBPACK_IMPORTED_MODULE_1__.circle} ${_index_module_css__WEBPACK_IMPORTED_MODULE_1__[theme]}`
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "none",
    style: style
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    stroke: "currentColor",
    strokeWidth: "1.4",
    d: "M12 3v17M19 13l-7 7-7-7"
  })));
}

/***/ }),

/***/ "./src/components/ListPagination/index.tsx":
/*!*************************************************!*\
  !*** ./src/components/ListPagination/index.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListPagination": () => (/* binding */ ListPagination)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CircleArrow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../CircleArrow */ "./src/components/CircleArrow/index.tsx");
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.module.css */ "./src/components/ListPagination/index.module.css");




function ListPagination(props) {
  const {
    prevPage = '',
    prevPageTitle = 'Previous Page',
    nextPage = '',
    nextPageTitle = 'Next Page'
  } = props;
  const {
    0: prevTheme,
    1: setPrevTheme
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.light);
  const {
    0: nextTheme,
    1: setNextTheme
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.light);

  const renderPrevItem = () => {
    if (prevPage) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
        className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.paginationItem,
        to: prevPage,
        rel: "prev",
        onMouseOver: () => setPrevTheme(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.dark),
        onMouseOut: () => setPrevTheme(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.light)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrow, {
        size: 14,
        rotate: 90,
        theme: prevTheme
      }), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
        className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.paginationItemPrev
      }, prevPageTitle));
    }

    return null;
  };

  const renderNextItem = () => {
    if (nextPage) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
        className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.paginationItem,
        to: nextPage,
        rel: "next",
        onMouseOver: () => setNextTheme(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.dark),
        onMouseOut: () => setNextTheme(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrowThemeEnum.light)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
        className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.paginationItemNext
      }, nextPageTitle), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_CircleArrow__WEBPACK_IMPORTED_MODULE_2__.CircleArrow, {
        size: 14,
        rotate: -90,
        theme: nextTheme
      }));
    }

    return null;
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: _index_module_css__WEBPACK_IMPORTED_MODULE_3__.pagination
  }, renderPrevItem(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null), renderNextItem());
}

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

/***/ "./src/templates/blog-list.tsx":
/*!*************************************!*\
  !*** ./src/templates/blog-list.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_seo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/seo */ "./src/components/seo.js");
/* harmony import */ var _components_Article_ArticleList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Article/ArticleList */ "./src/components/Article/ArticleList.tsx");
/* harmony import */ var _components_BlogLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/BlogLayout */ "./src/components/BlogLayout.tsx");
/* harmony import */ var _components_ListPagination__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ListPagination */ "./src/components/ListPagination/index.tsx");






function BlogList({
  data,
  pageContext,
  location
}) {
  var _data$site$siteMetada, _data$site$siteMetada2, _data$site$siteMetada3;

  const {
    currentPage,
    numPages
  } = pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/blogs' : `/blogs/${(currentPage - 1).toString()}`;
  const nextPage = `/blogs/${(currentPage + 1).toString()}`;
  const siteTitle = ((_data$site$siteMetada = data.site.siteMetadata) === null || _data$site$siteMetada === void 0 ? void 0 : _data$site$siteMetada.title) || 'Title';
  const posts = data.allMarkdownRemark.nodes;
  const siteMenu = ((_data$site$siteMetada2 = data.site.siteMetadata) === null || _data$site$siteMetada2 === void 0 ? void 0 : _data$site$siteMetada2.menu) || [];
  const description = ((_data$site$siteMetada3 = data.site.siteMetadata) === null || _data$site$siteMetada3 === void 0 ? void 0 : _data$site$siteMetada3.description) || '';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_BlogLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    location: location,
    title: siteTitle,
    description: description,
    menu: siteMenu
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_seo__WEBPACK_IMPORTED_MODULE_1__["default"], {
    title: "All posts"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Article_ArticleList__WEBPACK_IMPORTED_MODULE_2__.ArticleList, {
    posts: posts
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "pagination"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ListPagination__WEBPACK_IMPORTED_MODULE_4__.ListPagination, {
    prevPage: isFirst ? '' : prevPage,
    nextPage: isLast ? '' : nextPage
  })));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlogList);
const BlogListQuery = "938869606";

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

/***/ "./src/components/Article/index.css":
/*!******************************************!*\
  !*** ./src/components/Article/index.css ***!
  \******************************************/
/***/ (() => {



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
//# sourceMappingURL=component---src-templates-blog-list-tsx.js.map