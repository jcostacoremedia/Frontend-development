<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMTaxonomy" -->
<#-- @ftlvariable name="cssClass" type="java.lang.String" -->
<#-- @ftlvariable name="attr" type="java.lang.String" -->
<#-- @ftlvariable name="link" type="java.lang.String" -->
<#-- @ftlvariable name="pageLocale" type="java.util.Locale" -->

<#assign cssClass=cm.localParameters().cssClass!"" />
<#assign attr=cm.localParameters().attr!"" />
<#assign link=cm.localParameters().link!cm.getLink(self.target!cm.UNDEFINED) />
<#assign pageLocale=cmpage.content.locale/>

<#assign value=self.teaserTitle!""/>
<#assign translatedValue = bp.translatedPropertyValue(self, cmpage.locale, self.value)/>
<#if translatedValue?has_content && translatedValue != cm.UNDEFINED>
  <#assign value = translatedValue/>
</#if>

<a class="${cssClass}" href="${link}" ${attr?no_esc} <@preview.metadata data=[self.content, "properties.teaserTitle"] />>${value!""}</a>
