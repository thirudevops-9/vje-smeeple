import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const expertSpotlight = [
  {
    id: "1",
    name: "Jeff Demassari",
    category: "Trades & Services",
    specialty: "Sheet metal",
    rating: "4.98",
    reviews: "12",
    rate: "$30",
    photo: "/assets/img/photo-jeff-demassari.jpg",
    profile: "https://app.smeeple.com/experts/1qp3es"
  },
  {
    id: "2",
    name: "Katie Krejci",
    category: "Homesteading",
    specialty: "Garden planning",
    rating: "5.0",
    reviews: "1",
    rate: "$30",
    photo: "/assets/img/photo-katie-krejci.jpg",
    profile: "https://app.smeeple.com/experts/6rueat"
  },
  {
    id: "3",
    name: "Ian Gunther",
    category: "Sports",
    specialty: "Gymnastics",
    rating: "4.76",
    reviews: "1283",
    rate: "$30",
    photo: "/assets/img/photo-ian-gunther.jpg",
    profile: "https://app.smeeple.com/experts/bdb345"
  },
  {
    id: "4",
    name: "Discovery Daisy",
    category: "Outdoors",
    specialty: "Metal detecting tips",
    rating: "4.91",
    reviews: "31",
    rate: "$20",
    photo: "/assets/img/photo-discovery-daisy.jpg",
    profile: "https://app.smeeple.com/experts/DiscoveryDaisy"
  },
  {
    id: "5",
    name: "Jake Fullington",
    category: "Culinary",
    specialty: "Brisket",
    rating: "4.84",
    reviews: "53",
    rate: "$15",
    photo: "/assets/img/photo-jake-fullington.jpg",
    profile: "https://app.smeeple.com/experts/a0ed01"
  },
  {
    id: "6",
    name: "Erin Costa",
    category: "Home & Design",
    specialty: "Interior design & decorating",
    rating: "4.90",
    reviews: "5",
    rate: "$50",
    photo: "/assets/img/photo-erin-costa.jpg",
    profile: "https://app.smeeple.com/experts/4klo69"
  },
  {
    id: "7",
    name: "Daniel Sydnor",
    category: "Health & Wellness",
    specialty: "Personalized training plan",
    rating: "4.53",
    reviews: "138",
    rate: "$60",
    photo: "/assets/img/photo-daniel-sydnor.jpg",
    profile: "https://app.smeeple.com/experts/pjuj7f"
  }
];
const _sfc_main = {
  data() {
    return {
      expertSpotlight
    };
  },
  mounted() {
    const root = (void 0).documentElement;
    const marqueeElementsDisplayed = 7;
    const marqueeContent = (void 0).querySelector("ul.marquee-content");
    if (marqueeContent) {
      root.style.setProperty("--marquee-elements", marqueeContent.children.length);
      for (let i = 0; i < marqueeElementsDisplayed; i++) {
        marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
      }
    } else {
      console.error("marquee-content element not found");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "overflow-hidden md-max:pb-5 md-max:pt-7" }, _attrs))}><div class="container"><div class="sm:grid sm:grid-cols-12 sm:gap-3"><div class="text-center sm:col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3"><h2 class="mb-8 inline-block -rotate-3 -skew-x-6 rounded-lg bg-green-light px-2 text-white">Expert spotlight</h2><p>Check out some of our top experts, from industry leaders to social media giants. With Smeeple, you&#39;ll get personalized one-on-one assistance tailored to your needs, when you need it the most.</p></div></div></div><div class="marquee mt-8 md-max:mb-3 lg:mb-0"><ul class="marquee-content list-none"><!--[-->`);
  ssrRenderList($data.expertSpotlight, (expert) => {
    _push(`<li class="mx-[15px] scale-100 transition-all lg:hover:scale-105"><a${ssrRenderAttr("href", expert.profile)} class="relative flex-1 no-underline" target="_blank"><div class="absolute -left-[8px] top-[8px] z-10 rounded-md bg-orange-light px-2 font-poppins text-16 text-white shadow-md">${ssrInterpolate(expert.category)}</div><div style="${ssrRenderStyle({ backgroundImage: `url('${expert.photo}')` })}" class="card relative h-[480px] overflow-hidden rounded-lg bg-gray-light shadow-lg shadow-black/30 duration-300"><div class="card-body absolute bottom-0 grid w-full grid-cols-12 bg-white/90 px-3 py-2"><div class="col-span-9"><span class="block font-poppins text-18 text-black">${ssrInterpolate(expert.name)}</span><span class="block overflow-hidden text-ellipsis whitespace-nowrap font-poppins text-16 text-blue-light">${ssrInterpolate(expert.specialty)}</span></div><div class="col-span-3 text-right"><span class="inline-block rounded-md bg-green-light px-2 font-poppins text-16 text-white">${ssrInterpolate(expert.rate)}</span></div></div></div></a></li>`);
  });
  _push(`<!--]--></ul></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Expert_Spotlight.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __nuxt_component_9 as _
};
//# sourceMappingURL=Expert_Spotlight-B-AjJxrX.js.map
