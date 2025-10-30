import $ from "jquery";
import { addNodeDecoratorByData } from "@coremedia/brick-node-decoration-service";
import { updateTarget } from "@coremedia/brick-dynamic-include";
import { initPagination } from "./pagination";

// Enable pagination
addNodeDecoratorByData(undefined, "cm-pagination", ($pagination, url) => {
  const $button = $pagination.find(".cm-pagination__more");
  const $spinner = $pagination.find(".cm-pagination__loading");
  initPagination($button, $spinner, url, (newPage) => {
    // replace the whole pagination with the result (the result has a new one)
    updateTarget($pagination, $(newPage), true);
  });
});

// --- DOCUMENT READY --------------------------------------------------------------------------------------------------

$(function () {
  "use strict";

  /* --- Mobile Header Search --- */
  const $search = $("#cmSearchWrapper");
  const $searchInput = $search.find(".cm-search__form-input");
  $(".cm-mobile-search-button, .cm-search__form-close").on("click", function () {
    $search.toggleClass("open");
    if ($search.hasClass("open")) {
      $searchInput.focus();
    }
  });

  // prevent empty search on all search fields
  $(".cm-search__form-button").on("click", function (e) {
    let $input = $(this).parents(".cm-search--form").find(".cm-search__form-fieldset input");
    if ($input.length > 0 && $input.val().length === 0) {
      e.preventDefault();
      $input.focus();
    }
  });
});
