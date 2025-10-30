<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<div>
  <!-- TODO: Iterate the items of this page grid placement  -->
  <!--       and include every item with view "asTeaser"    -->
  <#list self.items![] as item>
    <@cm.include self=item view="asTeaser" />
  </#list>
</div>
