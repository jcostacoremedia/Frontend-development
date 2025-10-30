<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTeasable" -->
<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />
<#assign targetLink=cm.getLink(self.target!cm.UNDEFINED) />
<div>

  <div>
    <@utils.optionalLink href=targetLink>
      <@cm.include self=self.picture!cm.UNDEFINED view="asLarge" />
    </@utils.optionalLink>
  </div>
  <div>
    <hr>
    <h3 class="intro-text text-center">
      <@utils.optionalLink href=targetLink>
        <strong>${self.teaserTitle!self.title!'No title'}</strong>
      </@utils.optionalLink>
    </h3>
    <hr>
    <#assign truncatedTeaserText=bp.truncateText(self.teaserText!"", bp.setting(cmpage, "teaser.max.length", 140)) />
    <@utils.renderWithLineBreaks text=truncatedTeaserText />
  </div>
</div>
