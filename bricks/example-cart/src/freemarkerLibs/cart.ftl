<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/components.ftl" as components />
<#import "*/node_modules/@coremedia/brick-utils/src/freemarkerLibs/utils.ftl" as utils />

<#--
  Renders an addToCart button in different variations depending on the given product. If product has only
  one product variant the button includes an add to cart functionality, otherwise its just a link to the product
  detail page. If no product is available, it renders an unavailable labeled button.

  @param product The product that needs to be added to the cart.
  @param alwaysShow Forces the button to be shown even if product is not available.
  @param alwaysClickable Enables add to cart functionality even if there is more than one variant.
  @param enableShopNow Enable addToCart functionality. If false, only show the Details button.
  @param withLink Link to the product detail page. Will be used for the button, if enableShopNow is
                  disabled or product has more than one variant.
  @param attr Adds additional custom attributes as a hash map to the button.

  Example:
  <@addToCartButton product=self.product
                    withLink=cm.getLink(self.productInSite)
                    attr={"classes":["my-button-group__button", "my-button--linked"]} />
-->
<#macro addToCartButton product csrf=cm.UNDEFINED alwaysShow=false alwaysClickable=false enableShopNow=true withLink="" attr={}>
  <#-- @ftlvariable name="csrf" type="org.springframework.security.web.csrf.CsrfToken" -->
  <#-- @ftlvariable name="product" type="com.coremedia.livecontext.ecommerce.catalog.Product" -->
  <#assign availableClass="cm-add-to-cart-button--available" />
  <div class="cm-add-to-cart-button<#if alwaysShow> ${availableClass}<#else><@lc.availability product=product ifTrue=" ${availableClass}" ifFalse="" /></#if>">
    <@components.button text=cm.getMessage("cart_unavailable")
                        href=withLink
                        baseClass="cm-button"
                        attr=utils.extendSequenceInMap(attr, "classes", ["cm-add-to-cart-button__not-available"]) />
    <#local attr=utils.extendSequenceInMap(attr, "classes", ["cm-button--primary", "cm-add-to-cart-button__available"]) />
    <#local hasSingleSKU=(product.variants?size == 1) />
    <#if (enableShopNow && (alwaysClickable || hasSingleSKU))>
      <#local cart=cm.substitute("cart", product) />
      <#local externalId=hasSingleSKU?then(product.variants[0].externalId, product.externalId)/>
      <#local csrfParams=csrf?has_content?then({ csrf.parameterName: csrf.token }, {}) />
      <#local buttonData={"data-cm-cart-add-item": {"id": externalId!"", "link": cm.getLink(cart, "ajax") } + csrfParams} />
      <@components.button text=cm.getMessage("cart_add_item")
                          baseClass="cm-button"
                          iconClass=" "
                          attr=(attr + buttonData) />
    <#else>
      <@components.button text=cm.getMessage("cart_view_variants")
                          href=withLink
                          baseClass="cm-button"
                          attr=attr />
    </#if>
  </div>
</#macro>
