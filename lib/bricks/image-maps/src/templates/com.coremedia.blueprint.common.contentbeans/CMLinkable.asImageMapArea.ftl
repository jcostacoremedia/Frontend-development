<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMLinkable" -->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign imageMapArea=cm.localParameter("imageMapArea", {}) />
<#assign additionalAttributes=cm.localParameter("additionalAttributes", {}) />
<#assign shape=imageMapArea.shape!"default" />
<#assign coords=imageMapArea.coords!cm.UNDEFINED />

<area shape="${shape}"
      <#if shape == "rect">coords="0,0,0,0"</#if>
      href="${cm.getLink(self)}"
      class="cm-imagemap__area"
      alt="${imageMapArea.alt!""}"
      <#if coords?has_content><@cm.dataAttribute name="data-coords" data=bp.responsiveImageMapAreaData(coords) /></#if>
      <@utils.renderAttr attr=additionalAttributes />>
