function main() {
  runFilter();

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      runFilter();
    }, 200);
  });
}

async function runFilter() {
  const boycottedBrands = await _fetchBoycottItemList();

  filterSearchPage(boycottedBrands);
  filterHomePageRecommendation(boycottedBrands);
}

function filterSearchPage(boycottedBrands) {
  const listItems = Array.from(
    document.querySelectorAll("ul .shopee-search-item-result__item")
  );

  listItems.forEach((li) => {
    const itemEl = li.querySelector(".line-clamp-2");
    if (!itemEl) return;

    const itemName = itemEl.textContent.toLowerCase().trim();

    const matched = boycottedBrands.some((brand) => itemName.includes(brand));

    if (matched) {
      li.style.pointerEvents = "none";
      li.style.opacity = 0.01;
    }
  });
}

function filterHomePageRecommendation(boycottedBrands) {
  const itemDivs = Array.from(document.querySelectorAll(".oMSmr0"));
  itemDivs.forEach((itemDiv) => {
    const itemEl = itemDiv.querySelector("div .line-clamp-2");
    const itemName = itemEl.textContent.toLowerCase().trim();
    const matched = boycottedBrands.some((brand) => itemName.includes(brand));
    if (matched) {
      itemDiv.style.pointerEvents = "none";
      itemDiv.style.opacity = 0.01;
    }
  });
}

async function _fetchBoycottItemList() {
  const url = chrome.runtime.getURL("boycott_list.txt");
  const res = await fetch(url);
  const text = await res.text();

  return text
    .split("\n")
    .map((line) => line.toLowerCase().trim())
    .filter(Boolean);
}

main();
