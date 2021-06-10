import $ from "jquery";

export default function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #main__content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    
    
    const scrollElement = $("#sidebar li.active")[0];
    if (scrollElement) {
        scrollElement.scrollIntoView(false);
    }
}