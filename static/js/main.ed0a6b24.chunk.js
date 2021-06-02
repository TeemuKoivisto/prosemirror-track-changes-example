(this["webpackJsonpprosemirror-track-changes-example"]=this["webpackJsonpprosemirror-track-changes-example"]||[]).push([[0],{225:function(t,e,n){},226:function(t,e,n){},227:function(t,e,n){},228:function(t,e,n){},229:function(t,e,n){},230:function(t,e,n){"use strict";n.r(e);var r,a,o,i,c,s,u=n(0),l=n(33),d=n(46),h=n(5),f=n(12),g=n(74),p=n(17),b=n(13),m=n(4),O=function(t){var e=t.className;return Object(m.jsx)(j,{className:e,children:Object(m.jsx)(v,{children:Object(m.jsx)(x,{to:"/",exact:!0,activeClassName:"current",children:"Front page"})})})},j=b.a.div(r||(r=Object(f.a)(["\n  background: var(--color-primary);\n  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);\n  padding: 1rem;\n"]))),v=b.a.nav(a||(a=Object(f.a)(["\n  align-items: center;\n  color: #fff;\n  display: flex;\n  justify-content: space-between;\n"]))),x=Object(b.a)(d.b)(o||(o=Object(f.a)(["\n  box-sizing: border-box;\n  color: #fff;\n  cursor: pointer;\n  font-size: 1rem;\n  padding: 0.5rem 1rem;\n  text-decoration: none;\n  transition: 0.2s hover;\n  &:hover {\n    text-decoration: underline;\n  }\n  &.current {\n    font-weight: 600;\n  }\n"]))),k=["component"],w=function(t){var e,n=t.component,r=Object(g.a)(t,k);return Object(m.jsx)(h.b,Object(p.a)(Object(p.a)({},r),{},{render:(e=n,function(t){return Object(m.jsxs)(y,{children:[Object(m.jsx)(O,Object(p.a)({},t)),Object(m.jsx)(M,{children:Object(m.jsx)(e,Object(p.a)({},t))})]})})}))},y=b.a.div(i||(i=Object(f.a)(["\n  min-height: 100vh;\n"]))),M=b.a.main(c||(c=Object(f.a)(["\n  margin: 40px auto 0 auto;\n  max-width: 680px;\n  padding-bottom: 20px;\n  @media only screen and (max-width: 720px) {\n    margin: 40px 20px 0 20px;\n    padding-bottom: 20px;\n  }\n"])));function S(t){var e=t.className;return Object(m.jsx)(D,{className:e,children:Object(m.jsxs)("header",{children:[Object(m.jsx)("h1",{children:Object(m.jsx)("a",{href:"https://teemukoivisto.github.io/prosemirror-track-changes-example/",children:"Track changes example"})}),Object(m.jsx)("p",{children:"With prosemirror-changeset"}),Object(m.jsx)("p",{children:Object(m.jsx)("a",{href:"https://github.com/TeemuKoivisto/prosemirror-track-changes-example",children:"Github repo"})})]})})}var D=b.a.div(s||(s=Object(f.a)(["\n"]))),E=n(95),A=n.n(E),N=n(102),B=n(15),J=n(2),z=n(103),K=new(n(1).i)({nodes:{doc:{content:"block+"},paragraph:{content:"inline*",group:"block",parseDOM:[{tag:"p"}],toDOM:function(){return["p",0]}},blockquote:{content:"block+",group:"block",defining:!0,parseDOM:[{tag:"blockquote"}],toDOM:function(){return["blockquote",0]}},horizontal_rule:{group:"block",parseDOM:[{tag:"hr"}],toDOM:function(){return["hr"]}},heading:{attrs:{level:{default:1}},content:"inline*",group:"block",defining:!0,parseDOM:[{tag:"h1",attrs:{level:1}},{tag:"h2",attrs:{level:2}},{tag:"h3",attrs:{level:3}},{tag:"h4",attrs:{level:4}},{tag:"h5",attrs:{level:5}},{tag:"h6",attrs:{level:6}}],toDOM:function(t){return["h"+t.attrs.level,0]}},code_block:{content:"text*",marks:"",group:"block",code:!0,defining:!0,parseDOM:[{tag:"pre",preserveWhitespace:"full"}],toDOM:function(){return["pre",["code",0]]}},text:{group:"inline"},image:{inline:!0,attrs:{src:{},alt:{default:null},title:{default:null}},group:"inline",draggable:!0,parseDOM:[{tag:"img[src]",getAttrs:function(t){var e=t;return{src:e.getAttribute("src"),title:e.getAttribute("title"),alt:e.getAttribute("alt")}}}],toDOM:function(t){var e=t.attrs;return["img",{src:e.src,alt:e.alt,title:e.title}]}},hard_break:{inline:!0,group:"inline",selectable:!1,parseDOM:[{tag:"br"}],toDOM:function(){return["br"]}}},marks:{link:{attrs:{href:{},title:{default:null}},inclusive:!1,parseDOM:[{tag:"a[href]",getAttrs:function(t){var e=t;return{href:e.getAttribute("href"),title:e.getAttribute("title")}}}],toDOM:function(t){var e=t.attrs;return["a",{href:e.href,title:e.title},0]}},italic:{parseDOM:[{tag:"i"},{tag:"em"},{style:"font-style=italic"}],toDOM:function(){return["em",0]}},bold:{parseDOM:[{tag:"strong"},{tag:"b",getAttrs:function(t){return"normal"!=t.style.fontWeight&&null}},{style:"font-weight",getAttrs:function(t){return/^(bold(er)?|[5-9]\d{2,})$/.test(t)&&null}}],toDOM:function(){return["strong",0]}},code:{parseDOM:[{tag:"code"}],toDOM:function(){return["code",0]}},strikethrough:{parseDOM:[{tag:"s"},{tag:"strike"},{style:"text-decoration=line-through"},{style:"text-decoration-line=line-through"}],toDOM:function(){return["s"]}}}}),R=n(73),C=n(3),q=(n(225),new J.e("track-changes"));var I=function(){return new J.d({key:q,state:{init:function(t,e){return{changeSet:R.a.create(e.doc),decorationSet:B.b.empty}},apply:function(t,e,n,r){var a=e.changeSet.addSteps(t.doc,t.mapping.maps,function(t,e){return t.steps.map((function(t){if(t instanceof C.c)return 0===t.slice.size?e.doc.textBetween(t.from,t.to):t.slice.content.textBetween(0,t.slice.size)}))}(t,n)),o=[],i=0,c=0;return a.changes.forEach((function(t){var e,n=t.fromB;t.inserted.forEach((function(e){o.push(B.a.inline(n,t.toB,{class:"inserted"})),n+=e.length,c+=e.length})),(e=t.deleted,e.reduce((function(t,e,n){return 0===n?[e]:R.b.join([e],t,(function(t,e){return e+t}))}),[])).forEach((function(e){var n=a.startDoc.textBetween(t.fromA,t.fromA+e.length);o.push(B.a.widget(t.fromA+i+c,function(t){return function(e,n){var r=document.createElement("span");return r.textContent=t,r.classList.add("deleted"),r}}(n),{side:-1,marks:[K.marks.strikethrough.create()]})),i-=e.length}))})),{changeSet:a,decorationSet:B.b.create(t.doc,o)}}},props:{decorations:function(t){return this.getState(t).decorationSet}}})};n(226),n(227),n(228);function T(t){var e=t.className,n=void 0===e?"":e,r=Object(u.useRef)(null),a=Object(u.useRef)(null);function o(e){if(a.current){var n=a.current.state.apply(e);a.current.updateState(n),t.onEdit&&t.onEdit(n)}}return Object(u.useLayoutEffect)((function(){var e=J.b.create({schema:K,plugins:Object(z.a)({schema:K}).concat(I())}),n=r.current;return n&&(a.current=function(t,e){var n=new B.c({mount:t},{state:e,dispatchTransaction:o});window&&(window.editorView=n);return n}(n,e),t.onEditorReady&&(null===t||void 0===t||t.onEditorReady(a.current))),function(){var t;null===(t=a.current)||void 0===t||t.destroy()}}),[]),Object(m.jsx)("div",{id:"example-editor",ref:r,className:n})}var V,W=n(101),_=function t(e){var n=this;if(Object(W.a)(this,t),this.view=void 0,this.currentEditorState=void 0,this.localStorageKey=void 0,this.setEditorView=function(t){if(n.view=t,n.currentEditorState){var e=J.b.fromJSON({schema:n.view.state.schema,plugins:n.view.state.plugins},n.currentEditorState);n.view.updateState(e)}},this.syncCurrentEditorState=function(){var t=n.view.state.toJSON();localStorage.setItem(n.localStorageKey,JSON.stringify(t))},this.localStorageKey=e,"undefined"!==typeof window){var r=localStorage.getItem(this.localStorageKey);if(r&&null!==r&&r.length>0){var a=JSON.parse(r);this.currentEditorState=a}}};function L(){var t=Object(u.useMemo)((function(){return new _("track-changes")}),[]),e=Object(u.useMemo)((function(){return A()(t.syncCurrentEditorState,250)}),[]);return Object(m.jsx)(T,{onEdit:function(){e()},onEditorReady:function(e){t.setEditorView(e),Object(N.a)(e)}})}function F(){return Object(m.jsxs)(G,{children:[Object(m.jsx)(S,{}),Object(m.jsx)(L,{})]})}var G=b.a.div(V||(V=Object(f.a)([""]))),$=function(){return Object(m.jsx)(d.a,{basename:"/prosemirror-track-changes-example",children:Object(m.jsxs)(h.d,{children:[Object(m.jsx)(w,{exact:!0,path:"/",component:F}),Object(m.jsx)(h.a,{to:"/"})]})})};n(229);Object(l.render)(Object(m.jsx)($,{}),document.getElementById("root"))}},[[230,1,2]]]);
//# sourceMappingURL=main.ed0a6b24.chunk.js.map