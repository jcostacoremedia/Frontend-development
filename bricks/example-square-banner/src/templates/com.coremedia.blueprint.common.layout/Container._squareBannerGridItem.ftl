<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#assign metadata=(cm.localParameters().metadata![]) + self.containerMetadata + self.itemsMetadata />

<#list self.items as item>
  <@cm.include self=item view="_squareBannerGridItem" params={
    "metadata": metadata
  } />
</#list>
