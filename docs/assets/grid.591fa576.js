var t=(i,s,l)=>{if(!s.has(i))throw TypeError("Cannot "+l)};var u=(i,s,l)=>(t(i,s,"read from private field"),l?l.call(i):s.get(i)),o=(i,s,l)=>{if(s.has(i))throw TypeError("Cannot add the same private member more than once");s instanceof WeakSet?s.add(i):s.set(i,l)},c=(i,s,l,r)=>(t(i,s,"write to private field"),r?r.call(i,l):s.set(i,l),l);import{D as d,h as a}from"./index.0f65c826.js";var e,h;class g extends d{constructor(l){super("wok-ui-grid");o(this,e,void 0);o(this,h,void 0);if(c(this,h,l),typeof l.gap=="number"?c(this,e,{col:l.gap,row:l.gap}):l.gap?c(this,e,l.gap):c(this,e,{col:0,row:0}),!Number.isInteger(l.cols))throw new Error(`cols \u5FC5\u987B\u662F\u6574\u6570,\u5F53\u524D\u503C: ${l.cols}`);if(l.cols<1||l.cols>12)throw new Error(`cols \u8D85\u51FA\u8303\u56F4, \u6709\u6548\u8303\u56F4\u662F 1-12 ,\u5F53\u524D\u503C: ${l.cols}`);this.el.style.columnGap=`${u(this,e).col}px`,this.el.style.rowGap=`${u(this,e).row}px`,a(l.cells).forEach(r=>this.addCell(r))}addCell(l){this.addChild({style:{width:`calc((100% - ${u(this,e).col*(u(this,h).cols-1)}px) / ${u(this,h).cols})`,minWidth:u(this,h).cellMinWidth&&u(this,h).cellMinWidth>0?`${u(this,h).cellMinWidth}px`:void 0},children:l})}}e=new WeakMap,h=new WeakMap;export{g as G};