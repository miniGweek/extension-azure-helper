main();

function main() {
  var trackIndex = "v0.1";
  console.log("AzureHelper extension " + trackIndex + " loaded");
  //Attach to the search button
  setTimeout(function () {
    if (extension_azure_helper.timers.searcher == null) {
      extension_azure_helper.timers.searcher = setInterval(function () {
        console.log(
          "Searching search drop down again " +
            trackIndex +
            ", Interval timer is " +
            extension_azure_helper.timers.searcher
        );

        extension_azure_helper.shortcut_helper(
          extension_azure_helper.constants.virtualMachineSearchAnchor,
          "Microsoft.Compute",
          "virtualMachines",
          [
            { shortCutName: "Bastion", azureUrlEndPart: "bastionHost" },
            { shortCutName: "IAM", azureUrlEndPart: "users" },
            { shortCutName: "Networking", azureUrlEndPart: "networking" },
            { shortCutName: "Run", azureUrlEndPart: "runcommands" },
          ]
        );

        extension_azure_helper.shortcut_helper(
          extension_azure_helper.constants.storageAccountSearchAnchor,
          "Microsoft.Storage",
          "storageAccounts",
          [
            { shortCutName: "Networking", azureUrlEndPart: "networking" },
            { shortCutName: "IAM", azureUrlEndPart: "iamAccessControl" },
            { shortCutName: "Keys", azureUrlEndPart: "keys" },
            { shortCutName: "Explorer", azureUrlEndPart: "storageexplorer" },
          ]
        );

        extension_azure_helper.shortcut_helper(
          extension_azure_helper.constants.keyVaultSearchAnchor,
          "Microsoft.KeyVault",
          "vaults",
          [
            { shortCutName: "Networking", azureUrlEndPart: "networking" },
            { shortCutName: "IAM", azureUrlEndPart: "users" },
            { shortCutName: "Secrets", azureUrlEndPart: "secrets" },
            { shortCutName: "Certs", azureUrlEndPart: "certificates" },
          ]
        );
      }, 1000);
    }
  }, 1000);
}

var extension_azure_helper = {
  constants: {
    baseAzureUrl: "https://portal.azure.com/<tenant>/resource/subscriptions/",
    azurePortalSearchBox: "div.fxs-search-box.fxs-topbar-input>input",
    virtualMachineSearchAnchor:
      "a.fxs-menu-item.fxs-search-menu-content[title*='Virtual machine']",
    storageAccountSearchAnchor:
      "a.fxs-menu-item.fxs-search-menu-content[title*='Storage account']",
    keyVaultSearchAnchor:
      "a.fxs-menu-item.fxs-search-menu-content[title*='Key vault']",
    searchResultList: "fxs-portal-hover.fxs-menu-result-item",
  },
  timers: {
    searcher: null,
  },
  azure_url_parser: function (element) {
    let resultRow = jQuery(element);
    let resourceHref = resultRow.attr("href");
    let splits = resourceHref.split("/");
    let tenant = splits[0];
    let subscription = splits[5];
    let resourcegroup = splits[7];
    let resourceName = splits[11];
    return {
      tenant: tenant,
      subscription: subscription,
      resourcegroup: resourcegroup,
      resourceName: resourceName,
    };
  },
  shortcut_helper: function (
    resourceSearchAnchor,
    provider,
    resourceType,
    shortCuts
  ) {
    $(resourceSearchAnchor).each(function (i, e) {
      let resultRow = jQuery(e);
      let { tenant, subscription, resourcegroup, resourceName } =
        extension_azure_helper.azure_url_parser(e);
      let baseUrl_with_tenant =
        extension_azure_helper.constants.baseAzureUrl.replace(
          "<tenant>",
          tenant
        );
      let linkPattern = `${baseUrl_with_tenant}${subscription}/resourceGroups/${resourcegroup}/providers/${provider}/${resourceType}/${resourceName}/`;

      shortCuts.forEach(function (shortCut) {
        extension_azure_helper.link_helper(
          resultRow,
          shortCut.shortCutName,
          linkPattern,
          shortCut.azureUrlEndPart,
          extension_azure_helper.timers.searcher
        );
      });
    });
  },
  link_helper: function (
    resultRow,
    shortCutName,
    shortCutLinkPattern,
    azureUrlEndPart,
    timer
  ) {
    let shortCutLink = `${shortCutLinkPattern}${azureUrlEndPart}`;
    let shortCutContainerExists =
      resultRow.parent().children(`div.shortCutContainer`).length == 1;
    if (!shortCutContainerExists) {
      resultRow.parent().append("<div class='shortCutContainer'></div>");
    }

    let shortCutLinkExists =
      resultRow
        .parent()
        .children(`div.shortCutContainer`)
        .children(`a.${shortCutName}`).length == 1;
    if (!shortCutLinkExists) {
      resultRow.parent().children(`div.shortCutContainer`).append(`
  <a class="${shortCutName} shortCut" href="${shortCutLink}" target='_blank'>${shortCutName}</a>`);
    }
  },
};
