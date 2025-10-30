<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.navigation.Navigation" -->
<#assign root=self.rootNavigation />
<nav class="navbar navbar-default" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <!-- navbar-brand is hidden on larger screens, but visible when the menu is collapsed -->
      <a class="navbar-brand" href="${cm.getLink(root)}">${root.title}</a>
    </div>
    <div class="collapse navbar-collapse" id="navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="${self.root?then("active", "")}">
          <a href="${cm.getLink(root)}">Home</a>
        </li>
        <#list root.visibleChildren as child>
        <li class="${(self==child)?then("active", "")}">
          <@cm.include self=child view="asLink" />
        </li>
        </#list>
      </ul>
    </div>
  </div>
</nav>
