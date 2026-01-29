class NewsletterBar {

    constructor() {
        this.get();
    }

    get() {
        jQuery.ajax({
            url: window.location.origin + "/newsletter/subscribe/?widget=footer",
            type: 'GET',
            dataType: 'JSON',
            async: true,
            cache: false,
        }).
            done((response) => {
                $('.newsletter').html(response.html)
            });
    }
}