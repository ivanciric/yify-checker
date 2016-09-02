function YifyChecker() {

    var self = this;
    self.refresh();
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        kango.browser.tabs.create({url: 'https://yts.ag'});
        self.refresh();
    });
    window.setInterval(function(){self.refresh()}, self._refreshTimeout);
}

YifyChecker.prototype = {

    //_refreshTimeout: 60*1000*15,    // 15 minutes
    _refreshTimeout: 60*1000, // 1 min
    _feedUrl: 'https://yts.ag/rss',

    _setOffline: function() {
        kango.ui.browserButton.setTooltipText(kango.i18n.getMessage('Offline'));
        kango.ui.browserButton.setIcon('icons/button_gray.png');
        kango.ui.browserButton.setBadgeValue(0);
    },

    _setLatestMovie: function(movieTitle) {
        kango.ui.browserButton.setTooltipText(kango.i18n.getMessage('Latest movie') + ': ' + movieTitle);
        kango.ui.browserButton.setIcon('icons/button.png');
        kango.ui.browserButton.setBadgeValue(movieTitle);
    },

    refresh: function() {

        var details = {
            url: this._feedUrl,
            method: 'GET',
            async: true,
            contentType: 'text'
        };
        var self = this;
        kango.xhr.send(details, function(data) {

            if (data.status == 200 && data.response != null)
            {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data.response, "text/xml");
                var item = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;

                self._setLatestMovie(item);
            }
            else {
                self._setOffline();
            }
        });
    }
};

var extension = new YifyChecker();