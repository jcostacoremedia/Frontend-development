<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
    Template Description:

    This template renders all items with the view "asLeftRightBanner" and adds pagination, if available.

    @since 1907
-->

<#assign isPaginated=self.isPaginated() />
<#assign modifierClass=isPaginated?then("cm-left-right-banner-container--paginated", "") />

<div class="cm-left-right-banner-container ${modifierClass}"<@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_leftRightBannerContainerHeader" />

  <div class="cm-left-right-banner-container__items cm-left-right-banner-grid"<@preview.metadata self.itemsMetadata/>>
    <#--items paginated -->
    <#if isPaginated>
      <@cm.include self=self.asPagination() view="asLeftRightBanner" />
    <#else>
      <#list self.items![] as item>
        <@cm.include self=item view="_leftRightBannerGridItem" />
      </#list>
    </#if>
  </div>
</div>
