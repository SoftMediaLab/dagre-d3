/* eslint-disable linebreak-style */
"use strict";

var _ = require("./lodash");
var addLabel = require("./label/add-label");
var util = require("./util");
var d3 = require("./d3");

module.exports = createEdgeLabels;

function createEdgeLabels(selection, g) {
  var svgEdgeLabels = selection.selectAll("g.edgeLabel")
    .data(g.edges(), function(e) { return util.edgeToId(e); })
    .classed("update", true);

  svgEdgeLabels.exit().remove();
  svgEdgeLabels.enter().append("g")
    .classed("edgeLabel", true)
    .classed("customizeEdgeLabel",function(e) {
      var edge = g.edge(e);
      return edge.needCustomizedClass;})
    .style("opacity", 0)
    .each(function(element) {
      var edge = g.edge(element);
      if (edge.textLabelClass && typeof edge.textLabelClass === 'string') {
        this.classList.add(edge.textLabelClass);
      }
    });

  svgEdgeLabels = selection.selectAll("g.edgeLabel");

  svgEdgeLabels.each(function(e) {
    var root = d3.select(this);
    root.select(".label").remove();
    var edge = g.edge(e);
    var label = addLabel(root, g.edge(e), 0, 0).classed("label", true);
    var bbox = label.node().getBBox();

    if (edge.labelId) { label.attr("id", edge.labelId); }
    if (!_.has(edge, "width")) { edge.width = bbox.width; }
    if (!_.has(edge, "height")) { edge.height = bbox.height; }
  });

  var exitSelection;

  if (svgEdgeLabels.exit) {
    exitSelection = svgEdgeLabels.exit();
  } else {
    exitSelection = svgEdgeLabels.selectAll(null); // empty selection
  }

  util.applyTransition(exitSelection, g)
    .style("opacity", 0)
    .remove();

  return svgEdgeLabels;
}
