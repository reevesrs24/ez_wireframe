
/* Starter JSON for tree */
var treeData = [
    {
        "name": "start",
        "id": 1,
        "image": "Blank.png"
    }
];


/* GLOBAL VARIABLES */
var nodeName = "";
var nodeId = "";

//D3.js script
/*
    Boilder plate obtained from D3noob
    http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
 */
function renderTree() {
    console.log("RENDERING");

    nodeName = "";
    nodeId = "";

    d3.select("svg").remove();

    var canvas = d3.select("#wireframe-tree")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 700)
        .attr("class", "overlay")
        .call(d3.behavior.zoom().on("zoom", function () {
          canvas.attr("transform", "translate(" +  d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
         }))
        .on("dblclick.zoom", null)
        .append("g")
        .attr("transform", "translate(10, 0)");


    var tree = d3.layout.tree().nodeSize([150, 150]);

        var root = treeData[0];

        update(root);

        function update(source) {
            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            nodes.forEach(function(d) {
                d.y = d.depth * 300;
            });

            var node = canvas.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + (d.y + 325) + "," + (d.x + 325) + ")";
                });

            node.append("image")
              .attr("xlink:href", function(d) {
                  return "../static/images/wireframes/" + d.image;
              })
              .attr("x", -37)
              .attr("y", -40)
              .attr("width", "100px")
              .attr("height", "100px")
              .attr("class", "not-selected")
              .attr("fill", "steelblue")
              .attr("cursor", "pointer")
              .on('click', function(d) {
                    // handle events here
                    // d - datum
                    if (d3.select(this).attr("class") == "not-selected") {
                        d3.selectAll(".node").style("stroke", "");
                        d3.select(this.parentNode).style("stroke", "#F05F40")
                                                  .style("stroke-width", "1");
                        d3.select(this).attr("class", "selected");
                        nodeName = d.name;
                        nodeId = d.id;
                    }
                    else {
                        d3.select(this.parentNode).style("stroke", "");
                        d3.select(this).attr("class", "not-selected");
                        nodeName = "";
                        nodeId = "";
                       }
                });

            node.append("text")
                .attr("y", -45)
                .attr("x", 12)
                .attr("text-anchor", "middle")
                .attr("cursor", "pointer")
                .on('click', function(d) {
                    // handle events here
                    // d - datum
                    console.log("TEXT CLICK ");
                     nodeId = d.id;
                    showWireframeModal(d.image, d.type, d.id, d.name);
                })
                .text(function (d) {
                    return d.name;
                });

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y + 325, d.x + 325];
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

/*
    Jquery Modal Code

 */

$("#delete-wireframe" ).click(function() {

    var uuid = nodeId;
    console.log("DELETE " + uuid);

    function traverse(treeArray, id) {

        if (treeArray.children) {
            for (var k in treeArray.children) {

                if (treeArray.children[k].id === id) {

                    treeArray.children.splice(k, 1);

                    renderTree();
                    break;

                } else if (treeArray.children.length) {
                    traverse(treeArray.children[k], id);
                }
            }
        }
    }

    var tree = treeData[0];

traverse(tree, uuid);
});

function showWireframeModal(image, type, id, name)
{
    $("#wireframe-img-modal").attr('src', '../static/images/wireframes/' + image);
    $('#myModalLabel').text(name);
    $('#myModal').modal('show');
}


/*
    vue.js Code
*/
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
                self.vue.currentNumber = 30;
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

    self.add_element_to_tree = function() {

        var imgName = self.vue.wireframes[self.vue.currentNumber].name_readable;
        var image = self.vue.wireframes[self.vue.currentNumber].wireframe_name;

        function traverse(treeArray, id) {

            if (treeArray.children) {
                for (var k in treeArray.children) {

                        if (treeArray.children[k].id === id) {

                            var rand = Math.floor(Math.random() * (100000 - 0) + 0);

                            if (treeArray.children[k].children) {

                                treeArray.children[k].children.push({
                                    "name": imgName,
                                    "id": rand,
                                    "type": type,
                                    "image": image,
                                    "children": []
                                });
                            }
                            else
                                treeArray.children[k].children = [ {"name": imgName, "id": rand, "type": type, "image": image} ];

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

            if (!self.vue.start) {
                treeData[0]['name'] = imgName;
                treeData[0]['type'] = type;
                treeData[0]['image'] = image;
                self.vue.start = true;
            } else if (self.vue.start) {
                if (treeData[0].children) {

                    treeData[0].children.push({
                        "name": imgName,
                        "id": rand,
                        "type": type,
                        "image": image,
                        "children": []
                    });
                }
                else
                    treeData[0].children = [{"name": imgName, "id": rand, "type": type, "image": image}];

            }
            renderTree();
        }
    };


    self.highlight = function() {
        self.vue.isActive = !self.vue.isActive;
    };

    self.save_tree_data = function() {

        var data = treeData;

        $.ajax({
            type: "POST",
            url: save_tree_data_url,
            data: {tree_data: data},
            dataType: 'json',
            success: function (json) {

            }
        });
    };


    self.get_user_tree_data = function() {


         $.get(get_user_tree_data_url, function(json, status){
                console.log("tree " + json['tree_data'].tree_data);
                treeData = JSON.parse(json['tree_data'].tree_data);
                console.log("tree " + treeData);
            });

    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            wireframes: [],
            currentNumber: 30,
            path: "../static/images/wireframes/",
            platform: "mobile",
            toggle_search_bool: false,
            toggle_list_bool: false,
            search_wireframe: "",
            wireframe_hints: [],
            isActive: false,
            start: false

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
            highlight: self.highlight,
            save_tree_data: self.save_tree_data,
            get_user_tree_data: self.get_user_tree_data

        }

    });


    //self.get_user_tree_data();
    //Load Images on when page is rendered
    self.get_wireframe_images();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

