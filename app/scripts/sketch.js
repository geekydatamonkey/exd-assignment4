// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
const $ = require('jquery');
// const _ = require('lodash');


function mySketch(s) {

  let rUnit = 50;
  let seconds = {
    radius: 2 * rUnit
  };
  let minutes = {
    radius: 3 * rUnit
  };
  let hour = {
    radius: 4 * rUnit
  };

  let center;

  function renderTimePaths() {
    s.push();
    s.ellipseMode(s.RADIUS);
    s.noFill();
    s.stroke(222);
    s.ellipse(center.x, center.y, seconds.radius, seconds.radius);
    s.ellipse(center.x, center.y, minutes.radius, minutes.radius);
    s.ellipse(center.x, center.y, hour.radius, hour.radius);

    // sundial line
    s.push();
    s.strokeWeight(3);

    s.line(center.x, center.y, center.x, center.y - seconds.radius);
    s.pop();

    // horizontal
    s.push();
    s.strokeWeight(1);
    s.line(center.x - hour.radius, center.y, center.x + hour.radius, center.y);
    s.pop();
    s.pop();
  }

  s.setup = function (){

    // create canvas and put in canvasWrapper
    let $canvasWrapper = $('.canvas-wrapper');

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    center = {
      x: s.width/2,
      y: s.height/2
    };

  };

  s.draw = function() {

    s.clear();
    //renderTimePaths();

    // make a seconds dot
    let dateTime = new Date();
    seconds.current = dateTime.getMilliseconds()/1000 + dateTime.getSeconds(); 
    seconds.angle = seconds.current/60 * Math.PI * 2 + Math.PI/2;;
    seconds.x = center.x - seconds.radius * Math.cos(seconds.angle);
    seconds.y = center.y - seconds.radius * Math.sin(seconds.angle);

    // seconds triangle
    s.push();
    s.noStroke();
    s.fill([0,150,150,50]);
    s.triangle(
      seconds.x,
      seconds.y,
      center.x,
      center.y,
      center.x,
      center.y - seconds.radius
    );
    s.pop();

    s.push();
    s.fill([255,0,0,100]);
    s.ellipse(
      seconds.x,
      seconds.y,
      5,
      5
    );
    s.pop();

    // minutes
    minutes.current = seconds.current/60 + dateTime.getMinutes();
    console.log(minutes.current);
    minutes.angle = minutes.current/60 * Math.PI * 2 + Math.PI/2;
    minutes.x = center.x - minutes.radius * Math.cos(minutes.angle);
    minutes.y = center.y - minutes.radius * Math.sin(minutes.angle);


    // we want the line to go through the top of
    // the sundial (aka "noon")
    minutes.dyNoon = center.y - minutes.y;
    minutes.dxNoon = center.x - minutes.x;
    minutes.angleNoon =  Math.atan2( minutes.dyNoon, minutes.dxNoon);

    s.push();
    s.noStroke();
    s.fill([255,255,100,100]);
    s.triangle(
      minutes.x,
      minutes.y,
      center.x,
      center.y,
      center.x, 
      center.y - minutes.radius
    );
    s.pop();

    s.push();
    s.fill([255,0,0,100]);
    s.ellipse(
      minutes.x,
      minutes.y,
      5,
      5
    );
    s.pop();


  };

  s.windowResized = function() {
    let $canvasWrapper = $('.canvas-wrapper');

    let w = $canvasWrapper.innerWidth();
    let h = $canvasWrapper.height();

    // put in canvasWrapper
    s.resizeCanvas(w,h-3);
  };

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};