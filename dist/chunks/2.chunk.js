(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{14:function(e,t,n){var o=n(15);"string"==typeof o&&(o=[[e.i,o,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};n(13)(o,r);o.locals&&(e.exports=o.locals)},15:function(e,t,n){(e.exports=n(12)(!1)).push([e.i,".home {\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  margin-top: 50px; }\n  .home .but {\n    padding: 8px 10px;\n    border: solid 1px #ccc;\n    border-radius: 3px;\n    cursor: pointer;\n    box-shadow: 0 0 5px #ccc; }\n\n.mt20 {\n  margin-top: 20px; }\n\n.redux {\n  font-size: 25px;\n  color: red; }\n\n.button_add {\n  font-size: 18px;\n  border: solid 1px #000;\n  color: #000;\n  margin-left: 20px;\n  cursor: pointer; }\n\n.home-button {\n  padding: 5px 10px;\n  border: solid 1px #6f8fb7;\n  margin-left: 10px;\n  cursor: pointer;\n  color: #fff;\n  background: #6f8fb7;\n  border-radius: 3px; }\n",""])},8:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(n(1)),r=a(n(17));function a(e){return e&&e.__esModule?e:{default:e}}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function l(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}n(14);var s=function(e){function t(e,n){var o;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(o=l(this,c(t).call(this,e,n))).state={username:"wangweianger00",begintime:""},console.log(e,r.default),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(t,o.default.Component),function(e,t,n){t&&u(e.prototype,t),n&&u(e,n)}(t,[{key:"componentDidMount",value:function(){}},{key:"handleAlert",value:function(e){}},{key:"handleConfirm",value:function(e){}},{key:"handleAddNumber",value:function(){}},{key:"render",value:function(){var e=this.props.number;return o.default.createElement("div",null,o.default.createElement("div",{className:"tc mb20 redux"},o.default.createElement("b",null,"redux中的number值为")," ",e,o.default.createElement("button",{onClick:this.handleAddNumber.bind(this),className:"button_add"},"增加number计数")),o.default.createElement("div",{className:"tc mb20"},"时间日历插件",o.default.createElement("input",{className:"input",type:"",name:"",id:"zane-calendar"})),o.default.createElement("div",{className:"mt30 tc"},o.default.createElement("button",{className:"btn cursor",onClick:this.handleAlert.bind(this)},"Alert弹窗"),o.default.createElement("button",{className:"btn cursor ml10",onClick:this.handleConfirm.bind(this)},"Confirm弹窗")),o.default.createElement("div",{className:"home"},this.state.username,o.default.createElement("br",null),o.default.createElement("img",{src:"http://img0.imgtn.bdimg.com/it/u=1058181807,3427139407&fm=27&gp=0.jpg"})))}}]),t}();t.default=s}}]);