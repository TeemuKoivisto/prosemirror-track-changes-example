(this["webpackJsonpprosemirror-track-changes-example"]=this["webpackJsonpprosemirror-track-changes-example"]||[]).push([[3],{246:function(e,n,r){"use strict";function t(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}r.d(n,"a",(function(){return a}));var a=function(){function e(){var n,r,t;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),t=void 0,(r="task")in(n=this)?Object.defineProperty(n,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[r]=t}var n,r,a;return n=e,(r=[{key:"request",value:function(){this.cancel();var e=window.requestIdleCallback||window.requestAnimationFrame;return new Promise((function(n){return e(n)}))}},{key:"cancel",value:function(){var e=window.cancelIdleCallack||window.cancelAnimationFrame;this.task&&e(this.task)}}])&&t(n.prototype,r),a&&t(n,a),e}()},248:function(e,n,r){"use strict";r.r(n),r.d(n,"JsonDiffMain",(function(){return s}));var t=r(58),a=r.n(t),i=r(102),o=r(246);function c(e,n,r,t,a,i,o){try{var c=e[i](o),u=c.value}catch(f){return void r(f)}c.done?n(u):Promise.resolve(u).then(t,a)}function u(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function f(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}var s=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),f(this,"diffPatcher",new i.DiffPatcher({arrays:{detectMove:!1},textDiff:{minLength:1}})),f(this,"scheduler",new o.a)}var n,r,t;return n=e,(r=[{key:"diff",value:function(){var e,n=(e=a.a.mark((function e(n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.scheduler.request();case 2:return e.abrupt("return",{id:n.id,delta:this.diffPatcher.diff(n.a,n.b)});case 3:case"end":return e.stop()}}),e,this)})),function(){var n=this,r=arguments;return new Promise((function(t,a){var i=e.apply(n,r);function o(e){c(i,t,a,o,u,"next",e)}function u(e){c(i,t,a,o,u,"throw",e)}o(void 0)}))});return function(e){return n.apply(this,arguments)}}()}])&&u(n.prototype,r),t&&u(n,t),e}()}}]);
//# sourceMappingURL=3.3915777d.chunk.js.map