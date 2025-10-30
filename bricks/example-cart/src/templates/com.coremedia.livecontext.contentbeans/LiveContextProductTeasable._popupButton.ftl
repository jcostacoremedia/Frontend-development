<#-- @ftlvariable name="self" type="com.coremedia.livecontext.contentbeans.LiveContextProductTeasable" -->
<#-- @ftlvariable name="_csrf" type="org.springframework.security.web.csrf.CsrfToken" -->

<#import "../../freemarkerLibs/cart.ftl" as cart />

<#if self.product?has_content>
  <#-- add-to-cart button -->
  <div class="cm-popup__button cm-button-group">
    <@cart.addToCartButton product=self.product
                           csrf=_csrf
                           withLink=cm.getLink(self.productInSite!(cm.UNDEFINED))
                           enableShopNow=self.isShopNowEnabled(cmpage.context)
                           attr={"classes": ["cm-button-group__button", "cm-button--popup"]} />
  </div>
</#if>
