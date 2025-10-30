<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<div class="box">
  <#list self.items![] as item>
    <#assign positionInRow=item?index % 3 />
    <#if positionInRow==0  >
      <div class="row">
    </#if>
        <div class="col-lg-4">
         <@cm.include self=item view="asVerticalTeaser" />
        </div>
    <#if positionInRow==2 || item?is_last>
      </div>
    </#if>
  </#list>
</div>
