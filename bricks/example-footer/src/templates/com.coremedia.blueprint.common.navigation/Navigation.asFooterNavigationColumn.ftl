<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.navigation.Navigation" -->

<div class="cm-footer-navigation__column">
  <#if self.title?has_content>
    <#assign link=cm.getLink(self!cm.UNDEFINED) />
    <h2 class="cm-footer-navigation-column__title"><a href="${link}" class="cm-footer-navigation-column__link">${self.title!""}</a></h2>
  </#if>

  <#list self.visibleChildren![]>
    <ul class="cm-footer-navigation-column">
      <#items as item>
        <@cm.include self=item view="_footerNavigationColumnItem" />
      </#items>
    </ul>
  </#list>
</div>
