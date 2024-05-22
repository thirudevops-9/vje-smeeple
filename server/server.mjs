import { effectScope, reactive, hasInjectionContext, getCurrentInstance, inject, toRef, version, unref, ref, watchEffect, watch, h, nextTick, shallowRef, shallowReactive, isReadonly, isRef, isShallow, isReactive, toRaw, defineComponent, computed, provide, Suspense, mergeProps, Transition, withCtx, createVNode, useSSRContext, defineAsyncComponent, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, createApp } from "vue";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import { $fetch } from "ofetch";
import { createHooks } from "hookable";
import { getContext } from "unctx";
import { sanitizeStatusCode, createError as createError$1 } from "h3";
import { getActiveHead } from "unhead";
import { defineHeadPlugin, composableNames } from "@unhead/shared";
import { START_LOCATION, createMemoryHistory, createRouter, useRoute as useRoute$1, RouterView } from "vue-router";
import { withQuery, hasProtocol, parseURL, isScriptProtocol, joinURL } from "ufo";
import { defu } from "defu";
import "klona";
import "devalue";
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderSuspense, ssrRenderVNode } from "vue/server-renderer";
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.10.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      once: /* @__PURE__ */ new Set(),
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn)),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
// @__NO_SIDE_EFFECTS__
function tryUseNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  return nuxtAppInstance || null;
}
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  const nuxtAppInstance = /* @__PURE__ */ tryUseNuxtApp();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error2 = useError();
    if (false)
      ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && process.env.NODE_ENV !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$9 = null;
const __nuxt_page_meta$8 = null;
const __nuxt_page_meta$7 = null;
const __nuxt_page_meta$6 = null;
const __nuxt_page_meta$5 = null;
const __nuxt_page_meta$4 = null;
const __nuxt_page_meta$3 = null;
const __nuxt_page_meta$2 = null;
const __nuxt_page_meta$1 = null;
const __nuxt_page_meta = null;
const _routes = [
  {
    name: "about-smeeple",
    path: "/about-smeeple",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.redirect,
    component: () => import("./_nuxt/index-DszDKjuN.js").then((m) => m.default || m)
  },
  {
    name: "booking-policy-and-expert-agreement",
    path: "/booking-policy-and-expert-agreement",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.redirect,
    component: () => import("./_nuxt/index-YwYQJNiO.js").then((m) => m.default || m)
  },
  {
    name: "browse-experts-slug",
    path: "/browse-experts/:slug()",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.redirect,
    component: () => import("./_nuxt/_slug_-CdLSi89Y.js").then((m) => m.default || m)
  },
  {
    name: "browse-experts",
    path: "/browse-experts",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect,
    component: () => import("./_nuxt/index-zgKbSJB8.js").then((m) => m.default || m)
  },
  {
    name: "faqs",
    path: "/faqs",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect,
    component: () => import("./_nuxt/index-wR-xj3XY.js").then((m) => m.default || m)
  },
  {
    name: "for-experts",
    path: "/for-experts",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect,
    component: () => import("./_nuxt/index-BgGdYdtd.js").then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect,
    component: () => import("./_nuxt/index-DRXnbB3g.js").then((m) => m.default || m)
  },
  {
    name: "privacy-policy",
    path: "/privacy-policy",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect,
    component: () => import("./_nuxt/index-B3uSgZjl.js").then((m) => m.default || m)
  },
  {
    name: "support",
    path: "/support",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect,
    component: () => import("./_nuxt/index-CuDhXsGo.js").then((m) => m.default || m)
  },
  {
    name: "terms-and-conditions",
    path: "/terms-and-conditions",
    meta: {},
    alias: [],
    redirect: __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect,
    component: () => import("./_nuxt/index-Cf7nsKm9.js").then((m) => m.default || m)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const asyncDataDefaults = { "deep": true };
const fetchDefaults = {};
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from, failure) => {
      delete nuxtApp._processingMiddleware;
      if (failure) {
        await nuxtApp.callHook("page:loading:end");
      }
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  return ((_a = useRequestEvent()) == null ? void 0 : _a.$fetch) || globalThis.$fetch;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const _0_siteConfig_7pzUtwM1Zj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    const state = useState("site-config");
    {
      const { context } = useRequestEvent();
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = context.siteConfig.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    let stack = {};
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin,
  _0_siteConfig_7pzUtwM1Zj,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY
];
const layouts = {
  default: () => import("./_nuxt/default-PEXSSTOM.js").then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0$6 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1$4 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === (Component == null ? void 0 : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$k = {};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$6;
  const _component_NuxtPage = __nuxt_component_1$4;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$e]]);
const _sfc_main$j = {};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, _attrs))}><path class="fill-white" d="M14.7,1.3c-0.4-0.4-1-0.4-1.4,0L8,6.6L2.7,1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L6.6,8l-5.3,5.3 c-0.4,0.4-0.4,1,0,1.4C1.5,14.9,1.7,15,2,15s0.5-0.1,0.7-0.3L8,9.4l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L9.4,8l5.3-5.3C15.1,2.3,15.1,1.7,14.7,1.3z"></path></svg>`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Close.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const __nuxt_component_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$d]]);
const _sfc_main$i = {
  __name: "Header_Banner",
  __ssrInlineRender: true,
  setup(__props) {
    let showBanner = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon_Close = __nuxt_component_0$5;
      if (unref(showBanner)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-blue-light py-1 text-white md-max:hidden" }, _attrs))}><div class="container relative text-center"><p>Download the app today for a chance to win a $100 Smeeple gift card.</p><a class="absolute right-2 top-[7px] cursor-pointer">`);
        _push(ssrRenderComponent(_component_Icon_Close, null, null, _parent));
        _push(`</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header_Banner.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __nuxt_component_0$4 = _sfc_main$i;
const _sfc_main$h = {
  props: {
    isHeaderFixed: Boolean,
    isMobileNavOpen: Boolean,
    parentClass: String
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: "logo-smeeple-blue",
    xmlns: "http://www.w3.org/2000/svg",
    width: "160",
    height: "42",
    viewBox: "0 0 160 42"
  }, _attrs))}><path class="fill-blue-light transition-all duration-300" d="m13.6598,19.2513c-.9534-.6539-2.0901-1.2101-3.4652-1.6318-2.2918-.7089-3.5875-1.1734-3.5875-2.4813,0-1.0084.8067-1.7173,1.9618-1.7173,1.2284,0,1.9618.6539,2.1818,1.9435.0733.4339.5378.7823.9779.7823h1.9373v-6.2582c-1.3017-1.0573-2.9763-1.6929-4.8953-1.6929-3.8136,0-7.7555,2.7319-7.7555,7.3094,0,2.5546.8251,5.427,6.9366,7.3583,2.9519.9534,3.3491,1.9313,3.3491,2.7624,0,1.4607-1.0084,2.4079-2.5669,2.4079-1.8151,0-2.8663-1.0573-3.1047-3.1474-.0611-.5256-.4889-.9595-1.0145-.9595H1.015C.465,23.9266-.0178,24.3789.0005,24.935c.165,5.4698,4.4247,8.3239,8.6417,8.3239,1.9679,0,3.6791-.5561,5.0359-1.4973,0-.0305-.0183-.055-.0183-.0795v-12.4308h0Z"></path><path class="fill-transparent transition-all duration-300" d="m10.7446,15.3643c-.2139-1.2895-.9473-1.9435-2.1818-1.9435-1.1551,0-1.9618.7028-1.9618,1.7173,0,1.3079,1.2957,1.7723,3.5875,2.4813,1.3812.4217,2.5179.9779,3.4652,1.6318v-3.1047h-1.9373c-.44,0-.9045-.3483-.9779-.7823h.0061Z"></path><path class="transition-all duration-300" d="m15.6766,16.1405c.1833,0,.3606-.0733.4889-.2078s.1956-.3117.1895-.495c-.0733-2.3163-1.0939-4.2536-2.6952-5.5554v6.2582s2.0168,0,2.0168,0Z" style="${ssrRenderStyle({ "fill": "#1b268f" })}"></path><path class="transition-all duration-300" d="m16.8866,25.375c0-2.6157-1.0879-4.657-3.2269-6.1237v12.4247l.0183.0795c1.9923-1.3812,3.2085-3.6241,3.2085-6.3804h0Z" style="${ssrRenderStyle({ "fill": "#1b268f" })}"></path><path class="fill-green-light transition-all duration-300" d="m47.982,13.2375c-1.5279-3.178-4.5837-5.0481-8.7639-5.0481-3.3308,0-5.6593,1.0023-7.3949,3.2208-1.4484-1.9618-4.1314-3.2208-7.0343-3.2208-2.4568,0-4.2047.6111-5.8609,2.1146v-.8189c0-.3789-.3056-.6845-.6845-.6845h-3.5753c-.5561,0-1.0084.4523-1.0084,1.0084v.0733c1.6012,1.2957,2.6279,3.2391,2.6952,5.5554,0,.1833-.0611.3667-.1895.495-.1283.1345-.3056.2078-.4889.2078h-2.0107v3.1047c2.139,1.4729,3.2269,3.508,3.2269,6.1237,0,2.7563-1.2162,4.9992-3.2085,6.3804.0428.5195.4645.9289.9962.9289h3.5691c.5561,0,1.0084-.4523,1.0084-1.0084v-12.3147c0-4.0519,1.5523-5.9404,4.8831-5.9404,2.9824,0,4.4369,1.7968,4.4369,5.4943v12.7609c0,.5561.4523,1.0084,1.0084,1.0084h3.5753c.5561,0,1.0084-.4523,1.0084-1.0084v-12.3514c0-4.1925,1.3567-5.9037,4.6814-5.9037,3.0802,0,4.6447,2.0107,4.6447,5.9832v12.2719c0,.5561.4523,1.0084,1.0084,1.0084h3.5753c.5561,0,1.0084-.4523,1.0084-1.0084v-2.2429c-2.1635-2.2429-3.5447-5.262-3.5447-8.4828,0-2.9335.9229-5.5798,2.4385-7.7127v.0061h0Z"></path><path class="transition-all duration-300" d="m47.982,13.2375c-1.5157,2.1329-2.4385,4.7731-2.4385,7.7127,0,3.2208,1.3812,6.2399,3.5447,8.4828v-11.0863c0-1.9618-.4095-3.6547-1.1062-5.1031v-.0061Z" style="${ssrRenderStyle({ "fill": "#5b6e10" })}"></path><path class="fill-orange-light transition-all duration-300" d="m57.5649,8.1894c-3.9725,0-7.4071,1.9801-9.5829,5.0481.6967,1.4484,1.1062,3.1474,1.1062,5.1031v11.0863c2.2368,2.3224,5.3109,3.8197,8.5989,3.8197,3.7097,0,7.0771-1.6929,9.3567-4.4981.3056-.3789.1833-.9534-.2383-1.1979l-2.6829-1.5829c-.3178-.1895-.6845-.0733-.9779.1467-1.6012,1.1917-3.2697,2.0657-5.3048,2.0657-3.0374,0-5.3476-2.0779-6.6555-5.0115h18.0107c.2873,0,.5378-.2139.5806-.4951.1283-.8251.1283-1.5034.1283-2.2185,0-6.8755-5.4209-12.2658-12.3453-12.2658h.0061,0Zm-6.5027,10.5301c.6234-3.3919,3.8136-5.4637,6.6188-5.4637,3.2941,0,6.1237,2.3529,6.7043,5.4637h-13.3231Z"></path><path class="fill-transparent transition-all duration-300" d="m57.6872,13.262c-2.8052,0-6.0015,2.0718-6.6188,5.4637h13.3231c-.5806-3.1107-3.4102-5.4637-6.7043-5.4637Z"></path><path class="${ssrRenderClass([{
    "fill-blue duration-300": $props.parentClass === "logo-dark" && !$props.isHeaderFixed && !$props.isMobileNavOpen,
    "fill-white duration-300": $props.parentClass === "logo-light" || $props.isHeaderFixed && !$props.isMobileNavOpen || $props.isHeaderFixed && $props.isMobileNavOpen,
    "fill-white duration-1000": !$props.isHeaderFixed && $props.isMobileNavOpen
  }, "transition-all"])}" d="m91.0499,25.9739c-.3178-.1895-.6845-.0733-.9779.1467-1.6012,1.1917-3.2697,2.0657-5.3048,2.0657-3.0374,0-5.3476-2.0779-6.6555-5.0115h18.0107c.2873,0,.5378-.2139.5806-.4951.1283-.8251.1283-1.5034.1283-2.2185,0-6.8755-5.4209-12.2658-12.3453-12.2658s-12.0213,5.6043-12.0213,12.7547c0,6.5515,5.6715,12.3025,12.1436,12.3025,3.7097,0,7.0771-1.6929,9.3567-4.4981.3056-.3789.1833-.9534-.2383-1.1979l-2.6829-1.5829h.0061,0Zm-6.4415-12.7181c3.2941,0,6.1237,2.3529,6.7043,5.4637h-13.3231c.6234-3.3919,3.8136-5.4637,6.6188-5.4637Z"></path><path class="${ssrRenderClass([{
    "fill-blue duration-300": $props.parentClass === "logo-dark" && !$props.isHeaderFixed && !$props.isMobileNavOpen,
    "fill-white duration-300": $props.parentClass === "logo-light" || $props.isHeaderFixed && !$props.isMobileNavOpen || $props.isHeaderFixed && $props.isMobileNavOpen,
    "fill-white duration-1000": !$props.isHeaderFixed && $props.isMobileNavOpen
  }, "transition-all"])}" d="m111.9208,8.1894c-2.9152,0-5.4881,1.0389-7.4071,2.9641v-1.6745c0-.3789-.3056-.6845-.6845-.6845h-3.5325c-.5561,0-1.0084.4523-1.0084,1.0084v30.4353c0,.5561.4523,1.0084,1.0084,1.0084h3.5691c.5561,0,1.0084-.4523,1.0084-1.0084v-9.6562c1.7357,1.6868,4.3453,2.6585,7.3216,2.6585,6.7655,0,12.0641-5.372,12.0641-12.2291,0-7.3155-5.3109-12.8342-12.3453-12.8342l.0061.0122h0Zm6.7532,12.5897c0,4.0641-3.0374,7.2421-6.9183,7.2421s-6.9549-3.2147-6.9549-7.3216,3.1107-7.2849,6.796-7.2849c4.2353,0,7.0771,3.8075,7.0771,7.3644h0Z"></path><path class="${ssrRenderClass([{
    "fill-blue duration-300": $props.parentClass === "logo-dark" && !$props.isHeaderFixed && !$props.isMobileNavOpen,
    "fill-white duration-300": $props.parentClass === "logo-light" || $props.isHeaderFixed && !$props.isMobileNavOpen || $props.isHeaderFixed && $props.isMobileNavOpen,
    "fill-white duration-1000": !$props.isHeaderFixed && $props.isMobileNavOpen
  }, "transition-all"])}" d="m131.7465,0h-3.5691c-.5561,0-1.0084.4523-1.0084,1.0084v30.6615c0,.5561.4523,1.0084,1.0084,1.0084h3.5691c.5623,0,1.0145-.4523,1.0145-1.0145V1.0084c0-.5561-.4523-1.0084-1.0084-1.0084h-.0061Z"></path><path class="${ssrRenderClass([{
    "fill-blue duration-300": $props.parentClass === "logo-dark" && !$props.isHeaderFixed && !$props.isMobileNavOpen,
    "fill-white duration-300": $props.parentClass === "logo-light" || $props.isHeaderFixed && !$props.isMobileNavOpen || $props.isHeaderFixed && $props.isMobileNavOpen,
    "fill-white duration-1000": !$props.isHeaderFixed && $props.isMobileNavOpen
  }, "transition-all"])}" d="m154.2186,25.9739c-.3178-.1895-.6845-.0733-.9779.1467-1.6012,1.1917-3.2697,2.0657-5.3048,2.0657-3.0374,0-5.3476-2.0779-6.6555-5.0115h18.0106c.2873,0,.5378-.2139.5806-.4951.1283-.8251.1283-1.5034.1283-2.2185,0-6.8755-5.4209-12.2658-12.3453-12.2658s-12.0213,5.6043-12.0213,12.7547c0,6.5515,5.6715,12.3025,12.1436,12.3025,3.7097,0,7.0771-1.6929,9.3567-4.4981.3056-.3789.1833-.9534-.2383-1.1979l-2.6829-1.5829h.0061Zm-6.4415-12.7181c3.2941,0,6.1237,2.3529,6.7043,5.4637h-13.3231c.6234-3.3919,3.8136-5.4637,6.6188-5.4637Z"></path></svg>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/logos/Logo_Smeeple.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __nuxt_component_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$c]]);
const Header = {
  data() {
    return {
      isHeaderFixed: false,
      isMobileNavOpen: false
    };
  },
  methods: {
    checkHeaderFixed() {
      this.isHeaderFixed = (void 0).querySelector("header").classList.contains("bg-blue");
    },
    toggleMobileNav() {
      this.isMobileNavOpen = !this.isMobileNavOpen;
      if (this.isMobileNavOpen) {
        (void 0).body.classList.add("overflow-hidden");
      } else {
        (void 0).body.classList.remove("overflow-hidden");
      }
    }
  },
  mounted() {
    this.checkHeaderFixed();
    new MutationObserver(this.checkHeaderFixed).observe((void 0).querySelector("header"), {
      attributeFilter: ["class"],
      attributes: true
    });
    if (!this.isMobileNavOpen) {
      (void 0).body.classList.remove("overflow-hidden");
    }
  },
  props: {
    parentClass: String
  }
};
const _sfc_main$g = {
  mixins: [Header]
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[-->`);
  if (_ctx.$route.path !== "/for-experts") {
    _push(`<li class="${ssrRenderClass({
      "md-max:hidden": _ctx.parentClass === "nav-header"
    })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="/for-experts">For experts</a></li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$route.path === "/for-experts") {
    _push(`<li class="${ssrRenderClass({
      "md-max:hidden": _ctx.parentClass === "nav-header"
    })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="/">For consumers</a></li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<li class="${ssrRenderClass({
    "ml-4 md-max:hidden": _ctx.parentClass === "nav-header",
    "mt-1": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile"
  })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="/browse-experts">Browse experts</a></li><li class="${ssrRenderClass({
    "ml-4 md-max:hidden": _ctx.parentClass === "nav-header",
    "mt-1": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile"
  })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="/about-smeeple">About Smeeple</a></li><li class="${ssrRenderClass({
    "ml-4 md-max:hidden": _ctx.parentClass === "nav-header",
    "mt-1": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile"
  })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="/faqs">FAQs</a></li><li class="${ssrRenderClass({
    hidden: _ctx.parentClass === "nav-header",
    "mt-1": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile"
  })}"><a class="transition-all duration-150 lg:hover:text-orange-light" href="https://us21.list-manage.com/contact-form?u=d80d185e796d0394c7aedcb86&amp;form_id=c8ff58847bc83c0cb9b8335ee32bfa64" target="_blank">Contact us</a></li><li class="${ssrRenderClass({
    "ml-4 md-max:hidden": _ctx.parentClass === "nav-header",
    "mt-1": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile"
  })}"><a class="${ssrRenderClass([{
    "border-0 bg-transparent p-0": _ctx.parentClass === "nav-footer" || _ctx.parentClass === "nav-mobile",
    "place-content-start": _ctx.parentClass === "nav-footer",
    "justify-center text-32": _ctx.parentClass === "nav-mobile"
  }, "cta-primary flex items-center"])}" href="https://devsmeepleapp.netlify.app/sign-in?returnUrl=/profile">Expert login</a></li><!--]-->`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/Nav_List.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$b]]);
const _sfc_main$f = {
  props: {
    isHeaderFixed: Boolean,
    isMobileNavOpen: Boolean,
    parentClass: String
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative -top-[12px] h-[40px] w-[40px] rotate-180 hover:cursor-pointer" }, _attrs))}><!--[-->`);
  ssrRenderList(3, (index) => {
    _push(`<span class="${ssrRenderClass([{
      "bg-blue": $props.parentClass === "icon-dark" && !$props.isHeaderFixed && !$props.isMobileNavOpen,
      "bg-white": $props.parentClass === "icon-light" || $props.isHeaderFixed || $props.isMobileNavOpen
    }, "nav-toggle-bar block transition-all duration-300"])}"></span>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Menu.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __nuxt_component_3$2 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$a]]);
const _sfc_main$e = {};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    viewBox: "0 0 32 32"
  }, _attrs))}><path class="fill-white" d="M28.893,24.01c-0.705,1.562-1.042,2.258-1.95,3.638c-1.265,1.927-3.05,4.327-5.262,4.347 c-1.965,0.018-2.47-1.278-5.137-1.263c-2.667,0.015-3.223,1.287-5.188,1.268c-2.212-0.02-3.902-2.187-5.168-4.115 c-3.54-5.388-3.91-11.712-1.727-15.073c1.552-2.39,4-3.787,6.302-3.787c2.343,0,3.817,1.285,5.755,1.285 c1.88,0,3.025-1.287,5.735-1.287c2.048,0,4.218,1.115,5.765,3.042C22.952,14.842,23.775,22.075,28.893,24.01L28.893,24.01z"></path><path class="fill-white" d="M20.484,5.651c0.985-1.263,1.732-3.047,1.46-4.87c-1.608,0.11-3.488,1.133-4.587,2.467 c-0.997,1.21-1.82,3.005-1.5,4.75C17.612,8.053,19.429,7.005,20.484,5.651L20.484,5.651z"></path></svg>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Apple.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __nuxt_component_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$9]]);
const _sfc_main$d = {
  __name: "CTA_App_Store",
  __ssrInlineRender: true,
  setup(__props) {
    const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
    const appleLink = runtimeConfig.public.appleLink;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon_Apple = __nuxt_component_0$3;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "cta-primary leading-5",
        href: unref(appleLink),
        target: "_blank",
        rel: "noopener noreferrer"
      }, _attrs))}><div class="flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_Icon_Apple, { class: "mr-1 fill-white" }, null, _parent));
      _push(`<div class="normal-case"><span class="block text-12">Download on the</span>App Store</div></div></a>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ctas/CTA_App_Store.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __nuxt_component_2$1 = _sfc_main$d;
const _sfc_main$c = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    viewBox: "0 0 32 32"
  }, _attrs))}><path class="fill-white" d="m16,14.4l4.48-4.8L3.0933.2133c-.1067-.1067-.32-.1067-.64-.2133l13.5467,14.4Z"></path><path class="fill-white" d="m22.4,21.3333l6.2933-3.4133c.7467-.4267,1.1733-1.0667,1.1733-1.92s-.4267-1.6-1.1733-1.92l-6.2933-3.4133-5.0133,5.3333,5.0133,5.3333Z"></path><path class="fill-white" d="m.4267.96c-.32.32-.4267.7467-.4267,1.1733v27.7333c0,.4267.1067.8533.4267,1.28l14.08-15.1467L.4267.96Z"></path><path class="fill-white" d="m16,17.6l-13.5467,14.4c.2133,0,.4267-.1067.64-.2133l17.3867-9.3867s-4.48-4.8-4.48-4.8Z"></path></svg>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Google_Play.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$b = {
  __name: "CTA_Google_Play",
  __ssrInlineRender: true,
  setup(__props) {
    const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
    const googlePlayLink = runtimeConfig.public.googlePlayLink;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon_Google_Play = __nuxt_component_1$2;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "cta-primary leading-5",
        href: unref(googlePlayLink),
        target: "_blank",
        rel: "noopener noreferrer"
      }, _attrs))}><div class="flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_Icon_Google_Play, { class: "mr-1 fill-white" }, null, _parent));
      _push(`<div class="normal-case"><span class="block text-12">Get it on</span> Google Play</div></div></a>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ctas/CTA_Google_Play.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_3$1 = _sfc_main$b;
const _sfc_main$a = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  const _component_Nav_List = __nuxt_component_6;
  const _component_CTA_App_Store = __nuxt_component_2$1;
  const _component_CTA_Google_Play = __nuxt_component_3$1;
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "fixed top-0 z-40 flex h-full w-full flex-col justify-center overflow-y-auto bg-blue transition-all duration-[600ms] lg:hidden" }, _attrs))}><ul class="nav-list w-full scale-90 list-none pt-8 text-center text-32 text-white transition-all duration-300">`);
  _push(ssrRenderComponent(_component_Nav_List, { parentClass: "nav-mobile" }, null, _parent));
  _push(`</ul><ul class="app-list mt-2 w-full scale-90 list-none text-white transition-all duration-300"><li>`);
  _push(ssrRenderComponent(_component_CTA_App_Store, null, null, _parent));
  _push(`</li><li class="mt-2">`);
  _push(ssrRenderComponent(_component_CTA_Google_Play, null, null, _parent));
  _push(`</li></ul></nav>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/Nav_Mobile.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$9 = {
  data() {
    return {
      isPageScrolled: false
    };
  },
  methods: {
    checkScrollPosition() {
      let scrollPosition = (void 0).scrollY || (void 0).documentElement.scrollTop || (void 0).body.scrollTop;
      this.isPageScrolled = scrollPosition > 0;
    }
  },
  mixins: [Header],
  mounted() {
    this.checkScrollPosition();
    (void 0).addEventListener("scroll", this.checkScrollPosition);
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Header_Banner = __nuxt_component_0$4;
  const _component_Logo_Smeeple = __nuxt_component_1$3;
  const _component_Nav_List = __nuxt_component_6;
  const _component_Icon_Menu = __nuxt_component_3$2;
  const _component_Nav_Mobile = __nuxt_component_4;
  _push(`<!--[--><header class="${ssrRenderClass([{
    "bg-blue": $data.isPageScrolled
  }, "fixed top-0 z-50 w-full transition-all duration-300"])}">`);
  _push(ssrRenderComponent(_component_Header_Banner, null, null, _parent));
  _push(`<div class="container py-2"><div class="flex min-h-[52px] items-center justify-between"><a href="/">`);
  _push(ssrRenderComponent(_component_Logo_Smeeple, { parentClass: "logo-light" }, null, _parent));
  _push(`</a><nav><ul class="nav-list flex list-none items-center text-white">`);
  _push(ssrRenderComponent(_component_Nav_List, { parentClass: "nav-header" }, null, _parent));
  _push(`</ul></nav><div class="${ssrRenderClass([{
    "nav-toggle-open": _ctx.isMobileNavOpen
  }, "nav-toggle lg:hidden"])}">`);
  _push(ssrRenderComponent(_component_Icon_Menu, {
    onClick: _ctx.toggleMobileNav,
    parentClass: "icon-light"
  }, null, _parent));
  _push(`</div></div></div></header>`);
  _push(ssrRenderComponent(_component_Nav_Mobile, {
    class: {
      "-right-[991px]": !_ctx.isMobileNavOpen,
      "right-0": _ctx.isMobileNavOpen
    }
  }, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$8 = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-blue-light bg-[url('/assets/img/bg-dot.png')] bg-bottom py-4" }, _attrs))}><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="text-center sm:col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3"><h2 class="leading-tight text-white">Subscribe to our newsletter</h2><div class="mb-3 sm:flex sm:items-center sm:justify-center"><form action="https://smeeple.us21.list-manage.com/subscribe/post?u=d80d185e796d0394c7aedcb86&amp;id=be6c5ed361&amp;f_id=003be1e6f0" method="post" target="_blank" novalidate><div class="sm:flex"><input class="border-white xs-max:mb-2 sm:w-[360px]" type="email" name="EMAIL" placeholder="Enter your email address" required><input class="cta-tertiary cursor-pointer sm:ml-2" type="submit" name="subscribe" value="Sign up"></div><div hidden><input type="hidden" name="tags" value="2964930,2969893"></div><div class="absolute -left-[5000px]" aria-hidden="true"><input type="text" name="b_d80d185e796d0394c7aedcb86_be6c5ed361" tabindex="-1"></div></form></div><p class="text-white">Get the latest Smeeple news and updates delivered <br class="sm-max:hidden">directly to your inbox.</p></div></div></div></section>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Newsletter_Signup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, _attrs))}><path d="M9.03153,23L9,13H5V9h4V6.5C9,2.7886,11.29832,1,14.60914,1c1.58592,0,2.94893,0.11807,3.34615,0.17085 v3.87863l-2.29623,0.00104c-1.80061,0-2.14925,0.85562-2.14925,2.11119V9H18.75l-2,4h-3.24019v10H9.03153z"></path></svg>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Facebook.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$6 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, _attrs))}><path d="M12,2.982c2.937,0,3.285.011,4.445.064a6.072,6.072,0,0,1,2.042.379,3.4,3.4,0,0,1,1.265.823,3.4,3.4,0,0,1,.823,1.265,6.072,6.072,0,0,1,.379,2.042c.053,1.16.064,1.508.064,4.445s-.011,3.285-.064,4.445a6.072,6.072,0,0,1-.379,2.042,3.644,3.644,0,0,1-2.088,2.088,6.072,6.072,0,0,1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.072,6.072,0,0,1-2.042-.379,3.4,3.4,0,0,1-1.265-.823,3.4,3.4,0,0,1-.823-1.265,6.072,6.072,0,0,1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.072,6.072,0,0,1,.379-2.042,3.4,3.4,0,0,1,.823-1.265,3.4,3.4,0,0,1,1.265-.823,6.072,6.072,0,0,1,2.042-.379c1.16-.053,1.508-.064,4.445-.064M12,1c-2.987,0-3.362.013-4.535.066a8.108,8.108,0,0,0-2.67.511A5.625,5.625,0,0,0,1.577,4.8a8.108,8.108,0,0,0-.511,2.67C1.013,8.638,1,9.013,1,12s.013,3.362.066,4.535a8.108,8.108,0,0,0,.511,2.67A5.625,5.625,0,0,0,4.8,22.423a8.108,8.108,0,0,0,2.67.511C8.638,22.987,9.013,23,12,23s3.362-.013,4.535-.066a8.108,8.108,0,0,0,2.67-.511A5.625,5.625,0,0,0,22.423,19.2a8.108,8.108,0,0,0,.511-2.67C22.987,15.362,23,14.987,23,12s-.013-3.362-.066-4.535a8.108,8.108,0,0,0-.511-2.67A5.625,5.625,0,0,0,19.2,1.577a8.108,8.108,0,0,0-2.67-.511C15.362,1.013,14.987,1,12,1Z"></path><path d="M12,6.351A5.649,5.649,0,1,0,17.649,12,5.649,5.649,0,0,0,12,6.351Zm0,9.316A3.667,3.667,0,1,1,15.667,12,3.667,3.667,0,0,1,12,15.667Z"></path><circle cx="17.872" cy="6.128" r="1.32"></circle></svg>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_Instagram.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$5 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, _attrs))}><path d="M23.8,7.2c0,0-0.2-1.7-1-2.4c-0.9-1-1.9-1-2.4-1C17,3.6,12,3.6,12,3.6h0c0,0-5,0-8.4,0.2 c-0.5,0.1-1.5,0.1-2.4,1c-0.7,0.7-1,2.4-1,2.4S0,9.1,0,11.1v1.8c0,1.9,0.2,3.9,0.2,3.9s0.2,1.7,1,2.4c0.9,1,2.1,0.9,2.6,1 c1.9,0.2,8.2,0.2,8.2,0.2s5,0,8.4-0.3c0.5-0.1,1.5-0.1,2.4-1c0.7-0.7,1-2.4,1-2.4s0.2-1.9,0.2-3.9v-1.8C24,9.1,23.8,7.2,23.8,7.2z M9.5,15.1l0-6.7l6.5,3.4L9.5,15.1z"></path></svg>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_YouTube.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, _attrs))}><path d="M23,0H1C0.4,0,0,0.4,0,1v22c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V1C24,0.4,23.6,0,23,0z M7.1,20.5H3.6V9h3.6 V20.5z M5.3,7.4c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1c1.1,0,2.1,0.9,2.1,2.1C7.4,6.5,6.5,7.4,5.3,7.4z M20.5,20.5h-3.6 v-5.6c0-1.3,0-3-1.8-3c-1.9,0-2.1,1.4-2.1,2.9v5.7H9.4V9h3.4v1.6h0c0.5-0.9,1.6-1.8,3.4-1.8c3.6,0,4.3,2.4,4.3,5.5V20.5z"></path></svg>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/Icon_LinkedIn.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$3 = {
  props: {
    parentClass: String
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon_Facebook = __nuxt_component_0;
  const _component_Icon_Instagram = __nuxt_component_1$1;
  const _component_Icon_YouTube = __nuxt_component_2;
  const _component_Icon_LinkedIn = __nuxt_component_3;
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "mt-3 list-none" }, _attrs))}><li class="inline-block sm-max:mr-2 md:mr-2"><a href="https://facebook.com/SmeepleApp" target="_blank">`);
  _push(ssrRenderComponent(_component_Icon_Facebook, {
    class: [{
      "fill-blue-light hover:fill-blue-lighter": $props.parentClass === "icons-blue",
      "fill-green-light hover:fill-green-lighter": $props.parentClass === "icons-green",
      "fill-orange-light hover:fill-orange-lighter": $props.parentClass === "icons-orange"
    }, "transition-all duration-300"]
  }, null, _parent));
  _push(`</a></li><li class="inline-block sm-max:mr-2 md:mr-2"><a href="https://instagram.com/SmeepleApp" target="_blank">`);
  _push(ssrRenderComponent(_component_Icon_Instagram, {
    class: [{
      "fill-blue-light hover:fill-blue-lighter": $props.parentClass === "icons-blue",
      "fill-green-light hover:fill-green-lighter": $props.parentClass === "icons-green",
      "fill-orange-light hover:fill-orange-lighter": $props.parentClass === "icons-orange"
    }, "transition-all duration-300"]
  }, null, _parent));
  _push(`</a></li><li class="inline-block sm-max:mr-2 md:mr-2"><a href="https://youtube.com/@SmeepleApp" target="_blank">`);
  _push(ssrRenderComponent(_component_Icon_YouTube, {
    class: [{
      "fill-blue-light hover:fill-blue-lighter": $props.parentClass === "icons-blue",
      "fill-green-light hover:fill-green-lighter": $props.parentClass === "icons-green",
      "fill-orange-light hover:fill-orange-lighter": $props.parentClass === "icons-orange"
    }, "transition-all duration-300"]
  }, null, _parent));
  _push(`</a></li><li class="inline-block"><a href="https://linkedin.com/company/smeeple" target="_blank">`);
  _push(ssrRenderComponent(_component_Icon_LinkedIn, {
    class: [{
      "fill-blue-light hover:fill-blue-lighter": $props.parentClass === "icons-blue",
      "fill-green-light hover:fill-green-lighter": $props.parentClass === "icons-green",
      "fill-orange-light hover:fill-orange-lighter": $props.parentClass === "icons-orange"
    }, "transition-all duration-300"]
  }, null, _parent));
  _push(`</a></li></ul>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/Social_List.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const _imports_0 = "" + __publicAssetsURL("assets/img/qr-smeeple-app.png");
const _sfc_main$2 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
    const googlePlayLink = runtimeConfig.public.googlePlayLink;
    const appleLink = runtimeConfig.public.appleLink;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Newsletter_Signup = __nuxt_component_0$1;
      const _component_Logo_Smeeple = __nuxt_component_1$3;
      const _component_Icon_Apple = __nuxt_component_0$3;
      const _component_Icon_Google_Play = __nuxt_component_1$2;
      const _component_CTA_App_Store = __nuxt_component_2$1;
      const _component_CTA_Google_Play = __nuxt_component_3$1;
      const _component_Nav_List = __nuxt_component_6;
      const _component_Social_List = __nuxt_component_7;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Newsletter_Signup, null, null, _parent));
      _push(`<footer class="bg-blue-dark text-white"><div class="bg-blue py-4"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="order-1 sm:col-span-6 xl:col-span-3 2xl:col-span-4"><a href="/">`);
      _push(ssrRenderComponent(_component_Logo_Smeeple, { parentClass: "logo-light" }, null, _parent));
      _push(`</a><div class="mt-2 md-max:hidden lg:lg-max:flex lg:lg-max:items-center 2xl:flex 2xl:items-center"><img${ssrRenderAttr("src", _imports_0)} alt="QR code to download the Smeeple app"><div class="lg:lg-max:ml-3 xl:xl-max:mt-3 2xl:ml-3"><p>Scan the QR code,<br>to download Smeeple.</p><div class="mt-1 flex"><a${ssrRenderAttr("href", unref(appleLink))} target="_blank" rel="noopener noreferrer">`);
      _push(ssrRenderComponent(_component_Icon_Apple, null, null, _parent));
      _push(`</a><a${ssrRenderAttr("href", unref(googlePlayLink))} target="_blank" rel="noopener noreferrer">`);
      _push(ssrRenderComponent(_component_Icon_Google_Play, { class: "ml-2" }, null, _parent));
      _push(`</a></div></div></div><ul class="app-list mt-3 list-none lg:hidden"><li>`);
      _push(ssrRenderComponent(_component_CTA_App_Store, null, null, _parent));
      _push(`</li><li class="mt-2">`);
      _push(ssrRenderComponent(_component_CTA_Google_Play, null, null, _parent));
      _push(`</li></ul></div><nav class="xs-max:order-2 xs-max:mt-3 sm:order-3 sm:col-span-6 xl:order-2 xl:col-span-2"><h6 class="text-blue-light">Menu</h6><ul class="nav-list list-none">`);
      _push(ssrRenderComponent(_component_Nav_List, { parentClass: "nav-footer" }, null, _parent));
      _push(`</ul></nav><div class="xs-max:order-3 xs-max:mt-3 sm:order-2 sm:col-span-6 xl:order-3 xl:col-span-3 2xl:col-span-3"><h6 class="text-green-light">Join our community</h6><p>Want to share your expertise, assist others remotely, and connect with your network?</p><a class="cta-secondary mt-3" href="/for-experts">Become an expert</a></div><div class="order-4 xs-max:mt-3 sm:col-span-6 xl:col-span-3"><h6 class="text-orange-light">Smeeple</h6><p>Connecting people to subject matter experts, through video conferencing, to gain knowledge, skills, and insight.</p>`);
      _push(ssrRenderComponent(_component_Social_List, { parentClass: "icons-orange" }, null, _parent));
      _push(`</div></div></div></div><div class="bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] sm-max:py-4 md:py-2"><div class="container md:flex md:items-center md:justify-between"><p class="sm-max:mb-3">© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Smeeple. <br class="sm-max:hidden xl:hidden">All rights reserved.</p><ul class="nav-list list-none md:flex md:items-center md-max:justify-center"><li><a href="/terms-and-conditions">Terms &amp; conditions</a></li><li class="sm-max:mt-1 md:ml-4"><a href="/privacy-policy">Privacy policy</a></li><li class="sm-max:mt-1 md:ml-4"><a href="/booking-policy-and-expert-agreement">Booking policy &amp; <br class="sm-max:hidden lg:hidden">expert agreement</a></li></ul></div></div></footer><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = _sfc_main$2;
const _sfc_main$1 = {
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.error.statusCode} - ${props.error.statusMessage.split(":")[0]} | Smeeple`,
      meta: [
        { name: "description", content: "" },
        { name: "keywords", content: "" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ],
      bodyAttrs: {
        class: "bg-blue-dark"
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0$2;
      const _component_Footer = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<section class="flex h-screen items-center bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] text-white md-max:-mt-[92px] md-max:pt-[132px] lg:-mt-[141px] lg:pt-[221px]"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><span class="block text-24 font-normal text-blue-light">${ssrInterpolate(__props.error.statusCode)}</span><h1 class="mb-3">${ssrInterpolate(__props.error.statusMessage.split(":")[0])}</h1>`);
      if (__props.error.statusCode === 404) {
        _push(`<div><p>Uh oh! 😲 It appears the page you were trying to reach has disappeared into the digital void.</p><p>Click <a class="cursor-pointer">here</a> to get back on track. 😎</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section>`);
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import("./_nuxt/island-renderer-eQdyCZUE.js").then((r) => r.default || r));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);
export {
  _export_sfc as _,
  asyncDataDefaults as a,
  useNuxtApp as b,
  createError as c,
  useRequestFetch as d,
  entry$1 as default,
  _imports_0 as e,
  fetchDefaults as f,
  useRuntimeConfig as g,
  __nuxt_component_0$3 as h,
  __nuxt_component_1$2 as i,
  __nuxt_component_2$1 as j,
  __nuxt_component_3$1 as k,
  useRequestEvent as l,
  useRoute as m,
  __nuxt_component_0$2 as n,
  __nuxt_component_1 as o,
  useHead as u
};
//# sourceMappingURL=server.mjs.map
