var DemoPage = Page.sub({
    className: "DemoPage",
    inherited: {
        fill: "true",
        content: [
            " ",
            {
                control: "PhotoCanvas",
                ref: "photoCanvas"
            },
            " "
        ]
    }
});
DemoPage.prototype.extend({
    
    initialize: function() {
        var apiKey = "c3685bc8d8cefcc1d25949e4c528cbb0";
        var method = "flickr.interestingness.getList";
        var self = this;
        this.getFlickrPhotos(apiKey, method, function(flickrPhotos) {
            var photos = $.map(flickrPhotos, function(flickrPhoto) {
                return {
                    src: self.getFlickrImageSrc(flickrPhoto),
                    href: self.getFlickrImageHref(flickrPhoto)
                };
            })
            self.$photoCanvas().photos(photos);
        });
    },
    
    getFlickrPhotos: function(apiKey, method, callback) {
        var baseUrl = "http://api.flickr.com/services/rest/";
        var count = Page.urlParameters().count || 12;
        var url = baseUrl + 
                    "?api_key=" + apiKey +
                    "&method=" + method +
                    "&per_page=" + count +
                    "&format=json" +
                    "&nojsoncallback=1";
        $.getJSON(url, function (data) {
            callback(data.photos.photo);
        });
    },
    
    getFlickrImageSrc: function(flickrPhoto) {
        return "http://farm" + flickrPhoto.farm +
               ".static.flickr.com/" + flickrPhoto.server +
               "/" + flickrPhoto.id +
               "_" + flickrPhoto.secret +
               ".jpg";
    },
    
    getFlickrImageHref: function(flickrPhoto) {
        return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
    }
});

var Photo = Control.sub({
    className: "Photo",
    inherited: {
        content: [
            " ",
            {
                html: "<img />",
                ref: "photo"
            },
            " "
        ]
    }
});
Photo.prototype.extend({
    href: Control.property(),
    src: Control.chain("$photo", "attr/src"),
    initialize: function() {
        var self = this;
        this.$photo().click(function() {
            window.location.href = self.href();
        });
    }
});

var PhotoCanvas = Control.sub({
    className: "PhotoCanvas"
});
PhotoCanvas.prototype.extend({

    initialize: function() {
        var self = this;
        this.on( "layout", function() {
            self.refresh();
        });
    },

    // An array of URLs pointing to images.
    photos: Control.property(function(photos) {
        var photoElements = $.map(photos, function(photo) {
            return Photo.create({
                src: photo.src,
                href: photo.href
            });
        });
        this
            .content(photoElements)
            .refresh();
    }),

    refresh: function() {
        var $children = this.children();
        var cellSize = maxSquare.optimalCellSize( this.width(), this.height(), $children.length );
        $children.css(cellSize);
    }

});
