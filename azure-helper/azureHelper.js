main();

function main() {
  var trackIndex = "v7";
  console.log("AzureHelper extension " + trackIndex + " loaded");
  //Attach to the search button
  setTimeout(function () {
    $(extension_azure_helper.constants.azurePortalSearchBox).keydown(function (
      e
    ) {
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
              { shortCutName: "Networking", azureUrlEndPart: "networking" },
              { shortCutName: "Run", azureUrlEndPart: "runcommands" },
              { shortCutName: "IAM", azureUrlEndPart: "users" },
              { shortCutName: "Bastion", azureUrlEndPart: "bastionHost" },
            ]
          );

          // extension_azure_helper.shortcut_helper(
          //   extension_azure_helper.constants.storageAccountSearchAnchor,
          //   "Microsoft.Storage",
          //   "storageAccounts",
          //   [
          //     { shortCutName: "Networking", azureUrlEndPart: "networking" },
          //     { shortCutName: "Explorer", azureUrlEndPart: "storageexplorer" },
          //     { shortCutName: "IAM", azureUrlEndPart: "users" },
          //     { shortCutName: "Keys", azureUrlEndPart: "keys" },
          //   ]
          // );
        }, 1000);
      }
    });
  }, 1000);
}

var extension_azure_helper = {
  constants: {
    baseAzureUrl:
      "https://portal.azure.com/#@globalasahi.com/resource/subscriptions/",
    azurePortalSearchBox: "div.fxs-search-box.fxs-topbar-input>input",
    virtualMachineSearchAnchor:
      "a.fxs-menu-item.fxs-search-menu-content[title*='Virtual machine']",
    storageAccountSearchAnchor:
      "a.fxs-menu-item.fxs-search-menu-content[title*='Storage account']",
    searchResultList: "fxs-portal-hover.fxs-menu-result-item",
  },
  timers: {
    searcher: null,
  },
  azure_url_parser: function (element) {
    let resultRow = jQuery(element);
    let resourceHref = resultRow.attr("href");
    let splits = resourceHref.split("/");
    let subscription = splits[5];
    let resourcegroup = splits[7];
    let resourceName = splits[11];
    return {
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
      let { subscription, resourcegroup, resourceName } =
        extension_azure_helper.azure_url_parser(e);

      let linkPattern = `${extension_azure_helper.constants.baseAzureUrl}${subscription}/resourceGroups/${resourcegroup}/providers/${provider}/${resourceType}/${resourceName}/`;

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
    let linkExists = extension_azure_helper.link_exists_checker(
      resultRow,
      shortCutName
    );
    if (!linkExists) {
      resultRow.parent().after(`
  <a class=${shortCutName} href="${shortCutLink}" target='_blank'>${shortCutName}</a>`);
    }
  },
  link_exists_checker: function (resultRow, shortCutName) {
    let next = resultRow.parent();
    let stop = false;
    let found = false;
    while (!stop) {
      if (next.next("a").hasClass(shortCutName)) {
        stop = true;
        found = true;
      }
      if (
        next.next(`li.${extension_azure_helper.constants.searchResultList}`)
          .length > 0
      ) {
        stop = true;
      }
      next = next.next();
    }
    return found;
  },
};
