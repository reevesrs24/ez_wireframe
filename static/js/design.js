// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings


    self.get_wireframe_images = function() {

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

    self.toggle_list = function() {
        self.vue.toggle_search_bool = false;
        self.vue.toggle_list_bool = !self.vue.toggle_list_bool;
    };

    self.toggle_Search = function() {
        self.vue.search_wireframe = "";
        self.vue.toggle_list_bool = false;
        self.vue.toggle_search_bool = !self.vue.toggle_search_bool;
    };

    self.update_wireframe_image = function() {

    /*
        var myNode = document.getElementById("wireframe-list");
        while (myNode.childElementCount > 5) {
            myNode.removeChild(myNode.lastElementChild);
        }
    */

        console.log(self.vue.search_wireframe);
        $.ajax({
            type: "POST",
            url: search_wireframe_images_url,
            data: {search_wireframe: self.vue.search_wireframe},
            dataType: 'json',
            success: function (json) {
                self.vue.wireframe_hints = json['wireframes'];
                self.vue.currentNumber = 0;
            }
        });
    };

    self.get_wireframe_by_name = function() {

        $.ajax({
            type: "POST",
            url: get_wireframe_by_name_url,
            data: {wireframe_name: self.vue.search_wireframe},
            dataType: 'json',
            success: function (json) {
                self.vue.wireframes = json['wireframes'];
                self.vue.currentNumber = 0;
            }
        });
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
            toggle_search_bool: false,
            toggle_list_bool: false,
            search_wireframe: "",
            wireframe_hints: []

        },
        methods: {
            get_wireframe_images: self.get_wireframe_images,
            next: self.next,
            prev: self.prev,
            toggle_list: self.toggle_list,
            toggle_search: self.toggle_Search,
            update_wireframe_image: self.update_wireframe_image,
            get_wireframe_by_name: self.get_wireframe_by_name


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

