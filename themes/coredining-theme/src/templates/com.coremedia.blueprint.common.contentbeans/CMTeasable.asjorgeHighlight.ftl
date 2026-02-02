<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTeasable" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign targetLink = cm.getLink(self) />
<#assign hasLink = targetLink?? />

<#-- Settings -->
<#assign maxLength = (cmpage??)
  ? then(bp.setting(cmpage, "highlight.teaser.max.length", 260), 260)
 />
<#assign labelText = (cmpage??)
  ? then(bp.setting(cmpage, "highlight.teaser.label", "Teaser Highlight"), "Teaser Highlight")
 />
<#assign pictureView = (cmpage??)
  ? then(bp.setting(cmpage, "highlight.teaser.picture.view", "asThumbnail"), "asThumbnail")
 />

<#-- Content -->
<#assign teaserTitle = self.teaserTitle!self.title!"No title" />
<#assign teaserText = bp.truncateText(self.teaserText!"", maxLength) />

<div class="cm-teaser cm-teaser--highlight">

  <div class="cm-teaser__media">
    <@utils.optionalLink href=targetLink>
      <#if self.picture??>
        <@cm.include self=self.picture view=pictureView />
      <#else>
        <div class="cm-teaser__mediaFallback">No Image</div>
      </#if>
    </@utils.optionalLink>
  </div>

  <div class="cm-teaser__body">
    <#if labelText?has_content>
      <span class="cm-teaser__label">${labelText}</span>
    </#if>

    <h2 class="cm-teaser__headline">
      <@utils.optionalLink href=targetLink>
        <strong>${teaserTitle}</strong>
      </@utils.optionalLink>
    </h2>

    <div class="cm-teaser__text">
      <@utils.renderWithLineBreaks text=teaserText />
    </div>

    <#if hasLink>
      <p class="cm-teaser__cta">
        <a href="${targetLink}">Read More →</a>
      </p>
    </#if>
  </div>

</div>
