<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Container" -->
<#-- @ftlvariable name="cmpage" type="com.coremedia.blueprint.common.contentbeans.Page" -->

<#-- Settings (simple + safe) -->
<#assign cols = (bp.setting(self, "layout.columns", 2)?number)!2 />
<#if cols < 1><#assign cols = 1 /></#if>

<#assign maxItems = (bp.setting(self, "max.items", 6)?number)!6 />
<#if maxItems < 1><#assign maxItems = 1 /></#if>

<#assign span = 12 / cols />

<div class="box">
  <h2 class="text-center">Custom Teaser Layout</h2>

  <#if !(self.items?has_content)>
    <p class="text-muted text-center">⚠ No items to display</p>
  </#if>

  <#-- render only up to maxItems, then treat the last rendered index as "last" -->
  <#list self.items![] as item>
    <#if item?index < maxItems>

      <#if (item?index % cols) == 0>
        <div class="row">
      </#if>

        <div class="col-lg-${span}">
          <@cm.include self=item view=(item?index == 0)?string("asjorgeHighlight", "asjorgeTestLayout") />
        </div>

      <#assign isLastRendered = (item?index == maxItems - 1) || item?is_last />

      <#if (item?index % cols) == cols - 1 || isLastRendered>
        </div>
      </#if>

    </#if>
  </#list>
</div>
