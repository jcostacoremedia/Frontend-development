<#import "utils.ftl" as utils />

<#function getButtonSettings base={}>
  <#return {
    "target": base.target!cm.UNDEFINED,
    "hash": base.hash!cm.UNDEFINED,
    "text": base.text!"",
    "openInNewTab": base.openInNewTab!false,
    "metadata": base.metadata![]
  } />
</#function>

<#macro renderButton link=""
                     text=""
                     openInNewTab=false
                     blockClass="cm-cta-button"
                     additionalClass=""
                     metadata=[]>
  <#if !text?has_content>
    <#local text=cm.getMessage("button_read_more") />
  </#if>

  <#local attr={
    "class": "cm-cta__button ${blockClass} ${additionalClass}",
    "role": "button",
    "metadata": metadata
  } />
  <@utils.optionalLink href=link openInNewTab=openInNewTab attr=attr>${text}</@utils.optionalLink>

</#macro>

<#macro render buttons=[]
               additionalClass=""
               additionalButtonClass=""
               metadata=[]>
  <#list buttons>
    <div class="cm-cta ${additionalClass}"<@preview.metadata data=metadata />>
      <#items as button>
        <#local buttonSettings=getButtonSettings(button!{}) />
        <#local previewContent=preview.content(buttonSettings.target!cm.UNDEFINED) />
        <#local hashCharacter=(buttonSettings.hash?has_content && !buttonSettings.hash?contains("#"))?then("#", "") />
        <#local linkSuffix=buttonSettings.hash?has_content?then(hashCharacter + buttonSettings.hash, "") />
        <@renderButton link=cm.getLink(buttonSettings.target!cm.UNDEFINED) + linkSuffix
                       text=buttonSettings.text!""
                       openInNewTab=buttonSettings.openInNewTab!false
                       additionalClass=additionalButtonClass
                       metadata=cm.notUndefined(previewContent, []) />
      </#items>
    </div>
  </#list>
</#macro>
