<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<#assign root=cmpage.navigation.rootNavigation />

<div class="brand">${root.title!"No Title"}</div>
<#if root.teaserText?has_content>
  <div class="address-bar">${bp.truncateText(root.teaserText, 140)}</div>
</#if>
<@cm.include self=cmpage.navigation view="asNavbar" />