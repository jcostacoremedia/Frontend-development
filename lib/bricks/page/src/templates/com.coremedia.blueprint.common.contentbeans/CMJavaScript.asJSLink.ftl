<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMJavaScript" -->

<#--
    Template Description:

    This template is used for JS files if
    - js includes an external css file
    - delivery.local-resources or delivery.developer-mode are set to true
    Otherwise MergableResources.asJSLink.ftl is used.
-->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign jsLink=cm.getLink(self)/>
<#assign attr=self.htmlAttributes />
<#assign ignore=["src"] />

<script src="${jsLink}"<@utils.renderAttr attr=attr ignore=ignore /><@preview.metadata self.content />></script>
