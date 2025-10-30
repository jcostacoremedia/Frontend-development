import $ from "jquery";
import { error, log } from "@coremedia/brick-utils";

/**
 * Loads more search results (next page) via ajax below the search results.
 *
 * Static Application Security Testing (SAST) tools like Checkmarx may complain
 * about the usage of 'nextSearchResults' response, if they assume that it is
 * untrusted data without proper sanitization or encoding.
 * Such reports are false positives.
 *
 * @param {string} url
 */
function loadPage(url) {
  // load more results
  log("ajaxUrl", url);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
    })
      .done((nextSearchResults) => {
        log("Loaded next page successfully.");
        resolve(nextSearchResults);
      })
      .fail(() => {
        error("Could not load next page.");
        reject();
      });
  });
}

export function initPagination($loadMoreButton, $spinner, url, newPageCallback) {
  log("Initialize pagination", $loadMoreButton, url);
  $loadMoreButton.on("click touch", () => {
    log("Load more search results via ajax.", $loadMoreButton, url);
    $loadMoreButton.hide();
    $spinner.show();
    loadPage(url)
      .then((nextSearchResults) => {
        newPageCallback(nextSearchResults);
      })
      .catch(() => {
        // restore button and spinner again for retry
        $spinner.hide();
        $loadMoreButton.show();
      });
  });
  // enable button as soon as functionality is attached
  $loadMoreButton.removeAttr("disabled");
}
