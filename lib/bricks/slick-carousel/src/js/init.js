import $ from "jquery";
import { EVENT_LAYOUT_CHANGED } from "@coremedia/brick-utils";
import { addNodeDecoratorByData } from "@coremedia/brick-node-decoration-service";
import slickCarousel from "./index";
import { waitForFragments } from "@coremedia/brick-dynamic-include";

const $document = $(document);

addNodeDecoratorByData({}, "cm-slick-carousel", ($container, config) => {
  waitForFragments({
    callback: () => {
      slickCarousel($container, config);
      $document.trigger(EVENT_LAYOUT_CHANGED);

      // Listen to EVENT_LAYOUT_CHANGED to refresh dimensions of the carousel
      $document.on(EVENT_LAYOUT_CHANGED, () => {
        // store dimensions
        const width = $container.width();
        const height = $container.height();
        // refresh slick carousel
        $container.slick("setPosition");
        // if dimensions have changed, trigger another EVENT_LAYOUT_CHANGED
        if (width !== $container.width() || height !== $container.height()) {
          $document.trigger(EVENT_LAYOUT_CHANGED);
        }
      });
    },
    container: $container[0],
  });
});
