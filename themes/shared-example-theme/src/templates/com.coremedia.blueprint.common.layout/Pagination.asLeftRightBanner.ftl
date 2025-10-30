<@cm.responseHeader name="Content-Type" value="text/html; charset=UTF-8"/>
<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Pagination" -->

<#--
    Template Description:

    This template is used for CMQueryLists inside PagegridPlacements without layout variant, if "load More" is enabled.

    @since 1907
-->

<#assign pageNumber=self.pageNum!0 />
<#assign nextPageNumber=pageNumber+1 />
<#assign numberOfPages=self.numberOfPages />
<#assign itemStartsWithEven=(((pageNumber*(self.itemsPerPage))+1)%2 == 0) />

<#-- list paginated items for this page, starting with 0 -->
<#list self.items![] as item>
  <@cm.include self=item view="_leftRightBannerGridItem" />
</#list>

<#-- show button to load more results via ajax -->
<#if (nextPageNumber < numberOfPages)>
  <div class="cm-pagination" data-cm-pagination="${cm.getLink(self, {"view": "asLeftRightBanner", "pageNum": nextPageNumber})}">
    <button disabled class="cm-pagination__more cm-button">
      ${cm.getMessage("pagination_load_more")}
    </button>
    <div class="cm-pagination__loading"></div>
  </div>
</#if>
