<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<div class="box">
<h2 class="text-center">jorge Test Layout</h2>
  <#list self.items![] as item>
    <#assign positionInRow=item?index % 2 />
    <#if positionInRow==0  >
      <div class="row">
    </#if>
      <div class="col-lg-6">
        <@cm.include self=item view="asjorgeTestLayout" />
      </div>
    <#if positionInRow==1 || item?is_last>
      </div>
    </#if>
  </#list>
</div>

<div class="box">
  <h2 class="text-center">Simon Test Layout</h2>
    <div class="row">
      <#list self.items![] as item>
      <#assign positionInRow=item?index % 2 />
      <div class="col-lg-6">
        <@cm.include self=item view="asjorgeTestLayout" />
      </div>
      </#list>
    </div>
</div>