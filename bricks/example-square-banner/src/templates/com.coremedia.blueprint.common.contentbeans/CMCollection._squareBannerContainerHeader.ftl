<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMCollection" -->

<#if self.teaserTitle?has_content>
  <h2 class="cm-square-banner-container__headline" <@preview.metadata "properties.teaserTitle" />>${self.teaserTitle}</h2>
</#if>
