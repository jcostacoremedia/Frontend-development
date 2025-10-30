<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#assign metadata=cm.localParameters().metadata![] />

<#list self.items as item>
  <@cm.include self=item view="_heroBannerSlickCarouselItem" params=cm.localParameters() + {
    "metadata": metadata + self.containerMetadata + self.itemsMetadata
  } />
</#list>
