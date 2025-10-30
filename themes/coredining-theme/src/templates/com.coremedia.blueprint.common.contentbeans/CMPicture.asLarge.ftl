<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMPicture" -->
<div class="col-lg-12">

<@cm.include self=self view="media" params={
	"classBox" : "xx-picture xx-picture--large",
	"classMedia" : "xx-picture__image" } />

  <#if self.teaserText?has_content>
    <div class="text-center">
      <@cm.include self=self.detailText />
    </div>
  </#if>
</div>