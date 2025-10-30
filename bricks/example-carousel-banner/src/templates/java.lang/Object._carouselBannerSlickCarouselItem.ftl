<@cm.responseHeader name="Content-Type" value="text/html; charset=UTF-8"/>
<#-- @ftlvariable name="self" type="java.lang.Object" -->

<#assign metadata=cm.localParameters().metadata![] />

<#-- this div is used by slick for the slides -->
<div class="cm-slick-carousel__item"<@preview.metadata metadata/>>
  <#-- metadata has already been processed, make sure that it is not rendered twice -->
  <@cm.include self=self view="asCarouselBanner" params=cm.localParameters() + {
    "metadata": []
  } />
</div>
