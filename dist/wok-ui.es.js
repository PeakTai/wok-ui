var reset = '';

const enUS = {
  cancel: "cancel",
  confirm: "ok",
  "form-err-required": "Please fill in this field.",
  "form-err-must-check": "Please check this.",
  "form-err-number": "Please enter a number.",
  "form-err-min": "Not less than {}.",
  "form-err-max": "Not greater than {}.",
  "form-err-max-select": "Up to {} option(s) can be selected.",
  "form-err-min-select": "Please select at least {} option(s).",
  "form-err-max-length": "You can enter up to {} character(s).",
  "form-err-min-length": "Please enter at least {} character(s).",
  "form-err-min-size": "The file size must be greater than {}",
  "form-err-max-size": "The file size must not exceed {}",
  "form-err-max-files-select": "You can select up to {} file(s)",
  "form-err-min-files-select": "Please select at least {} file(s)"
};

function parseLangTag(tag) {
  const [lang, region] = tag.split("-");
  if (!lang) {
    throw new Error(`Unable to parse lang tag\uFF1A${tag}`);
  }
  return { lang: lang.toLowerCase(), region: region ? region.toLowerCase() : void 0 };
}

class I18n {
  constructor(enMsgs) {
    this.enMsgs = enMsgs;
    const regionMap = /* @__PURE__ */ new Map();
    regionMap.set("-", enMsgs);
    this.#msgsMap = /* @__PURE__ */ new Map();
    this.#msgsMap.set("en", regionMap);
    this.#lang = "en";
    this.#msgs = enMsgs;
  }
  #lang;
  #msgs;
  #msgsMap;
  async findMsgsByLang(langTag) {
    const tag = parseLangTag(langTag);
    const regionMap = this.#msgsMap.get(tag.lang);
    if (!regionMap) {
      return void 0;
    }
    let msgs = void 0;
    let key = "";
    if (tag.region) {
      key = tag.region;
      msgs = regionMap.get(key);
    }
    if (!msgs) {
      key = "-";
      msgs = regionMap.get(key);
    }
    if (!msgs) {
      const entry = regionMap.entries().next();
      if (entry.value) {
        [key, msgs] = entry.value;
      }
    }
    if (!msgs) {
      return void 0;
    }
    if (typeof msgs === "function") {
      const finalMsgs = await msgs();
      regionMap.set(key, finalMsgs);
      return finalMsgs;
    }
    return msgs;
  }
  setMsgs(langTag, msgs) {
    const tag = parseLangTag(langTag);
    let regionMap = this.#msgsMap.get(tag.lang);
    if (!regionMap) {
      regionMap = /* @__PURE__ */ new Map();
      this.#msgsMap.set(tag.lang, regionMap);
    }
    regionMap.set(tag.region || "-", msgs);
  }
  getSupportedLanguageTags(...tags) {
    return tags.filter((tag) => {
      const langTag = parseLangTag(tag);
      return this.#msgsMap.get(langTag.lang);
    });
  }
  async setLang(lang) {
    const msgs = await this.findMsgsByLang(lang);
    if (!msgs) {
      return false;
    }
    this.#lang = lang;
    this.#msgs = msgs;
    return true;
  }
  getLang() {
    return this.#lang;
  }
  buildMsg(key, ...args) {
    const template = this.#msgs[key];
    if (!args || !args.length) {
      return template;
    }
    let idx = 0;
    return template.replace(/\{\}/g, () => `${args[idx++]}`);
  }
}
class ExtensibleI18n extends I18n {
  #extendedI18ns = [];
  async setLang(lang) {
    for (const ex of this.#extendedI18ns) {
      await ex.setLang(lang);
    }
    return super.setLang(lang);
  }
  extend(enMsgs) {
    const extendedI18n = new I18n(enMsgs);
    this.#extendedI18ns.push(extendedI18n);
    return extendedI18n;
  }
}

const zhCN = {
  cancel: "\u53D6\u6D88",
  confirm: "\u786E\u5B9A",
  "form-err-required": "\u8BF7\u586B\u5199\u6B64\u9879",
  "form-err-must-check": "\u5FC5\u987B\u52FE\u9009\u6B64\u9879",
  "form-err-number": "\u8BF7\u8F93\u5165\u4E00\u4E2A\u6570\u5B57",
  "form-err-min": "\u4E0D\u5F97\u5C0F\u4E8E {}",
  "form-err-max": "\u4E0D\u5F97\u5927\u4E8E {}",
  "form-err-max-select": "\u6700\u591A\u53EF\u4EE5\u9009\u62E9 {} \u4E2A\u9009\u9879",
  "form-err-min-select": "\u8BF7\u81F3\u5C11\u9009\u62E9 {} \u4E2A\u9009\u9879",
  "form-err-max-length": "\u6700\u591A\u53EF\u4EE5\u586B\u5199 {} \u4E2A\u5B57\u7B26",
  "form-err-min-length": "\u8BF7\u586B\u5199\u81F3\u5C11 {} \u4E2A\u5B57\u7B26",
  "form-err-min-size": "\u6587\u4EF6\u5927\u5C0F\u4E0D\u5F97\u5C0F\u4E8E {}",
  "form-err-max-size": "\u6587\u4EF6\u5927\u5C0F\u4E0D\u5F97\u5927\u4E8E {}",
  "form-err-max-files-select": "\u6700\u591A\u53EF\u4EE5\u9009\u62E9 {} \u4E2A\u6587\u4EF6",
  "form-err-min-files-select": "\u8BF7\u81F3\u5C11\u9009\u62E9 {} \u4E2A\u6587\u4EF6"
};

let I18N;
function getI18n() {
  if (I18N) {
    return I18N;
  }
  I18N = new ExtensibleI18n(enUS);
  I18N.setMsgs("zh-CN", zhCN);
  const tags = I18N.getSupportedLanguageTags(...navigator.languages);
  if (tags.length) {
    I18N.setLang(tags[0]);
  }
  return I18N;
}

var animation = '';

var fade = '';

var scaleUp = '';

var scaleDown = '';

var slideTop = '';

var slideBottom = '';

var slideLeft = '';

var slideRight = '';

var shake = '';

var Animation = /* @__PURE__ */ ((Animation2) => {
  Animation2["FADE"] = "animation-fade";
  Animation2["SCALE_UP"] = "animation-scale-up";
  Animation2["SCALE_DOWN"] = "animation-scale-down";
  Animation2["SLIDE_TOP"] = "animation-slide-top";
  Animation2["SLIDE_BOTTOM"] = "animation-slide-bottom";
  Animation2["SLIDE_LEFT"] = "animation-slide-left";
  Animation2["SLIDE_RIGHT"] = "animation-slide-right";
  Animation2["SHAKE"] = "animation-shake";
  return Animation2;
})(Animation || {});
const ANIMATION_PROVISION = "animation-provision";
const ANIMATION_REVERSE = "animation-reverse";
async function animate(opts) {
  opts.el.classList.remove(...Object.values(Animation), ANIMATION_REVERSE);
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, 0);
  });
  opts.el.classList.remove(ANIMATION_PROVISION);
  const duration = typeof opts.duration === "number" && opts.duration > 0 ? opts.duration : 500;
  opts.el.style.animationDuration = `${duration}ms`;
  if (Array.isArray(opts.animation)) {
    opts.el.classList.add(...opts.animation);
  } else {
    opts.el.classList.add(opts.animation);
  }
  if (opts.reverse) {
    opts.el.classList.add(ANIMATION_REVERSE);
  }
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}

class Module {
  constructor(el) {
    this.el = el;
    this.__children = [];
    this.__destroyed = false;
  }
  replaceChild(index, newChild) {
    if (newChild.getParent()) {
      throw new Error("The module you want to insert already has a parent module");
    }
    const existingChild = this.__children[index];
    if (!existingChild) {
      return false;
    }
    this.insertChild(index, newChild);
    this.removeChild(existingChild);
    return true;
  }
  insertChild(index, newChild) {
    const newChildModule = convertToModule(newChild);
    if (newChildModule.__destroyed) {
      console.error("The module to be inserted has been destroyed", newChildModule);
      throw new Error("The module to be inserted has been destroyed");
    }
    if (newChildModule.getParent()) {
      throw new Error("The module you want to insert already has a parent module");
    }
    if (index === this.__children.length) {
      this.addChild(newChildModule);
      newChildModule.__parent = this;
      return true;
    }
    const existingChild = this.__children[index];
    if (!existingChild) {
      return false;
    }
    this.el.insertBefore(newChildModule.el, existingChild.el);
    this.__children.splice(index, 0, newChildModule);
    newChildModule.__parent = this;
    return true;
  }
  moveChild(sourceIndex, targetIndex) {
    const sourceChild = this.getChild(sourceIndex);
    const targetChild = this.getChild(targetIndex);
    if (!sourceChild || !targetChild) {
      return false;
    }
    this.__children.splice(sourceIndex, 1);
    this.__children.splice(targetIndex, 0, sourceChild);
    if (sourceIndex > targetIndex) {
      this.el.insertBefore(sourceChild.el, targetChild.el);
    } else {
      const nextChild = this.getChild(targetIndex + 1);
      if (nextChild) {
        this.el.insertBefore(sourceChild.el, nextChild.el);
      } else {
        this.el.removeChild(sourceChild.el);
        this.el.appendChild(sourceChild.el);
      }
    }
    return true;
  }
  destroy() {
    if (this.__parent) {
      const index = this.__parent.__children.indexOf(this);
      if (index !== -1) {
        this.__parent.__children.splice(index, 1);
      }
      this.__parent = void 0;
    }
    this.empty();
    this.el.remove();
    this.__destroyed = true;
  }
  empty() {
    [...this.__children].forEach((c) => c.destroy());
  }
  getParent() {
    return this.__parent;
  }
  replaceBy(module) {
    if (!this.__parent) {
      return false;
    }
    const idx = this.getIndex();
    this.__parent.replaceChild(idx, module);
    return true;
  }
  find(predicate) {
    const result = [];
    for (const child of this.__children) {
      if (predicate(child)) {
        result.push(child);
      }
      result.push(...child.find(predicate));
    }
    return result;
  }
  findFirst(predicate) {
    for (const child of this.__children) {
      if (predicate(child)) {
        return child;
      }
      const grand = child.findFirst(predicate);
      if (grand) {
        return grand;
      }
    }
    return void 0;
  }
  addChild(...child) {
    child.filter((c) => c !== void 0).forEach((c) => this.__addSingleChild(c));
  }
  __addSingleChild(child) {
    const childModule = convertToModule(child);
    if (childModule.__destroyed) {
      console.error("The module to be added has been destroyed", child);
      throw new Error("The module to be added has been destroyed");
    }
    if (childModule.getParent()) {
      throw new Error("The module you want to add already has a parent module");
    }
    childModule.mount(this.el);
    this.__children.push(childModule);
    childModule.__parent = this;
  }
  removeChild(moduleOrIndex) {
    let child = void 0;
    let index = -1;
    if (typeof moduleOrIndex === "number") {
      index = moduleOrIndex;
      child = this.__children[moduleOrIndex];
    } else {
      child = moduleOrIndex;
      index = this.__children.findIndex((c) => c === moduleOrIndex);
    }
    if (!child || index === -1) {
      return false;
    }
    child.__parent = void 0;
    child.destroy();
    this.__children.splice(index, 1);
    return true;
  }
  getChildren() {
    return this.__children;
  }
  getChild(index) {
    return this.__children[index];
  }
  mount(parentEl) {
    if (this.__parent) {
      throw new Error(
        "The current module has already been added to a parent module and cannot be mounted"
      );
    }
    if (this.__destroyed) {
      throw new Error("The current module has been destroyed !");
    }
    parentEl.appendChild(this.el);
  }
  scrollIntoView() {
    this.el.scrollIntoView(true);
  }
  getIndex() {
    if (!this.__parent) {
      return -1;
    }
    return this.__parent.getChildren().findIndex((c) => c === this);
  }
  scrollIntoViewIfInvisible() {
    const el = this.el;
    const rect = el.getBoundingClientRect();
    let invisible = false;
    if (rect.top + rect.height < 0) {
      invisible = true;
    }
    if (rect.top + rect.height > window.innerHeight) {
      invisible = true;
    }
    if (rect.left + rect.width < 0) {
      invisible = true;
    }
    if (rect.left > window.innerWidth) {
      invisible = true;
    }
    if (!invisible) {
      return;
    }
    el.scrollIntoView(true);
  }
}
class DomModule extends Module {
  constructor(el, children) {
    super(el);
    if (children) {
      children.forEach((child) => this.addChild(child));
    }
  }
}
class DivModule extends Module {
  constructor(...classNames) {
    const el = document.createElement("div");
    super(el);
    el.classList.add(...classNames);
  }
}
function convertToModule(cm) {
  if (typeof cm === "string") {
    const text = document.createElement("span");
    text.innerText = `${cm}`;
    return new DomModule(text);
  }
  if (typeof cm === "number") {
    const spacer = document.createElement("div");
    spacer.style.height = `${cm}px`;
    return new DomModule(spacer);
  }
  if (cm instanceof HTMLElement) {
    return new DomModule(cm);
  }
  if (cm instanceof Module) {
    return cm;
  }
  if (typeof cm === "function") {
    return cm();
  }
  return createDomModule(cm);
}
function buildSubModules(opt) {
  if (Array.isArray(opt)) {
    return opt.map((c) => convertToModule(c));
  }
  if (typeof opt === "function") {
    const children = [];
    const res = opt((...child) => children.push(...child));
    if (res instanceof Module) {
      return [res];
    }
    return children.map((c) => convertToModule(c));
  } else {
    return [convertToModule(opt)];
  }
}
function createDomModule(options) {
  const el = document.createElement(options.tag || "div");
  if (options.preHandle) {
    options.preHandle(el);
  }
  if (options.innerText) {
    el.innerText = options.innerText;
  } else if (options.innerHTML) {
    el.innerHTML = options.innerHTML;
  }
  if (options.attrs) {
    const { attrs } = options;
    Object.keys(options.attrs).forEach((key) => {
      const val = attrs[key];
      if (typeof val !== "undefined") {
        el.setAttribute(key, val);
      }
    });
  }
  if (options.classNames) {
    if (typeof options.classNames === "string") {
      el.classList.add(options.classNames);
    } else {
      el.classList.add(...options.classNames.filter((name) => !!name));
    }
  }
  if (options.style) {
    for (let property in options.style) {
      const val = options.style[property];
      if (!val) {
        continue;
      }
      el.style[property] = val;
    }
  }
  if (options.onClick) {
    el.addEventListener("click", options.onClick);
  }
  if (options.events) {
    for (let evtName in options.events) {
      el.addEventListener(evtName, options.events[evtName]);
    }
  }
  const children = options.children ? buildSubModules(options.children) : [];
  const module = new DomModule(el, children);
  if (options.postHandle) {
    options.postHandle(el);
  }
  return module;
}

function proxyCachedModule(module) {
  const delegate = new Proxy(module, {
    get(target, p) {
      if (p === "destroy") {
        return () => {
          const parent = target.getParent();
          if (parent) {
            parent.removeChild(delegate);
          }
          target.el.remove();
        };
      }
      if (p === "destroyThoroughly") {
        return () => {
          target.destroy();
        };
      }
      return target[p];
    }
  });
  return delegate;
}

class FullRenderingModule extends Module {
  constructor(rootEl) {
    super(rootEl || document.createElement("div"));
    this.__pendingRender = false;
    this.__cachedModules = /* @__PURE__ */ new Map();
  }
  render() {
    this.__pendingRender = true;
    setTimeout(() => {
      if (!this.__pendingRender) {
        return;
      }
      this.__pendingRender = false;
      try {
        this.empty();
        this.buildContent();
      } catch (e) {
        console.error(e);
      }
    }, 0);
  }
  cacheModule(opts) {
    const cachedModule = this.__cachedModules.get(opts.key);
    if (cachedModule) {
      return cachedModule;
    }
    const module = proxyCachedModule(opts.module());
    this.__cachedModules.set(opts.key, module);
    return module;
  }
  removeCache(key) {
    const module = this.__cachedModules.get(key);
    if (module) {
      const { destroyThoroughly } = module;
      if (typeof destroyThoroughly === "function") {
        destroyThoroughly();
      }
      this.__cachedModules.delete(key);
    }
  }
  clearCaches() {
    for (const key of this.__cachedModules.keys()) {
      this.removeCache(key);
    }
  }
  destroy() {
    this.clearCaches();
    super.destroy();
  }
}

var ResponsiveBreakPoint = /* @__PURE__ */ ((ResponsiveBreakPoint2) => {
  ResponsiveBreakPoint2[ResponsiveBreakPoint2["sm"] = 576] = "sm";
  ResponsiveBreakPoint2[ResponsiveBreakPoint2["md"] = 768] = "md";
  ResponsiveBreakPoint2[ResponsiveBreakPoint2["lg"] = 992] = "lg";
  ResponsiveBreakPoint2[ResponsiveBreakPoint2["xl"] = 1200] = "xl";
  ResponsiveBreakPoint2[ResponsiveBreakPoint2["xxl"] = 1400] = "xxl";
  return ResponsiveBreakPoint2;
})(ResponsiveBreakPoint || {});
class ResponsiveModule extends Module {
  constructor(el) {
    super(el || document.createElement("div"));
    this.__respSize = "xs";
    this.__pendingRender = false;
    this.__cachedModules = /* @__PURE__ */ new Map();
    this.__resizeListener = () => this.render(false);
    window.addEventListener("resize", this.__resizeListener);
  }
  render(force = true) {
    this.__pendingRender = true;
    setTimeout(() => {
      try {
        this.__render(force);
      } catch (e) {
        console.error(e);
      }
    }, 0);
  }
  __render(force) {
    if (!this.__pendingRender) {
      return;
    }
    this.__pendingRender = false;
    let size = "xs";
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1400) {
      size = "xxl";
    } else if (windowWidth >= 1200) {
      size = "xl";
    } else if (windowWidth >= 992) {
      size = "lg";
    } else if (windowWidth >= 768) {
      size = "md";
    } else if (windowWidth >= 576) {
      size = "sm";
    } else {
      size = "xs";
    }
    if (force || this.__respSize !== size) {
      this.__respSize = size;
      this.empty();
      this.buildContent({
        respSize: size,
        windowWidth
      });
    }
  }
  cacheModule(opts) {
    const cachedModule = this.__cachedModules.get(opts.key);
    if (cachedModule) {
      return cachedModule;
    }
    const module = proxyCachedModule(opts.module());
    this.__cachedModules.set(opts.key, module);
    return module;
  }
  removeCache(key) {
    const module = this.__cachedModules.get(key);
    if (module) {
      const { destroyThoroughly } = module;
      if (typeof destroyThoroughly === "function") {
        destroyThoroughly();
      }
      this.__cachedModules.delete(key);
    }
  }
  clearCaches() {
    for (const key of this.__cachedModules.keys()) {
      this.removeCache(key);
    }
  }
  destroy() {
    this.clearCaches();
    super.destroy();
  }
}

const fsStr = window.getComputedStyle(document.body).fontSize;
let defaultFontSize = fsStr.endsWith("px") ? parseInt(fsStr) : 16;
if (isNaN(defaultFontSize) || defaultFontSize < 14 || defaultFontSize > 20) {
  defaultFontSize = 16;
}
const defaultSize = {
  text: defaultFontSize,
  textSm: defaultFontSize * 0.75,
  textLg: defaultFontSize * 1.25,
  textXl: defaultFontSize * 1.5,
  borderRadius: Math.round(defaultFontSize * 0.375)
};
Object.freeze(defaultSize);
let specifiedSize;
function getSize() {
  return specifiedSize || defaultSize;
}
function setCssVars$1(size) {
  const { style } = document.body;
  style.setProperty("--size-text", `${size.text}px`);
  style.setProperty("--size-text-sm", `${size.textSm}px`);
  style.setProperty("--size-text-lg", `${size.textLg}px`);
  style.setProperty("--size-text-xl", `${size.textXl}px`);
  style.setProperty("--size-border-radius", `${size.borderRadius}px`);
  document.documentElement.style.fontSize = `${size.text}px`;
}
setCssVars$1(defaultSize);
function setSize(size) {
  const newSize = Object.assign({}, defaultSize);
  for (let property in size) {
    const val = size[property];
    if (!val) {
      continue;
    }
    newSize[property] = val;
  }
  specifiedSize = Object.freeze(newSize);
  setCssVars$1(specifiedSize);
}
function resetSize() {
  setSize(defaultSize);
}
function rem(rem2) {
  return getSize().text * rem2;
}

const defaultColor = {
  primary: "#1677ff",
  danger: "#ff4d4f",
  success: "#198754",
  warning: "#ffc107",
  border: "#dee2e6",
  text: "#303133",
  textSecondary: "#909399",
  outline: "#b1d2ff"
};
Object.freeze(defaultColor);
let specifiedColor;
function setCssVars(color) {
  const { style } = document.body;
  style.setProperty("--color-primary", color.primary);
  style.setProperty("--color-danger", color.danger);
  style.setProperty("--color-success", color.success);
  style.setProperty("--color-warning", color.warning);
  style.setProperty("--color-border", color.border);
  style.setProperty("--color-text", color.text);
  style.setProperty("--color-text-secondary", color.textSecondary);
  style.setProperty("--color-outline", color.outline);
  document.body.style.color = color.text;
}
setCssVars(defaultColor);
function getColor() {
  return specifiedColor || defaultColor;
}
function setColor(color) {
  const newColor = Object.assign({}, defaultColor);
  for (let property in color) {
    const val = color[property];
    if (!val) {
      continue;
    }
    newColor[property] = val;
  }
  specifiedColor = Object.freeze(newColor);
  setCssVars(specifiedColor);
}
function resetColor() {
  setColor(defaultColor);
}

class Text extends Module {
  constructor(opts) {
    const finalOpts = typeof opts === "string" ? { text: opts } : opts;
    const tag = finalOpts.tag || "span";
    super(document.createElement(tag));
    this.el.className = "wok-ui-text";
    this.el.innerText = finalOpts.text;
    if (finalOpts.size) {
      this.setSize(finalOpts.size);
    }
    if (finalOpts.bold) {
      this.el.style.fontWeight = "bold";
    }
    if (finalOpts.color) {
      this.el.style.color = finalOpts.color;
    }
    if (finalOpts.onClick) {
      this.onClick(finalOpts.onClick);
    }
  }
  setText(text) {
    this.el.innerText = text;
    return this;
  }
  setColor(color) {
    this.el.style.color = color;
    return this;
  }
  setSize(size) {
    if (size === "sm") {
      this.el.style.fontSize = "0.8rem";
    } else if (size === "default") {
      this.el.style.fontSize = "1rem";
    } else if (size === "large") {
      this.el.style.fontSize = "1.2rem";
    } else if (size === "xl") {
      this.el.style.fontSize = "1.4rem";
    } else {
      this.el.style.fontSize = `${size}px`;
    }
    return this;
  }
  setBold(bold) {
    if (bold) {
      this.el.style.fontWeight = "bold";
    } else {
      this.el.style.fontWeight = "normal";
    }
    return this;
  }
  onClick(listener) {
    this.el.style.cursor = "pointer";
    this.el.addEventListener("click", listener);
    return this;
  }
}
class PrimaryBodyText extends Text {
  constructor(text) {
    super({
      text,
      size: "default",
      color: getColor().text
    });
  }
}
class SecondaryBodyText extends Text {
  constructor(text) {
    super({
      text,
      size: "default",
      color: getColor().textSecondary
    });
  }
}
class SmallSecondaryBodyText extends Text {
  constructor(text) {
    super({
      text,
      size: "sm",
      color: getColor().textSecondary
    });
  }
}
class Title$1 extends Text {
  constructor(text) {
    super({
      tag: "h2",
      text,
      size: "large",
      color: getColor().text,
      bold: true
    });
    this.el.style.margin = "0";
  }
}
class LargeTitle extends Text {
  constructor(text) {
    super({
      tag: "h1",
      text,
      size: "xl",
      color: getColor().text,
      bold: true
    });
    this.el.style.margin = "0";
  }
}

class Spacer extends DivModule {
  constructor(height) {
    super();
    let finalHeight = rem(1);
    if (height === "sm") {
      finalHeight = rem(0.5);
    } else if (height === "lg") {
      finalHeight = rem(2);
    } else if (typeof height === "number") {
      finalHeight = height;
    }
    this.el.style.height = `${finalHeight}px`;
  }
}
class HSpacer extends DivModule {
  constructor(width) {
    super();
    let finalWidth = rem(1);
    if (width === "sm") {
      finalWidth = rem(0.5);
    } else if (width === "lg") {
      finalWidth = rem(2);
    } else if (typeof width === "number") {
      finalWidth = width;
    }
    this.el.style.display = "inline-block";
    this.el.style.width = `${finalWidth}px`;
    this.el.style.margin = "0";
  }
}

var style$9 = '';

class Button extends Module {
  constructor(opts) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("wok-ui-btn");
    super(btn);
    btn.innerText = opts.text;
    if (opts.block) {
      btn.classList.add("block");
    }
    if (opts.disabled) {
      btn.disabled = true;
    }
    if (opts.onClick) {
      btn.onclick = opts.onClick;
    }
    if (opts.width && opts.width > 0) {
      btn.style.width = `${opts.width}px`;
    }
    switch (opts.type) {
      case "primary":
        this.setCssVars(getColor().primary, !!opts.outline);
        break;
      case "danger":
        this.setCssVars(getColor().danger, !!opts.outline);
        break;
      case "success":
        this.setCssVars(getColor().success, !!opts.outline);
        break;
      case "warning":
        this.setCssVars(getColor().warning, !!opts.outline);
        break;
      default:
        this.el.style.setProperty("--btn-bg-color", "transparent");
        this.el.style.setProperty("--btn-color", getColor().text);
        this.el.style.setProperty("--btn-border-color", getColor().border);
        break;
    }
    btn.type = opts.formType || "button";
    const size = getSize();
    switch (opts.size) {
      case "lg":
        btn.style.setProperty("--btn-font-size", `${size.textLg}px`);
        break;
      case "sm":
        btn.style.setProperty("--btn-font-size", `${size.textSm}px`);
        break;
      default:
        btn.style.setProperty("--btn-font-size", `${size.text}px`);
        break;
    }
  }
  setCssVars(color, outline) {
    if (outline) {
      this.el.style.setProperty("--btn-bg-color", "transparent");
      this.el.style.setProperty("--btn-color", color);
      this.el.style.setProperty("--btn-border-color", color);
    } else {
      this.el.style.setProperty("--btn-bg-color", color);
      this.el.style.setProperty("--btn-color", "white");
      this.el.style.setProperty("--btn-border-color", color);
    }
  }
  setDisabled(disabled) {
    const btn = this.el;
    btn.disabled = disabled;
    return this;
  }
  onClick(listener) {
    const btn = this.el;
    btn.onclick = listener;
    return this;
  }
}

var grid = '';

class Grid extends DivModule {
  constructor(opts) {
    super("wok-ui-grid");
    this.opts = opts;
    if (typeof opts.gap === "number") {
      this.gap = { col: opts.gap, row: opts.gap };
    } else if (opts.gap) {
      this.gap = opts.gap;
    } else {
      this.gap = { col: 0, row: 0 };
    }
    if (!Number.isInteger(opts.cols)) {
      throw new Error(`cols \u5FC5\u987B\u662F\u6574\u6570,\u5F53\u524D\u503C: ${opts.cols}`);
    }
    if (opts.cols < 1 || opts.cols > 12) {
      throw new Error(`cols \u8D85\u51FA\u8303\u56F4, \u6709\u6548\u8303\u56F4\u662F 1-12 ,\u5F53\u524D\u503C: ${opts.cols}`);
    }
    this.el.style.columnGap = `${this.gap.col}px`;
    this.el.style.rowGap = `${this.gap.row}px`;
    buildSubModules(opts.cells).forEach((cell) => this.addCell(cell));
  }
  addCell(module) {
    this.addChild({
      style: {
        width: `calc((100% - ${this.gap.col * (this.opts.cols - 1)}px) / ${this.opts.cols})`,
        minWidth: this.opts.cellMinWidth && this.opts.cellMinWidth > 0 ? `${this.opts.cellMinWidth}px` : void 0
      },
      children: module
    });
  }
}

class HBox extends DivModule {
  constructor(opts) {
    super("wok-ui-hbox");
    this.el.style.display = "flex";
    if (typeof opts.gap === "number") {
      this.el.style.gap = `${opts.gap}px ${opts.gap}px`;
    } else if (opts.gap) {
      this.el.style.gap = `${opts.gap.row}px ${opts.gap.column}px`;
    }
    if (opts.wrap) {
      this.el.style.flexWrap = "wrap";
    } else {
      this.el.style.flexWrap = "nowrap";
    }
    if (opts.reverse) {
      this.el.style.flexDirection = "row-reverse";
    } else {
      this.el.style.flexDirection = "row";
    }
    if (opts.align) {
      switch (opts.align) {
        case "center":
          this.el.style.alignItems = "center";
          break;
        case "top":
          this.el.style.alignItems = "start";
          break;
        case "bottom":
          this.el.style.alignItems = "end";
          break;
      }
    }
    this.addChild(...buildSubModules(opts.children));
    if (opts.onClick) {
      this.el.style.cursor = "pointer";
      this.el.addEventListener("click", opts.onClick);
    }
  }
}

var justifyBox = '';

class JustifyBox extends DivModule {
  constructor(opts) {
    super("wok-ui-justify-box");
    if (opts.align) {
      switch (opts.align) {
        case "center":
          this.el.style.alignItems = "center";
          break;
        case "top":
          this.el.style.alignItems = "start";
          break;
        case "bottom":
          this.el.style.alignItems = "end";
          break;
      }
    }
    this.addChild(...buildSubModules(opts.children));
    if (opts.onClick) {
      this.el.style.cursor = "pointer";
      this.el.addEventListener("click", opts.onClick);
    }
  }
}

var splitBox = '';

class VSplitBox extends DivModule {
  constructor(opts) {
    super("wok-ui-v-split-box");
    this.el.style.height = `${opts.height}px`;
    if (opts.fixedSide === "top") {
      this.el.classList.add("fix-top");
    } else {
      this.el.classList.add("fix-bottom");
    }
    this.addChild(opts.top, opts.bottom);
    if (opts.onClick) {
      this.el.style.cursor = "pointer";
      this.el.addEventListener("click", opts.onClick);
    }
  }
}
class HSplitBox extends DivModule {
  constructor(opts) {
    super("wok-ui-h-split-box");
    switch (opts.fixedSide) {
      case "left":
        this.el.classList.add("fix-left");
        break;
      case "right":
        this.el.classList.add("fix-right");
        break;
    }
    if (opts.align) {
      switch (opts.align) {
        case "center":
          this.el.style.alignItems = "center";
          break;
        case "top":
          this.el.style.alignItems = "start";
          break;
        case "bottom":
          this.el.style.alignItems = "end";
          break;
        default:
          this.el.style.alignItems = "stretch";
          break;
      }
    }
    if (opts.gap && opts.gap > 0) {
      this.el.style.gap = `${opts.gap}px`;
    }
    this.addChild(opts.left, opts.right);
    if (opts.onClick) {
      this.el.style.cursor = "pointer";
      this.el.addEventListener("click", opts.onClick);
    }
  }
}

var vbox = '';

class VBox extends DivModule {
  constructor(opts) {
    super("wok-ui-vbox");
    if (opts.gap && opts.gap > 0) {
      this.el.style.gap = `${opts.gap}px`;
    }
    if (opts.align) {
      switch (opts.align) {
        case "left":
          this.el.style.alignItems = "start";
          break;
        case "center":
          this.el.style.alignItems = "center";
          break;
        case "right":
          this.el.style.alignItems = "end";
          break;
        case "stretch":
          this.el.style.alignItems = "stretch";
          break;
      }
    }
    this.addChild(...buildSubModules(opts.children));
    if (opts.onClick) {
      this.el.style.cursor = "pointer";
      this.el.addEventListener("click", opts.onClick);
    }
  }
}

var loading$1 = '';

let loading;
function showLoading(msg) {
  hideLoading();
  loading = createDomModule({
    classNames: ["wok-ui-loading"],
    children(addChild) {
      addChild({
        classNames: ["loading-spinner"],
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`
      });
      if (msg) {
        addChild(new PrimaryBodyText(msg));
      }
    }
  });
  loading.mount(document.body);
}
function hideLoading() {
  if (loading) {
    loading.destroy();
    loading = void 0;
  }
}

var dialog = '';

function showAlert(msg) {
  return new Promise((res) => {
    const dialog = createDomModule({
      classNames: "wok-ui-dialog-box",
      children: {
        classNames: ["dialog-content", Animation.SLIDE_TOP],
        children: [
          { classNames: "dialog-body", innerText: msg },
          {
            classNames: "dialog-footer",
            children: {
              innerText: getI18n().buildMsg("confirm"),
              onClick(ev) {
                res();
                dialog.destroy();
              }
            }
          }
        ]
      }
    });
    dialog.mount(document.body);
  });
}
function showConfirm(msg) {
  return new Promise((res) => {
    const dialog = createDomModule({
      classNames: ["wok-ui-dialog-box"],
      children: {
        classNames: ["dialog-content", Animation.SLIDE_TOP],
        children: [
          { classNames: "dialog-body", innerText: msg },
          {
            classNames: "dialog-footer",
            children: [
              {
                innerText: getI18n().buildMsg("cancel"),
                onClick(ev) {
                  res(false);
                  dialog.destroy();
                }
              },
              {
                children: new Text({
                  text: getI18n().buildMsg("confirm"),
                  color: getColor().primary
                }),
                onClick(ev) {
                  res(true);
                  dialog.destroy();
                }
              }
            ]
          }
        ]
      }
    });
    dialog.mount(document.body);
  });
}

var toast = '';

var style$8 = '';

class SvgIcon extends DivModule {
  constructor(svgHtml) {
    super("wok-ui-svg-icon");
    this.el.innerHTML = svgHtml;
    const svg = this.el.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", "currentColor");
    }
  }
  setSize(height) {
    this.el.style.fontSize = `${height}px`;
    return this;
  }
  setColor(color) {
    this.el.style.color = color;
    return this;
  }
}

const CACHE_MAP = /* @__PURE__ */ new Map();
async function getSvgCodeFromCache(url) {
  const val = CACHE_MAP.get(url);
  if (val) {
    return val;
  }
  const promise = fetch(url).then(async (res) => {
    if (res.status !== 200) {
      throw new Error(`Failed to fetch icon, status code: ${res.status}, url\uFF1A${url}`);
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType || contentType.toLowerCase() !== "image/svg+xml") {
      throw new Error(`Failed to fetch icon, incorrect type\uFF1A${contentType}`);
    }
    const code = await res.text();
    CACHE_MAP.set(url, code);
    return code;
  });
  CACHE_MAP.set(url, promise);
  return promise;
}
class RemoteSvgIcon extends DivModule {
  constructor(iconUrl) {
    super("wok-ui-svg-icon");
    getSvgCodeFromCache(iconUrl).then((code) => {
      this.el.innerHTML = code;
      const svg = this.el.querySelector("svg");
      if (svg) {
        svg.setAttribute("fill", "currentColor");
      }
    }).catch(console.error);
  }
  setSize(height) {
    this.el.style.fontSize = `${height}px`;
    return this;
  }
  setColor(color) {
    this.el.style.color = color;
    return this;
  }
}

class IconSuccess extends SvgIcon {
  constructor() {
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
    );
    this.setColor(getColor().success);
  }
}
class IconWarning extends SvgIcon {
  constructor() {
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`
    );
    this.setColor(getColor().warning);
  }
}
class Oven extends DivModule {
  constructor() {
    super("wok-ui-oven");
  }
  addChild(...child) {
    super.addChild(...child);
  }
}
class Toast extends DivModule {
  constructor(opts) {
    super("wok-ui-toast", Animation.SLIDE_TOP);
    switch (opts.type) {
      case "success":
        this.addChild(new IconSuccess());
        break;
      case "warning":
        this.addChild(new IconWarning());
        break;
    }
    this.addChild(new HSpacer(8), new Text(opts.text));
    setTimeout(() => {
      this.destroy();
    }, opts.duration);
  }
  destroy() {
    animate({ el: this.el, animation: Animation.FADE, reverse: true, duration: 300 }).then(() => {
      super.destroy();
    }).catch(console.error);
  }
}
let oven;
function showToast(opts) {
  let duration = 3e3;
  if (opts.duration && opts.duration > 0) {
    duration = opts.duration;
  }
  if (!oven) {
    oven = new Oven();
    oven.mount(document.body);
  }
  oven.addChild(new Toast({ type: opts.type, text: opts.text, duration }));
}
function showWarning(errMsg) {
  let message = "";
  if (typeof errMsg === "string") {
    message = errMsg;
  } else if (errMsg instanceof Error) {
    message = errMsg.message;
    console.error(errMsg);
  } else {
    message = JSON.stringify(errMsg);
  }
  showToast({ type: "warning", text: message });
}
function showSuccess(text) {
  showToast({ type: "success", text });
}

var style$7 = '';

class Backdrop$1 extends DivModule {
  constructor(opts) {
    super("wok-ui-modal");
    this.opts = opts;
  }
  addDialog(dialog) {
    dialog.onDestroy(() => {
      if (this.getChildren().length === 0) {
        this.destroy();
      }
    });
    this.addChild(dialog);
  }
  async closeAllModals() {
    const children = this.getChildren();
    for (const child of children) {
      await child.close();
    }
  }
  removeChild(moduleOrIndex) {
    const res = super.removeChild(moduleOrIndex);
    if (this.getChildren().length === 0) {
      this.destroy();
    }
    return res;
  }
  mount(parentEl) {
    super.mount(parentEl);
    document.body.classList.add("wok-ui-modal-lock-scroll");
  }
  destroy() {
    document.body.classList.remove("wok-ui-modal-lock-scroll");
    super.destroy();
    this.opts.onDestroy();
  }
}
class Dialog extends DivModule {
  constructor(opts) {
    super("wok-ui-modal-dialog", ANIMATION_PROVISION);
    this.opts = opts;
    this.callbacked = false;
    animate({ el: this.el, animation: Animation.SLIDE_TOP, duration: 300 }).then(() => {
      if (opts.onShown) {
        opts.onShown();
      }
    });
    if (this.opts.fullscreen) {
      this.el.classList.add("fullscreen");
    } else if (this.opts.dialogCentered) {
      this.el.classList.add("centered");
    }
    this.el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.tryDestroy();
    });
    if (opts.replaceByBody) {
      this.addChild({
        classNames: ["wok-ui-modal-content"],
        style: {
          borderRadius: opts.borderRadius && opts.borderRadius > 0 ? `${opts.borderRadius}px` : void 0,
          width: opts.fullscreen ? void 0 : opts.width && opts.width > 0 ? `${opts.width}px` : "500px"
        },
        onClick(ev) {
          ev.stopPropagation();
        },
        children: opts.body
      });
      return;
    }
    this.addChild({
      classNames: ["wok-ui-modal-content", "normal"],
      style: {
        borderRadius: opts.borderRadius && opts.borderRadius > 0 ? `${opts.borderRadius}px` : void 0,
        width: opts.fullscreen ? void 0 : opts.width && opts.width > 0 ? `${opts.width}px` : "500px"
      },
      onClick(ev) {
        ev.stopPropagation();
      },
      children: (addChild) => {
        if (opts.title) {
          addChild({
            classNames: ["wok-ui-modal-header"],
            children: (addChild2) => {
              addChild2({ classNames: ["title"], innerText: opts.title });
              if (opts.closeBtn !== false) {
                addChild2({
                  classNames: ["close"],
                  innerHTML: "&times;",
                  onClick: () => {
                    this.close().catch(showWarning);
                  }
                });
              }
            }
          });
        }
        addChild({
          classNames: ["wok-ui-modal-body"],
          children: opts.body
        });
        if (opts.footer) {
          addChild(opts.footer);
        } else if (opts.buttons && (opts.buttons.cancel || opts.buttons.confirm)) {
          const { confirm, cancel } = opts.buttons;
          addChild({
            classNames: ["wok-ui-modal-footer"],
            children: (addChild2) => {
              if (confirm) {
                addChild2(
                  new Button({
                    text: typeof confirm === "string" ? confirm : getI18n().buildMsg("confirm"),
                    type: "primary",
                    onClick(ev) {
                      if (opts.onConfirm) {
                        opts.onConfirm();
                      }
                    }
                  })
                );
              }
              if (cancel) {
                addChild2(
                  new Button({
                    text: typeof cancel === "string" ? cancel : getI18n().buildMsg("cancel"),
                    onClick: (ev) => this.close().catch(showWarning)
                  })
                );
              }
            }
          });
        }
      }
    });
  }
  tryDestroy() {
    if (this.opts.staticBackDrop) {
      animate({ el: this.el, animation: Animation.SHAKE }).catch(showWarning);
      return;
    }
    this.close().catch(showWarning);
  }
  onDestroy(listener) {
    this.destroyListener = listener;
  }
  async close() {
    await animate({ el: this.el, animation: Animation.SLIDE_TOP, duration: 300, reverse: true });
    this.destroy();
    if (this.destroyListener) {
      this.destroyListener();
    }
    if (this.opts.onClose && !this.callbacked) {
      this.opts.onClose();
      this.callbacked = true;
    }
  }
}
let backdrop$1;
function showModal(options) {
  if (!backdrop$1) {
    backdrop$1 = new Backdrop$1({ onDestroy: () => backdrop$1 = void 0 });
    backdrop$1.mount(document.body);
  }
  const modal = new Dialog(options);
  backdrop$1.addDialog(modal);
  return {
    close: () => modal.close()
  };
}
async function closeAllModals() {
  if (backdrop$1) {
    await backdrop$1.closeAllModals();
  }
}

var style$6 = '';

class Backdrop extends DivModule {
  constructor(opts) {
    super("wok-ui-drawer");
    this.opts = opts;
    this.el.addEventListener("click", () => {
      const children = this.getChildren();
      if (children.length) {
        children[children.length - 1].destroy();
      }
    });
  }
  addContent(content) {
    content.onDestroy(() => {
      if (this.getChildren().length === 0) {
        this.destroy();
      }
    });
    this.addChild(content);
  }
  mount(parentEl) {
    super.mount(parentEl);
    document.body.classList.add("wok-ui-drawer-lock-scroll");
  }
  destroy() {
    document.body.classList.remove("wok-ui-drawer-lock-scroll");
    super.destroy();
    this.opts.onDestroy();
  }
}
class Content extends DivModule {
  constructor(opts) {
    super("wok-ui-drawer-content", ANIMATION_PROVISION);
    this.opts = opts;
    this.callbacked = false;
    this.leaveAnimating = false;
    this.el.addEventListener("click", (e) => e.stopPropagation());
    if (opts.placement === "left") {
      this.el.classList.add("left");
    } else if (opts.placement === "top") {
      this.el.classList.add("top");
    } else if (opts.placement === "bottom") {
      this.el.classList.add("bottom");
    } else {
      this.el.classList.add("right");
    }
    this.enter().catch(showWarning);
    if (opts.replaceByBody) {
      this.addChild(...buildSubModules(opts.body));
      return;
    }
    if (opts.title) {
      this.addChild({
        classNames: ["header"],
        children: [
          {
            classNames: ["title"],
            innerText: opts.title
          },
          {
            classNames: ["close"],
            innerHTML: "&times;",
            onClick: () => this.destroy()
          }
        ]
      });
    }
    this.addChild({
      classNames: ["body"],
      children: opts.body
    });
  }
  enter() {
    if (this.opts.placement === "left") {
      return animate({ el: this.el, animation: Animation.SLIDE_LEFT });
    } else if (this.opts.placement === "top") {
      return animate({ el: this.el, animation: Animation.SLIDE_TOP });
    } else if (this.opts.placement === "bottom") {
      return animate({ el: this.el, animation: Animation.SLIDE_BOTTOM });
    } else {
      return animate({ el: this.el, animation: Animation.SLIDE_RIGHT });
    }
  }
  async leave() {
    this.leaveAnimating = true;
    try {
      if (this.opts.placement === "left") {
        await animate({ el: this.el, animation: Animation.SLIDE_LEFT, reverse: true });
      } else if (this.opts.placement === "top") {
        await animate({ el: this.el, animation: Animation.SLIDE_TOP, reverse: true });
      } else if (this.opts.placement === "bottom") {
        await animate({ el: this.el, animation: Animation.SLIDE_BOTTOM, reverse: true });
      } else {
        await animate({ el: this.el, animation: Animation.SLIDE_RIGHT, reverse: true });
      }
    } finally {
      this.leaveAnimating = false;
    }
  }
  onDestroy(listener) {
    this.destroyListener = listener;
  }
  destroy() {
    if (this.leaveAnimating) {
      return;
    }
    this.leave().then(() => {
      super.destroy();
      if (this.destroyListener) {
        this.destroyListener();
      }
      if (this.opts.onClose && !this.callbacked) {
        this.opts.onClose();
        this.callbacked = true;
      }
    });
  }
}
let backdrop;
function showDrawer(options) {
  if (!backdrop) {
    backdrop = new Backdrop({ onDestroy: () => backdrop = void 0 });
    backdrop.mount(document.body);
  }
  const content = new Content(options);
  backdrop.addContent(content);
  return {
    close: () => content.destroy()
  };
}

var table = '';

class TableRow extends Module {
  constructor(opts) {
    super(document.createElement("tr"));
    opts.cols.forEach((col) => {
      this.addChild(
        new Cell({
          data: opts.data,
          col,
          rowIdx: opts.rowIdx
        })
      );
    });
  }
}
class Cell extends Module {
  constructor(opts) {
    super(document.createElement("td"));
    const content = opts.col.setting.content(opts.data, opts.rowIdx);
    this.addChild(content);
  }
}

class TableBody extends Module {
  constructor(opts) {
    super(document.createElement("tbody"));
    this.addChild(
      ...opts.list.map(
        (data, idx) => new TableRow({
          data,
          cols: opts.cols,
          rowIdx: idx
        })
      )
    );
  }
}

class TableHeader extends Module {
  constructor(opts) {
    super(document.createElement("thead"));
    this.addChild({
      tag: "tr",
      children: opts.cols.map((col) => {
        const width = col.setting.width && col.setting.width > 0 ? col.setting.width : 80;
        return new Title(col.setting.name, width);
      })
    });
  }
}
class Title extends Module {
  constructor(content, width) {
    super(document.createElement("th"));
    this.el.style.width = `${width}px`;
    if (typeof content === "string") {
      this.el.innerText = content;
      return;
    }
    this.addChild(content);
  }
}

class Table extends DivModule {
  constructor(opts) {
    super("kk-table");
    if (opts.bordered) {
      this.el.classList.add("bordered");
    }
    this.addChild({
      tag: "table",
      children: [
        new TableHeader({ cols: opts.cols }),
        new TableBody({
          table: this,
          list: opts.list,
          cols: opts.cols
        })
      ]
    });
  }
}

class FormInput extends Module {
  constructor(elOrClass) {
    var __super = (...args) => {
      super(...args);
    };
    if (elOrClass) {
      if (typeof elOrClass === "string") {
        __super(document.createElement("div"));
        this.el.classList.add(elOrClass);
      } else {
        __super(elOrClass);
      }
    } else {
      __super(document.createElement("div"));
    }
    this.el.classList.add("wok-ui-form-input");
  }
  showInvalidFeedback(errMsg) {
    this.hideInvalidFeedback();
    this.addChild(this.__feedback = new InvalidFeedback(errMsg));
  }
  hideInvalidFeedback() {
    if (this.__feedback) {
      this.__feedback.destroy();
      this.__feedback = void 0;
    }
  }
}
class InvalidFeedback extends DivModule {
  constructor(errMsg) {
    super("invalid-feedback");
    this.el.innerText = errMsg;
  }
}

var style$5 = '';

class TextInput extends FormInput {
  constructor(opts) {
    super(document.createElement("div"));
    this.opts = opts;
    this.composing = false;
    this.opts = opts;
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.classList.add("wok-ui-input");
    const size = getSize();
    switch (opts.size) {
      case "lg":
        this.input.style.setProperty("--input-font-size", `${size.textLg}px`);
        break;
      case "sm":
        this.input.style.setProperty("--input-font-size", `${size.textSm}px`);
        break;
      default:
        this.input.style.setProperty("--input-font-size", `${size.text}px`);
        break;
    }
    this.addChild(this.input);
    this.input.placeholder = opts.placeholder || "";
    if (typeof opts.minLength === "number") {
      this.input.minLength = opts.minLength;
    } else if (opts.minLength) {
      this.input.minLength = opts.minLength.minLength;
    }
    if (typeof opts.maxLength === "number") {
      this.input.maxLength = opts.maxLength;
    } else if (opts.maxLength) {
      this.input.maxLength = opts.maxLength.maxLength;
    }
    if (opts.required) {
      this.input.required = true;
    }
    if (opts.value) {
      this.input.value = opts.value;
    }
    if (opts.disabled) {
      this.input.disabled = true;
    }
    this.input.addEventListener("compositionstart", () => this.composing = true);
    this.input.addEventListener("compositionend", () => {
      this.composing = false;
      this.handleChange();
    });
    this.input.addEventListener("input", () => {
      if (this.composing) {
        return;
      }
      this.handleChange();
    });
    if (opts.onBlur) {
      this.input.addEventListener("blur", opts.onBlur);
    }
  }
  mount(parentEl) {
    super.mount(parentEl);
    if (this.opts.autofocus) {
      setTimeout(() => this.input.focus(), 0);
    }
  }
  focus() {
    this.input.focus();
  }
  handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.input.value);
    }
    this.validate();
  }
  __validate(val) {
    if (this.opts.required) {
      if (!val) {
        return {
          valid: false,
          msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-required")
        };
      }
    }
    if (!val) {
      return { valid: true };
    }
    if (typeof this.opts.minLength === "number") {
      if (val.length < this.opts.minLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-min-length", `${this.opts.minLength}`)
        };
      }
    } else if (this.opts.minLength) {
      if (val.length < this.opts.minLength.minLength) {
        return { valid: false, msg: this.opts.minLength.errMsg };
      }
    }
    if (typeof this.opts.maxLength === "number") {
      if (val.length > this.opts.maxLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-max-length", `${this.opts.maxLength}`)
        };
      }
    } else if (this.opts.maxLength) {
      if (val.length > this.opts.maxLength.maxLength) {
        return { valid: false, msg: this.opts.maxLength.errMsg };
      }
    }
    if (this.opts.validator) {
      return this.opts.validator(val);
    }
    return { valid: true };
  }
  validate() {
    const validateRes = this.__validate(this.input.value);
    if (validateRes.valid) {
      this.input.classList.remove("invalid");
      this.hideInvalidFeedback();
    } else {
      this.input.classList.add("invalid");
      this.showInvalidFeedback(validateRes.msg);
    }
    return validateRes.valid;
  }
  setDisabled(disabled) {
    this.input.disabled = disabled;
  }
}

class TelInput extends TextInput {
  constructor(opts) {
    super(opts);
    this.input.type = "tel";
  }
}

class SearchInput extends TextInput {
  constructor(opts) {
    super(opts);
    this.input.type = "search";
  }
}

class PasswordInput extends TextInput {
  constructor(opts) {
    super(opts);
    this.input.type = "password";
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthStr = `${month}`.padStart(2, "0");
  const dayStr = `${day}`.padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
}
function parseDate(dateStr) {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? void 0 : date;
}
class DateInput extends TextInput {
  constructor(dateOpts) {
    super({
      required: dateOpts.required,
      value: dateOpts.value ? formatDate(dateOpts.value) : void 0,
      disabled: dateOpts.disabled,
      placeholder: dateOpts.placeholder,
      size: dateOpts.size,
      validator(val) {
        const date = parseDate(val);
        if (!date) {
          if (dateOpts.required) {
            return {
              valid: false,
              msg: typeof dateOpts.required === "string" ? dateOpts.required : getI18n().buildMsg("form-err-required")
            };
          }
          return { valid: true };
        }
        if (dateOpts.min instanceof Date) {
          if (date.getTime() < dateOpts.min.getTime()) {
            return {
              valid: false,
              msg: getI18n().buildMsg("form-err-min", `${formatDate(dateOpts.min)}`)
            };
          }
        } else if (dateOpts.min) {
          if (date.getTime() < dateOpts.min.min.getTime()) {
            return { valid: false, msg: dateOpts.min.errMsg };
          }
        }
        if (dateOpts.max instanceof Date) {
          if (date.getTime() > dateOpts.max.getTime()) {
            return {
              valid: false,
              msg: getI18n().buildMsg("form-err-max", `${formatDate(dateOpts.max)}`)
            };
          }
        } else if (dateOpts.max) {
          if (date.getTime() > dateOpts.max.max.getTime()) {
            return { valid: false, msg: dateOpts.max.errMsg };
          }
        }
        return { valid: true };
      },
      onChange(val) {
        if (!dateOpts.onChange) {
          return;
        }
        if (!val) {
          dateOpts.onChange(void 0);
          return;
        }
        dateOpts.onChange(parseDate(val));
      },
      onBlur: dateOpts.onBlur
    });
    this.input.type = "date";
    if (dateOpts.min instanceof Date) {
      this.input.min = formatDate(dateOpts.min);
    } else if (dateOpts.min) {
      this.input.min = formatDate(dateOpts.min.min);
    }
    if (dateOpts.max instanceof Date) {
      this.input.max = formatDate(dateOpts.max);
    } else if (dateOpts.max) {
      this.input.max = formatDate(dateOpts.max.max);
    }
  }
}

var color = '';

class ColorInput extends TextInput {
  constructor(colorOpts) {
    super(colorOpts);
    this.input.type = "color";
  }
}

class NumberInput extends TextInput {
  constructor(numOpts) {
    super({
      required: numOpts.required,
      placeholder: numOpts.placeholder,
      value: typeof numOpts.value === "number" ? `${numOpts.value}` : void 0,
      disabled: numOpts.disabled,
      size: numOpts.size,
      validator(val) {
        if (!val) {
          if (numOpts.required) {
            return {
              valid: false,
              msg: typeof numOpts.required === "string" ? numOpts.required : getI18n().buildMsg("form-err-required")
            };
          }
          return { valid: true };
        }
        const num = parseFloat(val);
        if (isNaN(num)) {
          return { valid: false, msg: getI18n().buildMsg("form-err-number") };
        }
        if (typeof numOpts.max === "number") {
          if (num > numOpts.max) {
            return { valid: false, msg: getI18n().buildMsg("form-err-max", `${numOpts.max}`) };
          }
        } else if (numOpts.max) {
          if (num > numOpts.max.max) {
            return { valid: false, msg: numOpts.max.errMsg };
          }
        }
        if (typeof numOpts.min === "number") {
          if (num < numOpts.min) {
            return { valid: false, msg: getI18n().buildMsg("form-err-min", `${numOpts.min}`) };
          }
        } else if (numOpts.min) {
          if (num < numOpts.min.min) {
            return { valid: false, msg: numOpts.min.errMsg };
          }
        }
        if (numOpts.validator) {
          return numOpts.validator(num);
        }
        return { valid: true };
      },
      onChange(val) {
        if (numOpts.onChange) {
          if (!val) {
            numOpts.onChange(void 0);
          } else {
            numOpts.onChange(parseFloat(val));
          }
        }
      },
      onBlur: numOpts.onBlur
    });
    this.input.type = "number";
    if (typeof numOpts.max === "number") {
      this.input.max = `${numOpts.max}`;
    } else if (numOpts.max) {
      this.input.max = `${numOpts.max.max}`;
    }
    if (typeof numOpts.min === "number") {
      this.input.min = `${numOpts.min}`;
    } else if (numOpts.min) {
      this.input.min = `${numOpts.min.min}`;
    }
  }
}

class TextArea extends FormInput {
  constructor(textAreaopts) {
    super(document.createElement("div"));
    this.textAreaopts = textAreaopts;
    this.composing = false;
    this.textareaEl = document.createElement("textarea");
    this.textareaEl.classList.add("wok-ui-input");
    const size = getSize();
    switch (textAreaopts.size) {
      case "lg":
        this.textareaEl.style.setProperty("--input-font-size", `${size.textLg}px`);
        break;
      case "sm":
        this.textareaEl.style.setProperty("--input-font-size", `${size.textSm}px`);
        break;
      default:
        this.textareaEl.style.setProperty("--input-font-size", `${size.text}px`);
        break;
    }
    this.addChild(this.textareaEl);
    this.textareaEl.rows = textAreaopts.rows && textAreaopts.rows > 0 ? textAreaopts.rows : 3;
    if (typeof textAreaopts.minLength === "number") {
      this.textareaEl.minLength = textAreaopts.minLength;
    } else if (textAreaopts.minLength) {
      this.textareaEl.minLength = textAreaopts.minLength.minLength;
    }
    if (typeof textAreaopts.maxLength === "number") {
      this.textareaEl.maxLength = textAreaopts.maxLength;
    } else if (textAreaopts.maxLength) {
      this.textareaEl.maxLength = textAreaopts.maxLength.maxLength;
    }
    if (textAreaopts.required) {
      this.textareaEl.required = true;
    }
    if (textAreaopts.value) {
      this.textareaEl.value = textAreaopts.value;
    }
    if (textAreaopts.disabled) {
      this.textareaEl.disabled = true;
    }
    if (textAreaopts.placeholder) {
      this.textareaEl.placeholder = textAreaopts.placeholder;
    }
    this.textareaEl.addEventListener("compositionstart", () => this.composing = true);
    this.textareaEl.addEventListener("compositionend", () => {
      this.composing = false;
      this.handleChange();
    });
    this.textareaEl.addEventListener("input", () => {
      if (this.composing) {
        return;
      }
      this.handleChange();
    });
    if (textAreaopts.onBlur) {
      const { onBlur } = textAreaopts;
      this.textareaEl.addEventListener("blur", () => onBlur());
    }
  }
  handleChange() {
    if (this.textAreaopts.onChange) {
      this.textAreaopts.onChange(this.textareaEl.value);
    }
    this.validate();
  }
  __validate(val) {
    if (this.textAreaopts.required) {
      if (!val) {
        return {
          valid: false,
          msg: typeof this.textAreaopts.required === "string" ? this.textAreaopts.required : getI18n().buildMsg("form-err-required")
        };
      }
    }
    if (!val) {
      return { valid: true };
    }
    if (typeof this.textAreaopts.minLength === "number") {
      if (val.length < this.textAreaopts.minLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-min-length", `${this.textAreaopts.minLength}`)
        };
      }
    } else if (this.textAreaopts.minLength) {
      if (val.length < this.textAreaopts.minLength.minLength) {
        return { valid: false, msg: this.textAreaopts.minLength.errMsg };
      }
    }
    if (typeof this.textAreaopts.maxLength === "number") {
      if (val.length > this.textAreaopts.maxLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-max-length", `${this.textAreaopts.maxLength}`)
        };
      }
    } else if (this.textAreaopts.maxLength) {
      if (val.length > this.textAreaopts.maxLength.maxLength) {
        return { valid: false, msg: this.textAreaopts.maxLength.errMsg };
      }
    }
    if (this.textAreaopts.validator) {
      return this.textAreaopts.validator(val);
    }
    return { valid: true };
  }
  validate() {
    const validateRes = this.__validate(this.textareaEl.value);
    if (validateRes.valid) {
      this.textareaEl.classList.remove("invalid");
      this.hideInvalidFeedback();
    } else {
      this.textareaEl.classList.add("invalid");
      this.showInvalidFeedback(validateRes.msg);
    }
    return validateRes.valid;
  }
  setDisabled(disabled) {
    this.textareaEl.disabled = disabled;
  }
}

class FileInput extends FormInput {
  constructor(opts) {
    super(document.createElement("div"));
    this.opts = opts;
    this.input = document.createElement("input");
    this.input.classList.add("wok-ui-input");
    this.input.type = "file";
    this.input.accept = opts.accept || "*";
    this.input.multiple = !!opts.multiple;
    const size = getSize();
    switch (opts.size) {
      case "lg":
        this.input.style.setProperty("--input-font-size", `${size.textLg}px`);
        break;
      case "sm":
        this.input.style.setProperty("--input-font-size", `${size.textSm}px`);
        break;
      default:
        this.input.style.setProperty("--input-font-size", `${size.text}px`);
        break;
    }
    this.input.onchange = () => this.handleChange();
    this.addChild(this.input);
  }
  __validate() {
    const { files } = this.input;
    if (this.opts.required) {
      if (!files || !files.length) {
        return {
          valid: false,
          msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-required")
        };
      }
    }
    if (!files || !files.length) {
      return { valid: true };
    }
    if (typeof this.opts.minSelected === "number") {
      if (files.length < this.opts.minSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-min-files-select", `${this.opts.minSelected}`)
        };
      }
    } else if (this.opts.minSelected) {
      if (files.length < this.opts.minSelected.minSelected) {
        return { valid: false, msg: this.opts.minSelected.errMsg };
      }
    }
    if (this.opts.multiple) {
      if (typeof this.opts.maxSelected === "number") {
        if (files.length > this.opts.maxSelected) {
          return {
            valid: false,
            msg: getI18n().buildMsg("form-err-max-files-select", `${this.opts.maxSelected}`)
          };
        }
      } else if (this.opts.maxSelected) {
        if (files.length > this.opts.maxSelected.maxSelected) {
          return { valid: false, msg: this.opts.maxSelected.errMsg };
        }
      }
    }
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
    }
    if (typeof this.opts.minSize === "number") {
      if (totalSize < this.opts.minSize) {
        return { valid: false, msg: getI18n().buildMsg("form-err-min-size", this.formatFileSize(this.opts.minSize)) };
      }
    } else if (this.opts.minSize) {
      if (totalSize < this.opts.minSize.minSize) {
        return { valid: false, msg: this.opts.minSize.errMsg };
      }
    }
    if (typeof this.opts.maxSize === "number") {
      if (totalSize > this.opts.maxSize) {
        return { valid: false, msg: getI18n().buildMsg("form-err-max-size", this.formatFileSize(this.opts.maxSize)) };
      }
    } else if (this.opts.maxSize) {
      if (totalSize > this.opts.maxSize.maxSize) {
        return { valid: false, msg: this.opts.maxSize.errMsg };
      }
    }
    if (this.opts.validator) {
      return this.opts.validator(files);
    }
    return { valid: true };
  }
  handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.input.files);
    }
    this.validate();
  }
  validate() {
    const validateRes = this.__validate();
    if (validateRes.valid) {
      this.input.classList.remove("invalid");
      this.hideInvalidFeedback();
    } else {
      this.input.classList.add("invalid");
      this.showInvalidFeedback(validateRes.msg);
    }
    return validateRes.valid;
  }
  formatFileSize(size) {
    if (size < 1024) {
      return `${this.formatSizeNumber(size)}B`;
    } else if (size < 1024 * 1024) {
      return `${this.formatSizeNumber(size / 1024)}KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${this.formatSizeNumber(size / (1024 * 1024))}MB`;
    } else {
      return `${this.formatSizeNumber(size / (1024 * 1024 * 1024))}GB`;
    }
  }
  formatSizeNumber(size) {
    const s = size.toFixed(2);
    if (s.endsWith(".00")) {
      return s.substring(0, s.length - 3);
    } else if (s.endsWith("0")) {
      return s.substring(0, s.length - 1);
    } else {
      return s;
    }
  }
}

var style$4 = '';

class Form extends Module {
  constructor(opts) {
    const form = document.createElement("form");
    form.classList.add("wok-ui-form");
    form.noValidate = true;
    form.autocomplete = opts.autocomplete ? "on" : "off";
    super(form);
    this.opts = opts;
    if (opts.feedbackMode === "tooltip") {
      form.classList.add("feedback-tooltip");
    } else {
      form.classList.add("feedback-inline");
    }
    this.addChild(...buildSubModules(opts.children));
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      this.submit();
    });
  }
  submit() {
    if (!this.opts.onSubmit) {
      return;
    }
    const invalidInputs = this.find((m) => m instanceof FormInput).filter(
      (m) => !m.validate()
    );
    if (invalidInputs.length) {
      invalidInputs[0].scrollIntoViewIfInvisible();
      if (invalidInputs[0] instanceof TextInput) {
        invalidInputs[0].focus();
      }
      return;
    }
    this.opts.onSubmit();
  }
}

var checkbox = '';

class Checkbox extends Module {
  constructor(opts) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("wok-ui-checkbox");
    super(input);
    input.value = opts.value;
    this.value = opts.value;
    this.__input = input;
    if (opts.disabled) {
      input.disabled = opts.disabled;
    }
    this.setStatus(opts.status || "unchecked");
    if (opts.onChange) {
      const { onChange } = opts;
      this.el.addEventListener("change", (ev) => {
        ev.stopPropagation();
        onChange(this.getStatus());
      });
    }
  }
  setStatus(status) {
    if (status === this.getStatus()) {
      return;
    }
    switch (status) {
      case "checked":
        this.__input.checked = true;
        this.__input.indeterminate = false;
        break;
      case "unchecked":
        this.__input.checked = false;
        this.__input.indeterminate = false;
        break;
      case "indeterminate":
        this.__input.checked = false;
        this.__input.indeterminate = true;
        break;
    }
  }
  getStatus() {
    if (this.__input.checked) {
      return "checked";
    }
    if (this.__input.indeterminate) {
      return "indeterminate";
    }
    return "unchecked";
  }
  isChecked() {
    return this.__input.checked;
  }
  setDisabled(disabled) {
    this.__input.disabled = disabled;
  }
}

var checkboxGroup = '';

class CheckboxGroup extends FormInput {
  constructor(opts) {
    super();
    this.opts = opts;
    this.__values = [];
    this.__disabled = false;
    if (opts.value) {
      this.__values = [...opts.value];
    }
    if (opts.disabled) {
      this.__disabled = true;
    }
    this.addChild({
      classNames: ["wok-ui-checkbox-group", opts.inline ? "inline" : ""],
      children: opts.options.map(
        (opt) => createDomModule({
          tag: "label",
          classNames: ["item"],
          children: [
            new Checkbox({
              value: opt.value,
              status: this.__values.includes(opt.value) ? "checked" : "unchecked",
              disabled: this.__disabled,
              onChange: (status) => {
                if (status === "checked") {
                  if (!this.__values.includes(opt.value)) {
                    this.__values.push(opt.value);
                    this.handleChange();
                  }
                  this.updateCheckboxStatus();
                } else {
                  const idx = this.__values.indexOf(opt.value);
                  if (idx !== -1) {
                    this.__values.splice(idx, 1);
                    this.handleChange();
                  }
                  this.updateCheckboxStatus();
                }
              }
            }),
            opt.label
          ]
        })
      )
    });
    this.updateCheckboxStatus();
  }
  updateCheckboxStatus() {
    if (!this.opts.maxSelected) {
      return;
    }
    const maxSelected = typeof this.opts.maxSelected === "number" ? this.opts.maxSelected : this.opts.maxSelected.maxSelected;
    if (this.__values.length >= maxSelected) {
      this.find((m) => m instanceof Checkbox).forEach((box) => {
        if (!box.isChecked()) {
          box.setDisabled(true);
        }
      });
    } else {
      this.find((m) => m instanceof Checkbox).forEach((box) => {
        if (!box.isChecked()) {
          box.setDisabled(false);
        }
      });
    }
  }
  handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.__values);
    }
    this.validate();
  }
  __validate() {
    if (!this.__values.length) {
      if (this.opts.required) {
        return {
          valid: false,
          msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-must-check")
        };
      } else {
        return { valid: true };
      }
    }
    if (typeof this.opts.minSelected === "number") {
      if (this.__values.length < this.opts.minSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-min-select", `${this.opts.minSelected}`)
        };
      }
    } else if (this.opts.minSelected) {
      if (this.__values.length < this.opts.minSelected.minSelected) {
        return { valid: false, msg: this.opts.minSelected.errMsg };
      }
    }
    if (typeof this.opts.maxSelected === "number") {
      if (this.__values.length > this.opts.maxSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg("form-err-max-select", `${this.opts.maxSelected}`)
        };
      }
    } else if (this.opts.maxSelected) {
      if (this.__values.length > this.opts.maxSelected.maxSelected) {
        return { valid: false, msg: this.opts.maxSelected.errMsg };
      }
    }
    return { valid: true };
  }
  validate() {
    const res = this.__validate();
    if (!res.valid) {
      this.showInvalidFeedback(res.msg);
    } else {
      this.hideInvalidFeedback();
    }
    return res.valid;
  }
  setDisabled(disabled) {
    if (this.__disabled !== disabled) {
      this.__disabled = disabled;
      this.find((m) => m instanceof Checkbox).map((m) => m).forEach((box) => box.setDisabled(this.__disabled));
    }
  }
}

var boolCheckbox = '';

class BoolCheckbox extends FormInput {
  constructor(opts) {
    super(document.createElement("label"));
    this.opts = opts;
    this.__value = false;
    this.__disabled = false;
    if (opts.value) {
      this.__value = opts.value;
    }
    this.addChild({
      classNames: ["wok-ui-bool-checkbox"],
      children: [
        new Checkbox({
          value: "",
          status: this.__value ? "checked" : "unchecked",
          disabled: this.__disabled,
          onChange: (status) => {
            this.__value = status === "checked";
            if (this.opts.onChange) {
              this.opts.onChange(this.__value);
            }
            this.validate();
          }
        }),
        opts.label
      ]
    });
  }
  __validate() {
    if (this.opts.required && !this.__value) {
      return {
        valid: false,
        msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-must-check")
      };
    } else {
      return { valid: true };
    }
  }
  isChecked() {
    return this.__value;
  }
  validate() {
    const res = this.__validate();
    if (!res.valid) {
      this.showInvalidFeedback(res.msg);
    } else {
      this.hideInvalidFeedback();
    }
    return res.valid;
  }
  setDisabled(disabled) {
    if (this.__disabled !== disabled) {
      this.__disabled = disabled;
      this.find((m) => m instanceof Checkbox).map((m) => m).forEach((box) => box.setDisabled(this.__disabled));
    }
  }
}

function generateId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1e8);
  return `${timestamp.toString(36)}${random.toString(36)}`;
}

var radio = '';

class Radio extends Module {
  constructor(opts) {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = opts.name;
    input.value = opts.value;
    input.classList.add("wok-ui-radio");
    super(input);
    this.input = input;
    if (opts.checked) {
      input.checked = true;
    }
    if (opts.disabled) {
      input.disabled = true;
    }
    if (opts.onChecked) {
      input.onchange = () => {
        if (input.checked && opts.onChecked) {
          opts.onChecked();
        }
      };
    }
  }
  isChecked() {
    return this.input.checked;
  }
  setChecked(checked) {
    if (this.input.checked !== checked) {
      this.input.checked = checked;
    }
  }
  getValue() {
    return this.input.value;
  }
  setDisabled(disabled) {
    this.input.disabled = disabled;
  }
}

var radioGroup = '';

class RadioGroup extends FormInput {
  constructor(opts) {
    super(document.createElement("div"));
    this.opts = opts;
    this.value = "";
    this.el.classList.add("wok-ui-radio-group");
    this.name = generateId();
    if (opts.inline) {
      this.el.classList.add("inline");
    }
    this.addChild(
      ...opts.options.map(
        (opt) => createDomModule({
          tag: "label",
          children: [
            new Radio({
              name: this.name,
              value: opt.value,
              checked: opts.value === opt.value,
              disabled: opts.disabled,
              onChecked: () => {
                this.value = opt.value;
                if (this.opts.onChange) {
                  this.opts.onChange(this.value);
                }
                this.validate();
              }
            }),
            opt.label
          ]
        })
      )
    );
  }
  __validate() {
    if (!this.value) {
      if (this.opts.required) {
        return {
          valid: false,
          msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-must-check")
        };
      } else {
        return { valid: true };
      }
    }
    return { valid: true };
  }
  validate() {
    const res = this.__validate();
    if (!res.valid) {
      this.showInvalidFeedback(res.msg);
    } else {
      this.hideInvalidFeedback();
    }
    return res.valid;
  }
  setDisabled(disabled) {
    this.find((m) => m instanceof Radio).map((m) => m).forEach((m) => m.setDisabled(disabled));
  }
}

var style$3 = '';

class Select extends FormInput {
  constructor(opts) {
    super(document.createElement("div"));
    this.opts = opts;
    this.addChild({
      tag: "select",
      classNames: ["wok-ui-select"],
      postHandle: (el) => {
        this.select = el;
        if (opts.value) {
          this.select.value = opts.value;
        }
        this.select.addEventListener("change", (ev) => {
          if (this.opts.onChange) {
            this.opts.onChange(this.select.value);
          }
          this.validate();
        });
      },
      children: opts.options.map((opt) => ({
        tag: "option",
        innerText: opt.label,
        attrs: { value: opt.value }
      }))
    });
    const size = getSize();
    switch (opts.size) {
      case "lg":
        this.select.style.setProperty("--select-font-size", `${size.textLg}px`);
        break;
      case "sm":
        this.select.style.setProperty("--select-font-size", `${size.textSm}px`);
        break;
      default:
        this.select.style.setProperty("--select-font-size", `${size.text}px`);
        break;
    }
  }
  __validate(val) {
    if (this.opts.required) {
      if (!val) {
        return {
          valid: false,
          msg: typeof this.opts.required === "string" ? this.opts.required : getI18n().buildMsg("form-err-required")
        };
      }
    }
    return { valid: true };
  }
  validate() {
    const validateRes = this.__validate(this.select.value);
    if (validateRes.valid) {
      this.select.classList.remove("invalid");
      this.hideInvalidFeedback();
    } else {
      this.select.classList.add("invalid");
      this.showInvalidFeedback(validateRes.msg);
    }
    return validateRes.valid;
  }
  setDisabled(disabled) {
    this.select.disabled = disabled;
  }
}

var style$2 = '';

class Range extends FormInput {
  constructor(opts) {
    super(document.createElement("div"));
    this.input = document.createElement("input");
    this.input.classList.add("wok-ui-range");
    this.input.type = "range";
    this.input.min = `${opts.min}`;
    this.input.max = `${opts.max}`;
    if (typeof opts.step === "number") {
      this.input.step = `${opts.step}`;
    } else {
      this.input.step = "1";
    }
    this.input.value = `${opts.value}`;
    if (!opts.showValue) {
      this.addChild(this.input);
      this.input.addEventListener("change", () => {
        this.input.title = this.input.value;
        if (opts.onChange) {
          opts.onChange(parseInt(this.input.value));
        }
      });
      return;
    }
    const text = opts.showValue ? new Text(`${opts.value}`) : void 0;
    this.input.addEventListener("change", () => {
      this.input.title = this.input.value;
      if (text) {
        text.setText(this.input.value);
      }
      if (opts.onChange) {
        opts.onChange(parseInt(this.input.value));
      }
    });
    if (!text) {
      this.addChild(this.input);
    } else {
      this.addChild(
        new HSplitBox({
          left: this.input,
          right: text,
          gap: rem(0.5),
          fixedSide: "right"
        })
      );
    }
  }
  validate() {
    return true;
  }
  setDisabled(disabled) {
    this.input.disabled = disabled;
  }
}

class TableColumn {
  constructor(setting) {
    this.setting = setting;
  }
}
class TableCheckboxColumn extends TableColumn {
  constructor(opts) {
    let checkAllBox = void 0;
    if (!opts.name) {
      checkAllBox = new Checkbox({
        status: "unchecked",
        onChange: (status) => {
          if (!checkAllBox) {
            return;
          }
          if (checkAllBox.isChecked()) {
            this.boxes.forEach((b) => b.setStatus("checked"));
          } else {
            this.boxes.forEach((b) => b.setStatus("unchecked"));
          }
          if (opts.onChange) {
            opts.onChange(this.getCheckedValues());
          }
        },
        value: ""
      });
    }
    super({
      name: opts.name || checkAllBox || "",
      content: (data, idx) => {
        const value = opts.value(data, idx);
        const checked = opts.checked ? opts.checked(data, idx) : false;
        const box = new Checkbox({
          status: checked ? "checked" : "unchecked",
          value,
          onChange: () => {
            const checkedValues = this.getCheckedValues();
            if (opts.onChange) {
              opts.onChange(checkedValues);
            }
            this.updateCheckAllBox();
          }
        });
        this.boxes.push(box);
        return box;
      },
      width: 30
    });
    this.boxes = [];
    this.checkAllBox = checkAllBox;
  }
  updateCheckAllBox() {
    if (!this.checkAllBox) {
      return;
    }
    const checkedValues = this.getCheckedValues();
    if (checkedValues.length === this.boxes.length) {
      this.checkAllBox.setStatus("checked");
    } else if (checkedValues.length === 0) {
      this.checkAllBox.setStatus("unchecked");
    } else {
      this.checkAllBox.setStatus("indeterminate");
    }
  }
  getCheckedValues() {
    return this.boxes.filter((b) => b.isChecked()).map((b) => b.value);
  }
  checkAll() {
    if (this.checkAllBox) {
      this.checkAllBox.setStatus("checked");
    }
    this.boxes.forEach((b) => b.setStatus("checked"));
  }
  uncheckAll() {
    if (this.checkAllBox) {
      this.checkAllBox.setStatus("unchecked");
    }
    this.boxes.forEach((b) => b.setStatus("unchecked"));
  }
}
class TableIndexColumn extends TableColumn {
  constructor() {
    super({ name: "#", content: (data, idx) => `${idx + 1}`, width: 30 });
  }
}

function parseQueryString(qs) {
  const queryString = {};
  const kvs = qs.split("&");
  kvs.forEach((kv) => {
    if (!kv) {
      return;
    }
    const arr = kv.split("=");
    if (arr.length !== 2) {
      return;
    }
    const paramName = decodeURIComponent(arr[0]);
    const value = decodeURIComponent(arr[1]);
    if (!queryString[paramName]) {
      queryString[paramName] = value;
      return;
    }
    const exVal = queryString[paramName];
    if (typeof exVal === "string") {
      queryString[paramName] = [exVal, value];
      return;
    }
    exVal.push(value);
  });
  return queryString;
}
function buildQueryString(qs) {
  const arr = [];
  for (const key in qs) {
    const val = qs[key];
    if (typeof val === "string") {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
      continue;
    }
    val.forEach((v) => {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
    });
  }
  return arr.join("&");
}

function parsePathRule(pathRule) {
  const ps = pathRule.split("/").filter((p) => !!p);
  return ps.map((p) => {
    if (p.startsWith(":")) {
      const varName = p.substring(1);
      return { type: "variable", varName };
    }
    return { type: "constant", value: p };
  });
}
function matchPath(path, parts) {
  const ps = path.split("/").filter((p) => !!p);
  if (ps.length !== parts.length) {
    return { matched: false };
  }
  const vars = {};
  for (let i = 0; i < ps.length; i++) {
    const part = parts[i];
    const p = ps[i];
    if (part.type === "constant") {
      if (part.value !== p) {
        return { matched: false };
      }
      continue;
    }
    if (part.varName)
      vars[part.varName] = p;
  }
  return { matched: true, vars };
}
function isPathRuleEquals(rule1, rule2) {
  if (rule1.length !== rule2.length) {
    return false;
  }
  for (let i = 0; i < rule1.length; i++) {
    const p1 = rule1[i];
    const p2 = rule2[i];
    if (p1.type !== p2.type) {
      return false;
    }
    if (p1.type === "constant") {
      if (p1.value !== p2.value) {
        return false;
      }
    }
  }
  return true;
}

class CachedModule extends DivModule {
  constructor(key, module) {
    super();
    this.key = key;
    this.title = "";
    this.addChild(module);
  }
  cacheScroll() {
    this.scrollPos = { left: window.scrollX, top: window.scrollY };
  }
  hide() {
    this.el.style.display = "none";
    this.title = document.title;
    this.find(() => true).forEach((m) => {
      const mm = m;
      if (mm.onPageHide) {
        mm.onPageHide();
      }
    });
  }
  show() {
    this.el.style.display = "block";
    if (this.title) {
      document.title = this.title;
    }
    if (this.scrollPos) {
      const { left, top } = this.scrollPos;
      setTimeout(() => {
        window.scrollTo({ left, top, behavior: "instant" });
      }, 0);
    }
    this.find(() => true).forEach((m) => {
      const mm = m;
      if (mm.onPageShow) {
        mm.onPageShow();
      }
    });
  }
}
class Router extends Module {
  constructor(options) {
    super(document.createElement("div"));
    this.paths = [];
    this.currentPath = "";
    this.pathVars = {};
    this.query = {};
    this.cacheLimit = 10;
    this.ignoreScroll = false;
    if (options.cacheLimit && options.cacheLimit >= 1) {
      this.cacheLimit = options.cacheLimit;
    }
    options.rules.flatMap((rule) => {
      if (!rule.alias) {
        return [
          {
            pathRule: rule.path,
            module: rule.module,
            parts: parsePathRule(rule.path),
            cache: !!rule.cache
          }
        ];
      }
      const aliasPaths = rule.alias.map((alias) => ({
        pathRule: alias,
        module: rule.module,
        parts: parsePathRule(alias),
        cache: !!rule.cache
      }));
      return [
        {
          pathRule: rule.path,
          module: rule.module,
          parts: parsePathRule(rule.path),
          cache: !!rule.cache
        },
        ...aliasPaths
      ];
    }).forEach((pathInfo) => {
      if (pathInfo.pathRule === "*") {
        if (this.defaultPathInfo) {
          throw new Error("\u9ED8\u8BA4\u8DEF\u5F84\u91CD\u590D\uFF0C\u914D\u7F6E\u4E86\u591A\u4E2A\u8DEF\u5F84\u4E3A * \u7684\u8DEF\u7531");
        }
        this.defaultPathInfo = pathInfo;
        return;
      }
      const existPath = this.paths.find((p) => isPathRuleEquals(p.parts, pathInfo.parts));
      if (existPath) {
        throw new Error(`\u8DEF\u5F84\u89C4\u5219\u91CD\u590D\uFF1A${pathInfo.pathRule} \uFF0C${existPath.pathRule}`);
      }
      this.paths.push(pathInfo);
    });
    this.scrollListener = () => {
      setTimeout(() => {
        if (this.ignoreScroll) {
          this.ignoreScroll = false;
          return;
        }
        if (this.currentModule && this.currentModule instanceof CachedModule) {
          this.currentModule.cacheScroll();
        }
      }, 0);
    };
    window.addEventListener("scroll", this.scrollListener);
  }
  handleUrl() {
    const parRes = this.parseCurrentUrl();
    this.currentPath = parRes.path;
    this.query = parRes.query || {};
    const targetPath = this.paths.find((p) => {
      const res = matchPath(this.currentPath, p.parts);
      if (res.matched) {
        this.pathVars = res.vars || {};
        return true;
      } else {
        return false;
      }
    });
    if (this.currentModule) {
      if (this.currentModule instanceof CachedModule) {
        this.currentModule.hide();
      } else {
        this.currentModule.destroy();
      }
    }
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    if (!targetPath) {
      if (this.defaultPathInfo) {
        this.handleModule(this.defaultPathInfo.module).then((m) => {
          this.addChild(m);
          this.currentModule = m;
        }).catch(showWarning);
      } else {
        showWarning("Path not set\uFF1A" + this.currentPath);
      }
    } else if (targetPath.cache) {
      const key = JSON.stringify(parRes);
      const cachedModule = this.getChildren().filter((c) => c instanceof CachedModule).map((c) => c).find((c) => c.key === key);
      if (cachedModule) {
        cachedModule.show();
        this.currentModule = cachedModule;
        return;
      }
      this.handleModule(targetPath.module).then((m) => {
        const newCachedModule = new CachedModule(key, m);
        this.addChild(newCachedModule);
        this.currentModule = newCachedModule;
        const cachedModules = this.getChildren().filter((c) => c instanceof CachedModule).map((c) => c);
        if (cachedModules.length > this.cacheLimit) {
          this.removeChild(cachedModules[0]);
        }
      }).catch(showWarning);
    } else {
      this.handleModule(targetPath.module).then((m) => {
        this.addChild(m);
        this.currentModule = m;
      }).catch(showWarning);
    }
  }
  async handleModule(module) {
    return module();
  }
  getRouterInfo() {
    return {
      path: this.currentPath,
      query: this.query
    };
  }
  getParam(paramName) {
    const val = this.query[paramName];
    if (!val) {
      return "";
    }
    return typeof val === "string" ? val : val[0] || "";
  }
  getParamVals(paramName) {
    const val = this.query[paramName];
    return typeof val === "string" ? [val] : val;
  }
  getPathVar(varName) {
    return this.pathVars[varName] || "";
  }
  destroy() {
    window.removeEventListener("scroll", this.scrollListener);
    super.destroy();
  }
}

class HashRouter extends Router {
  constructor(rules, cacheLimit) {
    super({ rules, cacheLimit });
    this.listener = (e) => {
      e.preventDefault();
      this.ignoreScroll = true;
      this.handleUrl();
    };
    window.addEventListener("hashchange", this.listener);
    setTimeout(() => this.handleUrl(), 0);
  }
  parseCurrentUrl() {
    let { hash } = location;
    if (hash.startsWith("#")) {
      hash = hash.substring(1);
    }
    const qmarkIdx = hash.indexOf("?");
    let path = hash;
    if (qmarkIdx !== -1) {
      path = hash.substring(0, qmarkIdx);
    }
    let query = {};
    if (qmarkIdx !== -1) {
      query = parseQueryString(hash.substring(qmarkIdx + 1));
    }
    return { path, query };
  }
  buildUrl(path) {
    const { href } = location;
    const poundIdx = href.indexOf("#");
    const urlWithoutHash = poundIdx === -1 ? href : href.substring(0, poundIdx);
    if (typeof path === "string") {
      return `${urlWithoutHash}#${path}`;
    }
    const qs = buildQueryString(path.query);
    const hash = `${path.path}?${qs}`;
    return `${urlWithoutHash}#${hash}`;
  }
  push(path) {
    if (typeof path === "string") {
      location.hash = path;
      return;
    }
    const qs = buildQueryString(path.query);
    location.hash = `${path.path}?${qs}`;
  }
  replace(path) {
    location.replace(this.buildUrl(path));
  }
  destroy() {
    window.removeEventListener("hashchange", this.listener);
    super.destroy();
  }
}

class HistoryRouter extends Router {
  constructor(opts) {
    super({ rules: opts.rules, cacheLimit: opts.cacheLimit });
    this.base = opts.base;
    const { pathname } = location;
    if (this.base && !pathname.startsWith(this.base)) {
      throw new Error("\u65E0\u6CD5\u521B\u5EFA\u8DEF\u7531\uFF0C\u5F53\u524D\u8DEF\u5F84\u4E0D\u5728\u8BBE\u5B9A\u7684 base \u4E0B");
    }
    this.listener = () => {
      this.ignoreScroll = true;
      this.handleUrl();
    };
    window.addEventListener("popstate", this.listener);
    setTimeout(() => this.handleUrl(), 0);
  }
  parseCurrentUrl() {
    const { href, origin } = location;
    let path = href.substring(origin.length);
    const poundIdx = path.indexOf("#");
    if (poundIdx !== -1) {
      path = path.substring(0, poundIdx);
    }
    let query;
    const qmarkIdx = path.indexOf("?");
    if (qmarkIdx !== -1) {
      const qs = path.substring(qmarkIdx + 1);
      path = path.substring(0, qmarkIdx);
      query = parseQueryString(qs);
    }
    return { path, query };
  }
  buildUrl(path) {
    if (typeof path === "string") {
      return this.buildUrl({ path, query: {} });
    }
    let finalPath = path.path;
    if (!finalPath.startsWith("/")) {
      finalPath = `/${finalPath}`;
    }
    if (this.base) {
      finalPath = `${this.base}${finalPath}`;
    }
    if (!finalPath.startsWith("/")) {
      finalPath = `/${finalPath}`;
    }
    if (path.query) {
      finalPath = `${finalPath}?${buildQueryString(path.query)}`;
    }
    return `${location.origin}${finalPath}`;
  }
  push(path) {
    history.pushState({}, "", this.buildUrl(path));
  }
  replace(path) {
    history.replaceState({}, "", this.buildUrl(path));
  }
  destroy() {
    window.removeEventListener("popstate", this.listener);
  }
}

var style$1 = '';

class Link extends Module {
  constructor(opts) {
    const link = document.createElement("a");
    super(link);
    link.classList.add("wok-ui-link");
    if (typeof opts.content === "string") {
      link.innerText = opts.content;
    } else if (Array.isArray(opts.content)) {
      this.addChild(...opts.content);
    } else {
      this.addChild(opts.content);
    }
    if (opts.url) {
      link.href = opts.url;
    } else if (opts.onClick) {
      link.href = "javascript:;";
    }
    if (opts.target) {
      link.target = `_${opts.target}`;
    }
    if (opts.download) {
      link.download = opts.download;
    }
    if (opts.onClick) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (opts.onClick) {
          opts.onClick(e);
        }
      });
    }
  }
  triggerClick() {
    const a = this.el;
    a.click();
    return this;
  }
}

class RouterLink extends Link {
  constructor(opts) {
    const router = getRouter();
    const url = router.buildUrl(opts.query ? { path: opts.path, query: opts.query } : opts.path);
    super({
      content: opts.content,
      url,
      onClick(ev) {
        ev.stopPropagation();
        ev.stopPropagation();
        if (opts.replace) {
          if (opts.query) {
            router.replace({ path: opts.path, query: opts.query });
          } else {
            router.replace(opts.path);
          }
        } else {
          if (opts.query) {
            router.push({ path: opts.path, query: opts.query });
          } else {
            router.push(opts.path);
          }
        }
      }
    });
  }
}

let router;
function initRouter(opts) {
  if (router) {
    return router;
  }
  if (opts.mode === "hash") {
    router = new HashRouter(opts.rules, opts.cacheLimit);
  } else {
    router = new HistoryRouter({ rules: opts.rules, cacheLimit: opts.cacheLimit, base: opts.base });
  }
  return router;
}
function getRouter() {
  if (!router) {
    throw new Error("\u8DEF\u7531\u5C1A\u672A\u521D\u59CB\u5316");
  }
  return router;
}

var style = '';

class Dropdown extends DivModule {
  constructor(opts) {
    super("wok-ui-dropdown");
    this.el.addEventListener("click", (ev) => {
      if (this.el.classList.contains("open")) {
        this.close();
      } else {
        this.el.classList.add("open");
        setTimeout(() => this.addCloseListener(), 0);
      }
    });
    this.addChild(...buildSubModules(opts.content));
    const menusAlign = opts.menusAlign || "left";
    if (Array.isArray(opts.menus) && opts.menus[0] && typeof opts.menus[0].label === "string") {
      const menus = opts.menus;
      this.addChild({
        classNames: ["wok-ui-dropdown-menu", menusAlign],
        onClick(ev) {
          ev.stopPropagation();
        },
        children: menus.map((item) => ({
          classNames: ["wok-ui-dropdown-item", item.disabled ? "disabled" : ""],
          innerText: item.label,
          onClick: (ev) => {
            if (item.disabled) {
              return;
            }
            this.close();
            if (item.callback)
              item.callback();
          }
        }))
      });
    } else {
      this.addChild({
        classNames: ["wok-ui-dropdown-menu", menusAlign],
        onClick(ev) {
          ev.stopPropagation();
        },
        children: opts.menus
      });
    }
  }
  addCloseListener() {
    const closeListener = (ev) => {
      ev.stopPropagation();
      const target = ev.target;
      if (this.el.contains(target)) {
        return;
      }
      if (this.el.classList.contains("open")) {
        this.close();
      }
    };
    let parent = this.el.parentElement;
    let parentList = [];
    while (parent) {
      parentList.push(parent);
      parent.addEventListener("click", closeListener);
      parent = parent.parentElement;
    }
    this.__removeCloseListener = () => parentList.forEach((p) => p.removeEventListener("click", closeListener));
  }
  close() {
    this.el.classList.remove("open");
    if (this.__removeCloseListener) {
      this.__removeCloseListener();
      this.__removeCloseListener = void 0;
      return;
    }
  }
  destroy() {
    if (this.__removeCloseListener) {
      this.__removeCloseListener();
    }
    super.destroy();
  }
}
class Dropup extends Dropdown {
  constructor(opts) {
    super(opts);
    this.el.classList.add("dropup");
  }
}

export { ANIMATION_PROVISION, Animation, BoolCheckbox, Button, Checkbox, CheckboxGroup, ColorInput, DateInput, DivModule, Dropdown, Dropup, ExtensibleI18n, FileInput, Form, FormInput, FullRenderingModule, Grid, HBox, HSpacer, HSplitBox, I18n, JustifyBox, LargeTitle, Link, Module, NumberInput, PasswordInput, PrimaryBodyText, Radio, RadioGroup, Range, RemoteSvgIcon, ResponsiveBreakPoint, ResponsiveModule, Router, RouterLink, SearchInput, SecondaryBodyText, Select, SmallSecondaryBodyText, Spacer, SvgIcon, Table, TableCheckboxColumn, TableColumn, TableIndexColumn, TelInput, Text, TextArea, TextInput, Title$1 as Title, VBox, VSplitBox, animate, buildSubModules, closeAllModals, convertToModule, createDomModule, getColor, getI18n, getRouter, getSize, hideLoading, initRouter, rem, resetColor, resetSize, setColor, setSize, showAlert, showConfirm, showDrawer, showLoading, showModal, showSuccess, showToast, showWarning };
