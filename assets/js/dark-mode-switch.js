function initTheme(darkSwitch) {
    const e = null !== localStorage.getItem("darkSwitch") && "dark" === localStorage.getItem("darkSwitch");
    darkSwitch.checked=e;
    e ? document.body.setAttribute("data-theme","dark") : document.body.removeAttribute("data-theme");
}

function resetTheme(darkSwitch) {
    darkSwitch.checked ? (
        document.body.setAttribute("data-theme","dark"),
        localStorage.setItem("darkSwitch","dark")
    ) : (
        document.body.removeAttribute("data-theme"),
        localStorage.removeItem("darkSwitch")
    );
}

export default function() {
    window.addEventListener("load", () => {
        const darkModeSwitchElement = document.getElementById("darkSwitch");
    
        darkModeSwitchElement && (
            initTheme(darkModeSwitchElement),
            darkModeSwitchElement.addEventListener("change", () => {
                resetTheme(darkModeSwitchElement)
            })
        );
    });
}