<@cm.responseHeader name="Content-Type" value="text/html; charset=UTF-8"/>
<#-- @ftlvariable name="self" type="com.coremedia.blueprint.common.layout.Pagination" -->

<#--
    Template Description:

    This template is used for CMQueryLists inside the related property of CMPerson, if "load More" is enabled.

    @since 1901
-->

<#assign pageNumber=self.pageNum!0 />
<#assign nextPageNumber=pageNumber+1 />
<#assign numberOfPages=self.numberOfPages />

<#-- list paginated items for this page, starting with 0 -->
<@cm.include self=bp.getContainer(self.items) view="asLandscapeBannerContainer" params={"additionalClass": "cm-related__items"} />

<#-- show button to load more results via ajax -->
<#if (nextPageNumber < numberOfPages)>
  <div class="cm-pagination" data-cm-pagination="${cm.getLink(self, {"view": "asLandscapeBannerContainer", "pageNum": nextPageNumber})}">
    <button disabled class="cm-pagination__more">
      ${cm.getMessage("pagination_load_more")}
    </button>
    <div class="cm-pagination__loading"></div>
  </div>
</#if>
