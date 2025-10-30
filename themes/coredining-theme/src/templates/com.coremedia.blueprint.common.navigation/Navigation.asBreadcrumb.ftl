<#list self.navigationPathList as segment>
  <@cm.include self=segment view="asLink" />
  <#sep> &gt;
</#list>
