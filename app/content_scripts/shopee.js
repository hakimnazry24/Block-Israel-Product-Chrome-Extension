async function main() {
  window.addEventListener("scroll", async () => {
    await runFilter();
  });
}

async function runFilter() {
  const boycottedBrands = await _fetchBoycottItemList();

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
