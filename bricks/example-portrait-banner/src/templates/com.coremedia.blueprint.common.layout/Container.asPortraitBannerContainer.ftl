<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#--
  Template Description:

  This template renders all items with the view "_portraitBannerGridItem".

  @since 2004
-->

<#assign items=self.items![] />
<#assign additionalClass=cm.localParameters().additionalClass!"" />

<div class="cm-portrait-banner-container ${additionalClass}" <@preview.metadata data=self.containerMetadata + [bp.getPlacementHighlightingMetaData(self)!""] />>

  <@cm.include self=self view="_portraitBannerContainerHeader"/>
  <#if (items?size > 0)>
    <div class="cm-portrait-banner-container__items cm-portrait-banner-grid"<@preview.metadata data=self.itemsMetadata/>>
      <#list items as item>
        <@cm.include self=item view="_portraitBannerGridItem" />
      </#list>
    </div>
  </#if>
</div>
