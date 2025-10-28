function main() {
    const toggleBtn = document.getElementById("toggle-btn");
    const isOn = toggleBtn.textContent.toLowerCase() === "off"; // show current state, if text content is off, it means its on, and vice versa
    toggleFilter(isOn);

    toggleBtn.addEventListener("click", (e) => {
        const isCurrentlyOn = toggleBtn.textContent.toLowerCase() === "off";
        if (isCurrentlyOn) {
            // if its on, turn it off
            toggleBtn.textContent = "On";
            toggleFilter(false);
        } else {
            // if its off, turn it on
            toggleBtn.textContent = "Off";
            toggleFilter(true);
        }
    });
}

async function toggleFilter(isFilterOn) {
    if (isFilterOn) {
        const itemList = await fetchBoycottItemList();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, { action: "filterItem", itemList });
        });
    }
}

async function fetchBoycottItemList() {
    const filepath = "../../boycott_list.txt"
    const res = await fetch(filepath);
    const text = await res.text();
    const splitted = text
        .split("\n")
        .map((splittedText) => splittedText.toLowerCase());
    return splitted;
}

main();
