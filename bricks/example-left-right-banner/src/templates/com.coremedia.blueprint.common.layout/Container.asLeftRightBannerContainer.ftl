<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
  Template Description:

  This template renders all items as flattened list with the view "asLeftRightBanner".

  @since 1907
-->

<div class="cm-left-right-banner-container"<@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_leftRightBannerContainerHeader" />

  <div class="cm-left-right-banner-container__items cm-left-right-banner-grid"<@preview.metadata self.itemsMetadata/>>
    <#list self.items![] as item>
      <@cm.include self=item view="_leftRightBannerGridItem" />
    </#list>
  </div>
</div>
