<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTeasable" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign targetLink = cm.getLink(self) />

<#assign maxLen = (cmpage??)
  ? then(bp.setting(cmpage, "teaser.max.length", 140), 140)
 />
<#assign teaserText = bp.truncateText(self.teaserText!"", maxLen) />
<#assign teaserTitle = self.teaserTitle!self.title!"No title" />

<div>

  <div>
    <@utils.optionalLink href=targetLink>
      <#if self.picture??>
        <@cm.include self=self.picture view="asLarge" />
      <#else>
        <div>No image available</div>
      </#if>
    </@utils.optionalLink>
  </div>

  <div>
    <h3>
      <@utils.optionalLink href=targetLink>
        <strong>${teaserTitle}</strong>
      </@utils.optionalLink>
    </h3>

    <div>
      <@utils.renderWithLineBreaks text=teaserText />
    </div>

    <#if targetLink??>
      <p>
        <a href="${targetLink}">Read More →</a>
      </p>
    </#if>
  </div>
</div>
