import { _ as __nuxt_component_9 } from "./Expert_Spotlight-B-AjJxrX.js";
import { _ as __nuxt_component_1 } from "./Categories-Dw0TOHYh.js";
import { u as useHead } from "../server.mjs";
import { useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import "ohash";
import "#internal/nitro";
import "ofetch";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "defu";
import "klona";
import "devalue";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Browse Experts",
      meta: [
        { name: "description", content: "Meet Our Top Experts: Get Personalized Assistance Tailored to Your Needs with Smeeple!" },
        { name: "keywords", content: "smeeple, experts, people, knowledge, skills,  insight, download, expert, book" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Expert_Spotlight = __nuxt_component_9;
      const _component_Categories = __nuxt_component_1;
      _push(`<!--[--><section class="flex items-center bg-blue-dark bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] md-max:-mt-[92px] md-max:pt-[132px] lg:-mt-[141px] lg:pt-[221px]"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><h1 class="mb-0">Browse experts</h1></div></div></div></section>`);
      _push(ssrRenderComponent(_component_Expert_Spotlight, null, null, _parent));
      _push(ssrRenderComponent(_component_Categories, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/browse-experts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-zgKbSJB8.js.map
