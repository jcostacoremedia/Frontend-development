<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<#-- @ftlvariable name="js" type="com.coremedia.blueprint.common.contentbeans.CMJavaScript" -->

<#-- include fragment preview javascript  -->
<#if preview.isFragmentPreview()>
  <#assign fragmentPreviewJs=bp.setting(self, "fragmentPreviewJs", []) />
  <#list fragmentPreviewJs as js>
    <@cm.include self=js view="asJSLink"/>
  </#list>
</#if>

<#-- include javascript at bottom for performance -->
<#list self.javaScript![] as js>
  <@cm.include self=js view="asJSLink"/>
</#list>

<#-- include additional javascript for preview -->
<#if preview.isPreviewCae()>
  <#assign previewJs=bp.setting(self, "previewJs", []) />
  <#list previewJs as js>
    <@cm.include self=js view="asJSLink"/>
  </#list>
</#if>

<#-- hook for extensions at bottom of page (for e.g. javascripts) -->
<@cm.hook id=bp.viewHookEventNames.VIEW_HOOK_END />

<#-- icon and tools for developer mode -->
<@cm.include self=self view="_developerMode" />

<#-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Include tag manager - This is the only difference to the same template defined in the page brick
-->
<#assign tagManagers=bp.setting(self, "TagManagement", [])/>
<#list tagManagers as tagManager>
  <#if !bp.isEmptyRichtext(tagManager.bodyEnd!"")>
    <@cm.include self=tagManager.bodyEnd view="script" />
  </#if>
</#list>
