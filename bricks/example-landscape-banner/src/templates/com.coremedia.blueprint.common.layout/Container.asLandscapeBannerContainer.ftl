<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
  Template Description:

  This template renders all items with the view "_landscapeBannerGridItem".

  @since 2004
-->

<#assign items=self.items![] />
<#assign additionalClass=cm.localParameters().additionalClass!"" />

<div class="cm-landscape-banner-container ${additionalClass}"<@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_landscapeBannerContainerHeader"/>
  <#if (items?size > 0)>
    <div class="cm-landscape-banner-container__items cm-landscape-banner-grid"<@preview.metadata data=self.itemsMetadata />>
      <#list items as item>
        <@cm.include self=item view="_landscapeBannerGridItem" />
      </#list>
    </div>
  </#if>
</div>
