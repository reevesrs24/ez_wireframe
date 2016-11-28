// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

/*
    self.get_user_email = function() {
        $.get(get_email_url, function(json) {
            console.log(json['email']);
            self.vue.user_email = json['email'];

        });
    };
*/

    self.get_wireframe_images = function() {

        $.ajax({
            type: "POST",
            url: get_wireframe_images_url,
            data: {platform: ""},
            dataType: 'json',
            success: function (json) {
                self.wireframes = json['wireframes'];
            }
        });

    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            platform: "",
            wireframes: []
        },
        methods: {
            get_wireframe_images: self.get_wireframe_images

        }

    });

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

