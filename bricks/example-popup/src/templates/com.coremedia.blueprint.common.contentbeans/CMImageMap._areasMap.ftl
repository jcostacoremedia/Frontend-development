<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMImageMap" -->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />
<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/components.ftl" as components />

<#--
  Template Description:

  This template extends @coremedia/brick-image-maps and adds popups for the targets of the areas.
  For the popup layout, check the template *.asPopup.ftl.

  @since 1907
-->

<#-- if imageMapId is not given, generate new id -->
<#assign imageMapId=cm.localParameters().imageMapId!(bp.generateId("cm-map-")) />
<#assign imageMapAreas=bp.responsiveImageMapAreas(self) />
<#assign popupIndex=0 />

<#--imagemap with areas -->
<map <@utils.renderAttr attr={ "name": imageMapId, "classes": ["cm-imagemap__areas"], "data-cm-imagemap-popup": "" } /> <@preview.metadata "properties.imageMapAreas" />>
  <#assign overlay=bp.setting(self, "overlay", {}) />
  <#-- show hotzones as areas with inline overlay or as icon -->
  <#list imageMapAreas![] as imageMapArea>
    <#if imageMapArea.linkedContent?has_content>
      <#assign linkedContent=imageMapArea.linkedContent />
      <#assign link=cm.getLink(linkedContent.target!cm.UNDEFINED) />
      <#assign popupId=bp.generateId("cm-popup-") />

      <#-- inline overlay without popup -->
      <#if imageMapArea.displayAsInlineOverlay!false>
        <#assign classOverlay="" />
        <#assign theme=imageMapArea.inlineOverlayTheme!"" />
        <#-- only allow valid themes -->
        <#if (["dark", "light", "dark-on-light", "light-on-dark"]?seq_contains(theme))>
          <#assign classOverlay="cm-overlay--theme-" + theme />
        </#if>
        <#-- hot zones as areas -->
        <@cm.include self=linkedContent!cm.UNDEFINED view="asImageMapArea" params={
          "imageMapArea": imageMapArea,
          "overlay": overlay
        } />

        <#-- overlay -->
        <div class="cm-imagemap__hotzone cm-imagemap__hotzone--text">
          <@cm.include self=linkedContent!cm.UNDEFINED view="asImageMapInlineOverlay" params={
            "classOverlay": classOverlay,
            "overlay": overlay
          } />
        </div>

      <#-- icon with popup -->
      <#else>
        <#assign parameters={
          "data-cm-imagemap-target": "#${popupId}",
          "data-cm-imagemap-target-id": "${popupIndex}",
          "class": "cm-imagemap__hotzone cm-imagemap__hotzone--icon cm-imagemap__hotzone--loading",
          "metadata": linkedContent.content
        }/>
        <#-- hot zones as areas -->
        <@cm.include self=linkedContent!cm.UNDEFINED view="asImageMapArea" params={
          "imageMapArea": imageMapArea,
          "overlay": overlay,
          "additionalAttributes": {
            "data-cm-imagemap-popup-target-id": popupIndex
          }
        } />

        <#-- icon -->
        <@components.button baseClass="" href="${link}" iconText=(linkedContent.teaserTitle!cm.getMessage("button_popup")) attr=parameters />
        <#-- popup -->
        <@cm.include self=linkedContent view="asPopup" params={
          "popupId" : "${popupId}",
          "additionalClass": "mfp-hide",
          "overlay": overlay
        } />
        <#assign popupIndex=popupIndex+1 />
      </#if>
    </#if>

  <#-- add area for default target if no hotzones are available -->
  <#else>
    <@cm.include self=self view="asImageMapArea" params={
      "overlay": overlay
    } />
  </#list>
</map>
