<@cm.responseHeader name="Content-Type" value="text/html; charset=UTF-8"/>
<#-- @ftlvariable name="self" type="java.lang.Object" -->

<#assign blockClass=cm.localParameters().blockClass!"cm-slick-carousel" />
<#assign itemView=cm.localParameters().itemView!cm.UNDEFINED />
<#assign metadata=cm.localParameters().metadata![] />

<#-- this div is used by slick for the slides -->
<div class="${blockClass}__item"<@preview.metadata metadata/>>
  <#-- metadata has already been processed, make sure that it is not rendered twice -->
  <@cm.include self=self view=itemView params=cm.localParameters() + {
    "metadata": []
  } />
</div>
