<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMCollection" -->

<div class="cm-footer-navigation__column"<@preview.metadata self.content />>
  <#if self.teaserTitle?has_content>
    <h2 class="cm-footer-navigation-column__title"<@preview.metadata "properties.teaserTitle" />>${self.teaserTitle!""}</h2>
  </#if>

  <#list self.items![]>
    <ul class="cm-footer-navigation-column"<@preview.metadata "properties.items" />>
      <#items as item>
        <@cm.include self=item view="_footerNavigationColumnItem" />
      </#items>
    </ul>
  </#list>
</div>
