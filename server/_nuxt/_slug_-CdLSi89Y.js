import { u as useFetch, _ as __nuxt_component_1 } from "./Categories-Dw0TOHYh.js";
import { u as useHead } from "../server.mjs";
import { withAsyncContext, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import "ohash";
import "#internal/nitro";
import "ofetch";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "ufo";
import "defu";
import "klona";
import "devalue";
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch("https://app.smeeple.com/api/v1.1/categories/mobile", "$K66z1vmSzB")), __temp = await __temp, __restore(), __temp);
    const { data: experts } = ([__temp, __restore] = withAsyncContext(() => useFetch("https://app.smeeple.com/api/v1.1/experts/mobile", "$HyJIF2imHN")), __temp = await __temp, __restore(), __temp);
    const sentenceCase = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    const route = useRoute();
    const slug = route.params.slug;
    const categoryName = sentenceCase(slug.replace(/and/g, "&").replace(/-/g, " "));
    useHead({
      title: categoryName + " | Browse Experts",
      meta: [
        { name: "description", content: "" },
        { name: "keywords", content: "" },
        { property: "og:title", content: "" },
        { property: "og:description", content: "" },
        { property: "og:url", content: "" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Categories = __nuxt_component_1;
      _push(`<!--[--><section class="flex items-center bg-blue-dark bg-[url(&#39;/assets/img/bg-shapes-blue.png&#39;)] md-max:-mt-[92px] md-max:pt-[132px] lg:-mt-[141px] lg:pt-[221px]"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><span class="block text-24 font-normal text-blue-light">Browse experts</span><h1 class="mb-0">${ssrInterpolate(unref(categoryName))}</h1></div></div></div></section><section class="md-max:py-7"><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="sm:col-span-12 xl:col-span-10 xl:col-start-2"><div class="text-center"><h2 class="mb-8 inline-block -rotate-3 -skew-x-6 rounded-lg bg-green-light px-2 text-center text-white">Meet the experts</h2></div><div class="grid gap-3 sm:grid-cols-12"><!--[-->`);
      ssrRenderList(unref(categories), (category, index) => {
        _push(`<!--[-->`);
        if (sentenceCase(category.name) === unref(categoryName)) {
          _push(`<!--[-->`);
          ssrRenderList(unref(experts), (expert, index2) => {
            _push(`<!--[-->`);
            if (expert.categoryId === category.id) {
              _push(`<a class="xs:col-span-12 overflow-hidden rounded-lg shadow-lg shadow-black/30 sm:col-span-6 lg:col-span-4 2xl:col-span-3"${ssrRenderAttr("href", "https://app.smeeple.com/experts/" + expert.profileLinkId)} target="_blank"><div style="${ssrRenderStyle({ backgroundImage: `url('${expert.photoUrl}')` })}" class="card relative h-[360px] bg-cover bg-center shadow-lg shadow-black/30 duration-300"><div class="card-body absolute bottom-0 w-full bg-white/90 px-3 py-2"><span class="block font-poppins text-18 text-black">${ssrInterpolate(sentenceCase(expert.firstName))} ${ssrInterpolate(sentenceCase(expert.lastName))}</span><span class="block overflow-hidden text-ellipsis whitespace-nowrap font-poppins text-16 text-blue-light">${ssrInterpolate(sentenceCase(expert.specialties[0].specialty))}</span></div></div></a>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
      _push(ssrRenderComponent(_component_Categories, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/browse-experts/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_slug_-CdLSi89Y.js.map
