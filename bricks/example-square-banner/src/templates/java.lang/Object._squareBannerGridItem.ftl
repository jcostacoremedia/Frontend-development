<@cm.responseHeader name="Content-Type" value="text/html; charset=UTF-8"/>
<#-- @ftlvariable name="self" type="java.lang.Object" -->

<#assign metadata=cm.localParameters().metadata![] />

<div class="cm-square-banner-grid__item"<@preview.metadata metadata />>
  <@cm.include self=self view="asSquareBanner" />
</div>
