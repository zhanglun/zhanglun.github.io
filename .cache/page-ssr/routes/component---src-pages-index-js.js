"use strict";
exports.id = 678;
exports.ids = [678];
exports.modules = {

/***/ 5268:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "w": () => (/* binding */ ArticleList)
});

// EXTERNAL MODULE: external "/Users/zhanglun/Documents/mine/zhanglun.github.io/node_modules/react/index.js"
var index_js_ = __webpack_require__(3070);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js + 4 modules
var gatsby_browser_entry = __webpack_require__(2031);
// EXTERNAL MODULE: ./src/components/CategoryLabel/index.tsx
var CategoryLabel = __webpack_require__(220);
;// CONCATENATED MODULE: ./src/components/Article/ArticleItem.tsx
const ArticleItem=({post})=>{const title=post.frontmatter.title||post.fields.slug;const frontmatter=post.frontmatter||{};return/*#__PURE__*/index_js_default().createElement("li",{key:post.fields.slug},/*#__PURE__*/index_js_default().createElement("article",{className:"article-list-item",itemScope:true,itemType:"http://schema.org/Article"},/*#__PURE__*/index_js_default().createElement("header",null,frontmatter.categories&&/*#__PURE__*/index_js_default().createElement(CategoryLabel/* CategoryLabel */.q,{items:frontmatter.categories}),/*#__PURE__*/index_js_default().createElement("h2",null,/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{to:post.fields.slug,itemProp:"url",className:"article-item-title hover-underline"},/*#__PURE__*/index_js_default().createElement("span",{itemProp:"headline"},title))),/*#__PURE__*/index_js_default().createElement("small",null,post.frontmatter.date)),/*#__PURE__*/index_js_default().createElement("section",null,/*#__PURE__*/index_js_default().createElement("p",{dangerouslySetInnerHTML:{__html:post.frontmatter.description||post.excerpt},itemProp:"description"})),/*#__PURE__*/index_js_default().createElement("footer",null,/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{to:post.fields.slug,itemProp:"url",className:"read-more"},"READ MORE"))));};
;// CONCATENATED MODULE: ./src/components/Article/ArticleList.tsx
const ArticleList=({posts})=>{return/*#__PURE__*/index_js_default().createElement("ul",{className:"article-list"},posts.map((post,idx)=>{return/*#__PURE__*/index_js_default().createElement(ArticleItem,{post:post,key:idx});}));};

/***/ }),

/***/ 220:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": () => (/* binding */ CategoryLabel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3070);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
const CategoryLabel=props=>{const{items}=props;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div",{className:"article-category-list"},items.map((category,idx)=>{return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"article-category",key:idx},category);}));};

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

/***/ }),

/***/ 7704:
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
/* harmony import */ var _components_Article_ArticleList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5268);
const BlogIndex=({data,location})=>{var _data$site$siteMetada,_data$site$siteMetada2,_data$site$siteMetada3;const siteTitle=((_data$site$siteMetada=data.site.siteMetadata)===null||_data$site$siteMetada===void 0?void 0:_data$site$siteMetada.title)||`Title`;const posts=data.allMarkdownRemark.nodes;const siteMenu=((_data$site$siteMetada2=data.site.siteMetadata)===null||_data$site$siteMetada2===void 0?void 0:_data$site$siteMetada2.menu)||[];const description=((_data$site$siteMetada3=data.site.siteMetadata)===null||_data$site$siteMetada3===void 0?void 0:_data$site$siteMetada3.description)||"";if(posts.length===0){return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_layout__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,{location:location,title:siteTitle,menu:siteMenu},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_seo__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,{title:"All posts"}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"No blog posts found. Add markdown posts to \"content/blog\" (or the directory you specified for the \"gatsby-source-filesystem\" plugin in gatsby-config.js)."));}return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_layout__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,{location:location,title:siteTitle,menu:siteMenu,description:description},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_seo__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,{title:"All posts"}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Article_ArticleList__WEBPACK_IMPORTED_MODULE_4__/* .ArticleList */ .w,{posts:posts}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"pagination"}," ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:'/page/2',rel:"next"},"Next Page \u2192")));};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlogIndex);const pageQuery="1858660735";

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-js.js.map