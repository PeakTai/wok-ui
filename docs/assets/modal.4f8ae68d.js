import{T as A,D as E,L as s,S as B,H as l,r as a,B as u,j as r,s as n,c as F,d as c}from"./index.936704ca.js";import{s as e}from"./index.858539f3.js";class i extends E{constructor(){super(),this.addChild(new s("\u6A21\u6001\u6846"),new B(20),new l({gap:a(1),wrap:!0,children:[new u({text:"\u666E\u901A\u6A21\u6001\u6846",onClick(t){e({title:"\u6807\u9898",body:"\u8FD9\u91CC\u662F\u6A21\u6001\u6846\u8981\u5C55\u793A\u7684\u5185\u5BB9"})}}),new u({text:"\u65E0\u6807\u9898\u7684\u6A21\u6001\u6846",onClick(t){e({body:"\u65E0\u6807\u9898\u7684\u6A21\u6001\u6846"})}}),new u({text:"\u5168\u5C4F\u7684\u6A21\u6001\u6846",onClick(t){e({title:"\u5168\u5C4F\u6F14\u793A",body:"\u8FD9\u4E2A\u6A21\u6001\u6846\u5C06\u4F1A\u94FA\u6EE1\u6574\u4E2A\u7A97\u53E3",fullscreen:!0})}}),new u({text:"\u9759\u6001\u80CC\u666F",onClick(t){e({title:"\u9759\u6001\u80CC\u666F",staticBackDrop:!0,body:"\u80CC\u666F\u6CA1\u6709\u529F\u80FD\uFF0C\u4E0D\u80FD\u901A\u8FC7\u70B9\u51FB\u80CC\u666F\u6765\u5173\u95ED"})}}),new u({text:"\u5E26\u6309\u94AE\u7684\u6A21\u6001\u6846",onClick(t){const o=e({title:"\u5E26\u6309\u94AE\u6F14\u793A",body:"\u8FD9\u91CC\u662F\u6A21\u6001\u6846\u8981\u5C55\u793A\u7684\u5185\u5BB9",buttons:{confirm:!0,cancel:"\u9000\u51FA"},staticBackDrop:!0,onConfirm(){c("\u70B9\u51FB\u4E86\u786E\u8BA4"),o.close()},onClose(){n("\u6A21\u6001\u6846\u88AB\u5173\u95ED\u4E86")}})}}),new u({text:"\u591A\u5C42\u6A21\u6001\u6846",onClick(t){e({title:"\u7B2C\u4E00\u5C42\u6A21\u6001\u6846",body:new r({content:"\u70B9\u51FB\u5F39\u51FA\u7B2C\u4E8C\u5C42",onClick(o){e({title:"\u7B2C\u4E8C\u5C42\u6A21\u6001\u6846",body:"\u5B9E\u9645\u5F00\u53D1\u4E2D\u4E0D\u80FD\u5D4C\u5957\u592A\u591A\uFF0C\u5426\u5219\u96BE\u4EE5\u7EF4\u62A4",onClose:()=>n("\u7B2C\u4E8C\u5C42\u5173\u95ED")})}}),onClose:()=>n("\u7B2C\u4E00\u5C42\u5173\u95ED")})}}),new u({text:"\u5B8C\u5168\u81EA\u5B9A\u4E49\u5185\u5BB9",onClick(t){const o=e({replaceByBody:!0,staticBackDrop:!0,body:F({style:{color:"white"},onClick(C){C.stopPropagation()},children:["\u6574\u4E2A\u6A21\u6001\u6846\u7684\u5185\u5BB9\u88AB\u81EA\u5B9A\u4E49\u7684 body \u66FF\u6362\uFF0C\u5B9E\u73B0\u4E00\u4E9B\u7279\u6B8A\u6548\u679C",new B(20),new u({text:"\u70B9\u51FB\u8FD9\u91CC\u5173\u95ED",type:"primary",onClick(C){C.stopPropagation(),o.close()}})]})})}}),new u({text:"\u5BF9\u8BDD\u6846\u5C45\u4E2D\u663E\u793A",onClick(t){e({dialogCentered:!0,title:"\u5185\u5BB9\u5C45\u4E2D\u6F14\u793A",body:"\u5185\u5BB9\u5C45\u4E2D\u663E\u793A"})}})]}))}}function p(){return new A(new i)}export{p as modalTest};
