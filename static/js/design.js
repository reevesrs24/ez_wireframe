
/* Starter JSON for tree */
var treeData = [
    {
        "name": "start",
        "id": 1
    }
];


/* GLOBAL VARIABLES */
var nodeName = "";
var nodeId = "";

//D3.js script
function renderTree() {
    console.log("RENDERING");

    nodeName = "";
    nodeId = "";

    d3.select("svg").remove();

    var canvas = d3.select("#wireframe-tree")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 500)
        .attr("class", "overlay")
        .call(d3.behavior.zoom().on("zoom", function () {
          canvas.attr("transform", "translate(" +  d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
         }))
        .on("dblclick.zoom", null)
        .append("g")
        .attr("transform", "translate(10, 0)");


    var tree = d3.layout.tree()
        .size([300, 300]);

        var i = 0;

        var root = treeData[0];

        update(root);

        function update(source) {
            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            nodes.forEach(function(d) { d.y = d.depth * 180; });

            var node = canvas.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + (d.y +100) + "," + (d.x + 100) + ")";
                });

            node.append("circle")
                .attr("r", 8)
                .attr("fill", "steelblue")
                .on('click', function(d,i) {
                    // handle events here
                    // d - datum
                    // i - identifier or index
                    // this - the `<rect>` that was clicked
                    if (d3.select(this).attr("fill") == "steelblue") {
                        d3.selectAll(".node").selectAll("circle").attr("fill", "steelblue");
                        d3.select(this).attr("fill", "#F05F40");
                        nodeName = d.name;
                        nodeId = d.id;
                    }
                    else {
                        d3.select(this).attr("fill", "steelblue");
                        nodeName = "";
                        nodeId = "";
                    }


                });

            node.append("text")
                .attr("y", -13)
                .attr("x", -5)
                .attr("cursor", "pointer")
                .on('click', function(d, i) {
                    // handle events here
                    // d - datum
                    // i - identifier or index
                    // this - the `<rect>` that was clicked
                    //console.log("TEXT CLICK ");
                    //showWireframeModal(d.name, d.type, d.id);
                })
                .text(function (d) {
                    return d.name;
                });

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y + 100, d.x + 100];
                });

            canvas.selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("d", diagonal);


            canvas.append("path")
                .attr("fill", "none")
                .attr("stroke", "black");

        }

}

//Render the Tree on window load
renderTree();


//vue.js Code

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

    self.highlight();
        
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
        self.highlight();
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
        self.highlight();
    };

    self.add_element_to_tree = function() {

        var imgName = self.vue.wireframes[self.vue.currentNumber].name_readable;

        function traverse(treeArray, id) {

            if (treeArray.children) {
                for (var k in treeArray.children) {
                        console.log("NAME " + treeArray.children[k].id);

                        if (treeArray.children[k].id === id) {

                            var rand = Math.floor(Math.random() * (100000 - 0) + 0);

                            if (treeArray.children[k].children) {

                                treeArray.children[k].children.push({
                                    "name": imgName,
                                    "id": rand,
                                    "type": type,
                                    "children": []
                                });
                            }
                            else
                                treeArray.children[k].children = [ {"name": imgName, "id": rand, "type": type} ];

                            renderTree();


                        } else if (treeArray.children.length) {
                            traverse(treeArray.children[k], id);
                        }
                }
            }
        }

        var type = "web";
        var tree = treeData[0];

        if (nodeId != "")
            traverse(tree, nodeId, type);

        //If the user clicked on the "start" node
        if (nodeId == "1") {
            var rand = Math.floor(Math.random() * (100000 - 0) + 0);

            if (treeData[0].children) {

                console.log("RANDOM " + rand);
                treeData[0].children.push({
                    "name": imgName,
                    "id": rand,
                    "type": type,
                    "children": []
                });
            }
            else
                treeData[0].children = [{"name": imgName, "id": rand, "type": type}];

            renderTree();
        }
    };


    self.highlight = function() {
        console.log("TEST");
        //this.isActive = !this.isActive;
        self.vue.isActive = !self.vue.isActive;
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
            wireframe_hints: [],
            isActive: false


        },
        methods: {
            get_wireframe_images: self.get_wireframe_images,
            next: self.next,
            prev: self.prev,
            toggle_list: self.toggle_list,
            toggle_search: self.toggle_Search,
            update_wireframe_image: self.update_wireframe_image,
            get_wireframe_by_name: self.get_wireframe_by_name,
            add_element_to_tree: self.add_element_to_tree,
            highlight: self.highlight


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

