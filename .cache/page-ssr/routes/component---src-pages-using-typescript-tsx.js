"use strict";
exports.id = 970;
exports.ids = [970];
exports.modules = {

/***/ 2165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3070);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2031);
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4895);
/* harmony import */ var _components_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6179);
// If you don't want to use TypeScript you can delete this file!
const UsingTypescript=({data,path,location})=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_layout__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,{title:"Using TypeScript",location:location},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_seo__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,{title:"Using TypeScript"}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"Gatsby supports TypeScript by default!"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"This means that you can create and write ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em",null,".ts/.tsx")," files for your pages, components etc. Please note that the ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em",null,"gatsby-*.js")," files (like gatsby-node.js) currently don't support TypeScript yet."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"For type checking you'll want to install ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em",null,"typescript")," via npm and run ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em",null,"tsc --init")," to create a ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em",null,"tsconfig")," file."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"You're currently on the page \"",path,"\" which was built on"," ",data.site.buildTime,"."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"To learn more, head over to our"," ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a",{href:"https://www.gatsbyjs.com/docs/typescript/"},"documentation about TypeScript"),"."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/"},"Go back to the homepage"));/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UsingTypescript);const query="2907560070";

/***/ }),

/***/ 4895:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ layout)
});

// EXTERNAL MODULE: external "/Users/zhanglun/Documents/mine/zhanglun.github.io/node_modules/react/index.js"
var index_js_ = __webpack_require__(3070);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js + 4 modules
var gatsby_browser_entry = __webpack_require__(2031);
;// CONCATENATED MODULE: ./src/components/Header/index.tsx
const Header=props=>{const{title,menu=[]}=props;const renderMenu=()=>{return menu.map(item=>{return/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{className:"nav-item",to:item.url,key:item.id},item.name);});};return/*#__PURE__*/index_js_default().createElement("header",{className:"header"},/*#__PURE__*/index_js_default().createElement("div",{className:"header-inner"},/*#__PURE__*/index_js_default().createElement("div",{className:"header-title"},/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{className:"header-title-link",to:"/"},title)),/*#__PURE__*/index_js_default().createElement("nav",{className:"header-nav"},renderMenu())));};
;// CONCATENATED MODULE: ./src/components/Banner/index.tsx
const Banner=({description})=>{return/*#__PURE__*/index_js_default().createElement("div",{className:"banner"},/*#__PURE__*/index_js_default().createElement("div",{className:"banner-title"},description));};
;// CONCATENATED MODULE: ./src/components/Footer/index.tsx
const Footer=()=>{return/*#__PURE__*/index_js_default().createElement("footer",{className:"footer"},"\xA9 ",new Date().getFullYear(),", Built with",` `,/*#__PURE__*/index_js_default().createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby"));};
;// CONCATENATED MODULE: ./src/components/layout.js
const Layout=({location,children,title,menu,description})=>{const rootPath=`${""}/`;const isRootPath=location.pathname===rootPath;return/*#__PURE__*/index_js_.createElement("div",{className:"global-wrapper","data-is-root-path":isRootPath},/*#__PURE__*/index_js_.createElement(Header,{title:title,menu:menu}),/*#__PURE__*/index_js_.createElement(Banner,{description:description}),/*#__PURE__*/index_js_.createElement("section",{className:"main"},children),/*#__PURE__*/index_js_.createElement(Footer,null));};/* harmony default export */ const layout = (Layout);

/***/ }),

/***/ 6179:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3070);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5697);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4593);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2031);
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */const Seo=({description,lang,meta,title})=>{var _site$siteMetadata,_site$siteMetadata2,_site$siteMetadata2$s;const{site}=(0,gatsby__WEBPACK_IMPORTED_MODULE_3__.useStaticQuery)("2841359383");const metaDescription=description||site.siteMetadata.description;const defaultTitle=(_site$siteMetadata=site.siteMetadata)===null||_site$siteMetadata===void 0?void 0:_site$siteMetadata.title;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_helmet__WEBPACK_IMPORTED_MODULE_2__.Helmet,{htmlAttributes:{lang},title:title,titleTemplate:defaultTitle?`%s | ${defaultTitle}`:null,meta:[{name:`description`,content:metaDescription},{property:`og:title`,content:title},{property:`og:description`,content:metaDescription},{property:`og:type`,content:`website`},{name:`twitter:card`,content:`summary`},{name:`twitter:creator`,content:((_site$siteMetadata2=site.siteMetadata)===null||_site$siteMetadata2===void 0?void 0:(_site$siteMetadata2$s=_site$siteMetadata2.social)===null||_site$siteMetadata2$s===void 0?void 0:_site$siteMetadata2$s.twitter)||``},{name:`twitter:title`,content:title},{name:`twitter:description`,content:metaDescription}].concat(meta)});};Seo.defaultProps={lang:`en`,meta:[],description:``};Seo.propTypes={description:(prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),lang:(prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),meta:prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)),title:(prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired)};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Seo);

/***/ })

};
;
//# sourceMappingURL=component---src-pages-using-typescript-tsx.js.map