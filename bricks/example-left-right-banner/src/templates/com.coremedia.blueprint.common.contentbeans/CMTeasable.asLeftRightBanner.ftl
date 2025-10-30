<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTeasable" -->

<#--
  Template Description:

  This templates utilizes the "teaser" view of the brick "default-teaser" to configure the banner accordingly.

  @param additionalClass specifies an additionalClass to be added to the rendering

  @since 1907
-->

<#assign additionalClass=cm.localParameters().additionalClass!"" />

<@cm.include self=self view="teaser" params={
  "blockClass": "cm-left-right-banner",
  "additionalClass": additionalClass,
  "renderWrapper": false,
  "mediaView": "leftRightBannerMedia",
  "enableTeaserOverlay": false,
  "renderAuthors": true,
  "renderVideoInline": true,
  "renderDate": true
} + cm.localParameters() />
