<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMArticle" -->
<div class="box col-xl-12">
  <hr>
  <h2 class="intro-text text-center"><strong>${self.title!"No Title"}</strong></h2>
  <hr>
<p class="text-center">
  <@cm.include self=cmpage.navigation view="asBreadcrumb" />
</p>
  <div>
    <@cm.include self=self.picture!cm.UNDEFINED view="asLarge" />
  </div>

  <hr>

  <div>
    <@cm.include self=self.detailText!cm.UNDEFINED />
  </div>

  <div>
    <#list self.related![]>
      <hr>
      <h3>Related</h3>
      <#items as related>
        <@cm.include self=related view="asTeaser" />
      </#items>
    </#list>
    </div>
</div>
