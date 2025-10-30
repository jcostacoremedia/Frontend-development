<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#import "*/node_modules/@coremedia/brick-slick-carousel/src/freemarkerLibs/slickCarousel.ftl" as slickCarousel />

<#--
  Template Description:

  This template renders all items with the view "_carouselBannerSlickCarouselItem" inside a slick carousel.

  @since 2004
-->

<#assign slickConfig={

  "mobileFirst": true,

  "responsive": [
    {
      "breakpoint": 0,
      "settings": {
        "arrows": false,
        "centerMode": true,
        "centerPadding": "30px",
        "slidesToScroll": 1,
        "slidesToShow": 2
      }
    },
    {
      "breakpoint": 543,
      "settings": {
        "arrows": false,
        "centerMode": true,
        "centerPadding": "30px",
        "slidesToScroll": 1,
        "slidesToShow": 3
      }
    },
    {
      "breakpoint": 767,
      "settings": {
        "slidesToScroll": 3,
        "slidesToShow": 3
      }
    },
    {
      "breakpoint": 991,
      "settings": {
      "slidesToScroll": 4,
        "slidesToShow": 4
      }
    },
    {
      "breakpoint": 1199,
      "settings": {
        "slidesToScroll": 5,
        "slidesToShow": 5
      }
    }
  ]
}/>

<div class="cm-carousel-banner-container"<@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_carouselBannerContainerHeader" />

  <@slickCarousel.render items=self.items
                         itemsWrapperView="_carouselBannerSlickCarouselItem"
                         slickConfig=slickConfig
                         additionalClass="cm-carousel-banner-container__items cm-slick-carousel--multiple"
                         metadata=self.itemsMetadata
  />
</div>
