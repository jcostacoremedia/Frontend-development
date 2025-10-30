<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
  Template Description:

  This template renders all items with the view "_heroBannerSlickCarouselItem" inside a slick carousel.

  @since 2004
-->

<#import "*/node_modules/@coremedia/brick-slick-carousel/src/freemarkerLibs/slickCarousel.ftl" as slickCarousel />

<#assign items=self.items![] />

<#if (items?size > 0)>
  <@slickCarousel.render
    items=items
    itemsWrapperView="_heroBannerSlickCarouselItem"
    innerArrows=true
    slickConfig={"fade": true}
    additionalClass="cm-hero-banner-container"
    metadata=self.containerMetadata + self.itemsMetadata
  />
</#if>
