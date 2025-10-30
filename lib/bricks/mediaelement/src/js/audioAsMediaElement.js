import $ from "jquery";
import * as utils from "@coremedia/brick-utils";
import "promise-polyfill/src/polyfill";

/**
 * Generates a mediaElement for the given audio
 * See renderers for supported external audios
 *
 * @param audioElement
 * @return a Promise which resolves when the media element is initialized
 */
function audioAsMediaElement(audioElement) {
  const $audio = $(audioElement);
  const $document = $(document);

  return import("mediaelement/full").then(() => {
    // mediaElement object of the audio
    // eslint-disable-next-line no-undef
    const me = new MediaElement(audioElement, {
      fakeNodeName: "cm-mediaelementwrapper",
      useDefaultControls: true,

      // events of audios
      success: function (mediaElement) {
        const $mediaElement = $(mediaElement);
        // attach css class
        $mediaElement.addClass("cm-mediaelementwrapper");
        // audio loaded
        mediaElement.addEventListener(
          "loadedmetadata",
          function () {
            utils.log("Audio " + mediaElement.src + " loaded.", $audio);
            $document.trigger(utils.EVENT_LAYOUT_CHANGED);
          },
          false,
        );

        // audio started
        mediaElement.addEventListener(
          "playing",
          function () {
            utils.log("Audio started with duration of " + me.duration + "ms.");
          },
          false,
        );

        // audio ended
        mediaElement.addEventListener(
          "ended",
          function () {
            utils.log("Audio playback ended.");
          },
          false,
        );
      },
    });
  });
}

/**
 * default wrapper function to handle dom elements or jQuery selectors
 * @param domElementOrJQueryResult
 */
export default function (domElementOrJQueryResult) {
  if (domElementOrJQueryResult instanceof $) {
    $.each(domElementOrJQueryResult, function (index, item) {
      audioAsMediaElement(item);
    });
  } else {
    audioAsMediaElement(domElementOrJQueryResult);
  }
}
