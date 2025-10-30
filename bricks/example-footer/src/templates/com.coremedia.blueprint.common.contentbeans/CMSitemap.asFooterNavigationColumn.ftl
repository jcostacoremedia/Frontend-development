<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMSitemap" -->

<div class="cm-footer-navigation__column"<@preview.metadata self.content />>
  <#if self.teaserTitle?has_content>
    <#assign link=cm.getLink(self.target!cm.UNDEFINED) />
    <#assign target=(self.target?has_content && self.target.openInNewTab)?then('target="_blank"', "") />
    <#assign rel=(self.target?has_content && self.target.openInNewTab)?then('rel="noopener"', "") />
    <h2 class="cm-footer-navigation-column__title">
      <a href="${link}" ${target?no_esc} ${rel?no_esc} class="cm-footer-navigation-column__link"<@preview.metadata "properties.teaserTitle" />>${self.teaserTitle!""}</a>
    </h2>
  </#if>

  <#-- we ignore the depth of the sitemap and render just the first level of the navigation tree -->
  <#list self.root.visibleChildren![]>
    <ul class="cm-footer-navigation-column"<@preview.metadata "properties.root" />>
      <#items as item>
        <@cm.include self=item view="_footerNavigationColumnItem" />
      </#items>
    </ul>
  </#list>
</div>
