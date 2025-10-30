<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.contentbeans.CMCSS" -->

<#--
    Template Description:

    This template is used for CSS files if
    - css includes an external css file
    - delivery.local-resources and/or delivery.developer-mode are set to true
    Otherwise MergableResources.asCSSLink.ftl is used.
-->

<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#assign cssLink=cm.getLink(self)/>
<#assign attr={ "rel": "stylesheet" } + self.htmlAttributes />
<#assign ignore=["href"] />

<link href="${cssLink}"<@utils.renderAttr attr=attr ignore=ignore /><@preview.metadata self.content />>
