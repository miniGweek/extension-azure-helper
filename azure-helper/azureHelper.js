main();

function main() {
  var trackIndex = "v6";
  console.log("AzureHelper extension " + trackIndex + " loaded");
  var azurePortalSearchBox = "div.fxs-search-box.fxs-topbar-input>input";
  var virtualMachineSearchAnchor =
    "a.fxs-menu-item.fxs-search-menu-content[title*='Virtual machine']";
  console.log("Loaded Azure Helper");
  //Attach to the search button
  var searcher = null;
  setTimeout(function () {
    $(azurePortalSearchBox).keydown(function (e) {
      if (searcher == null) {
        searcher = setInterval(function () {
          console.log(
            "Searching search drop down again " +
              trackIndex +
              ", Interval timer is " +
              searcher
          );
          $(virtualMachineSearchAnchor).each(function (i, e) {
            let resultRow = jQuery(e);
            let vmAssetHref = resultRow.attr("href");
            let splits = vmAssetHref.split("/");
            let subscription = splits[5];
            let resourcegroup = splits[7];
            let vmname = splits[11];
            let bastionLink = `https://portal.azure.com/#@globalasahi.com/resource/subscriptions/${subscription}/resourceGroups/${resourcegroup}/providers/Microsoft.Compute/virtualMachines/${vmname}/bastionHost`;

            if (resultRow.parent().next("a:contains('Bastion')").length == 0) {
              resultRow.parent().after(`
          <a href="${bastionLink}" target='_blank'>Bastion</a>`);
              console.log(
                "added bastion link. clearing search interval " + searcher
              );
              resultRow
                .parent()
                .next("a:contains('Bastion')")
                .click(function (e) {
                  console.log("Bastion Link clicked");
                  console.log("Clearing interval searching");
                  clearInterval(searcher);
                });
            }
          });
        }, 1000);
      }
    });
  }, 1000);
}
