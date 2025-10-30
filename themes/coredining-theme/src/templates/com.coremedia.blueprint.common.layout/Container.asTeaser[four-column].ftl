<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.PageGridPlacement" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->
<div class="box">
  <#list self.items![] as item>
    <#assign positionInRow=item?index % 4 />
    <#if positionInRow==0  >
      <div class="row">
    </#if>
        <div class="col-lg-3">
          <@cm.include self=item view="asVerticalTeaser" />
        </div>
    <#if positionInRow==3 || item?is_last>
      </div>
    </#if>
  </#list>
</div>
