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
          extension_azure_helper.vm_helper(
            extension_azure_helper.constants.virtualMachineSearchAnchor
          );
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
    searchResultList: "fxs-portal-hover.fxs-menu-result-item",
  },
  timers: {
    searcher: null,
  },
  vm_helper: function (virtualMachineSearchAnchor) {
    $(virtualMachineSearchAnchor).each(function (i, e) {
      let resultRow = jQuery(e);
      let vmAssetHref = resultRow.attr("href");
      let splits = vmAssetHref.split("/");
      let subscription = splits[5];
      let resourcegroup = splits[7];
      let vmname = splits[11];
      let bastionLink = `${extension_azure_helper.constants.baseAzureUrl}${subscription}/resourceGroups/${resourcegroup}/providers/Microsoft.Compute/virtualMachines/${vmname}/bastionHost`;
      let iamLink = `${extension_azure_helper.constants.baseAzureUrl}${subscription}/resourceGroups/${resourcegroup}/providers/Microsoft.Compute/virtualMachines/${vmname}/users`;
      extension_azure_helper.link_helper(
        resultRow,
        "Bastion",
        bastionLink,
        extension_azure_helper.timers.searcher
      );
      extension_azure_helper.link_helper(
        resultRow,
        "IAM",
        iamLink,
        extension_azure_helper.timers.searcher
      );
    });
  },
  link_helper: function (resultRow, shortCutName, shortCutLink, timer) {
    let linkExists = extension_azure_helper.link_exists_checker(
      resultRow,
      shortCutName
    );
    if (!linkExists) {
      resultRow.parent().after(`
  <a class=${shortCutName} href="${shortCutLink}" target='_blank'>${shortCutName}</a>`);
      console.log(
        `added ${shortCutName} link. clearing search interval ${extension_azure_helper.timers.searcher}`
      );
      // resultRow
      //   .parent()
      //   .next(`a:contains(${shortCutName})`)
      //   .click(function (e) {
      //     console.log(`${shortCutName} Link clicked`);
      //     console.log(`Clearing interval searching`);
      //     clearInterval(timer);
      //   });
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
