import ClipboardJS from "clipboard";

function addCopy(element) {
    const icon = createIcon('clone');
    const copy = document.createElement("button");

    copy.className = "copy btn btn-outline-light float-right";
    copy.appendChild(icon);
    copy.appendChild(document.createTextNode(" Copy"));
    element.append(copy);
}

export default function () {
    const codes = document.querySelectorAll('pre');

    for (var i = 0, len = codes.length; i < len; i++) {
        addCopy(codes[i]);
    }

    new ClipboardJS('.copy', {
        target: function (trigger) {
            return trigger.previousElementSibling;
        }
    });
}