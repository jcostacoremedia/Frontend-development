import { addNodeDecoratorBySelector } from "@coremedia/brick-node-decoration-service";

const bannerBlock = "cm-left-right-banner";
const bannerModifierAlternative = `${bannerBlock}--alternative`;

const gridBlock = "cm-left-right-banner-grid";
const gridElementItem = `${gridBlock}__item`;

/**
 * @param {Element} firstItem
 * @param {Element} secondItem
 * @param {String} selector
 */
const fixAlternatingClasses = (firstItem, secondItem, selector = null) => {
  if (!firstItem || !secondItem) {
    return;
  }
  const firstBanner = selector ? firstItem.querySelector(selector) : firstItem;
  const secondBanner = selector ? secondItem.querySelector(selector) : secondItem;
  if (!firstBanner || !secondBanner) {
    return;
  }
  const firstIsAlternative = firstBanner.classList.contains(bannerModifierAlternative);
  const secondIsAlternative = secondBanner.classList.contains(bannerModifierAlternative);

  // if both are alternative or not alternative
  if (firstIsAlternative === secondIsAlternative) {
    if (firstIsAlternative) {
      secondBanner.classList.remove(bannerModifierAlternative);
    } else {
      secondBanner.classList.add(bannerModifierAlternative);
    }
    fixAlternatingClasses(secondItem, secondItem.nextElementSibling, selector);
  }
};

addNodeDecoratorBySelector(`.${bannerBlock}`, ($banner) => {
  const banner = $banner[0];
  fixAlternatingClasses(banner.previousElementSibling, banner);
});

addNodeDecoratorBySelector(`.${gridElementItem}`, ($gridItem) => {
  const gridItem = $gridItem[0];
  fixAlternatingClasses(gridItem.previousElementSibling, gridItem, `.${bannerBlock}`);
});
