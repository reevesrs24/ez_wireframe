// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings


    self.get_wireframe_images = function() {

        console.log(self.vue.platform);
        $.ajax({
            type: "POST",
            url: get_wireframe_images_url,
            data: {platform: self.vue.platform},
            dataType: 'json',
            success: function (json) {
                self.vue.wireframes = json['wireframes'];
                self.vue.currentNumber = 0;
            }
        });

    };

    self.next = function() {

        if (self.vue.currentNumber < self.vue.wireframes.length - 1)
            self.vue.currentNumber++;
    };

    self.prev = function() {
        if (self.vue.currentNumber > 0)
            self.vue.currentNumber--;
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            wireframes: [],
            currentNumber: 0,
            path: "../static/images/wireframes/",
            platform: "mobile",
            name: "TST"
        },
        methods: {
            get_wireframe_images: self.get_wireframe_images,
            next: self.next,
            prev: self.prev

        }

    });

    //Load Images on when page is rendered
    self.get_wireframe_images();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

