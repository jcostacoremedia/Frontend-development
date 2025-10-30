import $ from "jquery";
import { findAndSelf, ajax, pushTaskQueue, popTaskQueue } from "@coremedia/brick-utils";
import { decorateNode, undecorateNode } from "@coremedia/brick-node-decoration-service";

const $document = $(document);

export const EVENT_NODE_APPENDED = "coremedia.blueprint.basic.nodeAppended";

export const FRAGMENT_IDENTIFIER = "cm-fragment";

/**
 * Replace "$nextUrl$" in all data-href and store as href attribute.
 * Assumes that if the page contains a form with a nextUrl hidden input field, the form is already loaded.
 *
 * Static Application Security Testing (SAST) tools like Checkmarx may complain
 * about the usage of the 'nextUrl' parameter, if they assume that it is used
 * without proper sanitization or encoding. Such reports are false positives.
 * It will be encoded via encodeURIComponent(nextUrl)
 *
 * @param {jQuery} $target
 */
export function renderFragmentHrefs($target) {
  let nextUrl;
  if (window.location.pathname.match(/^\/dynamic\//)) {
    // we are inside a web flow, try to find "nextUrl" hidden input field value, else leave nextUrl blank
    nextUrl = $('input:hidden[name="nextUrl"]').val() || "";
  } else {
    // for all other pages, take the current page as the next page after login
    nextUrl = window.location.href;
  }

  const selector = "a[data-href]";
  findAndSelf($target, selector).each(function () {
    const $this = $(this);
    $this.attr("href", $this.data("href").replace(/\$nextUrl\$/g, encodeURIComponent(nextUrl)));
  });
}

/**
 * Changes a given target
 *
 * @param {jQuery} $target The target the update is to be applied to
 * @param {jQuery} $update The update to add to DOM
 * @param {boolean} replaceTarget if TRUE target will be replaced with the given target, otherwise only inner nodes will be removed
 */
export function updateTarget($target, $update, replaceTarget) {
  pushTaskQueue();
  if (replaceTarget) {
    undecorateNode($target);
    $target.replaceWith($update);
  } else {
    $target.children().each(function () {
      undecorateNode(this);
    });
    $target.empty().append($update);
  }
  decorateNode($update);
  $document.trigger(EVENT_NODE_APPENDED, [$update]);
  popTaskQueue();
}

/**
 * Updates a given target with the result of the provided url.
 *
 * Only the last triggered update will have an effect if multiple updates are triggered without waiting for
 * the ajax request to be finished.
 *
 * @param $target target to be updated
 * @param requestConfig the request config to be used containing
 *        url: the url to retrieve the new target from
 *        params: additional request params (optional)
 *        method: the request method (optional, defaults to GET)
 * @param replaceTarget (default) true, if false replaces only the child elements of the target
 * @param {updateTargetWithAjaxResponseCallback} callback to be triggered on success
 */
export function updateTargetWithAjaxResponse($target, requestConfig, replaceTarget, callback) {
  requestConfig = $.extend({ url: undefined, params: {}, method: "GET" }, requestConfig);

  if (typeof replaceTarget === "undefined") {
    replaceTarget = true;
  }
  if (requestConfig.url !== undefined) {
    const FRAGMENT_REQUEST_COUNTER = "cm-fragment-request-counter";
    const FRAGMENT_LOADING_CLASS = "cm-fragment--loading";
    const requestId = ($target.data(FRAGMENT_REQUEST_COUNTER) || 0) + 1;
    $target.data(FRAGMENT_REQUEST_COUNTER, requestId);

    const isOutdated = function () {
      // if $target is no longer in DOM or the request is not the current latest request: ignore update
      return !$.contains(document.documentElement, $target[0]) || requestId !== $target.data(FRAGMENT_REQUEST_COUNTER);
    };

    $target.addClass(FRAGMENT_LOADING_CLASS);
    ajax({
      type: requestConfig.method,
      url: requestConfig.url,
      data: requestConfig.params,
      dataType: "text",
    })
      .done(function (data, _, jqXHR) {
        if (isOutdated()) {
          return;
        }
        let $html = undefined;
        if (jqXHR.status === 200) {
          $html = $(data);
          updateTarget($target, $html, replaceTarget);
        }
        if (callback) {
          callback(jqXHR, $html);
        }
      })
      .fail(function (jqXHR) {
        if (callback) {
          callback(jqXHR);
        }
      })
      .always(function () {
        if (isOutdated()) {
          return;
        }
        $target.removeClass(FRAGMENT_LOADING_CLASS);
      });
  }
}

/**
 * @callback updateTargetWithAjaxResponseCallback
 * @param jqXHR the jQuery XHR object
 * @param {jQuery} $html the new html if the request was successful
 */

/**
 * Refreshes a refreshable fragment by reading its configuration.
 *
 * @param $fragment the refreshable fragment to refresh
 * @param callback to be triggered on success
 * @param requestParams additional request params
 */
export function refreshFragment($fragment, callback, requestParams) {
  const config = $.extend({ url: undefined }, $fragment.data("cm-refreshable-fragment"));
  const requestConfig = {
    url: config.url,
    params: requestParams,
  };
  updateTargetWithAjaxResponse($fragment, requestConfig, true, callback);
}

/**
 * Delays the execution of the given callback until all fragments of the given container are loaded.
 * If all fragments are already loaded the callback is executed immediately.
 *
 * @param {Object} config
 * @param {Function} config.callback the callback to trigger after the fragments are loaded.
 * @param {Node} config.container the container containing the fragments. If not provided the whole document will be used.
 */
export function waitForFragments({ callback, container = document }) {
  const $container = $(container);
  const wrappedCallback = () => {
    const $dynamicItems = $container.find(`[data-${FRAGMENT_IDENTIFIER}]`);
    // delay initialization until all dynamic fragments that are used as items inside the slideshow are loaded
    if ($dynamicItems.length === 0) {
      $document.off(EVENT_NODE_APPENDED, wrappedCallback);
      callback();
    }
  };
  $document.on(EVENT_NODE_APPENDED, wrappedCallback);
  wrappedCallback();
}
