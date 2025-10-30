<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMCollection" -->

<#-- headline -->
<#if self.teaserTitle?has_content>
  <h2 class="cm-left-right-banner-container__headline"<@preview.metadata "properties.teaserTitle"/>>${self.teaserTitle}</h2>
</#if>
<#-- teasertext -->
<#if !bp.isEmptyRichtext(self.teaserText!"")>
  <div class="cm-left-right-banner-container__text"<@preview.metadata "properties.teaserText"/>>
    <@cm.include self.teaserText />
  </div>
</#if>
