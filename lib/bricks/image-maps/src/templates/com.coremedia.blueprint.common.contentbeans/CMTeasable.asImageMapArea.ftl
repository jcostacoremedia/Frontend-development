<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTeasable" -->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign imageMapArea=cm.localParameter("imageMapArea", {}) />
<#assign additionalAttributes=cm.localParameter("additionalAttributes", {}) />
<#assign shape=imageMapArea.shape!"default" />
<#assign coords=imageMapArea.coords!cm.UNDEFINED />
<#assign target=(self.target?has_content && self.target.openInNewTab)?then("_blank", "") />
<#assign rel=(self.target?has_content && self.target.openInNewTab)?then("noopener", "") />

<area shape="${shape}"
      <#if shape == "rect">coords="0,0,0,0"</#if>
      href="${cm.getLink(self.target!cm.UNDEFINED)}"
      class="cm-imagemap__area"
      alt="${imageMapArea.alt!""}"
      target="${target}"
      rel="${rel}"
      <#if coords?has_content><@cm.dataAttribute name="data-coords" data=bp.responsiveImageMapAreaData(coords) /></#if>
      <@utils.renderAttr attr=additionalAttributes />>
