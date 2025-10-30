<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.Page" -->

<body class="cm-page" id="top"<@preview.metadata data=bp.setting(cmpage, "sliderMetaData", "")/>>
  <#-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   Include tag manager - This is the only difference to the same template defined in the page brick
  -->
  <#assign tagManagers=bp.setting(self, "TagManagement", [])/>
  <#list tagManagers as tagManager>
    <#if !bp.isEmptyRichtext(tagManager.bodyStart!"")>
      <@cm.include self=tagManager.bodyStart view="script" />
    </#if>
  </#list>

  <#-- show pagegrid -->
  <@cm.include self=self.pageGrid />

  <#-- info box for users with javascript disabled -->
  <noscript class="cm-javascript">
    ${cm.getMessage("error_noJavascript")}
  </noscript>

  <#-- include javascript files at the end -->
  <@cm.include self=self view="_bodyEnd" />
</body>
