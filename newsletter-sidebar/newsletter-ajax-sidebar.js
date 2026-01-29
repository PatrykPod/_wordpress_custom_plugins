class NewsletterSidebar {

    constructor() {
        this.get();
    }

    get() {
        jQuery.ajax({
            url: window.location.origin + "/newsletter/subscribe/?widget=sidebar",
            type: 'GET',
            dataType: 'JSON',
            async: true,
            cache: false,
        }).
            done((response) => {
                $('.newsletter-subscription').html(response.html)
            });
    }
}