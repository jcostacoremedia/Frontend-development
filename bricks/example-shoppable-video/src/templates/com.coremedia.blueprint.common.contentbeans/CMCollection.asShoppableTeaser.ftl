<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMCollection" -->

<#assign metadata=(cm.localParameters().metadata![]) + self.containerMetadata + self.itemsMetadata />

<#list self.items![] as item>
  <@cm.include self=item view="teaser" params={
    "blockClass": "cm-shoppable-teaser",
    "metadata": metadata,
    "renderWrapper": false,
    "renderTeaserText": true,
    "renderEmptyImage": false,
    "renderLink": false,
    "enableTeaserOverlay": false
  } />
</#list>
