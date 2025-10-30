import $ from "jquery";
import _cm_p13n from "./p13n-dynamic-include";

// --- JQUERY DOCUMENT READY -------------------------------------------------------------------------------------------

$(function () {
  const p13n = window.cm_p13n;
  if (p13n) {
    p13n._cm_p13n = _cm_p13n;
    p13n.run();
  }
});
