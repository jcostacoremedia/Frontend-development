<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
  Template Description:

  This template renders all items with the view "_squareBannerGridItem".

  @since 2004
-->

<#assign items=self.items![] />

<div class="cm-square-banner-container"<@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_squareBannerContainerHeader"/>
  <#if (items?size > 0)>
    <div class="cm-square-banner-container__items cm-square-banner-grid"<@preview.metadata data=self.itemsMetadata/>>
      <#list items as item>
        <@cm.include self=item view="_squareBannerGridItem" />
      </#list>
    </div>
  </#if>
</div>
