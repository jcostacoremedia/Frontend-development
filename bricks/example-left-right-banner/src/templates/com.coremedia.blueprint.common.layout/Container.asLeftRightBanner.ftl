<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->

<#list self.items as item>
  <@cm.include self=item view="asLeftRightBanner" params={
    "metadata": self.containerMetadata + self.itemsMetadata
  } />
</#list>
