import $ from "jquery";
import { ajax } from "@coremedia/brick-utils";
import { EVENT_NODE_APPENDED } from "@coremedia/brick-dynamic-include";
import { decorateNode, undecorateNode } from "@coremedia/brick-node-decoration-service";

const $document = $(document);
const EVENT_P13N_EXPERIENCE = "coremedia.p13n.experience";
const experienceTagAttributes = [
  "data-cm-experience-contentid",
  "data-cm-experience-links",
  "data-cm-experience-tracking",
  "data-cm-metadata",
];

const _cm_p13n = {
  multipleSegments: true,
  segmentSelected: false,

  pushSegment: function (segmentName) {
    const p13n = window.cm_p13n;
    if (this.multipleSegments || !this.segmentSelected) {
      this.segmentSelected = true;
      p13n.pushVariant(segmentName);
    }
  },

  pushVariant: function (variantId) {
    const fragments = $.find("[data-cm-experience-links]");
    fragments.forEach(function (f) {
      const $fragment = $(f);

      const state = $fragment.data("cm-state");
      if (state === "loading") {
        // ignore further activations if triggered multiple times on live side
        return;
      }

      const links = $fragment.data("cm-experience-links");
      if (!links || !links[variantId]) {
        // fragment is not matching the requested variant
        return;
      }
      const fragmentUrl = links[variantId];

      $fragment.data("cm-state", "loading");

      ajax({
        url: fragmentUrl,
        dataType: "text",
      }).done(function (html) {
        const $html = $(html);
        undecorateNode($fragment);
        experienceTagAttributes.forEach(function (name) {
          $html.attr(name, $fragment.attr(name));
        });
        $fragment.replaceWith($html);
        decorateNode($html);
        $document.trigger(EVENT_NODE_APPENDED, [$html]);
        triggerTracking($html, variantId);
      });
    });
  },

  exchangeVariant: function (variantId, contentId) {
    const fragments = $.find("[data-cm-experience-links]");
    fragments.forEach(function (f) {
      const $fragment = $(f);

      const state = $fragment.data("cm-state");
      if (state === "loading") {
        // ignore further activations if triggered before previous load finished
        return;
      }

      const fragmentContentId = $fragment.data("cm-experience-contentid");
      if (fragmentContentId !== contentId) {
        // ignore other content using the same experience
        return;
      }

      const links = $fragment.data("cm-experience-links");
      if (!links || !links[variantId]) {
        // fragment is not matching the requested variant
        return;
      }
      const fragmentUrl = links[variantId];

      $fragment.data("cm-state", "loading");

      ajax({
        url: fragmentUrl,
        dataType: "text",
      })
        .done(function (html) {
          const $html = $(html);
          undecorateNode($fragment);
          $.each($fragment.prop("attributes"), function () {
            $html.attr(this.name, this.value);
          });
          $html.css("opacity", 0);
          $fragment.replaceWith($html);
          decorateNode($html);
          $html.animate({ opacity: 1 }, 800, "linear");
          $fragment.data("cm-state", null);
        })
        .fail(function () {
          $fragment.data("cm-state", null);
        });
    });
  },

  completed: function (providerId) {
    const p13n = window.cm_p13n;
    if (providerId === "ALL") {
      p13n.ap = [];
    } else {
      const index = p13n.ap.indexOf(providerId);
      if (index > -1) {
        p13n.ap.splice(index, 1);
      }
    }
    if (p13n.ap.length > 0) {
      // wait until all providers have finished
      return;
    }

    const fragments = $.find(".cm-experience");
    fragments.forEach(function (f) {
      const $fragment = $(f);

      const state = $fragment.data("cm-state");
      if (state !== "loading") {
        const children = $fragment.children();
        if (children.length === 1) {
          const $child = $(children[0]);
          undecorateNode($fragment);
          experienceTagAttributes.forEach(function (name) {
            $child.attr(name, $fragment.attr(name));
          });
          $fragment.replaceWith($child);
          decorateNode($child);
          $document.trigger(EVENT_NODE_APPENDED, [$child]);
          triggerTracking($child, "baseline");
        }
      }
    });
  },
};

const triggerTracking = ($child, variantId) => {
  const contentData = $child.data("cm-experience-tracking");
  if (contentData) {
    const statistics = {
      uuid: contentData.uuid,
      name: contentData.name,
      type: contentData.type,
      p13nId: variantId,
      content: contentData.variants[variantId],
    };
    document.dispatchEvent(new CustomEvent(EVENT_P13N_EXPERIENCE, { detail: statistics }));
  }
};

window.addEventListener(
  "message",
  function (event) {
    const data = event.data;
    if (data.type === "previewExperience") {
      const contentId = data.body.contentId;
      const variantId = data.body.variantId;
      window.cm_p13n.exchangeVariant(variantId, contentId);
    }
  },
  false,
);

export default _cm_p13n;
